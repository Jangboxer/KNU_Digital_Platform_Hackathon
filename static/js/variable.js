var client_memory = new Object();
client_memory.latitude = 35.8805;
client_memory.longitude=128.6039044;
client_memory.user_uuid="";
client_memory.is_management_user=false;


client_memory.is_login=function(){
	
	if(client_memory.user_uuid==""){
		return false;
	}else{
		return true;
	}
	
}


window.onload=function(){
	console.log("페이지가 모두 로드 되어 map_First_init을 로드 합니다.");
	map_first_init.init ();
	account_request.check_login ();
	_connect_js.connect();
	 
	
}
