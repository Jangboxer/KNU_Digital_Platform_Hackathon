var new_event =new Object();

new_event.receive_event_from_server=function(obj){

	event_pin_request.__add_new_event_pin(obj);
	refresh_board_pin.refresh_pins();
	console.log("add new event");
}
new_event.receive_del_event_from_server=function(obj){

	event_pin_request.__del_new_event_pin (obj);
	refresh_board_pin.refresh_pins();
	
}
new_event.receive_info_event_from_server=function(obj){
	
	sound_messagebox.show_message("[ 이벤트 만료 ] " + obj.content,"info",10000);
	console.log("end,event event");
	
}