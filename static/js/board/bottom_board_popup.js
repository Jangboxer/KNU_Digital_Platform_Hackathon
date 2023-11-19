var _bottom_board_popup = new Object();

//메인 보드의 고유 아이디
_bottom_board_popup.__panel_board_main_boards ="panel_board_main_boards";
	//메인 보드 안의 일반 게시글 쓰레드 목록 아이디
	_bottom_board_popup.__panel_board_threads ="panel_board_threads";
	//메인 보드 안의 게시글 작성 아이디
	_bottom_board_popup.__panel_board_create_post ="panel_board_create_post";

//계정 보드의 고유 아이디
	_bottom_board_popup.__panel_board_account_boards ="panel_board_account_boards";
	//계정 보드 안의 회원가입 아이디
		_bottom_board_popup.__panel_board_account_register ="panel_board_account_register";
	//계정 보드 안의 로그인 아이디
		_bottom_board_popup.__panel_board_account_login ="panel_board_account_login";
	//계정 보드 안의 비밀번호 변경 아이디
		_bottom_board_popup.__panel_board_account_changepw ="panel_board_account_changepw";
	//계정 보드 안의 로그아웃 변경 아이디
		_bottom_board_popup.__panel_board_account_logout ="panel_board_account_logout";
	//계정 보드 안의 지역 관리자 변경 아이디
		_bottom_board_popup.__panel_board_region_admin = "panel_board_account_region_admin";
	//계정 보드 안의 라이선스 정보 아이디
		_bottom_board_popup.__panel_board_policy="panel_board_account_policy";



//채팅보드의 고유 아이디
_bottom_board_popup.__panel_board_chat ="panel_board_chat";


_bottom_board_popup.__popups = [[_bottom_board_popup.__panel_board_main_boards,
								[_bottom_board_popup.__panel_board_threads,
								 _bottom_board_popup.__panel_board_create_post]],
								
								[_bottom_board_popup.__panel_board_account_boards,
								[_bottom_board_popup.__panel_board_account_register,
								 _bottom_board_popup.__panel_board_account_login,
								 _bottom_board_popup.__panel_board_account_changepw,
								 _bottom_board_popup.__panel_board_account_logout,
								 _bottom_board_popup.__panel_board_region_admin,
								 _bottom_board_popup.__panel_board_policy]],
								 
								[_bottom_board_popup.__panel_board_chat,[]]];
_bottom_board_popup.get_main_panels= function(){
	var items = new Array();
	for(var i=0;i<_bottom_board_popup.__popups.length;i++){
		items.push(_bottom_board_popup.__popups[i][0]);
	}
	return items;
}
_bottom_board_popup.get_child_panels= function(name){
	for(var i=0;i<_bottom_board_popup.__popups.length;i++){
		if(name==_bottom_board_popup.__popups[i][0]){
			return _bottom_board_popup.__popups[i][1]
		}
	}
	return null;
}					 
_bottom_board_popup.close_all_panel=function()
{
	_items = _bottom_board_popup.get_main_panels();
	
	
	for (const item in _items) {
		var line = _items[item]
		
		_bottom_board_popup.close_child_all_panel(line);
	}
	_bottom_board_popup.close_main_all_panel();

}
_bottom_board_popup.close_main_all_panel=function()
{
	_items = _bottom_board_popup.get_main_panels();
	
	for (const item in _items) {
		var line = _items[item]
		
		_bottom_board_popup.close_single_panel(line);
	}

}
_bottom_board_popup.close_child_all_panel=function(e)
{
	
		
	_items = _bottom_board_popup.get_child_panels(e)
		
	for (const item in _items) {
		var line = _items[item]
		_bottom_board_popup.close_single_panel(line);
	}

}

_bottom_board_popup.close_single_panel=function(e)
{
	document.getElementById(e).classList.add("hide");
}


_bottom_board_popup.open_single_panel=function(e)
{
	document.getElementById(e).classList.remove("hide");
}