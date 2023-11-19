from static_py.StaticMemory import StaticMemory
from flask import Blueprint,render_template, request, session
import pymysql
import uuid
import json
import math

def haversine(user_latitude,user_longitude,other_latitude,other_longitude):
    result=6371 * math.acos(math.cos(math.radians(user_latitude)) * math.cos(math.radians(other_latitude))\
                        * math.cos(math.radians(other_longitude) - math.radians(user_longitude))\
                        + math.sin(math.radians(user_latitude)) * math.sin(math.radians(other_latitude)))
    return result

_internalbp = Blueprint("comment",__name__,url_prefix="/")
    
# 코멘트 업로드
@_internalbp.route("/comment/upload/",methods=['GET','POST'])
def comment_upload():
    
    # 세션 islogin이 True인 경우만 코멘트 업로드 가능
    if session.get('islogin',None) ==True:
        
        # 소켓
        # 작성한 게시글 반경 3km 이내인 사람들에게 정보전송(가중치 반영)
        # 온라인 유저
        _connections = StaticMemory.get_instance().get_auto_dict("sockets")
        # DB
        _dict = StaticMemory.get_instance().get_auto_dict("connections")
        
        # DB에 저장
        conn = _dict['db']
        # 외부 parameter
        board_uuid =request.args.get('board_uuid',None)
        longitude = request.args.get('longitude',None)
        latitude= request.args.get('latitude',None)
        latitude=float(latitude)
        longitude=float(longitude)

        # comment_uuid 생성
        comment_uuid= str(uuid.uuid4())
        
        # 세션에서 user_uuid, nick 가져옴
        user_uuid = session.get('user_uuid',None)
        nick = session.get("nick",None)

        level = request.args.get('level',None)
        comment = request.args.get('comment',None)

        result1 = conn.select('SELECT board_uuid,category from threat_board')
        
        for i in result1:
            if i[0]== board_uuid:
                category= i[1]

    
        conn.commit('INSERT INTO thread_comment (category, level,comment_uuid,board_uuid,user_uuid,wrote_date,longitude,latitude,comment ) VALUES (%s, %s,%s,%s,%s,now(),%s,%s,%s)', (category, level,comment_uuid,board_uuid,user_uuid,longitude,latitude,comment))

        # 해당되는 board에 댓글 수 comment_size에 1 증가시킴
        conn.commit(f"UPDATE threat_board SET comment_size = comment_size +1 WHERE board_uuid ='{board_uuid}'")

        new_obj2={}
        new_obj2['type']='threat_live'
        new_obj2['board_uuid']=board_uuid
        new_obj2['comment_uuid']=comment_uuid
        new_obj2['content']=comment
        new_obj2['category']=category
        new_obj2['level']=level
        new_obj2['latitude']=latitude
        new_obj2['longitude']=longitude

        # 기준합 이상 가중치 계산 함수
        def sum_over_comment_weight():
            result = conn.select(f'SELECT sum(LEVEL) from thread_comment WHERE board_uuid = "{board_uuid}"')
            return result[0][0]
        
        boundary=sum_over_comment_weight()
        print(boundary)

        if 10<=boundary:

            for k,v in _connections.items():
                other_user_uuid=v['user_uuid']
                other_latitude = v['latitude']
                other_longitude = v['longitude']
                print(latitude,longitude)
                if other_latitude!=None and other_longitude!=None:
                    print(haversine(latitude,longitude,other_latitude,other_longitude))

                    if haversine(latitude,longitude,other_latitude,other_longitude)<=3:
                        print(other_user_uuid)
                        k.request_send_json(new_obj2)
                    else:
                        print("'reason_eng':'cant find user','reason_kor':'주변에 이용자가 없습니다..'")

                else:
                    print("'reason_eng':'latitude or longitude is None','reason_kor':'위도, 경도가 None값 입니다.'")
        else:
            print("'reason_eng':'weight is lower than mean','reason_kor':'가중치가 평균을 넘지 않았습니다.'")
        

        # 리턴값 result True인 경우, comment_uuid와 nick 가져옴
        return json.dumps({"result":True,"comment_uuid":str(comment_uuid),"nick":nick})
    
    # islogin이 True가 아닌경우는, comment달지 못함.
    else:
        return json.dumps({"result":False,"reason_eng":"not login state","reason_kr":"로그인 상태가 아닙니다"})
    

