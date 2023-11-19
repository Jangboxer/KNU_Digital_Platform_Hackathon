var map_first_init = new Object();
map_first_init.__is_map_first_load=false;

map_first_init.init = function(){
		if(map_first_init.__is_map_first_load){
			return;
		}
		
	
		latitude = client_memory.latitude;
		longitude = client_memory.longitude;

		//지도 중심 좌표로 이동
		map.panTo(new kakao.maps.LatLng(latitude,longitude));
		

		var mp  = new kakao.maps.LatLng(latitude,longitude); 

		
		//현재 위치 좌표 넣기
		var ovl = new kakao.maps.CustomOverlay({
			position: mp,
			content: "<div class='colored_board_interface' style='display:inline-block; width:100%; pointer-events:none;'><div class='board_box full_width info' style='pointer-events:none;'>현재 위치</div></div>" 
		});
		ovl.setMap(map);
		
		map_first_init._now_location_map_pin = ovl;
		
		map_first_init.__is_map_first_load=true;
		console.log("초기 좌표 정보를 지정했습니다.");
		
		//핀 새로고침
		map_first_init.change_my_map_pin();
		
}

/*
	맵의 내 중심 핀이 변경 된 경우
*/
map_first_init.change_my_map_pin= function(){ 

	
	map_first_init._now_location_map_pin.setPosition( new kakao.maps.LatLng(client_memory.latitude,client_memory.longitude));
	console.log("지도 상의 고정 핀 태그 홈 핀 위치를 변경합니다.");
	
	request_update.update_location();
	public_data_request.request_all();
	event_pin_request.request_all();
	weather_request.check_request();
	
};



map_first_init.send_to_server_my_map_center = function(){
	
    var locations = map.getCenter(); 
    
    var latitude =  locations.getLat();
	var longitude = locations.getLng();
	
	console.log("시스템 현재 위도 경도 좌표 : " + latitude+"," +longitude);
	
	client_memory.latitude=latitude;
	client_memory.longitude=longitude;
	
	
    map_first_init.change_my_map_pin();
	

}

kakao.maps.event.addListener(map, 'dragend', function() {        
    //만약 위도 경도를 제대로 읽어온 사용자의 경우
	if(!_request_locations._was_not_loaded){
		return;
	}
  
  map_first_init.send_to_server_my_map_center();
  
  
});

kakao.maps.event.addListener(map, 'click', function() {        
	single_map_pin_manager.hide_image_map();

});
