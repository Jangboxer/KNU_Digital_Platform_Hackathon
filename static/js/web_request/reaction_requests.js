var reaction_request =new Object();

reaction_request.requestadministrator = function(){
		
	var user_job =document.getElementById('form_region_admin_job').value;
	var category=document.getElementById('form_region_admin_category').value;
	
	web_request.request("reaction/requestadministrator/?user_job=" + user_job+"&category=" + category, function(obj){
		
		if(obj.result==true){
						
			
				toastr.info("지역 서포터로 신청하였습니다","종사자 신청");

			
	
		}else{
			
				toastr.error("지역 서포터로 신청 불가합니다.<br>" + obj.reason,"종사자 신청");
				
		}
		
	});
	document.getElementById('form_region_admin_job').value="";
	document.getElementById('form_region_admin_category').value="hazard";
}
