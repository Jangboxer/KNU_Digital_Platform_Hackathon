var chat_request =new Object();

chat_request.send_chat = function(){
	
	var msg = document.getElementById('panel_board_chat_message').value;
	document.getElementById('panel_board_chat_message').value="";
	
	console.log("소켓 채팅 메시지 전송 열기 요청");

	request_update.send_chat(msg);
	
	
	
}
chat_request.send_chat_bykey = function(e){
	//엔터키를 누른 경우
	if(e.keyCode==13){
		console.log(e);
		chat_request.send_chat();
		
	}

}
chat_request.add_to_chat_msg=function(user_nick,time,msg){
	
	var chat_area = document.getElementById('detail_chat_area');
	
	var chatDiv = document.createElement('div');
	chatDiv.classList.add('board_box');
	chatDiv.classList.add('info');
	chatDiv.innerHTML = "<span class='right'>" + time +"</span><span class=\"bold\">" + user_nick +"</span><br><div class='board_box without_box_shadow' style='word-break: break-all; width:100%;'>" + msg + "</div>";
	
	chat_area.appendChild(chatDiv);
	chat_area.scrollTop = chat_area.scrollHeight;
	
}
chat_request.receive_chat_from_server=function(obj){
	
	chat_request.add_to_chat_msg(obj.nickname, obj.time,obj.content);
	
}