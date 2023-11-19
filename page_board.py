from urllib.request import urlopen
import pymysql
import re
import traceback
import uuid
import json
from static_py.StaticMemory import StaticMemory
_dict = StaticMemory.get_instance().get_auto_dict("connections")
conn = _dict['db']
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 데이터 DB에 입력 함수
def board_Content(board_uuid, user_uuid, longitude, latitude, title, content, category, level, comment_size=0):
    conn.commit('INSERT INTO threat_board VALUES (0, %s, %s, NOW(), %s, %s, %s, %s, %s, %s, %s)',\
                 (board_uuid, user_uuid, longitude, latitude, title, content, category, level, comment_size))
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 작성자 닉네임 찾는 함수
def board_user_nick(user_uuid):
    result = conn.select(f'SELECT user_nick FROM account WHERE user_uuid="{user_uuid}"')
    return result[0][0]
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 리스트의 title, content, user_uuid, wrote_date를 result=[]로 반환하는 함수
def open_board_list():
    result = conn.select('SELECT title, content, user_uuid, wrote_date from threat_board')
    return result
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 위도 경도 반환 함수
def board_la_lo(board_uuid):
    result = conn.select(f'SELECT latitude, longitude FROM threat_board WHERE board_uuid = "{board_uuid}";')
    return result[0][0],result[0][1]
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 삭제 함수
def delete_my_board(board_uuid):
    result = conn.select(f'DELETE from threat_board where board_uuid = "{board_uuid}"')
    board_uuid_list=[]
    for i in result:
        board_uuid_list.append(i)
    return board_uuid_list
# ------------------------------------------------------------------------------------------------------------------------------------------
# 내 게시글 조회 함수
def find_user_uuid_of_board(board_uuid):
    # _dict = StaticMemory.get_instance().get_auto_dict("connections")
    # conn = _dict['db']
    result = conn.select(f'SELECT user_uuid from threat_board where board_uuid="{board_uuid}"')
    return result[0][0]
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 내의 댓글 개수 반환 함수
def count_comment(board_uuid):
    result = conn.select(f'SELECT count(*) from thread_comment where board_uuid = "{board_uuid}"')
    return result[0][0]
# ------------------------------------------------------------------------------------------------------------------------------------------
# 평균 이상 가중치 계산 함수
def mean_over_board_weight():
    result = conn.select(f'SELECT avg(LEVEL+(LEVEL*comment_size/10)) AS weight from threat_board;')
    return result[0][0]
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 선택 함수
def select_board(board_uuid):
    result = conn.select(f'SELECT a.board_uuid, a.wrote_date, a.longitude, a.latitude,a.user_uuid,a.title,a.content,a.comment_size,b.user_nick,a.category,a.level\
                FROM threat_board AS a LEFT JOIN (SELECT user_uuid, user_nick FROM account) \
                AS b ON a.user_uuid=b.user_uuid WHERE board_uuid = "{board_uuid}";')
    return result
# ------------------------------------------------------------------------------------------------------------------------------------------
# 3km 이내 DB 데이터 반환
def facilities_1km(user_latitude,user_longitude,amount=0):
    if amount==0:
        result = conn.select(f'SELECT board_uuid, wrote_date, longitude, latitude, user_uuid, content,\
                    (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                    + sin(radians({user_latitude})) * sin(radians(latitude)))) \
                    AS distance FROM public_data having DISTANCE <= 1 ORDER BY distance;')
    else:
        result = conn.select(f'SELECT board_uuid, wrote_date, longitude, latitude, user_uuid, content,\
                    (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                    + sin(radians({user_latitude})) * sin(radians(latitude)))) \
                    AS distance FROM public_data having DISTANCE <= 1 ORDER BY distance LIMIT 0 , {amount};')
    return result    
