var map_pin_manager = new Object();
map_pin_manager.__items=new Map();
map_pin_manager._FLAG_DEFAULT_PIN=0;
map_pin_manager._FLAG_IMAGE_ONLY=1;

map_pin_manager.get_pins=function(pin, type){
	if(map_pin_manager.__items.has(pin)==false)
		map_pin_manager.__items.set(pin,new MapPinManager(map,type));
	
	return map_pin_manager.__items.get(pin);
}


map_pin_manager.get_animation_transform_content=function(board_uuid, level,animation_type, content){
	var str = "<div class='colored_board_interface' style='margin-top:-70px;'><div class='board_box " + level + " " + animation_type +" hover' onclick=\"board_request.open_post('" + board_uuid + "');\">" + content +"</div></div>";
	
	return str;
}
map_pin_manager.get_animation_transform_content_onclick=function(onclickmsg, level,animation_type, content){
	var str = "<div class='colored_board_interface' style='margin-top:-70px;'><div class='board_box " + level + " " + animation_type +" hover' onclick=\"" + onclickmsg +"\">" + content +"</div></div>";
	
	return str;
}


map_pin_manager.get_image_with_content=function(icon_image_class, content){
	var str = "<div class='colored_board_interface map_interface tooltip' ><div class='icon opacity_6 " + icon_image_class +"'></div><br><div style='width:120px;' class='messagebox force_bottom'>" + content +"</div></div></div>";
	
	return str;
}

class MapPinManager{
	//type : 0 기본 <핀 + 타이틀 바 + 보드 메시지>
	//type : 1 대피소
	
	constructor(map, type){
		this.map=map;
		this.__type=type;
		this.__items=new Map();
	}

	__map_create_pin(latitude, longitude, content){
		if(this.__type==0){
			var mp  = new kakao.maps.LatLng(latitude,longitude); 

			var marker = new kakao.maps.Marker({
				position: mp
			});
			var mymark = new kakao.maps.CustomOverlay({
				position: mp,
				content: content
			});
			
			
			
			marker.setMap(map);
			mymark.setMap(map);
			
			return [marker,mymark];
		}
		
		if(this.__type==1){
			var mp  = new kakao.maps.LatLng(latitude,longitude); 

			var mymark = new kakao.maps.CustomOverlay({
				position: mp,
				content: content
			});
			mymark.setMap(map);
			return [mymark];
		}
	}

	__map_delete_pin(marker){
		if(this.__type==0){
			
			marker[0].setMap(null);
			marker[1].setMap(null);
			
		}
		if(this.__type==1){
			
			marker[0].setMap(null);
		}
	}
	__map_set_content(marker,content){
		if(this.__type==0){
			
			marker[1].setContent(content);
		}
		if(this.__type==1){
			
			marker[1].setContent(content);
		}
	}


	has_marker(uuid){
		
		if(this.__items.has(uuid)){
			return true;
		}
		return false;
		
	}
	get_fixed_marker(uuid){
		
		if(this.has_marker(uuid)){
			
			return this.__items.get(uuid);
			
		}
		return null;

	}
	add_fixed_marker(uuid, latitude, longitude, content){
		
		if(this.has_marker(uuid)){
			return false;
		}
		
		var markers = this.__map_create_pin(latitude,longitude,content);
		
		var obj =new Object();
		obj.__uuid = uuid;
		obj.__latitude = latitude;
		obj.__longitude = longitude;
		obj.__content = content;
		obj.__marker = markers;
		obj.__attach = new Object();
		
		this.__items.set(uuid,obj);
		//console.log("마커 " + uuid +"는 생성 됨");
		
		return obj;
		
	};
	

	clear_fixed_marker(){
		
		var items = Array.from(this.__items.keys());
		
		for(var i=0;i<items.length;i++){
			
			var i_uuid_name = items[i];
			
			this.del_fixed_marker(i_uuid_name);
			
		}
		
	}
	del_fixed_marker(uuid){
		
		if(this.has_marker(uuid)){
			var obj =this.get_fixed_marker(uuid);
			this.__map_delete_pin(obj.__marker);
			
			this.__items.delete(uuid);
			
			//console.log("마커 " + uuid +"는 제거 됨");
			return true;
		}
		return false;
		
		
	}
	
	get_marker_uuids(){
		
		return Array.from(this.__items.keys());;
		
	}

	set_content(uuid,content){
		
		if(this.has_marker(uuid)){
			var obj =this.get_fixed_marker(uuid);
			obj.__content=content;
			//obj.__marker [1].setContent(content);
			
			this.__map_set_content(obj.__marker,content)
			//console.log("마커 " + uuid +"의 내용은 변경 됨");
			return true;
		}
		return false;
		
		
	}


	//주어진 uuid 리스트에서, 기존에 없던 새로운 데이터만 추출합니다.
	get_new_markers(uuids){
		
		var items = new Array();
		
		for(var i=0;i<uuids.length;i++){
			
			var i_uuid_name = uuids[i];
			
			if(!this.__items.has(i_uuid_name))
				items.push(i_uuid_name);
			
		}
		return items;
		
	}

	//주어진 uuid 리스트에서, 이제 버려도 되는 리스트 데이터만 추출합니다.
	get_old_markers(uuids){
		
		var items = Array.from(this.__items.keys());
		
		for(var i=0;i<uuids.length;i++){
			
			var i_uuid_name = uuids[i];
			
			if(items.includes(i_uuid_name))
				items.splice(items.indexOf(i_uuid_name),1);
			
		}
		return items;
		
	}
	
}