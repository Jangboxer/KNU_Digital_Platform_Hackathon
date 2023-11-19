var check_box_request = new Object();

check_box_request.close_all_check_fixed_button= function(){
	
	document.getElementById('left_top_no_checked').checked=true;
	
}

check_box_request.public_on_change_event= function(){
	
	
	var shelter_pin = map_pin_manager.get_pins("shelter",map_pin_manager._FLAG_IMAGE_ONLY);
	shelter_pin.clear_fixed_marker();
	public_data_request.show_public_shelter();
}

check_box_request.__event_close_fixed = function(event){
	
	var classes = document.getElementsByClassName('fix_button_body');
	
	
	for( var i =0;i<classes.length;i++){
		
		var document_div = classes[i];
		if(document_div.contains(event.target)){
			return;
		}
		
	}
	
	check_box_request.close_all_check_fixed_button();
	
}

window.addEventListener('mousedown', function(event){
	check_box_request.__event_close_fixed(event);
});
window.addEventListener('click', function(event){
	check_box_request.__event_close_fixed(event);
});