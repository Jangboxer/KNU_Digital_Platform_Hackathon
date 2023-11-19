import pymysql
import re
import uuid
import json
import base64
from static_py.StaticMemory import StaticMemory

_dict = StaticMemory.get_instance().get_auto_dict("connections")
conn = _dict['db']

from flask import Blueprint,render_template, request, session,make_response
_internalbp = Blueprint("image",__name__,url_prefix="/image/")


@_internalbp.route("/upload/",methods=['GET','POST'])
def img_board_upload():
    content = request.form.get('content', None)
    board_uuid = request.form.get('board_uuid', None)
    image_uuid = str(uuid.uuid4())
    
    conn = _dict['db']
    query = 'INSERT INTO image_table (content, board_uuid, image_uuid) VALUES (%s, %s, %s)'
    params = (content, board_uuid, image_uuid)
    conn.commit(query, params)
    return json.dumps({'result':True}, indent=4, sort_keys=True, default=str)


@_internalbp.route("/select/",methods=['GET','POST'])
def img_board_list():
    board_uuid = request.args.get('board_uuid', None)
    image_uuid = str(uuid.uuid4())
    
    conn = _dict['db']
    query = 'INSERT INTO image_table (content, board_uuid, image_uuid) VALUES (%s, %s, %s)'

    fetch = conn.select(f"SELECT image_uuid,content from image_table where board_uuid='{board_uuid}'")
    for x in fetch:
        return json.dumps({'result':True}, indent=4, sort_keys=True, default=str)
        
    
    return json.dumps({'result':False}, indent=4, sort_keys=True, default=str)
    

@_internalbp.route("/get/",methods=['GET','POST'])
def img_board_get():
    board_uuid = request.args.get('board_uuid', None)
    image_uuid = str(uuid.uuid4())
    
    conn = _dict['db']

    fetch = conn.select(f"SELECT image_uuid,content from image_table where board_uuid='{board_uuid}'")
    image = ""
    for x in fetch:
        image=x[1]
        
    if(image==""):
        return json.dumps({'result':False}, indent=4, sort_keys=True, default=str)
    
    image_base64 = image.split(",")[1]
    if(len(image_base64)>=2):
        image = base64.b64decode(image_base64)
        result = make_response(image)
        result.headers.set("Content-Type","image/jpeg")
        return result;
    else:
        return "Error"
    
    
