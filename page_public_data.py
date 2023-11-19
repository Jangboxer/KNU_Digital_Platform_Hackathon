from urllib.request import urlopen
import pymysql
import re
import uuid
import json
from static_py.StaticMemory import StaticMemory
from flask import Blueprint,render_template, request, session
_internalbp = Blueprint("public_data",__name__,url_prefix="/")

_dict = StaticMemory.get_instance().get_auto_dict("connections")
conn = _dict['db']

# ---------------------------------------------------------------------------
# 1km 이내 DB 데이터 반환

def facilities_nkm(user_latitude,user_longitude,amount,distance,item_type):
    if item_type==None:
        if amount=='0':
            result = conn.select(f'SELECT idx, longitude, latitude, item_type,\
                        (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                        + sin(radians({user_latitude})) * sin(radians(latitude)))) \
                        AS distance FROM public_data having DISTANCE < {distance} ORDER BY distance;')
        else:
            result = conn.select(f'SELECT idx, longitude, latitude, item_type,\
                        (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                        + sin(radians({user_latitude})) * sin(radians(latitude)))) \
                        AS distance FROM public_data having DISTANCE < {distance} ORDER BY distance LIMIT 0 , {amount};')
    else:
        if amount=='0':
            result = conn.select(f'SELECT idx, longitude, latitude, item_type,\
                        (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                        + sin(radians({user_latitude})) * sin(radians(latitude)))) \
                        AS distance FROM public_data having DISTANCE < {distance} AND item_type={item_type}  ORDER BY distance;')

        else:
            result = conn.select(f'SELECT idx, longitude, latitude, item_type,\
                        (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({user_longitude}))\
                        + sin(radians({user_latitude})) * sin(radians(latitude)))) \
                        AS distance FROM public_data having DISTANCE < {distance} AND item_type={item_type} ORDER BY distance LIMIT 0 , {amount};')
    return result
# ---------------------------------------------------------------------------
# 1km 이내 게시글 리스트
post_dict={}
@_internalbp.route("/public_data/facilities/",methods=['GET','POST'])
def page_facilities_list():
    # 외부 파라메터 받아오기
    board_uuid=request.args.get('board_uuid',None)
    latitude = request.args.get('latitude',None)
    longitude = request.args.get('longitude',None)
    amount = request.args.get('amount',"0")
    distance = request.args.get('distance',0)
    category = request.args.get('category',None)
    item_type = request.args.get('item_type',None)


    result=facilities_nkm(latitude,longitude,amount,distance,item_type)
    result_dict_list=[]
    for i in result:
        each_dict={"idx":i[0],"longitude":i[1],"latitude":i[2],"item_type":i[3],"distance":i[4]}
        result_dict_list.append(each_dict)
         
    # idx, longitude, latitude, item_type, distance


    return json.dumps(result_dict_list, indent=4, sort_keys=True, default=str)