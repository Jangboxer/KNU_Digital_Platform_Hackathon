var single_map_pin_manager = new Object();
single_map_pin_manager.now_single_polygon_map = null;
single_map_pin_manager.now_image_map =null;
single_map_pin_manager.weather_grid_map=null;

single_map_pin_manager.now_single_pins=[];

single_map_pin_manager.hide_weather_map = function(){
	
	if(single_map_pin_manager.weather_grid_map!=null){
		
		single_map_pin_manager.weather_grid_map[0].setMap(null);
		single_map_pin_manager.weather_grid_map[1].setMap(null);
		single_map_pin_manager.weather_grid_map=null;
		
	}
	
}


single_map_pin_manager.show_weather_map = function(msg){
	console.log("error");
	single_map_pin_manager.hide_weather_map();
	console.log(client_memory.latitude);
	console.log(client_memory.longitude);
	var latitude = client_memory.latitude
	var longitude = client_memory.longitude;
	var pos =  new kakao.maps.LatLng(latitude,longitude);
	
	console.log("좌표 : " +latitude +"," + longitude +"로 추가 합니다.");
	
	var circle = new kakao.maps.Circle({
		center : pos,
		radius: 1000,
		strokeColor: 'aqua',
		strokeOpacity: 0.5,
		strokeStyle: 'dashed',
		fillColor: 'aqua',
		strokeWeight: 3,
		fillOpacity: 0.2
	}); 
	
	var mymark = new kakao.maps.CustomOverlay({
		position : pos, 
		content: "<span class='weather_text ' style='padding-top:120px;'> <div class='background_white' style='font-size:15px; box-shadow: 1px 1px 2px rgba(0,0,0,0.2); border-radius:12px;'> " + msg +"</div></span>"
	});
	circle.setMap(map);
	mymark.setMap(map);
	
	console.log(map);

	console.log("리얼주소 :");

	single_map_pin_manager.weather_grid_map=[circle,mymark];
	console.log("지도 표시를 등록했습니다.");
}

single_map_pin_manager.show_image_map = function(latitude,longitude,src_image){
	
	if(single_map_pin_manager.now_image_map==null){
		
		single_map_pin_manager.now_image_map
		
		
		var markerPosition  = new kakao.maps.LatLng(latitude,longitude); 
		
		var mymark = new kakao.maps.CustomOverlay({
			position: markerPosition,
			content: "<div class='pin_image'><img onclick='single_map_pin_manager.hide_image_map();' draggable='false' src='" + src_image +"'></img></div>"
		});
		mymark.setMap(map);
		single_map_pin_manager.now_image_map = mymark;
		
		
		console.log("핀 창을 띄웁니다. : " + latitude + "," + longitude + "," + src_image);
		
	}
	
	
}
single_map_pin_manager.hide_image_map = function(){
	
	if(single_map_pin_manager.now_image_map!=null){
		
		single_map_pin_manager.now_image_map.setMap(null);
		single_map_pin_manager.now_image_map=null;
		
		console.log("핀 창을 제거합니다.");
	}
	
}

single_map_pin_manager.hide_pins = function(list){
	
	
	if(single_map_pin_manager.now_single_polygon_map!=null){
		single_map_pin_manager.now_single_polygon_map.setMap(null);
		
		single_map_pin_manager.now_single_polygon_map = null;
	}
	
	for(var i=0;i<single_map_pin_manager.now_single_pins.length;i++){
		var pin_item = single_map_pin_manager.now_single_pins[i];
		pin_item[0].setMap(null);
		pin_item[1].setMap(null);
	}
	single_map_pin_manager.now_single_pins=[];

	
}

single_map_pin_manager.show_pins = function(list){
	single_map_pin_manager.hide_pins();
	
	
	var polygonpath = [];
	
	
	for(var i=0;i<list.length;i++){
		var item = list[i];
		var latitude = item.latitude;
		var longitude = item.longitude;
		var datetime = item.wrote_date;
		var level = item.level;
		
		var markerPosition  = new kakao.maps.LatLng(latitude,longitude); 
		polygonpath.push([longitude,latitude]);
		

		var marker = new kakao.maps.Marker({
			position: markerPosition
		});
		var mymark = new kakao.maps.CustomOverlay({
			position: markerPosition,
			content: map_pin_manager.get_animation_transform_content_onclick("",1,"opacity_80 " + event_pin_request.get_event_color_by_level(level),datetime)
		});
		
		marker.setMap(map);
		mymark.setMap(map);
		
		single_map_pin_manager.now_single_pins.push([marker,mymark]);
		 
		
	}
	var dstpolygonpath = [];
	polygonpath = tools.get_sort_by(polygonpath);
	for(var i=0;i<polygonpath.length;i++){
		var data = polygonpath[i];
		
		dstpolygonpath.push( new kakao.maps.LatLng(data[2],data[1]));
		
	}
	
	
	
	var polygon = new kakao.maps.Polygon({
		path:dstpolygonpath, 
		strokeOpacity: 0.6,
		fillOpacity: 0.1,
		strokeStyle: 'longdash',
		fillColor: 'RED',
		strokeColor: 'RED', 
		strokeWeight: 2
	});




	polygon.setMap(map);
	single_map_pin_manager.now_single_polygon_map=polygon;
	console.log("테두리 다각형 핀을 찍었습니다.");
	console.log(list);
		
}