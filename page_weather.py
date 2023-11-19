from urllib.request import urlopen
import pymysql
import re
import uuid
import json
from static_py.StaticMemory import StaticMemory
from flask import Blueprint,render_template, request, session
_internalbp = Blueprint("weather",__name__,url_prefix="/")

_dict = StaticMemory.get_instance().get_auto_dict("connections")
conn = _dict['db']

# ---------------------------------------------------------------------------
# 날씨정보 전달 함수

def weather_info(user_latitude,user_longitude):
    user_latitude=float(user_latitude)
    user_longitude=float(user_longitude)
    print(user_latitude,user_longitude)
    result = conn.select(f'SELECT a.Idx, a.category, a.fcstValue, a.start_latitude, a.start_longitude, a.end_latitude, a.end_longitude,\
                         b.*, (6371 * acos(cos(radians({user_latitude})) * cos(radians(latitude))\
                         * cos(radians(longitude) - radians({user_longitude}))\
         		        + sin(radians({user_latitude})) * sin(radians(latitude)))) AS distance\
					    FROM (SELECT * FROM weather) AS a LEFT JOIN (SELECT * FROM daegu_weather) AS b ON a.nx=b.nx AND a.ny=b.ny\
					    having DISTANCE < 30 ORDER BY DISTANCE LIMIT 1,10;')
    return result

# ---------------------------------------------------------------------------
# 내 위치 날씨정보 반환
post_dict={}
@_internalbp.route("/weather/isin/",methods=['GET','POST'])
def page_facilities_list():
    # 외부 파라메터 받아오기
    user_latitude = request.args.get('latitude',None)
    user_longitude = request.args.get('longitude',None)

    result=weather_info(user_latitude,user_longitude)

    print(result)

    result_dict_list=[]
    for i in result:
        each_dict={"idx":i[0],"category":i[1],"fcstValue":i[2],"start_latitude":i[3],"start_longitude":i[4],"end_latitude":i[5],
                   "end_longitude":i[6],'user_latitude':user_latitude, 'user_longitude':user_longitude}
        result_dict_list.append(each_dict)
        print(result_dict_list)
    rain_type=result_dict_list[0]['fcstValue'] # PTY 강수형태
    rain_amount=result_dict_list[1]['fcstValue'] # RN1 1시간 강수량
    temp=result_dict_list[3]['fcstValue'] # T1H 기온

    temp=int(temp)

    if temp<12:
        temp_info=f'춥DAY({temp}℃ )'
    elif 12<=temp<18:
        temp_info=f'쌀쌀하DAY({temp}℃ )'
    elif 18<=temp<27:
        temp_info=f'선선하DAY({temp}℃ )'
    elif 27<=temp:
        temp_info=f'덥DAY({temp}℃ )'
    print(temp_info)

    if rain_amount=='강수없음':
        rain_amount_info=rain_amount
        warning_info='기상특보없음'
    else:
        rain_amount=float(rain_amount.replace('mm',''))
        if rain_amount < 1:
            rain_amount_info = '빗방울'
        elif 1<=rain_amount<3:
            rain_amount_info = '약함'
        elif 3<=rain_amount<15:
            rain_amount_info = '보통'
        elif 15<=rain_amount<30:
            rain_amount_info = '강함'
        elif 30<=rain_amount:
            rain_amount_info = '매우강함' 

        if rain_amount*3 < 60:
            warning_info='호우특보없음'
        elif 60 <=rain_amount*3 < 90:
            warning_info='호우주의보'
        elif 90 <=rain_amount*3:
            warning_info='호우경보'

    weather_infomation=rain_type+f'({rain_amount_info})'
    print(temp_info,weather_infomation,warning_info)
    weather_dict={"temp_info":temp_info,"weather_info":weather_infomation,"warning_info":warning_info}
  
    # temp_info, weather_info, warning_info

    return json.dumps(weather_dict, indent=4, sort_keys=True, default=str)