#코멘트 삭제
@_internalbp.route("/comment/delete/",methods=['GET','POST'])
def comment_delete():

    # islogin인 True인 경우에 코멘트 삭제 가능
    if session.get('islogin',None) ==True:

        # 세션에서 user_uuid,nick 가져옴
        user_uuid = session.get('user_uuid',None)
        nick = session.get("nick",None)
        
        # 외부 parameter
        comment_uuid = request.args.get('comment_uuid',None)

        _dict = StaticMemory.get_instance().get_auto_dict("connections")
        conn = _dict['db']

        #DB에서 comment_uuid, board_uuid ,user_uuid 가져오기
        results = conn.select('SELECT comment_uuid,board_uuid,user_uuid from thread_comment')
        
        for i in results:
            # comment_uuid와 입력한 uuid가 일치하고, 세션의 user_uuid와 DB의 user_uuid가 일치하는 경우, 코멘트삭제
            if comment_uuid == i[0] and user_uuid==i[2] :
                board_uuid= i[1]
                # DB에서 해당 코멘트 행 삭제
                conn.commit(f'DELETE FROM thread_comment WHERE comment_uuid ="{comment_uuid}"')
                # 댓글 수 board, comment_size에 1 감소
                conn.commit(f"UPDATE threat_board SET comment_size = comment_size -1 WHERE board_uuid ='{board_uuid}'")

                #  찾은 경우 comment_uuid와 nick 반환
                return json.dumps({"result":True,"comment_uuid":comment_uuid,"nick":nick})
        
        # 해당하는 comment_uuid와 user_uuid를 찾지 못한 경우
        return json.dumps({"result":False,"reason_eng":"not find synchronized comment_uuid and user_uuid","reason_kr":"일치하는 comment_uuid와 user_uuid를 찾을 수 없습니다."})

    # islogin이 None인 경우 코멘트 삭제 불가
    else:
        return json.dumps({"result":False,"reason_eng":"not login state","reason_kr":"로그인 상태가 아닙니다"})

# 코멘트 리스트 반환
@_internalbp.route("/comment/list/",methods=['GET','POST'])
def comment_list():
    
    # 외부 parameter
    board_uuid = request.args.get('board_uuid',None)
    
    # db에서 데이터 읽기
    _dict = StaticMemory.get_instance().get_auto_dict("connections")
    # DB에 저장
    conn = _dict['db']

    # thread_comment 테이블 정보를 모두 가져옴
    results = conn.select('SELECT a.*,b.user_nick, c.is_certificated from (SELECT idx, category, level,comment_uuid,board_uuid,user_uuid, wrote_date, \
                          longitude,latitude,comment from thread_comment ) AS a LEFT JOIN account AS b ON a.user_uuid=b.user_uuid LEFT JOIN reaction_user \
                          AS c ON b.user_uuid = c.user_uuid ORDER BY idx;')

    result = []
    
    # 일치하는 board_uuid를 찾는 경우,해당되는 댓글 정보를 모두 반환
    for i in results:
        if board_uuid == i[4]:
            if i[11] == 1:
                _dict={"category":i[1],"level":i[2],"comment_uuid":i[3],"user_uuid":i[5],"wrote_date":i[6],"longitude":i[7],"latitude":i[8],\
                    "comment":i[9],"nick":i[10],"is_management":True}
                result.append(_dict)
            elif i[11] ==None or i[11]==0:
                _dict={"category":i[1],"level":i[2],"comment_uuid":i[3],"user_uuid":i[5],"wrote_date":i[6],"longitude":i[7],"latitude":i[8],\
                    "comment":i[9],"nick":i[10],"is_management":False}
                result.append(_dict)
    
    # 해당되는 board_uuid의 코멘트 정보를 모두 반환 
    return json.dumps(result,indent=4, sort_keys=True, default=str)

# 특정 코멘트 내용 반환
@_internalbp.route("/comment/select/",methods=['GET','POST'])
def comment_select():
    
    # 외부 parameter
    comment_uuid = request.args.get('comment_uuid',None)
    _dict = StaticMemory.get_instance().get_auto_dict("connections")

    # DB에 저장
    conn = _dict['db']
    results = conn.select('SELECT a.*,b.user_nick, c.is_certificated from (SELECT idx, category, level,comment_uuid,board_uuid,user_uuid, wrote_date, \
                          longitude,latitude,comment from thread_comment) AS a LEFT JOIN account AS b ON a.user_uuid=b.user_uuid LEFT JOIN reaction_user \
                          AS c ON b.user_uuid = c.user_uuid;')

    
    _dict = {}
    #해당되는 commemt_uuid를 찾은 경우 해당 comment_uuid 정보 반환
    for i in results:
        if comment_uuid == i[3]:
            if i[11] == 1:
                _dict={"category":i[1],"level":i[2],"comment_uuid":i[3],"user_uuid":i[5],"wrote_date":i[6],"longitude":i[7],\
                       "latitude":i[8],"comment":i[9],"nick":i[10],"is_management":True}
            elif i[11] ==None or i[11]==0:
                _dict={"category":i[1],"level":i[2],"comment_uuid":i[3],"user_uuid":i[5],"wrote_date":i[6],"longitude":i[7],\
                       "latitude":i[8],"comment":i[9],"nick":i[10],"is_management":False}
                
    return json.dumps(_dict, indent=4, sort_keys=True, default=str)



