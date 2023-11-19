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


_internalbp = Blueprint("reaction",__name__,url_prefix="/reaction/")
    
# 본인을 해당지역 보안관 신청
@_internalbp.route("requestadministrator/",methods=['GET','POST'])
def request_administrator():
    
    # 세션
    if(session.get('islogin',None) ==True):

        # 내부 parameter
        user_uuid=session["user_uuid"]
        is_certificated = False

        # 외부 parameter
        user_job =request.args.get('user_job',None)
        category = request.args.get('category',None)
        latitude = request.args.get('latitude',None)
        longitude = request.args.get('longitude',None)

        _dict = StaticMemory.get_instance().get_auto_dict("connections")
        # DB에 저장
        conn = _dict['db']

        # 데이터 가져오기
        result = conn.select("SELECT category,user_uuid FROM reaction_user")

        for i in result:
            # 데이터베이스 비어 있는 경우
            if i==None:
                break
            # 데이터베이스 있는 경우
            else:
                if user_uuid == i[1]:
                    return json.dumps({"result":False, "reason":"중복신청이 불가합니다."})
                
        conn.commit('INSERT INTO reaction_user (user_uuid,date,user_job,is_certificated,category,latitude,longitude) VALUES (%s,now(),%s,%s,%s,%s,%s)', (user_uuid,user_job,is_certificated,category,latitude,longitude))

        # 리턴값
        return json.dumps({"result":True,"reason":"admin request completed"})
    
    else:
        return json.dumps({"result":False, "reason":"not login state"})
        

#보안관 여부 확인 및 카테고리 반환
@_internalbp.route("getuser/",methods=['GET','POST'])
def get_user():

    # 외부 parameter
    user_uuid = request.args.get('user_uuid',None)

    _dict = StaticMemory.get_instance().get_auto_dict("connections")
    conn = _dict['db']

    #DB에서 user_uuid 정보 가져오기
    result = conn.select('SELECT user_uuid,category,is_certificated from reaction_user')
    
    for i in result:
        if user_uuid == i[0]:
            return json.dumps({"result":True,"is_reaction_user":i[2], "category":i[1]})
        
    return json.dumps({"result":False, "reason":"해당 UUID를 찾을 수 없습니다."})
    
        

#보안관으로 승인
@_internalbp.route("approveadministrator/",methods=['GET','POST'])
def approve_administrator():
       
    # 외부 parameter
    user_uuid = request.args.get('user_uuid',None)

    _dict = StaticMemory.get_instance().get_auto_dict("connections")
    conn = _dict['db']

    result = conn.select('SELECT user_uuid,is_certificated from reaction_user')
    
    for i in result:
        if user_uuid == i[0] and i[1]==0:
            # 보안관 승인
            conn.commit(f"UPDATE reaction_user SET is_certificated = 1 Where user_uuid = '{user_uuid}'")
            # 리턴값
            return json.dumps({"result":True,"reason":"administrator_appoved"})
 
    return json.dumps({"result":False,"reason":"already_appoved"})

    

#  요청한 주변 좌표에 대해서 온라인 접속자인 위험에 대응하는 관리자를 모두 반환
# @_internalbp.route("getuserlist/",methods=['GET','POST'])
# def get_user_list():
    

# 관리자가 특정 board_uuid를 삭제
@_internalbp.route("deleteboard/",methods=['GET','POST'])
def get_board():
    if(session.get('islogin',None) ==True):
        # 세션에서 uuid 가져오기
        user_uuid=session["user_uuid"]

        # board_uuid 가져오기
        board_uuid = request.args.get('board_uuid',None)

        # db에서 데이터 읽기
        _dict = StaticMemory.get_instance().get_auto_dict("connections")

        # DB에 저장
        conn = _dict['db']

        #DB에서 user_uuid 정보 가져오기
        result = conn.select('SELECT c.user_uuid,c.category,c.is_certificated,b.user_nick from reaction_user as c left join account as b on c.user_uuid=b.user_uuid')
        
        result2 = conn.select('SELECT board_uuid, latitude, longitude, title from threat_board')
        
        is_board=False
        latitude=0
        longitude=0
        title="";
        
        for i in result2:
            if(board_uuid==i[0]):
                is_board=True
                latitude = float(i[1])
                longitude=float(i[2])
                title = i[3]
                
        
        
        isOkay=False
        user_nick="";
        
        for i in result:
            if user_uuid == i[0] and i[2]==True:
                isOkay=True
                user_nick=i[3];
        if(is_board==False):
            return json.dumps({"result":False, "reason":"is not operator", "reason_kor":"잘못된 엑세스 입니다. 이미 게시글이 존재하지 않습니다."})
        
        
        if(isOkay):
        
            conn.commit(f'DELETE FROM threat_board WHERE board_uuid ="{board_uuid}"')
            # 소켓
            # 온라인 유저
            _connections = StaticMemory.get_instance().get_auto_dict("sockets")
        
        
            # 작성한 게시글 반경 3km 이내인 사람들에게 정보전송
            # 정보
            new_obj={}
            new_obj['type']='del_event'
            new_obj['board_uuid']=board_uuid
            
            print(new_obj)
            
            for k,v in _connections.items():
                other_user_uuid=v['user_uuid']
                other_latitude = v['latitude']
                other_longitude = v['longitude']

                latitude=float(latitude)
                longitude=float(longitude)

                print(other_user_uuid,type(other_latitude),other_latitude,type(other_longitude),other_longitude)
                print(other_user_uuid,type(latitude),other_latitude,type(longitude),longitude)

            
                if other_latitude!=None and other_longitude!=None:
                    print(haversine(latitude,longitude,other_latitude,other_longitude))

                    if haversine(latitude,longitude,other_latitude,other_longitude)<=3:
                        print(other_user_uuid)
                        k.request_send_json(new_obj)
                    else:
                        print("'reason_eng':'cant find user','reason_kor':'주변에 이용자가 없습니다..'")
                else:
                    print("'reason_eng':'latitude or longitude is None','reason_kor':'위도, 경도가 None값 입니다.'")

            # 작성한 게시글 반경 3km 이내인 사람들에게 정보전송
            # 정보
            new_obj={}
            new_obj['type']='info_event'
            new_obj['content']="지역 관리자(" + user_nick + ")님이 다음 이벤트를 만료 했습니다.<br><br>" + board_uuid+"<br>" + title;            
            
            print(new_obj)
            
            for k,v in _connections.items():
                other_user_uuid=v['user_uuid']
                other_latitude = v['latitude']
                other_longitude = v['longitude']

                latitude=float(latitude)
                longitude=float(longitude)

                print(other_user_uuid,type(other_latitude),other_latitude,type(other_longitude),other_longitude)
                print(other_user_uuid,type(latitude),other_latitude,type(longitude),longitude)

            
                if other_latitude!=None and other_longitude!=None:
                    print(haversine(latitude,longitude,other_latitude,other_longitude))

                    if haversine(latitude,longitude,other_latitude,other_longitude)<=3:
                        print(other_user_uuid)
                        k.request_send_json(new_obj)
                    else:
                        print("'reason_eng':'cant find user','reason_kor':'주변에 이용자가 없습니다..'")
                else:
                    print("'reason_eng':'latitude or longitude is None','reason_kor':'위도, 경도가 None값 입니다.'")
      
            return json.dumps({"result":True})
        else:
            return json.dumps({"result":False, "reason":"is not operator", "reason_kor":"잘못된 엑세스 입니다. 관리자가 아닙니다."})
    else:
        return json.dumps({"result":False, "reason":"not login state", "reason_kor":"로그인 되어 있지 않습니다."})
        
            