var pop_commands =new Object();
pop_commands.close_all = function(){
	_bottom_board_popup.close_main_all_panel()
	
}

pop_commands.open_login = function(){
	board_form_request.show_board_window();
	
	pop_commands.close_all();
	//계정 창 부모 열기
	_bottom_board_popup.open_single_panel(_bottom_board_popup.__panel_board_account_boards);
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_account_boards);
	//계정 창의 로그인 창 열기
	_bottom_board_popup.open_single_panel( _bottom_board_popup.__panel_board_account_login);
}
pop_commands.open_logout = function(){
	board_form_request.show_board_window();
	
	pop_commands.close_all();
	//계정 창 부모 열기
	_bottom_board_popup.open_single_panel(_bottom_board_popup.__panel_board_account_boards);
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_account_boards);
	//계정 창의 로그아웃
	_bottom_board_popup.open_single_panel( _bottom_board_popup.__panel_board_account_logout);
}


pop_commands.open_only_login = function(){
	board_form_request.show_board_window();
	
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_account_boards);
	//계정 창의 로그인 창 열기
	_bottom_board_popup.open_single_panel( _bottom_board_popup.__panel_board_account_login);
}

pop_commands.open_only_register = function(){
	board_form_request.show_board_window();
	
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_account_boards);
	//계정 창의 로그인 창 열기
	_bottom_board_popup.open_single_panel( _bottom_board_popup.__panel_board_account_register);
}

pop_commands.open_only_logout = function(){
	board_form_request.show_board_window();
	
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_account_boards);
	//계정 창의 로그아웃
	_bottom_board_popup.open_single_panel( _bottom_board_popup.__panel_board_account_logout);
}

pop_commands.open_only_changepw = function(){
	board_form_request.show_board_window();
	
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_account_boards);
	//계정 창의 비밀번호 변경 창 열기
	_bottom_board_popup.open_single_panel( _bottom_board_popup.__panel_board_account_changepw);
}

pop_commands.open_only_region_admin = function(){
	board_form_request.show_board_window();
	
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_account_boards);
	//계정 창의 지역 관리 창 열기
	_bottom_board_popup.open_single_panel(_bottom_board_popup.__panel_board_region_admin);
}



pop_commands.open_only_policy = function(){
	board_form_request.show_board_window();
	
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_account_boards);
	//계정 창의 법적 정보 창 열기
	_bottom_board_popup.open_single_panel(_bottom_board_popup.__panel_board_policy);
}




pop_commands.open_board = function(){
	board_form_request.show_board_window();
	
	pop_commands.close_all();
	//보드 창 부모 열기
	_bottom_board_popup.open_single_panel(_bottom_board_popup.__panel_board_main_boards);  
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_main_boards);
	//보드 창 메인 창보기
	_bottom_board_popup.open_single_panel( _bottom_board_popup.__panel_board_threads);
}
pop_commands.open_board_parent_only = function(){
	board_form_request.show_board_window();
	
	pop_commands.close_all();
	//보드 창 부모만 열기
	_bottom_board_popup.open_single_panel(_bottom_board_popup.__panel_board_main_boards);  
}
pop_commands.open_only_new_event = function(){
	board_form_request.show_board_window();
	
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_main_boards);
	//보드 창의 새 이벤트 창 열기
	_bottom_board_popup.open_single_panel( _bottom_board_popup.__panel_board_create_post);
}
pop_commands.open_no_open_everybody = function(){
	board_form_request.show_board_window();
	
	_bottom_board_popup.close_child_all_panel(_bottom_board_popup.__panel_board_main_boards);
	//보드 창 모두 닫기
}



pop_commands.open_chat = function(){
	pop_commands.close_all();
	//보드 창 부모 열기
	_bottom_board_popup.open_single_panel(_bottom_board_popup.__panel_board_chat);  
}