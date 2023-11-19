from websocket import WebSocket
import json


class IntegratedWebClient:
    def __init__(self,server, websocket:WebSocket):
        self.__websocket=websocket
        self.__ip = websocket.remote_address[0]
        self.__port= websocket.remote_address[1]
        
        self.__server=server

    async def send_async(self, data):
        try:
            await self.__websocket.send(data)
        except:
            raise Exception("대상 클라이언트로 부터 연결이 끊겼습니다.")

    async def send_json_async(self, obj):
        try:
            await self.__websocket.send(json.dumps(obj))
        except:
            raise Exception("대상 클라이언트로 부터 연결이 끊겼습니다.")

    def request_send_json(self, obj):
        self.__server.add_queue(self,obj)
        pass
        
        
    def close(self):
        try:
            self.__websocket.close()
            return True
        except:
            raise Exception("이미 대상 클라이언트로 부터 연결이 끊겼습니다.")

    def get_remote_ip(self):
        return self.__ip

    def get_remote_port(self):
        return self.__port

    def get_unique_id(self):
        return self.__ip+":" + str(self.__port)

    def __str__(self):
        return "<IntegratedWebClient> " + self.get_unique_id()
