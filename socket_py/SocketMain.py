import threading
from static_py.StaticMemory import StaticMemory

from lib.IntegratedWebSocket.IntegratedWebSocket import IntegratedWebSocket
from lib.IntegratedWebSocket.IntegratedWebClient import IntegratedWebClient
from socket_py.ConnectionFunction1 import ConnectionFunction1

class SocketMain:
    def __init__(self):
        self._connection_function1 = ConnectionFunction1()
        pass

    def start(self):
        def work_thread():
            print("웹 소켓 서비스가 시작되었습니다.")
            socket = IntegratedWebSocket("0.0.0.0", 42427)
            socket.set_callback_connected(self.__event_connected)
            socket.set_callback_received(self.__event_received)
            socket.set_callback_disconnected(self.__event_disconnected)
            socket.start()
            socket.wait_forever()

            print("웹 소켓 서비스가 종료되었습니다.")

        _thread = threading.Thread(target=work_thread)
        _thread.start()

    async def __event_connected(self,client):
        _dict = StaticMemory.get_instance().get_auto_dict("sockets")
        _dict[client] = {'longitude':None, 'latitude':None, 'user_uuid':None}
        
        
        pass

    async def __event_received(self,client,data):
        obj = data[1]
        
        _dict = StaticMemory.get_instance().get_auto_dict("sockets")
        if(obj['type']=="location_update"):
            userdict = _dict[client]
            userdict['longitude']= obj['longitude']
            userdict['latitude']= obj['latitude']
            
        
        if(obj['type']=="uuid_update"):
            userdict = _dict[client]
            userdict['user_uuid']= obj['user_uuid']
            if userdict['user_uuid'] =="": userdict['user_uuid'] =None

           
        
        #채팅 관련
        await self._connection_function1.event_received(client,data)
        
        pass

    async def __event_disconnected(self,client):
        _dict = StaticMemory.get_instance().get_auto_dict("sockets")
        _dict.pop(client)
        pass