# ------------------------------------------------------------------------------------------------------------------------------------------
# nkm 이내 게시글 데이터 반환
def board_nkm(user_latitude, user_longitude, amount=0, distance=3, category=None):
    if category==None:
        result = conn.select(f'SELECT a.*,b.user_nick FROM (SELECT board_uuid, wrote_date, longitude, latitude, user_uuid, title, content, level, category,\
                    (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                    + sin(radians({user_latitude})) * sin(radians(latitude))))\
                    AS distance FROM threat_board) AS a LEFT JOIN (SELECT user_uuid, user_nick FROM account)\
                     AS b ON a.user_uuid=b.user_uuid having DISTANCE <= {distance} ORDER BY distance {f"LIMIT 0 , {amount}" if amount!=0 else ""};')
    else:
        result = conn.select(f'SELECT a.*,b.user_nick FROM (SELECT board_uuid, wrote_date, longitude, latitude, user_uuid, title, content, level, category,\
                    (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                    + sin(radians({user_latitude})) * sin(radians(latitude))))\
                    AS distance FROM threat_board) AS a LEFT JOIN (SELECT user_uuid, user_nick FROM account)\
                     AS b ON a.user_uuid=b.user_uuid having DISTANCE <= {distance} and category="{category}" ORDER BY distance {f"LIMIT 0 , {amount}" if amount!=0 else ""};')        
    return result  
# ------------------------------------------------------------------------------------------------------------------------------------------
# nkm 이내 게시글 가중치 데이터 반환
def board_nkm_weight(user_latitude,user_longitude, amount=0, distance=3,category=None):
    if category==None:
        result = conn.select(f'SELECT a.*,b.user_nick FROM (SELECT board_uuid, wrote_date, longitude, latitude, user_uuid, title, content, level, category,\
                    level+level/10*comment_size AS weight,\
                    (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                    + sin(radians({user_latitude})) * sin(radians(latitude))))\
                    AS distance FROM threat_board) AS a LEFT JOIN (SELECT user_uuid, user_nick FROM account)\
                     AS b ON a.user_uuid=b.user_uuid having DISTANCE <= {distance} ORDER BY weight DESC, distance ASC {f"LIMIT 0 , {amount}" if amount!=0 else ""};')
    else:
        result = conn.select(f'SELECT a.*,b.user_nick FROM (SELECT board_uuid, wrote_date, longitude, latitude, user_uuid, title, content, level, category,\
                    level+level/10*comment_size AS weight,\
                    (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                    + sin(radians({user_latitude})) * sin(radians(latitude))))\
                    AS distance FROM threat_board) AS a LEFT JOIN (SELECT user_uuid, user_nick FROM account)\
                     AS b ON a.user_uuid=b.user_uuid having DISTANCE <= {distance} and category="{category}" ORDER BY weight DESC, distance ASC {f"LIMIT 0 , {amount}" if amount!=0 else ""};')
    return result  
# ------------------------------------------------------------------------------------------------------------------------------------------
# 하버사인 함수
import math
def haversine(user_latitude,user_longitude,other_latitude,other_longitude):
    result=6371 * math.acos(math.cos(math.radians(user_latitude)) * math.cos(math.radians(other_latitude))\
                        * math.cos(math.radians(other_longitude) - math.radians(user_longitude))\
                        + math.sin(math.radians(user_latitude)) * math.sin(math.radians(other_latitude)))
    return result
