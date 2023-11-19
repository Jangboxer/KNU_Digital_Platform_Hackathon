import pymysql
from ..Loggers.Logger import Logger
from threading import RLock

class Database:
    def __init__(self,_host,_port,_user,_passwd,_db,_charset):
        self.conn=pymysql.connect(host=_host ,port=_port, user=_user, passwd=_passwd, db=_db, charset=_charset)
        self.__log = Logger("db.txt","데이터베이스 관리자")
        self._LOCK =RLock()

    def select(self,*commands):
        with self._LOCK:

            self.__log.info("DB 단순 리스트 및 SELECTION 조회 : ", commands)
            cur = self.conn.cursor()
            cur.execute(*commands)
            result = cur.fetchall()
        return result
    
    
    def commit(self,*commands):
        with self._LOCK:
            self.__log.info("DB COMMIT 요청 : ", commands)
            cur = self.conn.cursor()
            cur.execute(*commands)
            cur.connection.commit()
