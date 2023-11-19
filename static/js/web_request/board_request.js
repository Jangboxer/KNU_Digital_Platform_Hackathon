var board_request =new Object();
board_request.attributes=new Object();
board_request.attributes.now_open_board_uuid="";
board_request.attributes.latest_board_latitude=0;
board_request.attributes.latest_boad_longitude=0;


board_request.get_event_category_kor_by_category_eng=function(level){
	
	if(level=="hazard"){
		return "인재"
	}
	if(level=="calamity"){
		return "재해"
	}
	
}
board_request.open_post = function(uuid){
	document.getElementById('panel_board_threads_image_tag').classList.add("hide");
	document.getElementById('panel_board_threads_event_stop').classList.add('hide');
	if(client_memory.is_management_user){
		document.getElementById('panel_board_threads_event_stop').classList.remove('hide');
	}
	

	pop_commands.open_board();
	board_request.attributes.now_open_board_uuid=uuid;
	console.log("페이지 열기 요청");
	web_request.request("board/select/?board_uuid=" + uuid, function(obj){
		
		console.log("페이지 열기 요청");
		console.log(obj);
		
		if(obj.result==true){
			var contents_div = document.getElementById('panel_board_threads_contents');
			var color_info = event_pin_request.get_event_color_by_level(obj.level);
			
			board_request.attributes.latest_board_latitude = obj.latitude;
			board_request.attributes.latest_boad_longitude=obj.longitude;
			
			
			var delete_info = "<br><span class='right'><div class='board_box _hover_" + color_info +" hover clickable' onclick='board_request.delete_post(\"" + obj.board_uuid +"\");'>삭제</div></span>";
			if(obj.user_uuid!=client_memory.user_uuid){
				delete_info="";
			}
			
										
			contents_div.innerHTML = "	<div class=\"board_box " + color_info +"\">\
										\
										<span class=\"board_number\">M</span> <span class=\"bold\">" + obj.user_nick+"</span> " + obj.title +"\
									\
									<div class=\"board_box without_box_shadow\">\
										\
										<div class='right'>"  +board_request.get_event_category_kor_by_category_eng(obj.category) +" " + obj.wrote_date +"</div><br>" +  obj.content+"\
								</div>" + delete_info+"</div>";
			
		
		}else{
			
			question_box.show_message("이벤트 존재하지 않음","해당 이벤트 \"" + uuid +"\"는 이벤트 작성자 또는 게시자에 의해 이벤트가 만료 되었습니다." ,function(){return true;});
			pop_commands.open_no_open_everybody ();

			
			
		}
		
	});
	
	web_request.request("comment/list/?board_uuid=" + uuid, function(obj){
		
		console.log("댓글  열기 요청 : " + uuid);
		console.log(obj);
		
		
		var comments_div = document.getElementById('panel_board_threads_comments');
		comments_div.innerHTML="";
		
		for(var i=0;i<obj.length;i++){
			var item_dict = obj[i]
			var main_div = document.createElement("div");
			var color_info = event_pin_request.get_event_color_by_level(item_dict.level);
			var delete_info = "<br><span class='right'><div class='board_box _hover_" + color_info +" hover clickable' onclick='board_request.delete_comment(\"" + item_dict.comment_uuid +"\");'>삭제</div></span>";
			if(item_dict.user_uuid!=client_memory.user_uuid){
				delete_info="";
			}
			var management_user_div = "<div class='right_design'>관리자</div>";
			if(item_dict.is_management==false){
				management_user_div="";
			}
			main_div.innerHTML = "<div class=\"board_box " + color_info +"\">\
									" + management_user_div +"\
									\
									<span class=\"board_number\">" + (i+1)+"</span> <span class=\"bold\">" +item_dict.nick +"</span>\
								\
								<div class=\"board_box without_box_shadow\">\
									\
									<div class='right'>"  +item_dict.wrote_date +"</div><br>" + item_dict.comment+"\
							</div>" + delete_info+"</div>";
		
			main_div.addEventListener("click",function(){
				//console.log("OK");
			});
			comments_div.appendChild(main_div);
		}
		
	
		
	});
	web_request.request("image/select/?board_uuid=" + uuid, function(obj){
		if(obj.result==true){
			console.log("Exist Image : " + obj);
			document.getElementById('panel_board_threads_image_tag').src = "/image/get?board_uuid=" + uuid;
			document.getElementById('panel_board_threads_image_tag').classList.remove("hide");
	
			
			single_map_pin_manager.show_image_map(board_request.attributes.latest_board_latitude,board_request.attributes.latest_boad_longitude,"/image/get?board_uuid=" + uuid);
	
		}
	});
	
	
	refresh_board_pin.refresh_comment_pins();
	
	
};


