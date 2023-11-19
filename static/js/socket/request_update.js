var request_update= new Object()
request_update.update_uuid = function(){
	
	
	
	
	latitude = client_memory.latitude;
	longitude = client_memory.longitude;
	

	var obj = new Object();
	obj.type="uuid_update";
	obj.user_uuid=client_memory.user_uuid;
	
	
	_connect_js.send(obj);

	
}
request_update.update_location = function(){
	
	
	
	latitude = client_memory.latitude;
	longitude = client_memory.longitude;
	

	var obj = new Object();
	obj.type="location_update";
	obj.latitude =latitude;
	obj.longitude = longitude;
	
	_connect_js.send(obj);
	
	
}
request_update.send_chat = function(msg){
	
	

	var obj = new Object();
	obj.type="chat";
	obj.content = msg
	_connect_js.send(obj);
	
	
}