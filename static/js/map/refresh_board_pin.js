var refresh_board_pin = new Object();

refresh_board_pin.get_event_korean_by_level=function(level){
	
	if(level=="1"){
		
		return "참고"
	}
	if(level=="2"){
		
		return "경고"
	}
	if(level=="3"){
		
		return "위험"
	}
	
}

//메모리에(맵에 그려진) 저장된 보드들을(이벤트)을 화면에 그립니다.
refresh_board_pin.refresh_pins = function(){
	console.log("RefreshPins");
	var events = map_pin_manager.get_pins("event",0);
	var uuids = events.get_marker_uuids();
	console.log(uuids);
	
	var event_list_div = document.getElementById('panel_event_list');
	event_list_div.innerHTML="";
	var items=[]
	for(var i=0;i<uuids.length;i++){
		var item_dict = events.get_fixed_marker(uuids[i]);
		console.log("테스트 : ");
		console.log(item_dict);
		var attach = item_dict.__attach.obj;
		if(board_form_request._now_flag!=0){
			if(attach.category!=board_form_request._now_flag){
				
				continue;
			}
		}
		var main_div = document.createElement("div");
		main_div.innerHTML = "<div class=\"board_box "+ event_pin_request.get_event_color_by_level(attach.level) + " clickable hover\">\
									<span class=\"board_number\">" + (i+1) +"</span> <span class=\"bold\">" + refresh_board_pin.get_event_korean_by_level(attach.level) +"</span> " + attach.title +"\
								</div>";
								
		var __uuid = attach.board_uuid;
		main_div.addEventListener("click",function(__uuid){
				console.log("Ok 열기 요청 " + __uuid);
				board_request.open_post(__uuid);
				
				pop_commands.open_board();
		}.bind(this,__uuid));
		console.log("등록 :" +uuids[i] +"에 대해 : " +attach.board_uuid);
		event_list_div.appendChild(main_div);
		
		//보드에 추가
		
	}
	console.log(items);
}

//동선, 방향 등을 제시하는 핀의 생성 기능
refresh_board_pin.refresh_comment_pins = function(){
	var uuid = board_request.attributes.now_open_board_uuid
	
	var events = map_pin_manager.get_pins("event_comments",0);
	events.clear_fixed_marker();
	
	//__internal_refresh_items에는 다시 새로고침 및 요청된 동선, 방향등을 제시하는 핀 정보가 담겨 있습니다.
	refresh_board_pin.__internal_refresh_items=new Object();
	refresh_board_pin.__internal_refresh_items.isFlag=0;
	refresh_board_pin.__internal_refresh_items.items=[];
	
	
	var end_requests=function(){
		if(refresh_board_pin.__internal_refresh_items.isFlag!=2){
			//두 요청이 모두 끝난 경우
			return;
		}
		
		single_map_pin_manager.show_pins(refresh_board_pin.__internal_refresh_items.items);
		
		
		console.log("요청을 확인했습니다.");
		console.log(refresh_board_pin.__internal_refresh_items);

	}
	
	
	console.log("동선을 위한 - 페이지 열기 요청");
	web_request.request("board/select/?board_uuid=" + uuid, function(obj){
		
		console.log("페이지 열기 요청");
		console.log(obj);
		if(obj.result==true){
			var nobj =new Object();
			nobj.latitude=obj.latitude;
			nobj.longitude = obj.longitude;
			nobj.level = obj.level;
			nobj.wrote_date=obj.wrote_date;
			
			refresh_board_pin.__internal_refresh_items.items.push(nobj);
			
			refresh_board_pin.__internal_refresh_items.isFlag++;
			web_request.request("comment/list/?board_uuid=" + uuid, function(obj){
				
				console.log("동선을 위한 - 댓글  열기 요청 : " + uuid);
				console.log(obj);
				
				
				
				for(var i=0;i<obj.length;i++){
					var item_dict = obj[i]
					
					var nobj =new Object();
					nobj.latitude=item_dict.latitude;
					nobj.longitude = item_dict.longitude;
					nobj.level = item_dict.level;
					nobj.wrote_date=item_dict.wrote_date;
					
					refresh_board_pin.__internal_refresh_items.items.push(nobj);
					
				}
				refresh_board_pin.__internal_refresh_items.isFlag++;
				
				end_requests();
			});
	
		
		}else{
			
			toastr.warning("만료된 이벤트 입니다.","알림");
			
		}
	});
	
	
	
	
};
