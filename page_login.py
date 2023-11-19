from static_py.StaticMemory import StaticMemory
from flask import Blueprint,render_template, request, session
import uuid
import json
_internalbp = Blueprint("login",__name__,url_prefix="/user/")

#회원가입
@_internalbp.route("register/",methods=['GET','POST'])
def user_register(): #새로운사용자등록

    # session의 islogin이 None의 경우에 회원가입 가능
    if session.get('islogin',None)==None:

        #외부 파라메터 
        id = request.args.get('id',None)
        pw = request.args.get('pw',None)
        nick = request.args.get('nick',None)

        # user_uuid 생성
        user_uuid=str(uuid.uuid4())

        _dict = StaticMemory.get_instance().get_auto_dict("connections")
        conn = _dict['db']

        # id가 8자리 이하인 경우만 가능
        if len(id)<9:
            result = conn.select('select * from account')

            for i in result:

                # db에 동일한 user_id가 있는 경우 회원가입 안됨.
                if id==i[3]:   
                    print("중복이라 실패하였습니다.")
                    return json.dumps({"result":False,"reason_eng":"Duplicate id exists","reason_kr":"중복되는 아이디가 존재합니다"})

            # DB에 회원기록 저장
            conn.commit('INSERT INTO account (user_uuid,registered_date,user_id,user_pw,user_nick) VALUES (%s,now(),%s,%s,%s)', (user_uuid,id,pw,nick))
            return json.dumps({"result":True,"user_uuid":user_uuid,"nick":nick})
    
        # id가 8자리 초과인 경우
        else:
            return json.dumps({"result":False,"reason_eng":"id is more than 8 digits","reason_kr":"id가 8자리 초과입니다"})
    
    # session의 islogin이 None이 아닌 경우에 회원가입 불가  
    else:
        return json.dumps({"result":False,"reason_eng":"If islogin of session is not None, member registration is not possible","reason_kr":"session의 islogin이 None이 아닌 경우에 회원가입 불가"})
    

# 회원탈퇴
@_internalbp.route("unregister/",methods=['GET','POST'])    
def user_unregister(): #ID계정 제거

    # 세션 islogin이 True일 때 회원탈퇴 가능
    if session.get('islogin',None) ==True:

        # 세션에서 id 가져옴
        id = session["id"]

        # 외부 parameter
        pw = request.args.get('pw',None)

        _dict = StaticMemory.get_instance().get_auto_dict("connections")
        # DB에서 삭제
        conn = _dict['db']
        conn.commit(f'DELETE FROM account WHERE user_id ="{id}" and user_pw = "{pw}"')
        
        # 세션에서 islogin,id 제거
        session.pop('islogin',None)
        session.pop('id',None) 
        
        # 리턴값: True 반환 , user_uuid,nick 반환(user_uuid,nick 세션 제거)
        return json.dumps({"result":True,"user_uuid":session.pop("user_uuid",None),"nick":session.pop("nick",None)})
        
    # 세션 islogin이 None인 경우 회원탈퇴 불가
    else:
        return json.dumps({"result":False,"reason_eng":"session's islogin status is None","reason_kr":"islogin 상태가 None입니다"})


# 로그인
@_internalbp.route("login/",methods=['GET','POST'])
def login_work():
    # 세션이 islogin이 없는 조건일 경우 로그인 가능
    if session.get('islogin',None)==None:
        
        # id,pw 입력
        id = request.args.get('id',None)
        pw = request.args.get('pw',None)

        # db에서 데이터 읽기
        _dict = StaticMemory.get_instance().get_auto_dict("connections")
        # DB에 저장
        conn = _dict['db']
        # DB에서 account 테이블에서 user_uuid, user_id, user_pw, user_nick 읽어오기
        result = conn.select('SELECT user_uuid,user_id,user_pw,user_nick FROM account')

        # 테이블에서 읽어온 데이터 중, id와 pw가 일치하는 경우를 찾음
        for i in result:
            if (id ==i[1]) and (pw ==i[2]) :
                # 세션 로그인 True 변경
                session['islogin']=True

                # 세션에 user_uuid 저장
                user_uuid =i[0]
                session['user_uuid'] = user_uuid
                
                # 세션에 user_id 저장
                user_id = i[1]
                session["id"]= user_id

                # 세션에 user_nick 저장
                user_nick = i[3]
                session["nick"]= user_nick
                
                # 로그인 성공의 경우 user_uuid 및 user_nick 반환
                return json.dumps({"result":True,"user_uuid":str(user_uuid),"nick":str(user_nick)})

        # 일치하는 ip,pw가 없는 경우
        return json.dumps({"result":False,"reason_eng":"No matching id, pw found","reason_kr":"매치되는 id,pw가 없습니다"})
    
    # 세션에 None이 아닌 경우에 로그인 불가
    else:
        return json.dumps({"result":False,"reason_eng":"session's islogin status is not None","reason_kr":"세션 islogin이 이미 존재합니다"})


#로그아웃
@_internalbp.route("logout/")
def logout_work():
    # 세션이 islogin이 True 조건일 경우 로그아웃 가능
    if session.get('islogin',None) ==True:

        # 세션에 남아있는 기록 제거
        session.pop('id',None) 
        session.pop("nick")
        session.pop('islogin',None)

        # 리턴값 : result True 및 user_uuid 반환(반환과 동시에 세션제거)
        return json.dumps({"result":True,"user_uuid":session.pop('user_uuid',None)})
    
    # 세션에 islogin이 None인 경우 로그아웃 불가
    else:
        return json.dumps({"result":False,"reason_eng":"session's islogin status is None","reason_kr":"세션 islogin이 None입니다."})

#로그인 상태
@_internalbp.route("islogin/")
def islogin_work():  
    # 세션이 islogin이 True 조건일 경우 islogin 조회
    if session.get('islogin',None) ==True:
        
        # 리턴값 : result True 및 user_uui, nick 반환
        return json.dumps({"result":True,"user_uuid":session["user_uuid"],"nick":session["nick"]})
    
    # 세션에 islogin이 없는 경우 조회 불가
    else:
        return json.dumps({"result":False,"reason_eng":"session's islogin status is not None","reason_kr":"islogin 상태가 None입니다"})


# 비밀번호 변경
@_internalbp.route("changepassword/")
def changepassword_work():   
    # 세션 islogin이 True인 조건인 경우에 비밀번호 변경
    if session.get('islogin',None) ==True:

        # 세션 id값 가져옴
        id = session["id"]

        # pw와 newpw를 입력받음
        pw = request.args.get('pw',None)
        newpw = request.args.get('newpw',None)

        # db에서 데이터 읽기
        _dict = StaticMemory.get_instance().get_auto_dict("connections")
        # DB에 저장
        conn = _dict['db']
        
        # DB의 account 테이블에서 user_uuid,user_id,user_pw 가져옴
        result = conn.select('SELECT user_uuid,user_id, user_pw from account')

        for i in result:
            # user_id와 user_pw가 일치하는 경우에 비밀번호 변경 가능

            if (id ==i[1]) & (pw ==i[2]) & (newpw !=None):
                # user_id와 user_pw가 일치하는 경우에 비밀번호 변경 및 DB 반영
                conn.commit(f'UPDATE account SET user_pw = "{newpw}" WHERE user_id ="{id}" and  user_pw = "{pw}"' )

                return json.dumps({"result":True,"user_uuid":session["user_uuid"],"nick":session["nick"]})
            
        # 일치하는 id,pw가 없는 경우
        return json.dumps({"result":False,"reason_eng":"No matching id,pw found","reason_kr":"일치하는 id,pw가 찾을 수 없습니다"})
    