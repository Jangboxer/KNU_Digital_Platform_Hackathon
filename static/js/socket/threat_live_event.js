var threat_live_event =new Object();

threat_live_event.get_event_korean_by_level=function(level){
	
	if(level=="1"){
		
		return "참고"
	}
	if(level=="2"){
		
		return "경고"
	}
	if(level=="3"){
		
		return "위험"
	}
	
}

refresh_board_pin.get_event_english_by_level=function(level){
	
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

threat_live_event.get_event_category_kor_by_category_eng=function(level){
	
	if(level=="hazard"){
		return "인재"
	}
	if(level=="calamity"){
		return "재해"
	}
	
}

threat_live_event.receive_event_from_server=function(obj){
	
	console.log("new threat_lieve event");
	console.log(obj);
	sound_messagebox.show_message("[" + threat_live_event.get_event_category_kor_by_category_eng(obj.category) +"] - " + threat_live_event.get_event_korean_by_level(obj.level) +"" + obj.content,refresh_board_pin.get_event_english_by_level(obj.level),5000);
	notification_request.add_noti("[" + threat_live_event.get_event_category_kor_by_category_eng(obj.category) +"] " + threat_live_event.get_event_korean_by_level(obj.level) ,refresh_board_pin.get_event_english_by_level(obj.level),function(__uuid){
				board_request.open_post(__uuid);
				pop_commands.open_board();
		}.bind(this,obj.board_uuid));

}