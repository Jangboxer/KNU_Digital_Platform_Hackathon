import asyncio;
import time
import websockets;
import json
from websocket import WebSocket
from .IntegratedWebClient import IntegratedWebClient
from ..Loggers.Logger import Logger



class IntegratedWebSocket:

    def __init__(self,_host, _port):
        self.__host = _host
        self.__port = _port

        self.__connections=[]

        self.__logger = Logger("websocket.log")
        self.__logger.info("내부 시스템이 시작되었습니다.")

        async def trash_con(e):
            pass
        async def trash_con2(e,e2):
            pass


        self.__callback_connected=trash_con
        self.__callback_disconnected=trash_con
        self.__callback_received=trash_con2
        
        
       

        
        self.__loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.__loop)

        self.__queues=asyncio.Queue()
        pass

    def start(self):
        server = websockets.serve(self.__connected,self.__host,self.__port);

        self.__loop.create_task(self.__queue_event())
        self.__loop.run_until_complete(server)


        self.__logger.info("웹 소켓 서비스를 시작합니다.")
        self.__logger.info(f"호스트 \"{self.__host}\" 로 \"{self.__port}\" 포트 수신 대기를 시작합니다.")

    def get_loop(self):
        return self.__loop

    def wait_forever(self):
        self.__loop.run_forever();

    def set_callback_connected(self, callback):
        self.__callback_connected=callback

    def set_callback_disconnected(self, callback):
        self.__callback_disconnected=callback

    def set_callback_received(self, callback):
        self.__callback_received=callback

    def get_online_users(self):
        return self.__connections.copy()

    def add_queue(self,client,send_data):
        self.__loop.call_soon_threadsafe(self.__queues.put_nowait, (client,send_data))

    async def __queue_event(self):
        self.__logger.info("이벤트 관리자가 시작되었습니다.")
        while True:
            
            queue = await self.__queues.get()
            self.__logger.info("쿼리 전송 대기 0.05초 ", queue)
            await asyncio.sleep(0.05)
            self.__logger.info("쿼리 전송 요청 ", queue)
            await queue[0].send_json_async(queue[1])
        
            
            
        pass;

    async def __connected(self, websocket :WebSocket, path):
        client = IntegratedWebClient(self,websocket)
        _ip_addr = client.get_remote_ip() + ":"  + str(client.get_remote_port())
        try:
            self.__connections.append(client)
            await self.__callback_connected(client)
            self.__logger.info("새 ", _ip_addr,"가 서버에 연결 했습니다. (" , len(self.__connections),")")
            while True:
                data = await websocket.recv();
                data=str(data)
                try:
                    _indata = (data,json.loads(data) if data.startswith("{") else None)
                    await self.__callback_received(client, _indata)
                    self.__logger.info("새 수신 이벤트 ", (client,_indata))
                except Exception as e:
                    self.__logger.err(_ip_addr ,"콜백함수 _received에서 오류가 발견되었습니다.")
                    self.__logger.err(_ip_addr, "런타임 오류입니다.")
                    self.__logger.err(_ip_addr, "작성한 콜백함수 내 명령 중 문제가 없는지 확인 하십시오.")
                    self.__logger.err(_ip_addr, str(e))




        except Exception as e:
        
            self.__logger.err(_ip_addr ,"콜백함수 _received에서 오류가 발견되었습니다.")
            self.__logger.err(_ip_addr, "런타임 오류입니다.")
            self.__logger.err(_ip_addr, "작성한 콜백함수 내 명령 중 문제가 없는지 확인 하십시오.")
            self.__logger.err(_ip_addr, str(e))

            self.__connections.remove(client)
            self.__logger.info(_ip_addr ,"의 연결이 끊어졌습니다. (" , len(self.__connections),")")
            await self.__callback_disconnected(client)