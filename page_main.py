from static_py.StaticMemory import StaticMemory
from flask import Blueprint,render_template, request
import json
_internalbp = Blueprint("main",__name__,url_prefix="/")

@_internalbp.route("/")
def test_work():
    return render_template("map.html")

#page_main.py
@_internalbp.route("/test2",methods=["GET"])

def test_work2():
    _conn_dict= StaticMemory.get_instance().get_auto_dict("connections")
    
    _clients=StaticMemory.get_instance().get_auto_dict("sockets")
     
    for x in _clients.keys():
    
        _list=[1,2,3,4,5,6,7,8]
        
        x.request_send_json(_list)
        
    
    return json.dumps([{"result":True}])


