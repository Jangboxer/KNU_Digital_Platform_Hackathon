var sound_messagebox = new Object();
sound_messagebox.__internal_send_message=false;

sound_messagebox.show_message = function(message, level_class, timeout){
	sound_messagebox.hide_message();
	
	if(level_class=="info"){
		sound_messagebox.play_sound(sound_messagebox._s_sound_type_info);
	}else{
		sound_messagebox.play_sound(sound_messagebox._s_sound_type_warn);
		
	}
	var inner_msgbox = document.getElementById('sound_messagebox').getElementsByClassName("board_box")[0]
	
	inner_msgbox.classList.remove("info");
	inner_msgbox.classList.remove("warning");
	inner_msgbox.classList.remove("danger");
	
	inner_msgbox.classList.add(level_class);
	inner_msgbox.getElementsByClassName('inner_textlabel')[0].innerHTML = message;
	
	document.getElementById('sound_messagebox').classList.add("show_msg");
	
	
	sound_messagebox.__internal_send_message=setTimeout(function(){
		
		sound_messagebox.hide_message();
		
		
	},timeout);
	

	
	
}

sound_messagebox.hide_message = function(){
	
	if(sound_messagebox.__internal_send_message!=false){
		clearTimeout(sound_messagebox.__internal_send_message);
	}
	document.getElementById('sound_messagebox').classList.remove("show_msg");
	
	
}


sound_messagebox._s_sound_type_info="/static/sounds/info.mp3";
sound_messagebox._s_sound_type_warn="/static/sounds/warn.mp3";
sound_messagebox.__audio_object =new Audio();

sound_messagebox.play_sound= function(sound_type){
	sound_messagebox.__audio_object.pause();
	
	sound_messagebox.__audio_object.src=sound_type;
	
	sound_messagebox.__audio_object.play();
	
}