# ------------------------------------------------------------------------------------------------------------------------------------------
from flask import Blueprint,render_template, request, session
_internalbp = Blueprint("board",__name__,url_prefix="/")
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시판 flask
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시판 첫 화면
@_internalbp.route("/board/",methods=['GET','POST'])
def page_board():
    if session['islogin']==True:
        # session['uuid'] = uuid
        return "게시물을 입력할 수 있음"

    else:
        return "엑세스권한없음"
        # return render_template("login.html")
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 업로드
@_internalbp.route("/board/upload/",methods=['GET','POST'])
def page_board_upload():
    try:
    # 로그인 상황
        if session.get('islogin',None) == True:
            # 외부 파라메터 받아오기
            user_uuid = session.get('user_uuid',None)
            category = request.args.get('category',None)
            level = request.args.get('level', None)
            title = request.args.get('title',None)
            latitude = request.args.get('latitude',None)
            longitude = request.args.get('longitude',None)
            content = request.args.get('content',None)
            board_uuid=str(uuid.uuid4())
            latitude=float(latitude)
            longitude=float(longitude)

            # 데이터 베이스에 저장
            # board_uuid, user_uuid, longitude, latitude, title, content, category, level
            board_Content(board_uuid, user_uuid, longitude, latitude, title, content, category,level)
            # board_Content(board_uuid, _user_uuid, _longitude, _latitude,'지진발생','ㅇㅇ지역에서 4.3지진발생','자연재해',3)
            user_nick=board_user_nick(user_uuid)
            # --------------------------------------------------------------------------------------------------------
            # 소켓
            # 온라인 유저
            _connections = StaticMemory.get_instance().get_auto_dict("sockets");
            print(_connections)
            # DB
            _dict = StaticMemory.get_instance().get_auto_dict("connections")
            print(_dict)


            # 작성한 게시글 반경 3km 이내인 사람들에게 정보전송
            # 정보
            new_obj={}
            new_obj['type']='new_event'
            new_obj['board_uuid']=board_uuid
            new_obj['content']=content
            new_obj['category']=category
            new_obj['level']=level
            new_obj['latitude']=latitude
            new_obj['longitude']=longitude
            new_obj['title']=title
            print(new_obj)

            for k,v in _connections.items():
                other_user_uuid=v['user_uuid']
                other_latitude = v['latitude']
                other_longitude = v['longitude']

            
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




            rs = board_nkm(latitude,longitude,10,3,None)
            aaa=0
            for x in rs:
                aaa+=1
            
            if(aaa<=5):
            
                # 작성한 게시글 반경 3km 이내인 사람들에게 정보전송
                # 정보
                new_obj={}
                new_obj['type']='threat_live'
                new_obj['board_uuid']=board_uuid
                new_obj['content']=content
                new_obj['category']=category
                new_obj['level']=level
                new_obj['latitude']=latitude
                new_obj['longitude']=longitude
                new_obj['title']=title
                print(new_obj)

                for k,v in _connections.items():
                    other_user_uuid=v['user_uuid']
                    other_latitude = v['latitude']
                    other_longitude = v['longitude']

                
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

            # 결과 반환
            return json.dumps({'result':True, 'board_uuid':board_uuid,'user_nick':user_nick}, indent=4, sort_keys=True, default=str)
        # 로그아웃일 때 결과 반환
        else:
            return json.dumps({'result':False, 'reason_eng':'You are not login state','reason_kor':'로그인 상태가 아닙니다.'}, indent=4, sort_keys=True, default=str)
    except:
        print(traceback.format_exc())
        return json.dumps({'result':False,'reason_eng':'code error','reason_kor':'코드에러.'}, indent=4, sort_keys=True, default=str)
    
    
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 삭제
@_internalbp.route("/board/delete/",methods=['GET','POST'])
def page_board_delete():
    try:
        # 외부 파라메터 받아오기
        board_uuid=request.args.get('board_uuid',None)
        user_uuid=session.get('user_uuid',None)
        
        # 해당 게시글의 user_uuid를 찾음
        board_user_uuid=find_user_uuid_of_board(board_uuid)
        result=count_comment(board_uuid)
        comment_size=result
        latitude, longitude=board_la_lo(board_uuid)
        latitude=float(latitude)
        longitude=float(longitude)

        # 해당 게시글 작성자일 경우 게시글 삭제(단, 댓글이 한개라도 있으면 삭제불가)
        if comment_size==0:
            if user_uuid==board_user_uuid:
                delete_my_board(board_uuid)
                user_nick=board_user_nick(user_uuid)
                # --------------------------------------------------------------------------------------------------------
                # 소켓

                # 온라인 유저
                _connections = StaticMemory.get_instance().get_auto_dict("sockets");
                print(_connections)

                # DB
                _dict = StaticMemory.get_instance().get_auto_dict("connections")
                print(_dict)

                # 작성한 게시글 반경 3km 이내인 사람들에게 정보전송

                # 정보
                new_obj={}
                new_obj['type']='del_event'
                new_obj['board_uuid']=board_uuid
                print(new_obj)

                for k,v in _connections.items():
                    try:
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
                    except:
                        pass

                    else:
                        print("'reason_eng':'latitude or longitude is None','reason_kor':'위도, 경도가 None값 입니다.'")
                # -------------------------------------------------------------------------------------------------------

                return json.dumps({'result':True,'delete_board_uuid':board_uuid,'user_nick':user_nick}, indent=4, sort_keys=True, default=str)
            else:
                return json.dumps({'result':False,"reason_eng":"user_uuid is not match with other board_user_uuid ",'reason_kor':'작성자가 아닙니다.'})
        else:
            return json.dumps({'result':False,"reason_eng":"comment_size is more than 0",'reason_kor':'댓글이 존재합니다. 게시글을 지울 수 없습니다.'})
    except:
        return json.dumps({'result':False,"reason_eng":"this board isn't yours",'reason_kor':'작성자가 아닙니다.'})
    # return post_list
