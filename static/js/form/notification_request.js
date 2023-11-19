var notification_request = new Object();
notification_request.__is_already_msg=false;

notification_request.add_noti=function(msg, level_class,click_script){
	
	var notification = document.createElement("div");
	notification.classList.add("board_box");
	notification.classList.add(level_class);
	notification.classList.add("clickable");
	notification.classList.add("hover");
	notification.innerHTML=msg;
	notification.addEventListener("click",function(){click_script();});
	
	if(notification_request.__is_already_msg==false){
		document.getElementById('fix_menu_notifications').innerHTML="";
		notification_request.__is_already_msg=true;
	}
	document.getElementById('fix_menu_notifications').appendChild(notification);
	
}