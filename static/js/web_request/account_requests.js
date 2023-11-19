var account_request =new Object();

account_request.check_login = function(){
		
	web_request.request("user/islogin/", function(obj){
		
		if(obj.result==true){
						

			
			if(obj.user_uuid==undefined || obj.user_uuid==null){
				toastr.error("계정 정보를 불러올 수 없습니다.","로그인");
			
			}else{
				client_memory.user_uuid = obj.user_uuid;
				console.log("나의 UUID : " + client_memory.user_uuid);
					
				toastr.success("계정에 자동 로그인 되었습니다.","로그인");
				account_form_request.form_login();
				
				account_request.check_is_administrator();
			}
	
		}
		
	});
	
}


account_request.login= function(){
	
	if(client_memory.is_login()){
		
		toastr.warning("이미 로그인 되어 있습니다.","로그인 불가");
		return;
	
	}
	
	var _id = document.getElementById('form_login_id').value;
	var _pw = document.getElementById('form_login_pw').value;
	
	
	web_request.request("user/islogin/", function(obj){
		
		if(obj.result==true){
			
			toastr.warning("이미 계정에 로그인 되어 있습니다","로그인");
		}else{
						
			web_request.request("user/login/?id=" + _id + "&pw=" + _pw, function(obj){
				
				if(obj.result==true){
					
					toastr.success("로그인 되었습니다.","로그인");
					
					client_memory.user_uuid = obj.user_uuid;
					console.log("나의 UUID : " + client_memory.user_uuid);
					
					account_form_request.form_login();
									
					question_box.show_message("\"" + obj.nick +"\"님 환영합니다.","서비스에 로그인 되었습니다.<br>본 서비스는 공모전 목적이며 사용자 정보 처리에 대해 알아보려면 소스 정보를 참조하십시오.",function(){return true;});
					
					account_request.check_is_administrator();
					
				}else{
					
					toastr.error("로그인에 실패 했습니다.","로그인");
				}
				
				
			});
	
		}
		
	});
	
}



account_request.check_is_administrator= function(){
	web_request.request("reaction/getuser/?user_uuid=" + client_memory.user_uuid , function(obj){
		console.log("지역 관리자");
		console.log(obj);
		if(obj.result==true){
			
			if(obj.is_reaction_user==1){
				
				toastr.info("지역 관리자님 반갑습니다!","환영합니다.");
				client_memory.is_management_user=true;

			}
			
		}
		
	});
}


account_request.register= function(){
	
	var _id = document.getElementById('form_register_id').value;
	var _pw = document.getElementById('form_register_pw').value;
	var _pwre = document.getElementById('form_register_pwre').value;
	var _nick = document.getElementById('form_register_nick').value;
	
	if(_pw!=_pwre){
		toastr.error("비밀번호 재 입력이 일치하지 않습니다.","회원가입");
				
		return;
	}
	
						
	web_request.request("user/register/?id=" + _id + "&pw=" + _pw+"&nick=" + _nick, function(obj){
		
		if(obj.result==true){
			
			toastr.success("회원가입을 성공 했습니다.","회원가입");
			
			
		}else{
			
			toastr.error("회원가입에 실패 했습니다.<br>" + obj.reason_kr,"회원가입");
		}
		
				
	});
	
}

account_request.changepw= function(){
	
	if(client_memory.is_login()==false){
		
		toastr.warning("로그인 되어 있지 않습니다.","비밀번호 변경");
		return;
	
	}
	
	var _pw = document.getElementById('form_changepw_pw').value;
	var _newpw = document.getElementById('form_changepw_newpw').value;
	var _newpwre = document.getElementById('form_changepw_newpwre').value;
	
	if(_newpw!=_newpwre){
		toastr.error("비밀번호 재 입력이 일치하지 않습니다.","비밀번호 변경");
				
		return;
	}
	
	web_request.request("user/changepassword/?pw=" + _pw + "&newpw=" + _newpw, function(obj){
		
		if(obj.result==true){
						
			toastr.success("비밀번호가 변경되었습니다.","변경 완료");
			document.getElementById('form_changepw_pw').value="";
			document.getElementById('form_changepw_newpw').value="";
			document.getElementById('form_changepw_newpwre').value="";

		}else{
			toastr.warning("비밀번호를 변경할 수 없습니다.","변경 실패");
		
	
		}
		
	});
	
}

account_request.logout= function(){
	
	if(client_memory.is_login()==false){
		
		toastr.warning("로그인 되어 있지 않습니다.","로그인 불가");
		return;
	
	}
	
	var _id = document.getElementById('form_login_id').value;
	var _pw = document.getElementById('form_login_pw').value;
	
	
	web_request.request("user/islogin/", function(obj){
		
		if(obj.result==true){
						
			web_request.request("user/logout/", function(obj){
				
				if(obj.result==true){
					
					toastr.success("로그아웃 되었습니다.","로그인");
					client_memory.user_uuid ="";
					client_memory.is_management_user=false;
					account_form_request.form_logout();
				}else{
					
					toastr.error("로그아웃에 실패 했습니다.","로그인");
				}
				
				
			});
		}else{
			toastr.warning("계정에 로그인이 되어 있지 않습니다","로그아웃 실패");
		
	
		}
		
	});
	
}