# ------------------------------------------------------------------------------------------------------------------------------------------
# 게시글 선택
post_dict={}
@_internalbp.route("/board/select/",methods=['GET','POST'])
def page_board_select():
    try:
        # 외부 파라메터 받아오기
        board_uuid=request.args.get('board_uuid',None)

        result=select_board(board_uuid)

        # result로 받아온 데이터를 딕셔너리 형태로 담음
        for i in result:
            each_dict={"result":True, "board_uuid":i[0],"wrote_date":i[1],"longitude":i[2],"latitude":i[3],"user_uuid":i[4],\
                    "title":i[5],"content":i[6],"comment_size":i[7],"user_nick":i[8],"category":i[9],"level":i[10]}

        # board_uuid, wrote_date, longitude, latitude, user_uuid, title, content, comment_size, user_nick, category, level
        return json.dumps(each_dict, indent=4, sort_keys=True, default=str)
    
    except:
        return json.dumps({'result':False,"reason":"please input correct board_uuid",'reason_kor':'잘못된 board_uuid 입니다.'}, indent=4, sort_keys=True, default=str)

    
# ------------------------------------------------------------------------------------------------------------------------------------------
# nkm 이내 게시글 리스트
post_dict={}
@_internalbp.route("/board/listbydistance/",methods=['GET','POST'])
def page_board_list():
    try:
        # 외부 파라메터 받아오기
        latitude = request.args.get('latitude',0)
        longitude = request.args.get('longitude',0)
        amount = request.args.get('amount',0)
        category = request.args.get('category',None)

        # 기본거리 3km
        distance = request.args.get('distance',3)

        # nkm 이내 거리가 가까운 게시글을 반환
        result=board_nkm(latitude, longitude, amount, distance, category)

        result_dict_list=[]
        for i in result:
            each_dict={}
            each_dict={"board_uuid":i[0],"wrote_date":i[1],"longitude":i[2],"latitude":i[3],"user_uuid":i[4],\
                    "title":i[5],"content":i[6],"level":i[7],"category":i[8],"distance":i[9],"user_nick":i[10]}
            result_dict_list.append(each_dict)

        # board_uuid, wrote_date, longitude, latitude, user_uuid, title, content, level, category, distance, user_nick


        return json.dumps(result_dict_list, indent=4, sort_keys=True, default=str)
    
    except:
        return json.dumps({'result':False,"reason_eng":"Board do not exist within range.",'reason_kor':'범위이내에 게시글이 존재하지 않습니다.'})

# ------------------------------------------------------------------------------------------------------------------------------------------
# nkm 이내 가중치 게시글 리스트
post_dict={}
@_internalbp.route("/board/listbyweight/",methods=['GET','POST'])
def page_board_weight_list():
    try:
        # 외부 파라메터 받아오기
        board_uuid = request.args.get('board_uuid',None)
        latitude = request.args.get('latitude',None)
        longitude = request.args.get('longitude',None)
        amount = request.args.get('amount',0)
        category = request.args.get('category',None)

        # 기본 거리 3km
        distance = request.args.get('distance',3)

        # nkm 이내 가중치가 높고 거리가 가까운 게시글을 반환
        result=board_nkm_weight(latitude,longitude,amount,distance,category)
        result_dict_list=[]
        for i in result:
            each_dict={"board_uuid":i[0],"wrote_date":i[1],"longitude":i[2],"latitude":i[3],"user_uuid":i[4],\
                    "title":i[5],"content":i[6],"level":i[7],"category":i[8],"weight":i[9],"distance":i[10],"user_nick":i[11]}
            result_dict_list.append(each_dict)

        return json.dumps(result_dict_list, indent=4, sort_keys=True, default=str)
        # board_uuid, wrote_date, longitude, latitude, user_uuid, title, content, level, category, weight, distance, user_nick
    
    except:
        return json.dumps({'result':False,"reason_eng":"Board do not exist within range.",'reason_kor':'범위이내에 게시글이 존재하지 않습니다.'})
# ------------------------------------------------------------------------------------------------------------------------------------------