import datetime

class Logger:
    def __init__(self,filename,system_name="[시스템]"):
        self.__file = open(filename,"w")
        self.__system_name=system_name
        pass

    def __write(self,msg):
        _msg= "[" + str(datetime.datetime.now()) + "] " + str(msg)
        print(_msg )
        self.__file.write(_msg+ "\n")
        self.__file.flush()

    def info(self, *msg):
        self.print("\033[94m [", self.__system_name ,"] \033[0m", *msg)

    def err(self, *msg):
        self.print("\033[95m [", self.__system_name ,"] \033[0m", *msg)

    def print(self,*msg):
        msg= [str(x) for x in msg]
        self.__write("".join(msg))

    def close(self):
        self.__file.close()
