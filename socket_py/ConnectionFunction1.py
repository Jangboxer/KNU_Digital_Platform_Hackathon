import threading
from static_py.StaticMemory import StaticMemory
from haversine import haversine
import pymysql
import time

class ConnectionFunction1:
    def __init__(self):
        pass

    def start(self):
        pass


    async def event_received(self,client,data):
        obj = data[1]
        
        if(obj['type']=="chat"):
            self.__user_chat(client,data)
            
           
    def __user_chat(self,client,data):
        obj = data[1]
        print("chat event")

        _connections = StaticMemory.get_instance().get_auto_dict("sockets")
        print(_connections)
      

        _dict = StaticMemory.get_instance().get_auto_dict("connections")
        conn = _dict['db']
        results = conn.select('SELECT user_uuid,user_nick from account')

        
        for i in results:
            if _connections[client]["user_uuid"]== i[0]:
                nickname = i[1]

        for k,v in _connections.items():

            try:
                if(v["latitude"]!=None and v["longitude"]!=None):
                    if _connections[client]["user_uuid"]==None :
                        data[1]["nickname"]="익명"
                        data[1]["time"] = time.strftime('%Y.%m.%d - %H:%M:%S')
                        if haversine((_connections[client]["latitude"], _connections[client]["longitude"]), (v["latitude"], v["longitude"]),unit = 'km')<=3:
                            k.request_send_json(data[1])
                    else:
                        data[1]["nickname"]=nickname
                        data[1]["time"] = time.strftime('%Y.%m.%d - %H:%M:%S')
                        if haversine((_connections[client]["latitude"], _connections[client]["longitude"]), (v["latitude"], v["longitude"]),unit = 'km')<3:
                            k.request_send_json(data[1])
            except:
                print("오류발생")
