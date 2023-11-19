var web_request =new Object();

web_request.request= function(url, receive_callback){
	
	
		console.log("요청 : " + url)

	
		var http = new XMLHttpRequest();
		var url = "/"+url;
		http.onload=(e)=>{
			var json_obj = JSON.parse(http.responseText);
			console.log("[서버 응답] " + http.responseText);
			receive_callback(json_obj);
		};
		http.onerror=(e)=>{
			
			question_box.show_message("오류","네트워크 응답에 오류가 발생 했습니다.",function(){return true;});

		};
		http.open("GET", url);
		http.send();
	
}


web_request.request_post= function(url,formdata, receive_callback){
	
	
		var http = new XMLHttpRequest();
		var url = "/"+url;
		http.onload=(e)=>{
			var json_obj = JSON.parse(http.responseText);
			console.log("[POST 서버 응답] " + http.responseText);
			receive_callback(json_obj);
		};
		http.onerror=(e)=>{
			
			question_box.show_message("오류","네트워크 응답에 오류가 발생 했습니다.",function(){return true;});

		};
		http.open("POST", url,true);
		http.send(formdata);
	
}
