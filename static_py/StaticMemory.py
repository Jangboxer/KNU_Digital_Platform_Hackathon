class StaticMemory:
    
    __instance=None
    
    @classmethod
    def get_instance(cls):
        if(cls.__instance==None):
            cls.__instance=StaticMemory()
        return cls.__instance
    
    def __init__(self):
        self.__items={}
        pass
        
    def set(self, key, value):
        self.__items[key]= value
    
    def get(self, key, default_value):
        if( key in self.__items):
            return self.__items[key]
        else:
            return default_value
    
    def get_auto_dict(self,key):
        if( key not in self.__items):
            self.__items[key]= {}
        return self.__items[key]
        
    def get_auto_list(self,key):
        if( key not in self.__items):
            self.__items[key]= []
        return self.__items[key]
    
    def is_exist(self, key):
        return (key in self.__items)