board_request.upload_post = function(){
	var _category =  document.getElementById('panel_board_create_post_category').value;
	var _level= document.getElementById('panel_board_create_post_level').value;
	
	var _title = document.getElementById('panel_board_create_post_title').value;
	var _content = document.getElementById('panel_board_create_post_content').value;
	
		web_request.request("board/upload/?longitude=" + client_memory.longitude +"&latitude=" + client_memory.latitude+"&category=" + _category +"&level=" + _level +"&title=" +  _title +"&content=" + _content, function(obj){
		
		console.log("게시글 업로드 요청");
		console.log(obj);
		
		
		if(obj.result==false){
			toastr.error("새 이벤트를 기록하는데 실패 했습니다.<br> " + obj.reason_kor,"새 이벤트");
		}else{
			
			toastr.success("새 이벤트를 추가 했습니다.","이벤트 추가");
			
			//새 게시물을 추가 했으므로 핀도 새로고침 해 봅시다.
			event_pin_request.show_events ();
			
			console.log("작성된 보드 : " + obj.board_uuid);
			board_request.open_post(obj.board_uuid);
			
			if(board_form_request._selected_image !=""){
				
				var formdata=new FormData();
				formdata.append("board_uuid", obj.board_uuid);
				formdata.append("content",board_form_request._selected_image);
				web_request.request_post("image/upload/",formdata,function(obj){
					
					
					if(obj.result==false){
						
						toastr.error("이미지 정보를 기록하는데 실패했습니다.","새 이벤트");
					}else{
						
						toastr.info("이벤트의 사진 정보를 성공적으로 게시하였습니다.","알림");
					}
					
					
				});	
				
				board_form_request._selected_image ="";
				document.getElementById('panel_board_create_file_image').src='';
				document.getElementById('panel_board_create_post_file').value='';
				
			}
			
			
			
			document.getElementById('panel_board_create_post_title').value="";
			document.getElementById('panel_board_create_post_content').value="";
			
		}
	
		
	});
	
	
}

board_request.upload_comment = function(){
	var uuid = board_request.attributes.now_open_board_uuid;
	var _level= document.getElementById('paenl_board_threads_comment_level').value;
	var _comment = document.getElementById('paenl_board_threads_comment_txt').value;
	if(uuid==""){
		
		toastr.error("게시글 정보가 누락되었습니다.","오류");
		
		
		return;
	}
		web_request.request("comment/upload/?board_uuid=" + uuid +"&longitude=" + client_memory.longitude +"&latitude=" + client_memory.latitude+"&level=" + _level +"&comment=" + _comment, function(obj){
		
		console.log("댓글  업로드 요청 : " + uuid);
		console.log(obj);
		
		
		if(obj.result==false){
			toastr.error(obj.reason_kr,"이벤트 추가");
		}else{
			 document.getElementById('paenl_board_threads_comment_txt').value="";
			toastr.success("새 이벤트 댓글을 추가 했습니다.","이벤트 추가");
			board_request.open_post(uuid);
		}
	
		
	});
	
	
}

board_request.delete_comment = function(uuid){
	question_box.show_question("코멘트 삭제","정말 선택한 \"" + uuid +"\" 코멘트를 제거하시겠습니까?",function(){
		
		
		web_request.request("comment/delete/?comment_uuid=" + uuid, function(obj){
		
		console.log("댓글 삭제 요청 : " + uuid);
		console.log(obj);
		
		
		if(obj.result==false){
			toastr.error(obj.reason_kr,"이벤트 제거 실패");
		}else{
			toastr.success("코멘트를 성공적으로 제거 했습니다.","코멘트 제거");
			board_request.open_post(board_request.attributes.now_open_board_uuid);
		}
		
		});
		
		return true;
		
		
	},function(){return true;});

	
	
}
board_request.delete_post = function(uuid){
	question_box.show_question("최초 이벤트 삭제","정말 선택한 \"" + uuid +"\" 최초 이벤트를 제거하시겠습니까?<br><br>최초 이벤트는 이미 다른 사용자가 반응한 경우 삭제할 수 없으며, 이용 정책에 위반되거나 법적 문제가 있는 내용의 경우 게시 중단 요청을 해야 합니다.",function(){
		
		
		web_request.request("board/delete/?board_uuid=" + uuid, function(obj){
		
		console.log("댓글 삭제 요청 : " + uuid);
		console.log(obj);
		
		
		if(obj.result==false){
			toastr.error(obj.reason_kor,"이벤트 제거 실패");
		}else{
			toastr.success("최초 이벤트를 성공적으로 제거 했습니다.","새 이벤트 제거");
			
			
			pop_commands.open_no_open_everybody ();
			
			//이벤트 목록은 다시 가져오기
			event_pin_request.show_events ();
			
			//선택된 핀이 있다면 모두 지우기
			single_map_pin_manager.hide_pins();
		}
		
		});
		
		return true;
		
		
	},function(){return true;});

	
	
}
board_request.event_close = function(){
	var uuid = board_request.attributes.now_open_board_uuid;
	if(uuid==""){
		toastr.error("잘못된 게시글 UUID 데이터 입니다.");
		return;
	}
	question_box.show_question("최초 이벤트 종료","정말 선택한 \"" + uuid +"\" 최초 이벤트를 종료하시겠습니까?<br><br>이 이벤트를 만료하게 되면 해당 쓰레드 토론 내용들이 모두 비활성화되고 더 이상 알림이 발생하지 않습니다.<br><br>해당 이벤트가 정확히 끝내는 것이 맞는지 확인하세요.",function(){
		
		
		web_request.request("reaction/deleteboard/?board_uuid=" + uuid, function(obj){
		
		console.log("이벤트 삭제 요청 : " + uuid);
		console.log(obj);
		
		
		if(obj.result==false){
			toastr.error(obj.reason_kor,"이벤트 제거 실패");
		}else{
			
			toastr.success("최초 이벤트를 성공적으로 만료 했습니다.","이벤트 만료 됨");
			
			pop_commands.open_no_open_everybody ();
			
			//이벤트 목록은 다시 가져오기
			event_pin_request.show_events ();
			
			//선택된 핀이 있다면 모두 지우기
			single_map_pin_manager.hide_pins();
		}
		
		});
		
		return true;
		
		
	},function(){return true;});

	
	
}

