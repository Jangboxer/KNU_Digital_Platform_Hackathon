class IntegratedClient{
	
	constructor(ip, port){
		this.__ip=ip;
		this.__port=port;
		this.__isConnected=false;
		this.__socket = null;
		this.__callback_connected=function(){};
		this.__callback_received=function(e){};
		this.__callback_disconnected=function(){};
	}
	
	connect(){
	
		if(!this.__isConnected){	
			var main=this;
			console.log("서버에 접속을 시도하는 중... : " + this.__ip +"," + this.__port);
			this.__socket=new WebSocket("wss://" + this.__ip +":" + this.__port + "/ws/");
			
			this.__socket.addEventListener("open", (event) => {
				
				console.log("서버에 연결되었습니다.");
				main.__callback_connected();
				
			});


			this.__socket.addEventListener("message", (event) => {
				var received_data = event.data;
				var obj = JSON.parse(received_data);
				main.__callback_received(obj);
				
			});
			
			this.__socket.addEventListener("error", (event) => {
			
				main.__callback_disconnected();
				console.log("서버와에 연결할 수 없었습니다.");
				main.__isConnected=false;
				main.__socket=null;
				
			});
			this.__socket.addEventListener("close", (event) => {
			
				main.__callback_disconnected();
				console.log("서버와의 연결이 끊겼습니다.");
				main.__isConnected=false;
				main.__socket=null;
				
			});

		}else{
			console.log("이미 서버 세션에 접속되어 있습니다.");
		}
	
	}
	
	close(){
		if(this.__isConnected){
			
			this.__socket.close();
			this.__isConnected=false;
			this.__socket=null;
			console.log("서버 세션을 닫았습니다.");
			
		}else{
		
			console.log("이미 닫힌 세션 입니다.");
		
		}
	}
	
	send_json(obj){
	
		var json_string = JSON.stringify(obj);
		this.__socket.send(json_string);
	
	}
	
	set_callback_connected(callback){
	
		this.__callback_connected=callback;
	
	}
	
	set_callback_received(callback){
		
		this.__callback_received=callback;
	
	}
	
	set_callback_disconnected(callback){
		
		this.__callback_disconnected=callback;
		
	}
	


}