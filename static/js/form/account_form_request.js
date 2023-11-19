var account_form_request = new Object();


//로그인 되었을 때 호출되는 함수
account_form_request.form_login=function(){
	
	_bottom_board_popup.close_single_panel("navigator_login_button");
	_bottom_board_popup.open_single_panel("navigator_user_button");
	_bottom_board_popup.close_single_panel("form_login_board_box");
	_bottom_board_popup.close_single_panel("form_register_board_box");
	_bottom_board_popup.open_single_panel("form_changepw_board_box");
	_bottom_board_popup.open_single_panel("form_logout_board_box");
	_bottom_board_popup.open_single_panel("form_region_admin_board_box");
	pop_commands.open_only_logout();
	
	
	request_update.update_uuid();
}


//로그아웃 되었을 때 호출되는 함수
account_form_request.form_logout=function(){
	
	_bottom_board_popup.close_single_panel("form_changepw_board_box");
	_bottom_board_popup.close_single_panel("navigator_user_button");
	_bottom_board_popup.close_single_panel("form_logout_board_box");
	_bottom_board_popup.close_single_panel("form_region_admin_board_box");
	_bottom_board_popup.open_single_panel("navigator_login_button");
	_bottom_board_popup.open_single_panel("form_login_board_box");
	_bottom_board_popup.open_single_panel("form_register_board_box");
	pop_commands.open_only_login();
	
	request_update.update_uuid();
	
	
}

