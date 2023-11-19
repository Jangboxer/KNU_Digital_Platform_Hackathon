var _connect_js = new Object()
_connect_js.client = new IntegratedClient('서버 IP 주소를 입력',42426)


_connect_js.send = function(obj){
	if(_connect_js._is_connected){
		console.log("[서버로 전송] " + obj);
	_connect_js.client.send_json(obj);
	return true; }else{return false;
		question_box.show_message("오류","실시간 네트워크 통신에 오류가 발생 했습니다.",function(){return true;});
	}}
_connect_js._is_connected=false;

 _connect_js.connect= function(){
	_connect_js.client.connect();
}



_connect_js._connected = function (){
	_connect_js._is_connected=true;
	
	toastr.success("서버에 접속 되었습니다.","성공");

	_request_locations.request_location();
	
	
	
	map_first_init.init();


}

_connect_js._data_received = function (obj){
	
	console.log("[서버에서 응답 발생]");
	console.log(obj);
	
	if(obj.type=="chat"){
		chat_request.receive_chat_from_server(obj);
	}
	
	
	if(obj.type=="new_event"){
		new_event.receive_event_from_server(obj);
	}
	
	if(obj.type=="del_event"){
		new_event.receive_del_event_from_server(obj);
	}
	if(obj.type=="threat_live"){
		threat_live_event.receive_event_from_server(obj);
	}
	
	if(obj.type=="info_event"){
		new_event.receive_info_event_from_server(obj);
	}
	
}

_connect_js._disconnected = function (){
	_connect_js._is_connected=false;
	
	toastr.error("서버와의 연결이 끊겼습니다","실패");

	
}




/* 콜백 함수 등록 */
_connect_js.client.set_callback_connected(_connect_js._connected );
_connect_js.client.set_callback_received(_connect_js._data_received );
_connect_js.client.set_callback_disconnected(_connect_js._disconnected);