var _request_locations = new Object()
_request_locations._end_first_move_pin=false;

//was_not_loaded는 true인 경우 지도를 드래그 해서 현재 좌표를 변경합니다.
//웹 소켓에도 실시간으로 반영해야 합니다.
_request_locations._was_not_loaded=true;


_request_locations.request_location = function(){
	
	pos_error_event = function(e){
		
		if(e.code==e.PERMISSION_DENIED){
			toastr.warning("사용자 좌표 정보 권한이 거부되었습니다.","좌표 동기화");
			
		}
		if(e.code==e.POSITION_UNAVAILABLE){
			toastr.warning("위치 정보를 확인할 수 없습니다..","좌표 동기화");
			
		}
		_request_locations._was_not_loaded=true;
		
		toastr.warning("임의 맵 선택 모드로 진입합니다.","임의 맵 선택 모드");
		map_first_init.send_to_server_my_map_center();
		
		
		
	}
	
	pos_event = function(e){
		
		
		
		_loc = e.coords;
		
		client_memory.latitude = _loc.latitude;
		client_memory.longitude = _loc.longitude;
		
		if(_request_locations._end_first_move_pin==false){
			map_first_init.change_my_map_pin();
			map.panTo(new kakao.maps.LatLng(client_memory .latitude ,client_memory.longitude ));
			console.log("맵의 시작 좌표 : ");
	
			_request_locations._end_first_move_pin=true;
		}
		_request_locations._was_not_loaded=false;
		
			   
		
		console.log(e);
	}
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(pos_event, pos_error_event);
	} else {
		toastr.error("사용자 좌표 정보를 가져오는데 실패 했습니다.","좌표 동기화");
		_request_locations._was_not_loaded=true;
		
	}
	
	
}

