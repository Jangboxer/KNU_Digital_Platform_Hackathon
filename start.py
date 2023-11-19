from static_py.StaticMemory import StaticMemory
import threading
import time
from lib.IntegratedWebSocket.IntegratedWebSocket import IntegratedWebSocket
from lib.IntegratedWebSocket.IntegratedWebClient import IntegratedWebClient
from lib.Databases.Database import Database

from socket_py.SocketMain import SocketMain
import random
from flask import Flask

if(__name__=="__main__"):
    app = Flask(__name__, static_url_path="/static")
    app.secret_key="dsgjasghjdgjkgjk$#%&(1234#$@&#$(%&#@!(" + str(random.randint(0,99999999999))
    _conn=Database(_host='127.0.0.1',_port=3306, _user='db_hackerthon', _passwd="", _db='', _charset='utf8')
    _dict = StaticMemory.get_instance().get_auto_dict("connections")
    _dict["db"]=_conn 
    
    print(_dict)
    
    # 블루프린트 등록
    import page_main
    app.register_blueprint(page_main._internalbp)
    
    # 로그인
    import page_login
    app.register_blueprint(page_login._internalbp)

    #웹 소켓 시작
    socket = SocketMain().start()

    # board 페이지
    import page_board
    app.register_blueprint(page_board._internalbp)
    
    # image 페이지
    import image_board
    app.register_blueprint(image_board._internalbp)

    # comment 페이지
    import page_comment
    app.register_blueprint(page_comment._internalbp)

    #reaction 페이지
    import page_reaction
    app.register_blueprint(page_reaction._internalbp)

    # page_public_data 페이지
    import page_public_data
    app.register_blueprint(page_public_data._internalbp)

    # page_public_data 페이지
    import page_weather
    app.register_blueprint(page_weather._internalbp)

    print("종료점")
    app.run(debug=True, host='0.0.0.0', port=8080, use_reloader=False)
    print("끝")
