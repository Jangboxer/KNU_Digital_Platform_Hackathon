var public_data_request =new Object();
public_data_request.request_all=function(){
	public_data_request.show_public_shelter();
	
}
public_data_request.show_public_shelter = function(){
	
	var _saferoom = document.getElementById('check_flag_show_saferoom').checked;
	var _shelter = document.getElementById('check_flag_show_shelter').checked;
	var _police = document.getElementById('check_flag_show_police').checked;
	var _fire = document.getElementById('check_flag_show_fire').checked;
	var _danger_hospital = document.getElementById('check_flag_show_danger_hospital').checked;
	var _hospital = document.getElementById('check_flag_show_hospital').checked;
	
	web_request.request("public_data/facilities/?latitude=" + client_memory.latitude
	+ "&longitude=" + client_memory.longitude +"&amount=70&distance=3", function(obj){

						
		console.log(obj);
		var items = new Map();
		var uuid_list = new Array();
		for (var i =0;i<obj.length;i++){
			var _dict = obj[i];
			items.set("PD_" + _dict.idx, _dict);
			uuid_list.push("PD_" + _dict.idx);
		}
		
		var shelter_pin = map_pin_manager.get_pins("shelter",map_pin_manager._FLAG_IMAGE_ONLY);
		
		var should_new = shelter_pin.get_new_markers(uuid_list);
		var should_trash = shelter_pin.get_old_markers(uuid_list);
		
		for(var i=0;i<should_trash.length;i++){
			var name = should_trash[i];
			shelter_pin.del_fixed_marker(name);
		}
		
		for(var i=0;i<should_new.length;i++){
			var name = should_new[i];
			var single_obj = items.get(name);
			if(_saferoom && single_obj.item_type=="방공호"){
				shelter_pin.add_fixed_marker(name, single_obj.latitude, single_obj.longitude, map_pin_manager.get_image_with_content("shield",single_obj.item_type));
			
			}
			if(_shelter && single_obj.item_type=="지진옥외대피소"){
				shelter_pin.add_fixed_marker(name, single_obj.latitude, single_obj.longitude, map_pin_manager.get_image_with_content("shelter_run",single_obj.item_type));
			
			}
			if(_police && single_obj.item_type=="경찰서"){
				shelter_pin.add_fixed_marker(name, single_obj.latitude, single_obj.longitude, map_pin_manager.get_image_with_content("police",single_obj.item_type));
			
			}
			if(_fire && single_obj.item_type=="소방서"){
				
				shelter_pin.add_fixed_marker(name, single_obj.latitude, single_obj.longitude, map_pin_manager.get_image_with_content("firestation",single_obj.item_type));
				
			}
			
			if(_danger_hospital && single_obj.item_type=="응급의료기관"){
				
				shelter_pin.add_fixed_marker(name, single_obj.latitude, single_obj.longitude, map_pin_manager.get_image_with_content("danger_hospital",single_obj.item_type));
				
			}
			if(_hospital && single_obj.item_type=="일반의료기관"){
				
				shelter_pin.add_fixed_marker(name, single_obj.latitude, single_obj.longitude, map_pin_manager.get_image_with_content("default_hospital",single_obj.item_type));
				
			}
		}
		
		
		
	
		
	});
};