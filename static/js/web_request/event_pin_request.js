var event_pin_request =new Object();

event_pin_request.get_event_color_by_level=function(level){
	
	if(level=="1"){
		
		return "info"
	}
	if(level=="2"){
		
		return "warning"
	}
	if(level=="3"){
		
		return "danger"
	}
	
}

event_pin_request.get_event_category_kor_by_category_eng=function(level){
	
	if(level=="hazard"){
		return "인재"
	}
	if(level=="calamity"){
		return "재해"
	}
	
}
event_pin_request.request_all=function(){
	event_pin_request.show_events();
}
event_pin_request.show_events = function(){
	
	//메모리상에 담습니다.
	web_request.request("board/listbydistance/?latitude=" + client_memory.latitude
	+ "&longitude=" + client_memory.longitude +"&amount=100&distance=3", function(obj){

		console.log("핀 목록");
		console.log(obj);
		var items = new Map();
		var uuid_list = new Array();
		for (var i =0;i<obj.length;i++){
			
			var _dict = obj[i];
			items.set("PD_" + _dict.board_uuid, _dict);
			uuid_list.push("PD_" + _dict.board_uuid);
			
		}
		
		var event_pin = map_pin_manager.get_pins("event",map_pin_manager._FLAG_DEFAULT_PIN);
		
		var should_new = event_pin.get_new_markers(uuid_list);
		var should_trash = event_pin.get_old_markers(uuid_list);
		
		for(var i=0;i<should_trash.length;i++){
			var name = should_trash[i];
			event_pin.del_fixed_marker(name);
		}
		
		for(var i=0;i<should_new.length;i++){
			var name = should_new[i];
			var single_obj = items.get(name);
			var _board_uuid=single_obj.board_uuid;
			var _content=single_obj.content;
			var _category = single_obj.category;
			var _level = single_obj.level;
			
			var  _latitude=single_obj.latitude;
			var _longitude =single_obj.longitude;
			var _distance =single_obj.distance;
			var _user_uuid=single_obj.user_uuid;
			var _user_nick=single_obj.user_nick;
			var _title=single_obj.title;
			var _wrote_date=single_obj.wrote_date;
			
			var result = event_pin.add_fixed_marker(name, single_obj.latitude, single_obj.longitude, map_pin_manager.get_animation_transform_content(single_obj.board_uuid,event_pin_request.get_event_color_by_level(_level),"animation_warning","<span class='bold'>[" + event_pin_request.get_event_category_kor_by_category_eng(_category) + "]</span> " + _title));
			if(result!=false){
				result.__attach.obj = single_obj
			}
			
		}
		
		//화면에 그리도록 새로고침합니다.
		refresh_board_pin.refresh_pins();
		
		
	
		
	});
};

event_pin_request.__add_new_event_pin = function(obj){
	
	
		var event_pin = map_pin_manager.get_pins("event",map_pin_manager._FLAG_DEFAULT_PIN);
		
		var item = new Object();
		item.board_uuid = obj.board_uuid;
		item.content = obj.content;
		item.category = obj.category;
		item.level = obj.level;
		item.latitude = obj.latitude;
		item.longitude = obj.longitude;
		item.title = obj.title;
		
		var result = event_pin.add_fixed_marker("PD_" + item.board_uuid, item.latitude, item.longitude, map_pin_manager.get_animation_transform_content(item.board_uuid,event_pin_request.get_event_color_by_level(item.level),"animation_warning","<span class='bold'>[" + event_pin_request.get_event_category_kor_by_category_eng(item.category) + "]</span> " + item.title));
		if(result!=false){
			result.__attach.obj = item
		}

}
event_pin_request.__del_new_event_pin = function(obj){
	
	
		var event_pin = map_pin_manager.get_pins("event",map_pin_manager._FLAG_DEFAULT_PIN);
		
		var item = new Object();
		item.board_uuid = obj.board_uuid;
		item.content = obj.content;
		item.category = obj.category;
		item.level = obj.level;
		item.latitude = obj.latitude;
		item.longitude = obj.longitude;
		item.title = obj.title;
		event_pin.del_fixed_marker("PD_" + item.board_uuid);
		console.log("이벤트 제거");

}