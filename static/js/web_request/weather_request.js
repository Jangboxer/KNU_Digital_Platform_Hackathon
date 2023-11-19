var weather_request =new Object();


weather_request.requestadministrator = function(){
	
	
	web_request.request("weather/isin/?longitude="+  client_memory.longitude +"&latitude=" + client_memory.latitude , function(obj){
		
			
			console.log("웨덜 정보를 받습니다.");
			console.log(obj);
			
			document.getElementById('weather_text').innerHTML=obj.temp_info +"<br>" + obj.warning_info +"<br>" + obj.weather_info;
			
			single_map_pin_manager.show_weather_map(document.getElementById('weather_text').innerHTML);
		
		
	});
	
}

weather_request.check_request = function(){

	if(document.getElementById('check_flag_show_rain').checked){
		weather_request.requestadministrator();


	}else{
		single_map_pin_manager.hide_weather_map();
	}
			
			
}