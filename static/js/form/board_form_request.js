var board_form_request = new Object();
board_form_request._ALL=0;
board_form_request._HAZARD="hazard";
board_form_request._CALAMITY="calamity";
board_form_request._now_flag=0;
board_form_request._selected_image = "";


//UI 상에 사용자가 클릭한 경우 호출되는 부분
board_form_request.form_board_all=function(){
	
	document.getElementById('panel_board_main_selected_category').innerHTML = "전체";
	board_form_request._now_flag=board_form_request._ALL;
	
	pop_commands.open_board_parent_only();

	refresh_board_pin.refresh_pins();
}

board_form_request.form_board_hazard=function(){
	document.getElementById('panel_board_main_selected_category').innerHTML = "인재";
	
	board_form_request._now_flag=board_form_request._HAZARD;
	
	
	pop_commands.open_board_parent_only();
	refresh_board_pin.refresh_pins();

}

board_form_request.form_board_calamity=function(){
	
	document.getElementById('panel_board_main_selected_category').innerHTML = "재해";
	
	board_form_request._now_flag=board_form_request._CALAMITY;
	
	pop_commands.open_board_parent_only();
	
	refresh_board_pin.refresh_pins();

}

board_form_request.form_board_chat=function(){
	
	pop_commands.open_chat();

	

}
board_form_request.close_board_window=function(){
	
	document.getElementById('bottom_board').classList.add('hide_board');
	document.getElementById('open_bottom_board').classList.add('show_bottom_button');
	

}
board_form_request.show_board_window=function(){
	
	document.getElementById('bottom_board').classList.remove('hide_board');
	document.getElementById('open_bottom_board').classList.remove('show_bottom_button');
	

}

//UI 상에 게시글 최초 게시시 이미지 선택 부분
board_form_request.image_selection_event=function(){
	
	var fr= new FileReader();
	
	fr.addEventListener("load",function(ev2){
		
		console.log(ev2.target.result);
		board_form_request._selected_image= ev2.target.result;
		document.getElementById('panel_board_create_file_image').src=board_form_request._selected_image;
		
	});
	
	fr.readAsDataURL(this.files[0]);
	
}
document.getElementById('panel_board_create_post_file').addEventListener("change",board_form_request.image_selection_event);



window.addEventListener('dblclick', function(event){
	if(document.getElementById('bottom_board').contains(event.target))
		return;
	
	board_form_request.close_board_window();
});

board_form_request.clear_image_selection=function(){
	document.getElementById('panel_board_create_post_file').value="";
	board_form_request._selected_image="";
	document.getElementById('panel_board_create_file_image').src=null;
}