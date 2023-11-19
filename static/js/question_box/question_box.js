var question_box = new Object();
question_box.__latest_yes_button_listener=function(){}
question_box.__latest_no_button_listener=function(){}
question_box.__latest_close_button_listener=function(){}

question_box.__set_buttons=function(){
	
	var yes_button_div = document.getElementById('question_box_yes_button');
	var no_button_div = document.getElementById('question_box_no_button');
	var close_button_div = document.getElementById('question_box_close_button');
	yes_button_div.addEventListener("click",question_box.__latest_yes_button_listener)
	no_button_div.addEventListener("click",question_box.__latest_no_button_listener)
	close_button_div.addEventListener("click",question_box.__latest_close_button_listener)
	
}
question_box.__set_buttons();


question_box.__clear_buttons=function(){
	
	var yes_button_div = document.getElementById('question_box_yes_button');
	var no_button_div = document.getElementById('question_box_no_button');
	var close_button_div = document.getElementById('question_box_close_button');
	
	yes_button_div.removeEventListener("click",question_box.__latest_yes_button_listener)
	no_button_div.removeEventListener("click",question_box.__latest_no_button_listener)
	close_button_div.removeEventListener("click",question_box.__latest_close_button_listener)
	
}

question_box.show_message=function(title, message, on_close_click){
	
	var _question_box = document.getElementById('question_box');
	var _title_div = document.getElementById('question_box_title');
	var _content_div = document.getElementById('question_box_content');
	var _yes_button_div = document.getElementById('question_box_yes_button');
	var _no_button_div = document.getElementById('question_box_no_button');
	var _close_button_div = document.getElementById('question_box_close_button');
	
	
	_no_button_div.classList.add("hide");
	_yes_button_div.classList.add("hide");
	_close_button_div.classList.remove("hide");
	_question_box.classList.remove("no_show");

	_title_div.innerHTML = title;
	_content_div.innerHTML = message;
	
	question_box.__latest_close_button_listener =
	function(){
		if(on_close_click())		
			question_box.hide_message();
		
		
	}

	question_box.__clear_buttons();
	question_box.__set_buttons();

	
}

question_box.show_question=function(title, message, on_yes_click, on_no_click){
	
	var _question_box = document.getElementById('question_box');
	var _title_div = document.getElementById('question_box_title');
	var _content_div = document.getElementById('question_box_content');
	var _yes_button_div = document.getElementById('question_box_yes_button');
	var _no_button_div = document.getElementById('question_box_no_button');
	var _close_button_div = document.getElementById('question_box_close_button');
	
	
	_no_button_div.classList.remove("hide");
	_yes_button_div.classList.remove("hide");
	_close_button_div.classList.add("hide");
	_question_box.classList.remove("no_show");

	_title_div.innerHTML = title;
	_content_div.innerHTML = message;
	
	question_box.__latest_no_button_listener =
	function(){
		if(on_no_click())		
			question_box.hide_message();
		
		
	}

	question_box.__latest_yes_button_listener =
	function(){
		if(on_yes_click())		
			question_box.hide_message();
		
		
	}

	question_box.__clear_buttons();
	question_box.__set_buttons();

	
}

question_box.hide_message=function(){
	
	var _question_box = document.getElementById('question_box');
	var _title_div = document.getElementById('question_box_title');
	var _content_div = document.getElementById('question_box_content');
	var _yes_button_div = document.getElementById('question_box_yes_button');
	var _no_button_div = document.getElementById('question_box_no_button');
	var _close_button_div = document.getElementById('question_box_close_button');
	
	_no_button_div.classList.add("hide");
	_yes_button_div.classList.add("hide");
	_close_button_div.classList.add("hide");
	_question_box.classList.add("no_show");

	//_title_div.innerHTML = "제목"
	//_content_div.innerHTML = "메시지";
	
	question_box.__clear_buttons();

	
}