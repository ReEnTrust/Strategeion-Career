/*OVERALL MANAGEMENT OF THE ONLINE SYSTEM*/

var url="https://strategeion-career.herokuapp.com/";

// Set the value of the current experiment the candidate is seeing: 1, 2 or 3 //
function set_current_experiment(number){
	setCookie('_current_experiment',number,1);
	var current_experiment=getCookie('_current_experiment');
}

// Load the Next-Experiment page //
function join_next_experiment(){
	var current_experiment=Number(getCookie('_current_experiment'));
	current_experiment++;
	var location=url+'join_exp'+current_experiment.toString();
	if (current_experiment<=3){
		window.location.href=location;
	}else{
		window.location.href=url+'end';		
	}
}

// From the Next-Experiment page, the candidate can load the Experiment page //
function join_experiment(number){
	var _experiments=getCookie('_experiments');
	var num=_experiments[number];
	if(num==1){
		window.location.href=url+'base';
	}else if(num==2){
		window.location.href=url+'graph';
	}else if(num==3){
		window.location.href=url+'questions';
	}
}

// This function delivers the shortlisting result when the Experiment page is loading //
function get_result(experiment_num){
	if(experiment_num==1){
		var model_name=getCookie('_models')[5];
	}else if(experiment_num==2){
		var model_name=getCookie('_models')[12];
	}else{
		var model_name=getCookie('_models')[19];
	}
var entry={
	sport: getCookie('_sport'),
	interpersonal: getCookie('_interpersonal'),
 	it: getCookie('_it'),
	data: getCookie('_data'),
	management: getCookie('_management'),
	veteran: getCookie('_veteran'),
	volunteering: getCookie('_volunteering'),
	disability: getCookie('_disability'),
	development: getCookie('_development'),
	model: model_name
};


fetch(url+'result',{
	method:'POST',
	body: JSON.stringify(entry),
	headers: new Headers({
 		"content-type":"application/json"})
	})
		.then(function(response){
			return response.json();
		})
		.then(function(myJson){
			var prediction=myJson['data'];

			// The cut-off score for being shortlisted is 50/100 //
			if(prediction>=0.5){
				document.getElementById("result_paragraph1").innerHTML = "Congratulation! We are happy to announce that your Candidate Score is <b>"+((prediction*100).toFixed(1)).toString()+"/100</b>, \
				and that you will be considered for an interview. Please expect to receive a convocation from our HR Team in the following days.";

			}else{
				document.getElementById("result_paragraph1").innerHTML = " Your Candidate Score is <b>"+((prediction*100).toFixed(1)).toString()+"/100 </b>. We are sorry to announce you, that this is not enough and we will not\
				 consider you for an interview.  We thank you for the interest for our company.";

			}
			document.getElementById("result_paragraph2").innerHTML = "If you want further information about how we made our decision based on your profile, please read the box below.\
			 As a reminder, under the General Data Protection Regulation you have the right to contest the decision. To do so please contact hr@strategeion.uk.";

		})

}

// Going back to the previous join-experiment page//
function join_previous_experiment(){
	var current_experiment=Number(getCookie('_current_experiment'));
	current_experiment--;
	if (current_experiment>=1){
		window.location.href=url+'join_exp'+current_experiment.toString();
	}else{
		window.location.href=url+'application';		
	}
}

// Loading to the previous page when the participant clicks on Previous button from an Experiment page //
function back(){
	var current_experiment=Number(getCookie('_current_experiment'));
	if (current_experiment>=1){
		window.location.href=url+'join_exp'+current_experiment.toString();
	}else{
		window.location.href=url+'application';		
	}
}

// Setting cookies for the online system //
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"+";domain=strategeion-career.herokuapp.com";

}

// Getting cookies for the online system //
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


/*PARTICIPANT INFORMATION*/

// Participants are given an Study Completion ID computed randomly, but also indicating in which order they saw the different explanation types, and which model they saw for each explanation type//
function set_id(){

	var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    var id= (S4()+"-"+S4()+"-"+S4());
    var experiments=getCookie('_experiments');
    var models=getCookie('_models');
    id=id+'-M'+models[5]+models[12]+models[19]+'-E'+experiments;
	setCookie('_id',id,1);
	document.getElementById('_id').innerHTML='<b>'+id+'</b>';
	
}

//Once submitting their Candidate Profile, they obtain a score for each feature by computing the weighted sum of each sub-skill//
function profile(){


	//DATA SCIENCE
	var python = document.getElementById('python').value;
	var sql = document.getElementById('sql').value;
	var nosql = document.getElementById('nosql').value;
	var excel = document.getElementById('excel').value;
	var matlab = document.getElementById('matlab').value;
	var database = document.getElementById('database').value;
	var visualisation = document.getElementById('visualisation').value;
	setCookie('_python',python/100,1);
	setCookie('_sql',sql/100,1);
	setCookie('_nosql',nosql/100,1);
	setCookie('_excel',excel/100,1);
	setCookie('_matlab',matlab/100,1);
	setCookie('_database',database/100,1);
	setCookie('_visualisation',visualisation/100,1);

	data= 0.4*sql+0.4*excel+0.5*matlab+0.4*nosql+0.4*visualisation+0.5*python+0.4*database;
	setCookie('_data',data/100,1);

	//IT
	var linux = document.getElementById('linux').value; 
	var windows = document.getElementById('windows').value;   
	var mac = document.getElementById('mac').value;
	var cloud = document.getElementById('cloud').value;
	var modems = document.getElementById('modems').value;
	var cybersecurity = document.getElementById('cybersecurity').value;
	var ip = document.getElementById('ip').value;
	setCookie('_linux',linux/100,1);
	setCookie('_windows',windows/100,1);
	setCookie('_mac',mac/100,1);
	setCookie('_cloud',cloud/100,1);
	setCookie('_modems',modems/100,1);
	setCookie('_cybersecurity',cybersecurity/100,1);
	setCookie('_ip',ip/100,1);  

	it =0.5*linux+0.4*windows+0.4*ip+0.5*cloud+0.5*modems+0.6*cybersecurity+0.1*mac;
	setCookie('_it',it/100,1);




	// IT MANAGEMENT
	var agile = document.getElementById('agile').value; 
	var schedule = document.getElementById('schedule').value;   
	var planning = document.getElementById('planning').value;
	var quality = document.getElementById('quality').value;
	var troubleshooting = document.getElementById('troubleshooting').value;
	var cost = document.getElementById('cost').value;
	setCookie('_agile',agile/100,1);
	setCookie('_schedule',schedule/100,1);
	setCookie('_planning',planning/100,1);
	setCookie('_quality',quality/100,1);
	setCookie('_troubleshooting',troubleshooting/100,1);
	setCookie('_cost',cost/100,1); 

	management = 0.3*agile+0.4*schedule+0.4*planning+0.3*quality+0.3*troubleshooting+0.3*cost;
	setCookie('_management',management/100,1);


	//DEVELOPMENT SKILLS
	var cpp = document.getElementById('c++').value; 
	var java = document.getElementById('java').value;   
	var javascript = document.getElementById('javascript').value;
	var html = document.getElementById('html').value;
	var css = document.getElementById('css').value;
	var web = document.getElementById('web').value;
	var software = document.getElementById('software').value;
	setCookie('_cpp',cpp/100,1);
	setCookie('_java',java/100,1);
	setCookie('_javascript',javascript/100,1);
	setCookie('_html',html/100,1);
	setCookie('_css',css/100,1);
	setCookie('_web',web/100,1);
	setCookie('_software',software/100,1);  

	development = 0.3*cpp+0.2*java+0.3*web+0.3*software+0.3*javascript+0.3*html+0.3*css;
	setCookie('_development',development/100,1);

	
	//INTERPERSONAL SKILLS
	var teamwork = document.getElementById('teamwork').value; 
	var leadership = document.getElementById('leadership').value;   
	var team_building = document.getElementById('team_building').value;
	var public_speaking = document.getElementById('public_speaking').value;
	var writing = document.getElementById('writing').value;
	var presentations = document.getElementById('presentations').value;
	setCookie('_teamwork',teamwork/100,1);
	setCookie('_leadership',leadership/100,1);
	setCookie('_team_building',team_building/100,1);
	setCookie('_public_speaking',public_speaking/100,1);
	setCookie('_writing',writing/100,1);
	setCookie('_presentations',presentations/100,1);

	interpersonal = 0.5*teamwork+0.5*leadership+0.5*team_building+0.5*public_speaking+0.5*writing+0.5*presentations;
	setCookie('_interpersonal',interpersonal/100,1);

	

	//SPORT
	var rugby=0;
	var football=0;
	var boxing=0;
	var basketball=0;
	var athletism=0;
	var gymnastic=0;
	var other=0;
	if(document.getElementById("rugby").checked){
		var rugby=1;
	}
	if(document.getElementById("football").checked){
		var football=1;
	}
	if(document.getElementById("boxing").checked){
		var boxing=1;
	}
	if(document.getElementById("basketball").checked){
		var basketball=1;
	}
	if(document.getElementById("athletism").checked){
		var athletism=1;
	}
	if(document.getElementById("gymnastic").checked){
		var gymnastic=1;
	}
	if(document.getElementById("other").checked){
		var other=1;
	}
	setCookie('_rugby',rugby,1);
	setCookie('_football',football,1);
	setCookie('_boxing',boxing,1);
	setCookie('_basketball',basketball,1);
	setCookie('_athletism',athletism,1);
	setCookie('_gymnastic',gymnastic,1);
	setCookie('_other',other,1);

	sport= 0.4*rugby+0.4*football+0.4*boxing+0.3*basketball+0.2*athletism+0.1*gymnastic+0.2*other;

	
	setCookie('_sport',sport,1);


	//OTHER FEATURES
	veteran=0;
	disability=0;
	volunteering=0;
	if(document.getElementById("veteran").checked){
		veteran=1;
	}
	if(document.getElementById("disability").checked){
		disability=1;
	}
	if(document.getElementById("volunteering").checked){
		volunteering=1;
	}

	
	setCookie('_veteran',veteran,1);
	setCookie('_disability',disability,1);
	setCookie('_volunteering',volunteering,1);
	select_experiment();
	
}

// Once their Profile is computed, they are randomly attributed the order in which they will see the explanation types, and also, which model will be seen with each explanation type //
function select_experiment(){
	var r_model=Math.floor((Math.random() * 6) + 1);
	if(r_model==1){
		_models=['model1','model2','model3'];
	}else if(r_model==2){
		_models=['model1','model3','model2'];
	}else if(r_model==3){
		_models=['model2','model1','model3'];
	}else if(r_model==4){
		_models=['model3','model1','model2'];
	}else if(r_model==5){
		_models=['model2','model3','model1'];
	}else{
		_models=['model3','model2','model1'];
	}
	var r_experiment=Math.floor((Math.random() * 6) + 1);
	if(r_experiment==1){
		_experiments='123';
	}else if(r_experiment==2){
		_experiments='132';
	}else if(r_experiment==3){
		_experiments='312';
	}else if(r_experiment==4){
		_experiments='213';	
	}else if(r_experiment==5){
		_experiments='231';	
	}else{
		_experiments='321';
	}

	
	setCookie('_models',_models,1);
	setCookie('_experiments',_experiments,1);
	join_introduction();

}

// The candidates cannot submit their profile and carry on to the Introductory page of the Experiments if they say they have none of the skills presented to them //
function join_introduction(){
	var interpersonal=getCookie('_interpersonal');
	var development=getCookie('_development');
	var management=getCookie('_management');
	var it=getCookie('_it');
	var data=getCookie('_data');

	var sum=interpersonal+development+management+it+data;

	if(sum==0){
		help_pop.open('Warning');
	}else{
		window.location.href=url+'introduction';		
	}
}




/* Experiment 2 */

// Displays the main page of Explanation 2//
function input_influence(){

	//Loading the model name
	var model_name=getCookie('_models')[12];

	var dev;
	var management;
	var data;
	var it;
	var interpersonal;
	var volunteering;
	var disability;
	var veteran;
	var sport;

//Setting up the weights for the model
	if (model_name=='1'){
		dev= 8.6;
		management=1.1;
		data= 60.3;
		it= 14.5;
		interpersonal=1.9;
		volunteering= 0;
		disability=3;
		veteran=10.6;
		sport=0;

	}else if (model_name=='2'){
		dev= 3.8;
		management=4.4;
		data= 12.6;
		it= 6.3;
		interpersonal=38.4;
		volunteering= 2.5;
		disability=13.2;
		veteran=18.8;
		sport=0;

	}else{
		dev= 5.6;
		management=2.7;
		data= 72;
		it= 2.4;
		interpersonal=2.7;
		volunteering= 1;
		disability=1.3;
		veteran=5;
		sport=7.3;
	}


//Positioning the bubbles and setting their size and color
	var base= 100;
	var data_size= base + 5*data;
	var it_size= base + 5*it;
	var dev_size= base + 5*dev;
	var management_size= base + 5*dev;
	var interpersonal_size= base + 5*interpersonal;
	var volunteering_size= base + 5*volunteering;
	var veteran_size= base + 5*veteran;
	var disability_size= base + 5*disability;
	var sport_size= base + 5*sport;
	var max_size= Math.max(data,it,dev,interpersonal,volunteering,veteran,disability,sport);

	var start_point_left=-40;
	var start_point_top=0;
	var margin=20;


	if (model_name=='1'){
		//data
		document.getElementById("data_circle_container").style.left = (start_point_left+margin+it_size).toString()+'px';
		document.getElementById("data_circle_container").style.top = start_point_top.toString()+"px";
		document.getElementById("data_circle_text").innerHTML = "<b>Data Science  <br> <br>"+data.toString()+"% </b>";
		//it
		document.getElementById("it_circle_container").style.left = start_point_left.toString()+"px";
		document.getElementById("it_circle_container").style.top = start_point_top.toString()+"px";
		document.getElementById("it_circle_text").innerHTML = "<b>IT skills <br> <br>"+it.toString()+"% </b>";
		//dev
		document.getElementById("dev_circle_container").style.left = (start_point_left).toString()+"px";
		document.getElementById("dev_circle_container").style.top = (start_point_top+ it_size+5*margin).toString()+"px";
		document.getElementById("dev_circle_text").innerHTML = "<b>Development Skills <br><br> "+dev.toString()+"% </b>";
		//management
		document.getElementById("management_circle_container").style.left = (start_point_left+it_size+ data_size+margin).toString()+"px";
		document.getElementById("management_circle_container").style.top = (start_point_top+ it_size+5*margin).toString()+"px";
		document.getElementById("management_circle_text").innerHTML = "<b>IT Project Management <br><br> "+management.toString()+"% </b>";
		//interpersonal
		document.getElementById("interpersonal_circle_container").style.left = (start_point_left+it_size+ data_size+2*margin).toString()+"px";
		document.getElementById("interpersonal_circle_container").style.top = (start_point_top+margin).toString()+"px";
		document.getElementById("interpersonal_circle_text").innerHTML = "<b>Interpersonal Skills <br><br> "+interpersonal.toString()+"% </b>";
		//volunteering
		document.getElementById("volunteering_circle_container").style.left = (start_point_left+interpersonal_size+it_size+ data_size).toString()+"px";
		document.getElementById("volunteering_circle_container").style.top = (start_point_top+it_size-margin).toString()+"px";
		document.getElementById("volunteering_circle_text").innerHTML = "<b>Volunteering <br> "+volunteering.toString()+"% </b>";
		//veteran
		document.getElementById("veteran_circle_container").style.left = (start_point_left+interpersonal_size+it_size+ data_size+6*margin).toString()+"px";
		document.getElementById("veteran_circle_container").style.top = (start_point_top+1.5*margin).toString()+"px";
		document.getElementById("veteran_circle_text").innerHTML = "<b>UK Army Veteran <br><br> "+veteran.toString()+"% </b>";
		//disability
		document.getElementById("disability_circle_container").style.left = (start_point_left+veteran_size+volunteering_size+interpersonal_size+ data_size+4*margin).toString()+"px";
		document.getElementById("disability_circle_container").style.top = (start_point_top+10*margin).toString()+"px";
		document.getElementById("disability_circle_text").innerHTML = "<b>Disability <br> "+disability.toString()+"% </b>";
		//sport
		document.getElementById("sport_circle_container").style.left = (start_point_left+veteran_size+volunteering_size+interpersonal_size+it_size+ data_size-8*margin).toString()+"px";
		document.getElementById("sport_circle_container").style.top = (start_point_top+veteran_size+8*margin).toString()+"px";
		document.getElementById("sport_circle_text").innerHTML = "<b>Sport <br> "+sport.toString()+"% </b>";
		

	}else if (model_name=='2'){
		//data
		document.getElementById("data_circle_container").style.left = (start_point_left+margin+it_size).toString()+'px';
		document.getElementById("data_circle_container").style.top = (start_point_top).toString()+"px";
		document.getElementById("data_circle_text").innerHTML = "<b>Data Science <br> <br>"+data.toString()+"% </b>";
		//it
		document.getElementById("it_circle_container").style.left = start_point_left.toString()+"px";
		document.getElementById("it_circle_container").style.top =( start_point_top+2*margin).toString()+"px";
		document.getElementById("it_circle_text").innerHTML = "<b>IT skills <br> <br>"+it.toString()+"% </b>";
		//dev
		document.getElementById("dev_circle_container").style.left = (start_point_left).toString()+"px";
		document.getElementById("dev_circle_container").style.top = (start_point_top+ it_size+7*margin).toString()+"px";
		document.getElementById("dev_circle_text").innerHTML = "<b>Development Skills <br> "+dev.toString()+"% </b>";
		//management
		document.getElementById("management_circle_container").style.left = (start_point_left+data_size).toString()+"px";
		document.getElementById("management_circle_container").style.top = (start_point_top+ data_size+ margin).toString()+"px";
		document.getElementById("management_circle_text").innerHTML = "<b>IT Project Management <br><br> "+management.toString()+"% </b>";
		//interpersonal
		document.getElementById("interpersonal_circle_container").style.left = (start_point_left+it_size+ data_size+2*margin).toString()+"px";
		document.getElementById("interpersonal_circle_container").style.top = (start_point_top+margin).toString()+"px";
		document.getElementById("interpersonal_circle_text").innerHTML = "<b>Interpersonal Skills <br><br> "+interpersonal.toString()+"% </b>";
		//volunteering
		document.getElementById("volunteering_circle_container").style.left = (start_point_left+it_size+7*margin).toString()+"px";
		document.getElementById("volunteering_circle_container").style.top = (start_point_top+it_size+8*margin).toString()+"px";
		document.getElementById("volunteering_circle_text").innerHTML = "<b>Volunteering <br><br> "+volunteering.toString()+"% </b>";
		//veteran
		document.getElementById("veteran_circle_container").style.left = (start_point_left+volunteering_size+interpersonal_size+it_size+ data_size).toString()+"px";
		document.getElementById("veteran_circle_container").style.top = (start_point_top+margin).toString()+"px";
		document.getElementById("veteran_circle_text").innerHTML = "<b>UK Army Veteran <br><br> "+veteran.toString()+"% </b>";
		//disability
		document.getElementById("disability_circle_container").style.left = (start_point_left+interpersonal_size+it_size+ data_size).toString()+"px";
		document.getElementById("disability_circle_container").style.top = (start_point_top+interpersonal_size-2*margin).toString()+"px";
		document.getElementById("disability_circle_text").innerHTML = "<b>Disability <br><br> "+disability.toString()+"% </b>";
		//sport
		document.getElementById("sport_circle_container").style.left = (start_point_left+veteran_size+volunteering_size+interpersonal_size+it_size+4*margin).toString()+"px";
		document.getElementById("sport_circle_container").style.top = (start_point_top+veteran_size+3*margin).toString()+"px";
		document.getElementById("sport_circle_text").innerHTML = "<b>Sport <br> "+sport.toString()+"% </b>";
		

	}else{
		//data
		document.getElementById("data_circle_container").style.left = (start_point_left+margin+it_size).toString()+'px';
		document.getElementById("data_circle_container").style.top = start_point_top.toString()+"px";
		document.getElementById("data_circle_text").innerHTML = "<b>Data Science <br><br>"+data.toString()+"% </b>";
		//it
		document.getElementById("it_circle_container").style.left = start_point_left.toString()+"px";
		document.getElementById("it_circle_container").style.top = start_point_top.toString()+"px";
		document.getElementById("it_circle_text").innerHTML = "<b>IT skills <br><br>"+it.toString()+"% </b>";
		//dev
		document.getElementById("dev_circle_container").style.left = (start_point_left+margin).toString()+"px";
		document.getElementById("dev_circle_container").style.top = (start_point_top+data_size-6*margin).toString()+"px";
		document.getElementById("dev_circle_text").innerHTML = "<b>Development Skills <br>"+dev.toString()+"% </b>";
		//management
		document.getElementById("management_circle_container").style.left = (start_point_left+it_size+ data_size+margin).toString()+"px";
		document.getElementById("management_circle_container").style.top = (start_point_top+ it_size+7*margin).toString()+"px";
		document.getElementById("management_circle_text").innerHTML = "<b>IT Project Management <br> "+management.toString()+"% </b>";
		//interpersonal
		document.getElementById("interpersonal_circle_container").style.left = (start_point_left+it_size+ data_size+margin).toString()+"px";
		document.getElementById("interpersonal_circle_container").style.top = (start_point_top+margin).toString()+"px";
		document.getElementById("interpersonal_circle_text").innerHTML = "<b>Interpersonal Skills <br><br> "+interpersonal.toString()+"% </b>";
		//volunteering
		document.getElementById("volunteering_circle_container").style.left = (start_point_left+interpersonal_size+it_size+ data_size+margin).toString()+"px";
		document.getElementById("volunteering_circle_container").style.top = (start_point_top+it_size).toString()+"px";
		document.getElementById("volunteering_circle_text").innerHTML = "<b>Volunteering <br> "+volunteering.toString()+"% </b>";
		//veteran
		document.getElementById("veteran_circle_container").style.left = (start_point_left+volunteering_size+interpersonal_size+it_size+ data_size+margin).toString()+"px";
		document.getElementById("veteran_circle_container").style.top = (start_point_top+1*margin).toString()+"px";
		document.getElementById("veteran_circle_text").innerHTML = "<b>UK Army Veteran <br><br> "+veteran.toString()+"% </b>";
		//disability
		document.getElementById("disability_circle_container").style.left = (start_point_left+veteran_size+volunteering_size+interpersonal_size+it_size+ data_size-4*margin).toString()+"px";
		document.getElementById("disability_circle_container").style.top = (start_point_top+9*margin).toString()+"px";
		document.getElementById("disability_circle_text").innerHTML = "<b>Disability <br>"+disability.toString()+"% </b>";
		//sport
		document.getElementById("sport_circle_container").style.left = (start_point_left+veteran_size+volunteering_size+interpersonal_size+it_size+ data_size-7*margin).toString()+"px";
		document.getElementById("sport_circle_container").style.top = (start_point_top+veteran_size+9*margin).toString()+"px";
		document.getElementById("sport_circle_text").innerHTML = "<b>Sport <br><br> "+sport.toString()+"% </b>";
		}


//data
	document.getElementById("data_circle_main").style.backgroundColor = "rgb(255," +(255*(1-data/max_size)).toString()+", 0)";
	document.getElementById("data_circle_container").style.width = data_size.toString()+"px";
	document.getElementById("data_circle_container").style.height = data_size.toString()+"px";	
//it
	document.getElementById("it_circle_main").style.backgroundColor = "rgb(255," +(255*(1-it/max_size)).toString()+", 0)";
	document.getElementById("it_circle_container").style.width = it_size.toString()+"px";
	document.getElementById("it_circle_container").style.height = it_size.toString()+"px";
//dev
	document.getElementById("dev_circle_main").style.backgroundColor = "rgb(255," +(255*(1-dev/max_size)).toString()+", 0)";
	document.getElementById("dev_circle_container").style.width = dev_size.toString()+"px";
	document.getElementById("dev_circle_container").style.height = dev_size.toString()+"px";
//management	
	document.getElementById("management_circle_main").style.backgroundColor = "rgb(255," +(255*(1-management/max_size)).toString()+", 0)";
	document.getElementById("management_circle_container").style.width = management_size.toString()+"px";
	document.getElementById("management_circle_container").style.height = management_size.toString()+"px";
//interpersonal
	document.getElementById("interpersonal_circle_main").style.backgroundColor = "rgb(255," +(255*(1-interpersonal/max_size)).toString()+", 0)";
	document.getElementById("interpersonal_circle_container").style.width = interpersonal_size.toString()+"px";
	document.getElementById("interpersonal_circle_container").style.height = interpersonal_size.toString()+"px";
//volunteering
	document.getElementById("volunteering_circle_main").style.backgroundColor = "rgb(255," +(255*(1-volunteering/max_size)).toString()+", 0)";
	document.getElementById("volunteering_circle_container").style.width = volunteering_size.toString()+"px";
	document.getElementById("volunteering_circle_container").style.height = volunteering_size.toString()+"px";

//veteran
	document.getElementById("veteran_circle_main").style.backgroundColor ="rgb(255," +(255*(1-veteran/max_size)).toString()+", 0)";
	document.getElementById("veteran_circle_container").style.width = veteran_size.toString()+"px";
	document.getElementById("veteran_circle_container").style.height = veteran_size.toString()+"px";
//disability
	document.getElementById("disability_circle_main").style.backgroundColor = "rgb(255," +(255*(1-disability/max_size)).toString()+", 0)";
	document.getElementById("disability_circle_container").style.width = disability_size.toString()+"px";
	document.getElementById("disability_circle_container").style.height = disability_size.toString()+"px";
//sport
	document.getElementById("sport_circle_main").style.backgroundColor = "rgb(255," +(255*(1-sport/max_size)).toString()+", 0)";
	document.getElementById("sport_circle_container").style.width = sport_size.toString()+"px";
	document.getElementById("sport_circle_container").style.height = sport_size.toString()+"px";

}

// Displays more detail for Data Science on request //
function data_input_influence(){

	//Loading the model number
	var model_name=getCookie('_models')[12];

	var dev;
	var management;
	var data;
	var it;
	var interpersonal;
	var volunteering;
	var disability;
	var veteran;
	var sport;

	//Setting the weights of the features for the model
	if (model_name=='1'){
		dev= 8.6;
		management=1.1;
		data= 60.3;
		it= 14.5;
		interpersonal=1.9;
		volunteering= 0;
		disability=3;
		veteran=10.6;
		sport=0;

	}else if (model_name=='2'){
		dev= 3.8;
		management=4.4;
		data= 12.6;
		it= 6.3;
		interpersonal=38.4;
		volunteering= 2.5;
		disability=13.2;
		veteran=18.8;
		sport=0;

	}else{
		dev= 5.6;
		management=2.7;
		data= 72;
		it= 2.4;
		interpersonal=2.7;
		volunteering= 1;
		disability=1.3;
		veteran=5;
		sport=7.3;
	}

//Positioning the bubbles and setting their size and colors

	var max_size= Math.max(data,it,dev,interpersonal,volunteering,veteran,disability,sport);

// Each sub-skill is given importance proportionate to its weight in the decision //
	var python=Math.round(16.7*data) / 100;
	var sql=Math.round(13.3*data)/100;
	var nosql=Math.round(13.3*data)/100;
	var excel=Math.round(13.3*data)/100;
	var matlab=Math.round(16.7*data)/100;
	var database=Math.round(13.3*data)/100;
	var visualisation=Math.round(13.3*data)/100;

	var base= 105;
	var python_size= base + 5*python;
	var sql_size= base + 5*sql;
	var nosql_size= base + 5*nosql;
	var excel_size= base + 5*excel;
	var matlab_size= base + 5*matlab;
	var database_size= base + 5*database;
	var visualisation_size= base + 5*visualisation;
	

	var start_point_left=60;
	var start_point_top=0;
	var margin=50;

	//python
	document.getElementById("python_circle_container").style.left = (start_point_left).toString()+'px';
	document.getElementById("python_circle_container").style.top = (start_point_top+2*margin).toString()+"px";
	document.getElementById("python_circle_text").innerHTML = "<b>Python <br><br>"+python.toString()+"% </b>";
	document.getElementById("python_circle_main").style.backgroundColor = "rgb(255," +(255*(1-python/max_size)).toString()+", 0)";
	document.getElementById("python_circle_container").style.width = python_size.toString()+"px";
	document.getElementById("python_circle_container").style.height = python_size.toString()+"px";	
	//sql
	document.getElementById("sql_circle_container").style.left = (start_point_left+python_size+margin).toString()+'px';
	document.getElementById("sql_circle_container").style.top = (start_point_top+margin).toString()+"px";
	document.getElementById("sql_circle_text").innerHTML = "<b>SQL <br><br>"+sql.toString()+"% </b>";
	document.getElementById("sql_circle_main").style.backgroundColor = "rgb(255," +(255*(1-sql/max_size)).toString()+", 0)";
	document.getElementById("sql_circle_container").style.width = sql_size.toString()+"px";
	document.getElementById("sql_circle_container").style.height = sql_size.toString()+"px";
	//nosql
	document.getElementById("nosql_circle_container").style.left = (start_point_left+3*margin).toString()+'px';
	document.getElementById("nosql_circle_container").style.top = (start_point_top+python_size+2*margin).toString()+"px";
	document.getElementById("nosql_circle_text").innerHTML = "<b>NoSQL <br><br>"+nosql.toString()+"% </b>";
	document.getElementById("nosql_circle_main").style.backgroundColor = "rgb(255," +(255*(1-nosql/max_size)).toString()+", 0)";
	document.getElementById("nosql_circle_container").style.width = nosql_size.toString()+"px";
	document.getElementById("nosql_circle_container").style.height = nosql_size.toString()+"px";
	//excel
	document.getElementById("excel_circle_container").style.left = (start_point_left+python_size+sql_size+2*margin).toString()+'px';
	document.getElementById("excel_circle_container").style.top = (start_point_top+0.5*margin).toString()+"px";
	document.getElementById("excel_circle_text").innerHTML = "<b>Microsoft Excel <br><br>"+excel.toString()+"% </b>";
	document.getElementById("excel_circle_main").style.backgroundColor = "rgb(255," +(255*(1-excel/max_size)).toString()+", 0)";
	document.getElementById("excel_circle_container").style.width = excel_size.toString()+"px";
	document.getElementById("excel_circle_container").style.height = excel_size.toString()+"px";
	//matlab
	document.getElementById("matlab_circle_container").style.left = (start_point_left+python_size+sql_size+margin).toString()+'px';
	document.getElementById("matlab_circle_container").style.top = (start_point_top+python_size+0.5*margin).toString()+"px";
	document.getElementById("matlab_circle_text").innerHTML = "<b>Matlab <br><br>"+matlab.toString()+"% </b>";
	document.getElementById("matlab_circle_main").style.backgroundColor = "rgb(255," +(255*(1-matlab/max_size)).toString()+", 0)";
	document.getElementById("matlab_circle_container").style.width = matlab_size.toString()+"px";
	document.getElementById("matlab_circle_container").style.height = matlab_size.toString()+"px";
	//database
	document.getElementById("database_circle_container").style.left = (start_point_left+python_size+sql_size+excel_size+1.5*margin).toString()+'px';
	document.getElementById("database_circle_container").style.top = (start_point_top+excel_size+3*margin).toString()+"px";
	document.getElementById("database_circle_text").innerHTML = "<b>Database <br><br>"+database.toString()+"% </b>";
	document.getElementById("database_circle_main").style.backgroundColor = "rgb(255," +(255*(1-database/max_size)).toString()+", 0)";
	document.getElementById("database_circle_container").style.width = database_size.toString()+"px";
	document.getElementById("database_circle_container").style.height = database_size.toString()+"px";
	//visualisation
	document.getElementById("visualisation_circle_container").style.left = (start_point_left+python_size+sql_size+excel_size+3*margin).toString()+'px';
	document.getElementById("visualisation_circle_container").style.top = (start_point_top+2.5*margin).toString()+"px";
	document.getElementById("visualisation_circle_text").innerHTML = "<b>Visualisation <br><br>"+visualisation.toString()+"% </b>";
	document.getElementById("visualisation_circle_main").style.backgroundColor = "rgb(255," +(255*(1-visualisation/max_size)).toString()+", 0)";
	document.getElementById("visualisation_circle_container").style.width = visualisation_size.toString()+"px";
	document.getElementById("visualisation_circle_container").style.height = visualisation_size.toString()+"px";
}

// Displays more detail for IT on request //
function it_input_influence(){

	//Loading the model name
	var model_name=getCookie('_models')[12];

	var dev;
	var management;
	var data;
	var it;
	var interpersonal;
	var volunteering;
	var disability;
	var veteran;
	var sport;

	//Setting the weights of the features for the model
	if (model_name=='1'){
		dev= 8.6;
		management=1.1;
		data= 60.3;
		it= 14.5;
		interpersonal=1.9;
		volunteering= 0;
		disability=3;
		veteran=10.6;
		sport=0;

	}else if (model_name=='2'){
		dev= 3.8;
		management=4.4;
		data= 12.6;
		it= 6.3;
		interpersonal=38.4;
		volunteering= 2.5;
		disability=13.2;
		veteran=18.8;
		sport=0;

	}else{
		dev= 5.6;
		management=2.7;
		data= 72;
		it= 2.4;
		interpersonal=2.7;
		volunteering= 1;
		disability=1.3;
		veteran=5;
		sport=7.3;
	}

//Positioning the bubbles and setting their size and colors
	var max_size= Math.max(data,it,dev,interpersonal,volunteering,veteran,disability,sport);

// Each sub-skill is given importance proportionate to its weight in the decision //
	var linux=Math.round(16.7*it) / 100;
	var windows=Math.round(13.3*it) / 100;
	var mac=Math.round(3.3*it) / 100;
	var cloud=Math.round(16.7*it) / 100;
	var modems=Math.round(16.7*it) / 100;
	var cybersecurity=Math.round(20*it) / 100;
	var ip=Math.round(13.3*it) / 100;


	var base= 105;
	var linux_size= base + 5*linux;
	var windows_size= base + 5*windows;
	var mac_size= base + 5*mac;
	var cloud_size= base + 5*cloud;
	var modems_size= base + 5*modems;
	var cybersecurity_size= base + 5*cybersecurity;
	var ip_size= base + 5*ip;
	
	var start_point_left=140;
	var start_point_top=20;
	var margin=50;

	//linux
	document.getElementById("linux_circle_container").style.left = (start_point_left).toString()+'px';
	document.getElementById("linux_circle_container").style.top = start_point_top.toString()+"px";
	document.getElementById("linux_circle_text").innerHTML = "<b>Linux Environment <br><br>"+linux.toString()+"% </b>";
	document.getElementById("linux_circle_main").style.backgroundColor = "rgb(255," +(255*(1-linux/max_size)).toString()+", 0)";
	document.getElementById("linux_circle_container").style.width = linux_size.toString()+"px";
	document.getElementById("linux_circle_container").style.height = linux_size.toString()+"px";	
	//windows
	document.getElementById("windows_circle_container").style.left = (start_point_left+linux_size+margin).toString()+'px';
	document.getElementById("windows_circle_container").style.top = (start_point_top+margin).toString()+"px";
	document.getElementById("windows_circle_text").innerHTML = "<b>Windows Environment  <br><br>"+windows.toString()+"% </b>";
	document.getElementById("windows_circle_main").style.backgroundColor = "rgb(255," +(255*(1-windows/max_size)).toString()+", 0)";
	document.getElementById("windows_circle_container").style.width = windows_size.toString()+"px";
	document.getElementById("windows_circle_container").style.height = windows_size.toString()+"px";
	//mac os
	document.getElementById("mac_circle_container").style.left = (start_point_left+2*margin).toString()+'px';
	document.getElementById("mac_circle_container").style.top = (start_point_top+linux_size+margin).toString()+"px";
	document.getElementById("mac_circle_text").innerHTML = "<b>MAC OS Environment <br><br>"+mac.toString()+"% </b>";
	document.getElementById("mac_circle_main").style.backgroundColor = "rgb(255," +(255*(1-mac/max_size)).toString()+", 0)";
	document.getElementById("mac_circle_container").style.width = mac_size.toString()+"px";
	document.getElementById("mac_circle_container").style.height = mac_size.toString()+"px";
	//cloud
	document.getElementById("cloud_circle_container").style.left = (start_point_left+linux_size+windows_size+2*margin).toString()+'px';
	document.getElementById("cloud_circle_container").style.top = (start_point_top+0.5*margin).toString()+"px";
	document.getElementById("cloud_circle_text").innerHTML = "<b>Cloud Systems Administration <br><br>"+cloud.toString()+"% </b>";
	document.getElementById("cloud_circle_main").style.backgroundColor = "rgb(255," +(255*(1-cloud/max_size)).toString()+", 0)";
	document.getElementById("cloud_circle_container").style.width = cloud_size.toString()+"px";
	document.getElementById("cloud_circle_container").style.height = cloud_size.toString()+"px";
	//modems
	document.getElementById("modems_circle_container").style.left = (start_point_left+linux_size+windows_size).toString()+'px';
	document.getElementById("modems_circle_container").style.top = (start_point_top+linux_size+2*margin).toString()+"px";
	document.getElementById("modems_circle_text").innerHTML = "<b>Wireless Modems/<br>Routers  <br><br>"+modems.toString()+"% </b>";
	document.getElementById("modems_circle_main").style.backgroundColor = "rgb(255," +(255*(1-modems/max_size)).toString()+", 0)";
	document.getElementById("modems_circle_container").style.width = modems_size.toString()+"px";
	document.getElementById("modems_circle_container").style.height = modems_size.toString()+"px";
	//cybersecurity
	document.getElementById("cybersecurity_circle_container").style.left = (start_point_left+linux_size+windows_size+cloud_size+margin).toString()+'px';
	document.getElementById("cybersecurity_circle_container").style.top = (start_point_top+cloud_size+margin).toString()+"px";
	document.getElementById("cybersecurity_circle_text").innerHTML = "<b>Cyber Security <br><br>"+cybersecurity.toString()+"% </b>";
	document.getElementById("cybersecurity_circle_main").style.backgroundColor = "rgb(255," +(255*(1-cybersecurity/max_size)).toString()+", 0)";
	document.getElementById("cybersecurity_circle_container").style.width = cybersecurity_size.toString()+"px";
	document.getElementById("cybersecurity_circle_container").style.height = cybersecurity_size.toString()+"px";
	//ip setup
	document.getElementById("ip_circle_container").style.left = (start_point_left+linux_size+windows_size+cloud_size+3*margin).toString()+'px';
	document.getElementById("ip_circle_container").style.top = (start_point_top+1.5*margin).toString()+"px";
	document.getElementById("ip_circle_text").innerHTML = "<b>IP Setup <br><br>"+ip.toString()+"% </b>";
	document.getElementById("ip_circle_main").style.backgroundColor = "rgb(255," +(255*(1-ip/max_size)).toString()+", 0)";
	document.getElementById("ip_circle_container").style.width = ip_size.toString()+"px";
	document.getElementById("ip_circle_container").style.height = ip_size.toString()+"px";

}

// Displays more detail for Development SKills on request //
function dev_input_influence(){

//Loading the model name
	var model_name=getCookie('_models')[12];

	var dev;
	var management;
	var data;
	var it;
	var interpersonal;
	var volunteering;
	var disability;
	var veteran;
	var sport;

	//Setting the weights of the features for the model
	if (model_name=='1'){
		dev= 8.6;
		management=1.1;
		data= 60.3;
		it= 14.5;
		interpersonal=1.9;
		volunteering= 0;
		disability=3;
		veteran=10.6;
		sport=0;

	}else if (model_name=='2'){
		dev= 3.8;
		management=4.4;
		data= 12.6;
		it= 6.3;
		interpersonal=38.4;
		volunteering= 2.5;
		disability=13.2;
		veteran=18.8;
		sport=0;

	}else{
		dev= 5.6;
		management=2.7;
		data= 72;
		it= 2.4;
		interpersonal=2.7;
		volunteering= 1;
		disability=1.3;
		veteran=5;
		sport=7.3;
	}

//Positioning the bubbles and setting their size and colors
	var max_size= Math.max(data,it,dev,interpersonal,volunteering,veteran,disability,sport);


// Each sub-skill is given importance proportionate to its weight in the decision //
	var cpp=Math.round(15*dev)/100;
	var java=Math.round(10*dev)/100;
	var web=Math.round(15*dev)/100;
	var software=Math.round(15*dev)/100;
	var javascript=Math.round(15*dev)/100;
	var html=Math.round(15*dev)/100;
	var css=Math.round(15*dev)/100;

	var base= 105;
	var cpp_size= base + 5*cpp;
	var java_size= base + 5*java;
	var web_size= base + 5*web;
	var software_size= base + 5*software;
	var javascript_size= base + 5*javascript;
	var html_size= base + 5*html;
	var css_size= base + 5*css;
	
	var start_point_left=140;
	var start_point_top=50;
	var margin=50;

	//cpp
	document.getElementById("cpp_circle_container").style.left = (start_point_left).toString()+'px';
	document.getElementById("cpp_circle_container").style.top = start_point_top.toString()+"px";
	document.getElementById("cpp_circle_text").innerHTML = "<b>C++ <br><br>"+cpp.toString()+"% </b>";
	document.getElementById("cpp_circle_main").style.backgroundColor = "rgb(255," +(255*(1-cpp/max_size)).toString()+", 0)";
	document.getElementById("cpp_circle_container").style.width = cpp_size.toString()+"px";
	document.getElementById("cpp_circle_container").style.height = cpp_size.toString()+"px";	
	//java
	document.getElementById("java_circle_container").style.left = (start_point_left+cpp_size+margin).toString()+'px';
	document.getElementById("java_circle_container").style.top = (start_point_top+margin).toString()+"px";
	document.getElementById("java_circle_text").innerHTML = "<b>Java  <br><br>"+java.toString()+"% </b>";
	document.getElementById("java_circle_main").style.backgroundColor = "rgb(255," +(255*(1-java/max_size)).toString()+", 0)";
	document.getElementById("java_circle_container").style.width = java_size.toString()+"px";
	document.getElementById("java_circle_container").style.height = java_size.toString()+"px";
	//web
	document.getElementById("web_circle_container").style.left = (start_point_left+margin).toString()+'px';
	document.getElementById("web_circle_container").style.top = (start_point_top+cpp_size+0.5*margin).toString()+"px";
	document.getElementById("web_circle_text").innerHTML = "<b>Web Development <br><br>"+web.toString()+"% </b>";
	document.getElementById("web_circle_main").style.backgroundColor = "rgb(255," +(255*(1-web/max_size)).toString()+", 0)";
	document.getElementById("web_circle_container").style.width = web_size.toString()+"px";
	document.getElementById("web_circle_container").style.height = web_size.toString()+"px";
	//software
	document.getElementById("software_circle_container").style.left = (start_point_left+cpp_size+java_size+2*margin).toString()+'px';
	document.getElementById("software_circle_container").style.top = (start_point_top+0.5*margin).toString()+"px";
	document.getElementById("software_circle_text").innerHTML = "<b>Software Development <br><br>"+software.toString()+"% </b>";
	document.getElementById("software_circle_main").style.backgroundColor = "rgb(255," +(255*(1-software/max_size)).toString()+", 0)";
	document.getElementById("software_circle_container").style.width = software_size.toString()+"px";
	document.getElementById("software_circle_container").style.height = software_size.toString()+"px";
	//js
	document.getElementById("javascript_circle_container").style.left = (start_point_left+cpp_size+java_size).toString()+'px';
	document.getElementById("javascript_circle_container").style.top = (start_point_top+cpp_size+2*margin).toString()+"px";
	document.getElementById("javascript_circle_text").innerHTML = "<b>Javascript <br><br>"+javascript.toString()+"% </b>";
	document.getElementById("javascript_circle_main").style.backgroundColor = "rgb(255," +(255*(1-javascript/max_size)).toString()+", 0)";
	document.getElementById("javascript_circle_container").style.width = javascript_size.toString()+"px";
	document.getElementById("javascript_circle_container").style.height = javascript_size.toString()+"px";
	//html
	document.getElementById("html_circle_container").style.left = (start_point_left+cpp_size+java_size+software_size).toString()+'px';
	document.getElementById("html_circle_container").style.top = (start_point_top+software_size+margin).toString()+"px";
	document.getElementById("html_circle_text").innerHTML = "<b>HTML <br><br>"+html.toString()+"% </b>";
	document.getElementById("html_circle_main").style.backgroundColor = "rgb(255," +(255*(1-html/max_size)).toString()+", 0)";
	document.getElementById("html_circle_container").style.width = html_size.toString()+"px";
	document.getElementById("html_circle_container").style.height = html_size.toString()+"px";
	//css
	document.getElementById("css_circle_container").style.left = (start_point_left+cpp_size+java_size+software_size+3*margin).toString()+'px';
	document.getElementById("css_circle_container").style.top = (start_point_top+1.5*margin).toString()+"px";
	document.getElementById("css_circle_text").innerHTML = "<b>CSS <br><br>"+css.toString()+"% </b>";
	document.getElementById("css_circle_main").style.backgroundColor = "rgb(255," +(255*(1-css/max_size)).toString()+", 0)";
	document.getElementById("css_circle_container").style.width = css_size.toString()+"px";
	document.getElementById("css_circle_container").style.height = css_size.toString()+"px";

}

// Displays more detail for IT Project Management on request //
function management_input_influence(){

	//Loading the model name
	var model_name=getCookie('_models')[12];

	var dev;
	var management;
	var data;
	var it;
	var interpersonal;
	var volunteering;
	var disability;
	var veteran;
	var sport;

	//Setting the weights of the features for the model
	if (model_name=='1'){
		dev= 8.6;
		management=1.1;
		data= 60.3;
		it= 14.5;
		interpersonal=1.9;
		volunteering= 0;
		disability=3;
		veteran=10.6;
		sport=0;

	}else if (model_name=='2'){
		dev= 3.8;
		management=4.4;
		data= 12.6;
		it= 6.3;
		interpersonal=38.4;
		volunteering= 2.5;
		disability=13.2;
		veteran=18.8;
		sport=0;

	}else{
		dev= 5.6;
		management=2.7;
		data= 72;
		it= 2.4;
		interpersonal=2.7;
		volunteering= 1;
		disability=1.3;
		veteran=5;
		sport=7.3;
	}

//Positioning the bubbles and setting their size and color
	var max_size= Math.max(data,it,dev,interpersonal,volunteering,veteran,disability,sport);

// Each sub-skill is given importance proportionate to its weight in the decision //
	var agile=Math.round(15*management)/100;
	var schedule=Math.round(20*management)/100;
	var project=Math.round(20*management)/100;
	var quality=Math.round(15*management)/100;
	var troubleshooting=Math.round(15*management)/100;
	var cost=Math.round(15*management)/100;

	var base= 105;
	var agile_size= base + 5*agile;
	var schedule_size= base + 5*schedule;
	var project_size= base + 5*project;
	var quality_size= base + 5*quality;
	var troubleshooting_size= base + 5*troubleshooting;
	var cost_size= base + 5*cost;
	
	var start_point_left=180;
	var start_point_top=20;
	var margin=50;

	//agile methodologies
	document.getElementById("agile_circle_container").style.left = (start_point_left).toString()+'px';
	document.getElementById("agile_circle_container").style.top = start_point_top.toString()+"px";
	document.getElementById("agile_circle_text").innerHTML = "<b>Agile Methodologies <br><br>"+agile.toString()+"% </b>";
	document.getElementById("agile_circle_main").style.backgroundColor = "rgb(255," +(255*(1-agile/max_size)).toString()+", 0)";
	document.getElementById("agile_circle_container").style.width = agile_size.toString()+"px";
	document.getElementById("agile_circle_container").style.height = agile_size.toString()+"px";	
	//scheduling
	document.getElementById("schedule_circle_container").style.left = (start_point_left+agile_size+margin).toString()+'px';
	document.getElementById("schedule_circle_container").style.top = (start_point_top+margin).toString()+"px";
	document.getElementById("schedule_circle_text").innerHTML = "<b>Schedules  <br><br>"+schedule.toString()+"% </b>";
	document.getElementById("schedule_circle_main").style.backgroundColor = "rgb(255," +(255*(1-schedule/max_size)).toString()+", 0)";
	document.getElementById("schedule_circle_container").style.width = schedule_size.toString()+"px";
	document.getElementById("schedule_circle_container").style.height = schedule_size.toString()+"px";
	//project 
	document.getElementById("project_circle_container").style.left = (start_point_left+margin).toString()+'px';
	document.getElementById("project_circle_container").style.top = (start_point_top+agile_size+0.5*margin).toString()+"px";
	document.getElementById("project_circle_text").innerHTML = "<b>Project Planning <br><br>"+project.toString()+"% </b>";
	document.getElementById("project_circle_main").style.backgroundColor = "rgb(255," +(255*(1-project/max_size)).toString()+", 0)";
	document.getElementById("project_circle_container").style.width = project_size.toString()+"px";
	document.getElementById("project_circle_container").style.height = project_size.toString()+"px";
	//quality
	document.getElementById("quality_circle_container").style.left = (start_point_left+agile_size+schedule_size+2*margin).toString()+'px';
	document.getElementById("quality_circle_container").style.top = (start_point_top+0.5*margin).toString()+"px";
	document.getElementById("quality_circle_text").innerHTML = "<b>Quality Management <br><br>"+quality.toString()+"% </b>";
	document.getElementById("quality_circle_main").style.backgroundColor = "rgb(255," +(255*(1-quality/max_size)).toString()+", 0)";
	document.getElementById("quality_circle_container").style.width = quality_size.toString()+"px";
	document.getElementById("quality_circle_container").style.height = quality_size.toString()+"px";
	//troubleshooting
	document.getElementById("troubleshooting_circle_container").style.left = (start_point_left+agile_size+schedule_size-margin).toString()+'px';
	document.getElementById("troubleshooting_circle_container").style.top = (start_point_top+agile_size+2*margin).toString()+"px";
	document.getElementById("troubleshooting_circle_text").innerHTML = "<b>Trouble<br>shooting <br><br>"+troubleshooting.toString()+"% </b>";
	document.getElementById("troubleshooting_circle_main").style.backgroundColor = "rgb(255," +(255*(1-troubleshooting/max_size)).toString()+", 0)";
	document.getElementById("troubleshooting_circle_container").style.width = troubleshooting_size.toString()+"px";
	document.getElementById("troubleshooting_circle_container").style.height = troubleshooting_size.toString()+"px";
	//cost management
	document.getElementById("cost_circle_container").style.left = (start_point_left+agile_size+schedule_size+quality_size).toString()+'px';
	document.getElementById("cost_circle_container").style.top = (start_point_top+quality_size+margin).toString()+"px";
	document.getElementById("cost_circle_text").innerHTML = "<b>Cost Management <br><br>"+cost.toString()+"% </b>";
	document.getElementById("cost_circle_main").style.backgroundColor = "rgb(255," +(255*(1-cost/max_size)).toString()+", 0)";
	document.getElementById("cost_circle_container").style.width = cost_size.toString()+"px";
	document.getElementById("cost_circle_container").style.height = cost_size.toString()+"px";
}

// Displays more detail for Interpersonal Skills on request //
function interpersonal_input_influence(){

	//loading the model name
	var model_name=getCookie('_models')[12];

	var dev;
	var management;
	var data;
	var it;
	var interpersonal;
	var volunteering;
	var disability;
	var veteran;
	var sport;

	//Setting the weights of the features for the model
	if (model_name=='1'){
		dev= 8.6;
		management=1.1;
		data= 60.3;
		it= 14.5;
		interpersonal=1.9;
		volunteering= 0;
		disability=3;
		veteran=10.6;
		sport=0;

	}else if (model_name=='2'){
		dev= 3.8;
		management=4.4;
		data= 12.6;
		it= 6.3;
		interpersonal=38.4;
		volunteering= 2.5;
		disability=13.2;
		veteran=18.8;
		sport=0;

	}else{
		dev= 5.6;
		management=2.7;
		data= 72;
		it= 2.4;
		interpersonal=2.7;
		volunteering= 1;
		disability=1.3;
		veteran=5;
		sport=7.3;
	}

//Positioning the bubbles and setting their size and color
	var max_size= Math.max(data,it,dev,interpersonal,volunteering,veteran,disability,sport);

// Each sub-skill is given importance proportionate to its weight in the decision //
	var teamwork=Math.round(16.67*interpersonal)/100;
	var leadership=Math.round(16.67*interpersonal)/100;
	var team_building=Math.round(16.67*interpersonal)/100;
	var public_speaking=Math.round(16.67*interpersonal)/100;
	var writing=Math.round(16.67*interpersonal)/100;
	var presentations=Math.round(16.67*interpersonal)/100;

	var base= 105;
	var teamwork_size= base + 5*teamwork;
	var leadership_size= base + 5*leadership;
	var team_building_size= base + 5*team_building;
	var public_speaking_size= base + 5*public_speaking;
	var writing_size= base + 5*writing;
	var presentations_size= base + 5*presentations;
	
	var start_point_left=220;
	var start_point_top=40;
	var margin=40;


	//teamwork
	document.getElementById("teamwork_circle_container").style.left = (start_point_left).toString()+'px';
	document.getElementById("teamwork_circle_container").style.top = start_point_top.toString()+"px";
	document.getElementById("teamwork_circle_text").innerHTML = "<b>Teamwork <br><br>"+teamwork.toString()+"% </b>";
	document.getElementById("teamwork_circle_main").style.backgroundColor = "rgb(255," +(255*(1-teamwork/max_size)).toString()+", 0)";
	document.getElementById("teamwork_circle_container").style.width = teamwork_size.toString()+"px";
	document.getElementById("teamwork_circle_container").style.height = teamwork_size.toString()+"px";	
	//leadership
	document.getElementById("leadership_circle_container").style.left = (start_point_left+teamwork_size+margin).toString()+'px';
	document.getElementById("leadership_circle_container").style.top = (start_point_top+margin).toString()+"px";
	document.getElementById("leadership_circle_text").innerHTML = "<b>Schedules  <br><br>"+leadership.toString()+"% </b>";
	document.getElementById("leadership_circle_main").style.backgroundColor = "rgb(255," +(255*(1-leadership/max_size)).toString()+", 0)";
	document.getElementById("leadership_circle_container").style.width = leadership_size.toString()+"px";
	document.getElementById("leadership_circle_container").style.height = leadership_size.toString()+"px";
	//teambuilding
	document.getElementById("team_building_circle_container").style.left = (start_point_left+0.5*margin).toString()+'px';
	document.getElementById("team_building_circle_container").style.top = (start_point_top+teamwork_size+0.5*margin).toString()+"px";
	document.getElementById("team_building_circle_text").innerHTML = "<b>Project Planning <br><br>"+team_building.toString()+"% </b>";
	document.getElementById("team_building_circle_main").style.backgroundColor = "rgb(255," +(255*(1-team_building/max_size)).toString()+", 0)";
	document.getElementById("team_building_circle_container").style.width = team_building_size.toString()+"px";
	document.getElementById("team_building_circle_container").style.height = team_building_size.toString()+"px";
	//publicspeaking
	document.getElementById("public_speaking_circle_container").style.left = (start_point_left+teamwork_size+leadership_size+2*margin).toString()+'px';
	document.getElementById("public_speaking_circle_container").style.top = (start_point_top+0.5*margin).toString()+"px";
	document.getElementById("public_speaking_circle_text").innerHTML = "<b>Quality Management <br><br>"+public_speaking.toString()+"% </b>";
	document.getElementById("public_speaking_circle_main").style.backgroundColor = "rgb(255," +(255*(1-public_speaking/max_size)).toString()+", 0)";
	document.getElementById("public_speaking_circle_container").style.width = public_speaking_size.toString()+"px";
	document.getElementById("public_speaking_circle_container").style.height = public_speaking_size.toString()+"px";
	//writing
	document.getElementById("writing_circle_container").style.left = (start_point_left+teamwork_size+leadership_size-margin).toString()+'px';
	document.getElementById("writing_circle_container").style.top = (start_point_top+teamwork_size+2*margin).toString()+"px";
	document.getElementById("writing_circle_text").innerHTML = "<b>Writing <br><br>"+writing.toString()+"% </b>";
	document.getElementById("writing_circle_main").style.backgroundColor = "rgb(255," +(255*(1-writing/max_size)).toString()+", 0)";
	document.getElementById("writing_circle_container").style.width = writing_size.toString()+"px";
	document.getElementById("writing_circle_container").style.height = writing_size.toString()+"px";
	//presentations
	document.getElementById("presentations_circle_container").style.left = (start_point_left+teamwork_size+leadership_size+public_speaking_size).toString()+'px';
	document.getElementById("presentations_circle_container").style.top = (start_point_top+public_speaking_size+margin).toString()+"px";
	document.getElementById("presentations_circle_text").innerHTML = "<b>Presentations <br><br>"+presentations.toString()+"% </b>";
	document.getElementById("presentations_circle_main").style.backgroundColor = "rgb(255," +(255*(1-presentations/max_size)).toString()+", 0)";
	document.getElementById("presentations_circle_container").style.width = presentations_size.toString()+"px";
	document.getElementById("presentations_circle_container").style.height = presentations_size.toString()+"px";


}

// Displays more detail for Sport on request //
function sports_input_influence(){

//Loading model name
	var model_name=getCookie('_models')[12];

	var dev;
	var management;
	var data;
	var it;
	var interpersonal;
	var volunteering;
	var disability;
	var veteran;
	var sport;

//Setting the weights of the features for the model
	if (model_name=='1'){
		dev= 8.6;
		management=1.1;
		data= 60.3;
		it= 14.5;
		interpersonal=1.9;
		volunteering= 0;
		disability=3;
		veteran=10.6;
		sport=0;

	}else if (model_name=='2'){
		dev= 3.8;
		management=4.4;
		data= 12.6;
		it= 6.3;
		interpersonal=38.4;
		volunteering= 2.5;
		disability=13.2;
		veteran=18.8;
		sport=0;

	}else{
		dev= 5.6;
		management=2.7;
		data= 72;
		it= 2.4;
		interpersonal=2.7;
		volunteering= 1;
		disability=1.3;
		veteran=5;
		sport=7.3;
	}

//Positioning the bubbles and setting their color and size
	var max_size= Math.max(data,it,dev,interpersonal,volunteering,veteran,disability,sport);


// Each sub-skill is given importance proportionate to its weight in the decision //
	var rugby=Math.round(20*sport)/100;
	var football=Math.round(20*sport)/100;
	var boxing=Math.round(20*sport)/100;
	var basketball=Math.round(15*sport)/100;
	var athletism=Math.round(10*sport)/100;
	var gymnastic=Math.round(5*sport)/100;
	var other=Math.round(10*sport)/100;

	var base= 105;
	var rugby_size= base + 5*rugby;
	var football_size= base + 5*football;
	var boxing_size= base + 5*boxing;
	var basketball_size= base + 5*basketball;
	var athletism_size= base + 5*athletism;
	var gymnastic_size= base + 5*gymnastic;
	var other_size= base + 5*other;
	
	var start_point_left=140;
	var start_point_top=20;
	var margin=50;


	//rugby
	document.getElementById("rugby_circle_container").style.left = (start_point_left).toString()+'px';
	document.getElementById("rugby_circle_container").style.top = start_point_top.toString()+"px";
	document.getElementById("rugby_circle_text").innerHTML = "<b>Rugby <br><br>"+rugby.toString()+"% </b>";
	document.getElementById("rugby_circle_main").style.backgroundColor = "rgb(255," +(255*(1-rugby/max_size)).toString()+", 0)";
	document.getElementById("rugby_circle_container").style.width = rugby_size.toString()+"px";
	document.getElementById("rugby_circle_container").style.height = rugby_size.toString()+"px";	
	//football
	document.getElementById("football_circle_container").style.left = (start_point_left+rugby_size+margin).toString()+'px';
	document.getElementById("football_circle_container").style.top = (start_point_top+margin).toString()+"px";
	document.getElementById("football_circle_text").innerHTML = "<b>Football  <br><br>"+football.toString()+"% </b>";
	document.getElementById("football_circle_main").style.backgroundColor = "rgb(255," +(255*(1-football/max_size)).toString()+", 0)";
	document.getElementById("football_circle_container").style.width = football_size.toString()+"px";
	document.getElementById("football_circle_container").style.height = football_size.toString()+"px";
	//boxing
	document.getElementById("boxing_circle_container").style.left = (start_point_left+2*margin).toString()+'px';
	document.getElementById("boxing_circle_container").style.top = (start_point_top+rugby_size+margin).toString()+"px";
	document.getElementById("boxing_circle_text").innerHTML = "<b>Boxing <br><br>"+boxing.toString()+"% </b>";
	document.getElementById("boxing_circle_main").style.backgroundColor = "rgb(255," +(255*(1-boxing/max_size)).toString()+", 0)";
	document.getElementById("boxing_circle_container").style.width = boxing_size.toString()+"px";
	document.getElementById("boxing_circle_container").style.height = boxing_size.toString()+"px";
	//athletics
	document.getElementById("athletism_circle_container").style.left = (start_point_left+rugby_size+football_size+2*margin).toString()+'px';
	document.getElementById("athletism_circle_container").style.top = (start_point_top+0.5*margin).toString()+"px";
	document.getElementById("athletism_circle_text").innerHTML = "<b>Athletism <br><br>"+athletism.toString()+"% </b>";
	document.getElementById("athletism_circle_main").style.backgroundColor = "rgb(255," +(255*(1-athletism/max_size)).toString()+", 0)";
	document.getElementById("athletism_circle_container").style.width = athletism_size.toString()+"px";
	document.getElementById("athletism_circle_container").style.height = athletism_size.toString()+"px";
	//gymnastic
	document.getElementById("gymnastic_circle_container").style.left = (start_point_left+rugby_size+football_size).toString()+'px';
	document.getElementById("gymnastic_circle_container").style.top = (start_point_top+rugby_size+2.5*margin).toString()+"px";
	document.getElementById("gymnastic_circle_text").innerHTML = "<b>Gymnastic <br><br>"+gymnastic.toString()+"% </b>";
	document.getElementById("gymnastic_circle_main").style.backgroundColor = "rgb(255," +(255*(1-gymnastic/max_size)).toString()+", 0)";
	document.getElementById("gymnastic_circle_container").style.width = gymnastic_size.toString()+"px";
	document.getElementById("gymnastic_circle_container").style.height = gymnastic_size.toString()+"px";
	//other sport
	document.getElementById("other_circle_container").style.left = (start_point_left+rugby_size+football_size+athletism_size).toString()+'px';
	document.getElementById("other_circle_container").style.top = (start_point_top+athletism_size+margin).toString()+"px";
	document.getElementById("other_circle_text").innerHTML = "<b>Other <br><br>"+other.toString()+"% </b>";
	document.getElementById("other_circle_main").style.backgroundColor = "rgb(255," +(255*(1-other/max_size)).toString()+", 0)";
	document.getElementById("other_circle_container").style.width = other_size.toString()+"px";
	document.getElementById("other_circle_container").style.height = other_size.toString()+"px";
	//basketball
	document.getElementById("basket_circle_container").style.left = (start_point_left+rugby_size+football_size+athletism_size+3*margin).toString()+'px';
	document.getElementById("basket_circle_container").style.top = (start_point_top+1.5*margin).toString()+"px";
	document.getElementById("basket_circle_text").innerHTML = "<b>Basketball <br><br>"+basketball.toString()+"% </b>";
	document.getElementById("basket_circle_main").style.backgroundColor = "rgb(255," +(255*(1-basketball/max_size)).toString()+", 0)";
	document.getElementById("basket_circle_container").style.width = basketball_size.toString()+"px";
	document.getElementById("basket_circle_container").style.height = basketball_size.toString()+"px";

}

/*Experiment 3*/

var pop = {
				// When participants ask a whati-if question //
  				what_if : function (question_feature, question_side, feature_range) {
  					var model_name=getCookie('_models')[19];
  					var feature_1=null;
					var feature_2=null;
					var feature_3=null;
					var feature_4=null;
					var feature_5=null;
					var feature_6=null;
					var feature_7=null;

					// Collecting the participant's profile for the feature of interest
					if(question_feature=='Data Science'){
						feature_1=getCookie('_python');
					 	feature_2=getCookie('_sql');
						feature_3=getCookie('_nosql');
						feature_4=getCookie('_matlab');
						feature_5=getCookie('_excel');
						feature_6=getCookie('_database');
						feature_7=getCookie('_visualisation');
								
					}else if(question_feature=='IT'){
						feature_1=getCookie('_linux');
					 	feature_2=getCookie('_windows');
						feature_3=getCookie('_mac');
						feature_4=getCookie('_cloud');
						feature_5=getCookie('_modems');
						feature_6=getCookie('_cybersecurity');
						feature_7=getCookie('_ip');

					}else if(question_feature=='Development Skills'){
						feature_1=getCookie('_java');
					 	feature_2=getCookie('_javascript');
						feature_3=getCookie('_css');
						feature_4=getCookie('_html');
						feature_5=getCookie('_software');
						feature_6=getCookie('_cpp');
						feature_7=getCookie('_web');

					}else if(question_feature=='IT Project Management'){
						feature_1=getCookie('_agile');
					 	feature_2=getCookie('_schedule');
						feature_3=getCookie('_planning');
						feature_4=getCookie('_quality');
						feature_5=getCookie('_troubleshooting');
						feature_6=getCookie('_cost');

					}else if(question_feature=='Interpersonal Skills'){
						feature_1=getCookie('_teamwork');
					 	feature_2=getCookie('_leadership');
						feature_3=getCookie('_team_building');
						feature_4=getCookie('_public_speaking');
						feature_5=getCookie('_writing');
						feature_6=getCookie('_presentations');

					}else if(question_feature=='Sport'){
						feature_1=getCookie('_rugby');
					 	feature_2=getCookie('_football');
						feature_3=getCookie('_boxing');
						feature_4=getCookie('_basketball');
						feature_5=getCookie('_athletism');
						feature_6=getCookie('_gymnastic');
						feature_7=getCookie('_other');
					}		

					var entry={
						sport: getCookie('_sport'),
						interpersonal: getCookie('_interpersonal'),
 						it: getCookie('_it'),
						data: getCookie('_data'),
						management: getCookie('_management'),
						veteran: getCookie('_veteran'),
						volunteering: getCookie('_volunteering'),
						disability: getCookie('_disability'),
						development: getCookie('_development'),
						model: model_name,
						question_feature: question_feature,
						question_side: question_side,
						feature_range: feature_range,
						feature_1:feature_1,
						feature_2:feature_2,
						feature_3:feature_3,
						feature_4:feature_4,
						feature_5:feature_5,
						feature_6:feature_6,
						feature_7:feature_7
					};
		
					//asking the question//
					fetch(url+'what_if',{
						method:'POST',
						body: JSON.stringify(entry),
						headers: new Headers({
 						"content-type":"application/json"})
						})
						.then(function(response){
						return response.json();
						})
						.then(function(myJson){

							// Reception of the different elements constituing the answer to the What-If question
							var answer=myJson['data'];
							var current_score=myJson['current_value'];
							var new_score=myJson['new_value'];
							var answer1_feature_1=myJson['answer1_feature_1'];
							var answer1_feature_2=myJson['answer1_feature_2'];
							var answer1_feature_3=myJson['answer1_feature_3'];
							var answer1_feature_4=myJson['answer1_feature_4'];
							var answer1_feature_5=myJson['answer1_feature_5'];
							var answer1_feature_6=myJson['answer1_feature_6'];
							var answer1_feature_7=myJson['answer1_feature_7'];
							var limit_score=Number(myJson['limit_score']);

							var answer2=myJson['answer2'];
							

							var new_feature_1=myJson['new_feature_1'];
							var new_feature_2=myJson['new_feature_2'];
							var new_feature_3=myJson['new_feature_3'];
							var new_feature_4=myJson['new_feature_4'];
							var new_feature_5=myJson['new_feature_5'];
							var new_feature_6=myJson['new_feature_6'];
							var new_feature_7=myJson['new_feature_7'];

							var new_feature_1_score=Number(myJson['new_feature_1_score']);
							var new_feature_2_score=Number(myJson['new_feature_2_score']);
							var new_feature_3_score=Number(myJson['new_feature_3_score']);
							var new_feature_4_score=Number(myJson['new_feature_4_score']);
							var new_feature_5_score=Number(myJson['new_feature_5_score']);
							var new_feature_6_score=Number(myJson['new_feature_6_score']);
							var new_feature_7_score=Number(myJson['new_feature_7_score']);

							// At first, all the pop-up windows elements are not visible, given the questions, only the ones necessary will be displayed
							document.getElementById("pop-text").style.display = 'none';
							document.getElementById("pop-range").style.display = 'none';

							document.getElementById("change1").style.display = 'none';
							document.getElementById("change2").style.display = 'none';
							document.getElementById("change3").style.display = 'none';
							document.getElementById("change4").style.display = 'none';
							document.getElementById("change5").style.display = 'none';
							document.getElementById("change6").style.display = 'none';
							document.getElementById("change7").style.display = 'none';

							document.getElementById("unchange1").style.display = 'none';
							document.getElementById("unchange2").style.display = 'none';
							document.getElementById("unchange3").style.display = 'none';
							document.getElementById("unchange4").style.display = 'none';
							document.getElementById("unchange5").style.display = 'none';
							document.getElementById("unchange6").style.display = 'none';
							document.getElementById("unchange7").style.display = 'none';


							document.getElementById("new_feature_1").style.display = 'none';
							document.getElementById("new_feature_2").style.display = 'none';
							document.getElementById("new_feature_3").style.display = 'none';
							document.getElementById("new_feature_4").style.display = 'none';
							document.getElementById("new_feature_5").style.display = 'none';
							document.getElementById("new_feature_6").style.display = 'none';
							document.getElementById("new_feature_7").style.display = 'none';

							document.getElementById("output_new_feature_1").style.display = 'none';
							document.getElementById("output_new_feature_2").style.display = 'none';
							document.getElementById("output_new_feature_3").style.display = 'none';
							document.getElementById("output_new_feature_4").style.display = 'none';
							document.getElementById("output_new_feature_5").style.display = 'none';
							document.getElementById("output_new_feature_6").style.display = 'none';
							document.getElementById("output_new_feature_7").style.display = 'none';

							//More Detail displayed on candidate's request
							document.getElementById("details").style.display = 'none';

							document.getElementById("feature_1").style.display = 'none';
							document.getElementById("feature_2").style.display = 'none';
							document.getElementById("feature_3").style.display = 'none';
							document.getElementById("feature_4").style.display = 'none';
							document.getElementById("feature_5").style.display = 'none';
							document.getElementById("feature_6").style.display = 'none';
							document.getElementById("feature_7").style.display = 'none';

							document.getElementById("approximation").style.display = 'none';
							document.getElementById("precision").style.display = 'none';
							document.getElementById("precision_unique").style.display = 'none';


							


							//Setting "More Detail button"
							document.getElementById("details").textContent = 'More Detail';

							//Setting all the answers provided
							document.getElementById("unchange_text1").innerHTML=answer1_feature_1;
							document.getElementById("unchange_text2").innerHTML=answer1_feature_2;
							document.getElementById("unchange_text3").innerHTML=answer1_feature_3;
							document.getElementById("unchange_text4").innerHTML=answer1_feature_4;
							document.getElementById("unchange_text5").innerHTML=answer1_feature_5;
							document.getElementById("unchange_text6").innerHTML=answer1_feature_6;
							document.getElementById("unchange_text7").innerHTML=answer1_feature_7;

							document.getElementById("text1_feature_1").innerHTML=answer1_feature_1;
							document.getElementById("text1_feature_2").innerHTML=answer1_feature_2;
							document.getElementById("text1_feature_3").innerHTML=answer1_feature_3;
							document.getElementById("text1_feature_4").innerHTML=answer1_feature_4;
							document.getElementById("text1_feature_5").innerHTML=answer1_feature_5;
							document.getElementById("text1_feature_6").innerHTML=answer1_feature_6;
							document.getElementById("text1_feature_7").innerHTML=answer1_feature_7;

							document.getElementById("text2_feature_1").innerHTML=answer2;
							document.getElementById("text2_feature_2").innerHTML=answer2;
							document.getElementById("text2_feature_3").innerHTML=answer2;
							document.getElementById("text2_feature_4").innerHTML=answer2;
							document.getElementById("text2_feature_5").innerHTML=answer2;
							document.getElementById("text2_feature_6").innerHTML=answer2;
							document.getElementById("text2_feature_7").innerHTML=answer2;

							document.getElementById("new_feature_1").value = Number(new_feature_1);
							document.getElementById("new_feature_1_score").value = new_feature_1_score;
							document.getElementById("new_feature_2").value = Number(new_feature_2);
							document.getElementById("new_feature_2_score").value = new_feature_2_score;
							document.getElementById("new_feature_3").value = Number(new_feature_3);
							document.getElementById("new_feature_3_score").value = new_feature_3_score;
							document.getElementById("new_feature_4").value = Number(new_feature_4);
							document.getElementById("new_feature_4_score").value = new_feature_4_score;
							document.getElementById("new_feature_5").value = Number(new_feature_5);
							document.getElementById("new_feature_5_score").value = new_feature_5_score;
							document.getElementById("new_feature_6").value = Number(new_feature_6);
							document.getElementById("new_feature_6_score").value = new_feature_6_score;
							document.getElementById("new_feature_7").value = Number(new_feature_7);
							document.getElementById("new_feature_7_score").value = new_feature_7_score;

							document.getElementById("output_new_feature_1").innerHTML = Number(new_feature_1);
							document.getElementById("output_new_feature_1_score").innerHTML = new_feature_1_score;
							document.getElementById("output_new_feature_2").innerHTML = Number(new_feature_2);
							document.getElementById("output_new_feature_2_score").innerHTML = new_feature_2_score;
							document.getElementById("output_new_feature_3").innerHTML = Number(new_feature_3);
							document.getElementById("output_new_feature_3_score").innerHTML = new_feature_3_score;
							document.getElementById("output_new_feature_4").innerHTML = Number(new_feature_4);
							document.getElementById("output_new_feature_4_score").innerHTML = new_feature_4_score;
							document.getElementById("output_new_feature_5").innerHTML = Number(new_feature_5);
							document.getElementById("output_new_feature_5_score").innerHTML = new_feature_5_score;
							document.getElementById("output_new_feature_6").innerHTML = Number(new_feature_6);
							document.getElementById("output_new_feature_6_score").innerHTML = new_feature_6_score;
							document.getElementById("output_new_feature_7").innerHTML = Number(new_feature_7);
							document.getElementById("output_new_feature_7_score").innerHTML = new_feature_7_score;

							document.getElementById("output_new_feature_1").style.left = (22+0.7*Number(new_feature_1)).toString()+'px';
							document.getElementById("output_new_feature_1_score").style.left = (22+0.7*new_feature_1_score).toString()+'px';
							document.getElementById("output_new_feature_2").style.left = (22+0.7*Number(new_feature_2)).toString()+'px';
							document.getElementById("output_new_feature_2_score").style.left = (22+0.7*new_feature_2_score).toString()+'px';
							document.getElementById("output_new_feature_3").style.left = (22+0.7*Number(new_feature_3)).toString()+'px';
							document.getElementById("output_new_feature_3_score").style.left = (22+0.7*new_feature_3_score).toString()+'px';
							document.getElementById("output_new_feature_4").style.left = (22+0.7*Number(new_feature_4)).toString()+'px';
							document.getElementById("output_new_feature_4_score").style.left = (22+0.7*new_feature_4_score).toString()+'px';
							document.getElementById("output_new_feature_5").style.left = (22+0.7*Number(new_feature_5)).toString()+'px';
							document.getElementById("output_new_feature_5_score").style.left = (22+0.7*new_feature_5_score).toString()+'px';
							document.getElementById("output_new_feature_6").style.left = (22+0.7*Number(new_feature_6)).toString()+'px';
							document.getElementById("output_new_feature_6_score").style.left = (22+0.7*new_feature_6_score).toString()+'px';
							document.getElementById("output_new_feature_7").style.left = (22+0.7*Number(new_feature_7)).toString()+'px';
							document.getElementById("output_new_feature_7_score").style.left = (22+0.7*new_feature_7_score).toString()+'px';
							



							// If the candidate asked a question about Data Science
							if(question_feature=='Data Science'){

								// This part deals with the display and look of the pop-up window
								//Setting the names of the Data Science sub-skills
								document.getElementById("title_feature_1").innerHTML='Python';
								document.getElementById("title_feature_2").innerHTML='SQL';
								document.getElementById("title_feature_3").innerHTML='No SQL';
								document.getElementById("title_feature_4").innerHTML='Matlab';
								document.getElementById("title_feature_5").innerHTML='Excel';
								document.getElementById("title_feature_6").innerHTML='Database';
								document.getElementById("title_feature_7").innerHTML='Data Visualisation';

								//Positioning the sub-skill blocks
								document.getElementById("feature_1").style.left = (40).toString()+'px';
								document.getElementById("feature_1").style.top = (260).toString()+"px";

								document.getElementById("feature_2").style.left = (200).toString()+'px';
								document.getElementById("feature_2").style.top = (260).toString()+"px";

								document.getElementById("feature_3").style.left = (360).toString()+'px';
								document.getElementById("feature_3").style.top = (260).toString()+"px";

								document.getElementById("feature_4").style.left = (520).toString()+'px';
								document.getElementById("feature_4").style.top = (260).toString()+"px";

								document.getElementById("feature_5").style.left = (680).toString()+'px';
								document.getElementById("feature_5").style.top = (260).toString()+"px";

								document.getElementById("feature_6").style.left = (840).toString()+'px';
								document.getElementById("feature_6").style.top = (260).toString()+"px";

								document.getElementById("feature_7").style.left = (1000).toString()+'px';
								document.getElementById("feature_7").style.top = (260).toString()+"px";	

								//Displaying the sub-skill blocks
								document.getElementById("feature_1").style.display = 'block';
								document.getElementById("feature_2").style.display = 'block';
								document.getElementById("feature_3").style.display = 'block';
								document.getElementById("feature_4").style.display = 'block';
								document.getElementById("feature_5").style.display = 'block';
								document.getElementById("feature_6").style.display = 'block';
								document.getElementById("feature_7").style.display = 'block';

								//Display the "More Detail" Button
								document.getElementById("details").style.display = 'block';
								
								// If answer2==null, this means that modifying the feature cannot change the outcome of the system, and less has to be displayed
								if( answer2!=null){

									//This part sets the range bars showing the candidate how he could change the outcome of the system
									//Displaying blocks containing the answers
									document.getElementById("change1").style.display = 'block';
									document.getElementById("change2").style.display = 'block';
									document.getElementById("change3").style.display = 'block';
									document.getElementById("change4").style.display = 'block';
									document.getElementById("change5").style.display = 'block';
									document.getElementById("change6").style.display = 'block';
									document.getElementById("change7").style.display = 'block';


									document.getElementById("new_feature_1").style.display = 'block';
									document.getElementById("new_feature_2").style.display = 'block';
									document.getElementById("new_feature_3").style.display = 'block';
									document.getElementById("new_feature_4").style.display = 'block';
									document.getElementById("new_feature_5").style.display = 'block';
									document.getElementById("new_feature_6").style.display = 'block';
									document.getElementById("new_feature_7").style.display = 'block';

									document.getElementById("output_new_feature_1").style.display = 'block';
									document.getElementById("output_new_feature_2").style.display = 'block';
									document.getElementById("output_new_feature_3").style.display = 'block';
									document.getElementById("output_new_feature_4").style.display = 'block';
									document.getElementById("output_new_feature_5").style.display = 'block';
									document.getElementById("output_new_feature_6").style.display = 'block';
									document.getElementById("output_new_feature_7").style.display = 'block';

									//Positioning and displaying additional information for participants
									document.getElementById("precision").style.left = (40).toString()+'px';
									document.getElementById("precision").style.top = (515).toString()+"px";
									document.getElementById("precision").style.display = 'block';

									//"limit_score" indicates whether the change will grant the candidate an interview or if he would be rejected
									//setting up the answer
									if(limit_score==1.0){
										document.getElementById("new_score_text").innerHTML='With the following skills, you would not have been granted an interview:';
									}else if (limit_score==0.0){
										document.getElementById("new_score_text").innerHTML='With the following skills, you would have been granted an interview:';
									}

									// Setting the values of the different range bars and setting up the answers
									document.getElementById("current_score_text").innerHTML='Your current skills in Data Science are:';
									document.getElementById("current_score").value=current_score;
									document.getElementById("new_score").value=new_score;
									document.getElementById("output_current_score").innerHTML=current_score;
									document.getElementById("output_new_score").innerHTML=new_score;
									document.getElementById("output_current_score").style.left=(-310+Number(current_score)).toString()+'px';
									document.getElementById("output_new_score").style.left=(-310+Number(new_score)).toString()+'px';

									//Displays the pop-up window
									document.getElementById("pop-range").style.display = 'block';

								// If answer2!=null, this means that modifying the feature cannot change the outcome
								}else{
									
									//Displaying blocks containing the answer 
									document.getElementById("unchange1").style.display = 'block';
									document.getElementById("unchange2").style.display = 'block';
									document.getElementById("unchange3").style.display = 'block';
									document.getElementById("unchange4").style.display = 'block';
									document.getElementById("unchange5").style.display = 'block';
									document.getElementById("unchange6").style.display = 'block';
									document.getElementById("unchange7").style.display = 'block';

									//Positioning and displaying additional information to candidates
									document.getElementById("approximation").style.left = (40).toString()+'px';
									document.getElementById("approximation").style.top = (180).toString()+"px";
									document.getElementById("approximation").style.display = 'block';

									document.getElementById("precision_unique").style.left = (40).toString()+'px';
									document.getElementById("precision_unique").style.top = (515).toString()+"px";
									document.getElementById("precision_unique").style.display = 'block';

									//Displaying the pop-up window and setting up the answer
									document.getElementById("pop-text").innerHTML = answer;
									document.getElementById("pop-text").style.display = 'block';}

								

							
						// If the candidate asked a question about IT								
						}else if(question_feature=='IT'){

							// This part deals with the display and look of the pop-up window
							//Setting up the names of IT sub-skills
							document.getElementById("title_feature_1").innerHTML='Linux';
							document.getElementById("title_feature_2").innerHTML='Windows';
							document.getElementById("title_feature_3").innerHTML='MAC OS';
							document.getElementById("title_feature_4").innerHTML='Cloud System';
							document.getElementById("title_feature_5").innerHTML='Wireless/Modems';
							document.getElementById("title_feature_6").innerHTML='Cybersecurity';
							document.getElementById("title_feature_7").innerHTML='IP setup';

							//Positioning the sub-skill blocks
							document.getElementById("feature_1").style.left = (40).toString()+'px';
							document.getElementById("feature_1").style.top = (260).toString()+"px";
							
							document.getElementById("feature_2").style.left = (200).toString()+'px';
							document.getElementById("feature_2").style.top = (260).toString()+"px";
							
							document.getElementById("feature_3").style.left = (360).toString()+'px';
							document.getElementById("feature_3").style.top = (260).toString()+"px";
							
							document.getElementById("feature_4").style.left = (520).toString()+'px';
							document.getElementById("feature_4").style.top = (260).toString()+"px";
							
							document.getElementById("feature_5").style.left = (680).toString()+'px';
							document.getElementById("feature_5").style.top = (260).toString()+"px";
							
							document.getElementById("feature_6").style.left = (840).toString()+'px';
							document.getElementById("feature_6").style.top = (260).toString()+"px";
							
							document.getElementById("feature_7").style.left = (1000).toString()+'px';
							document.getElementById("feature_7").style.top = (260).toString()+"px";
								
							//Displaying the sub-skills blocks
							document.getElementById("feature_1").style.display = 'block';
							document.getElementById("feature_2").style.display = 'block';
							document.getElementById("feature_3").style.display = 'block';
							document.getElementById("feature_4").style.display = 'block';
							document.getElementById("feature_5").style.display = 'block';
							document.getElementById("feature_6").style.display = 'block';
							document.getElementById("feature_7").style.display = 'block';

							//Displays "More Detail" Button
							document.getElementById("details").style.display = 'block';

							// If answer2==null, this means that modifying the feature cannot change the outcome of the system, and less has to be displayed
							if(answer2!=null){

								//This part sets the range bars showing the candidate how he could change the outcome of the system
								//Displaying blocks containing the answer
								document.getElementById("change1").style.display = 'block';
								document.getElementById("change2").style.display = 'block';
								document.getElementById("change3").style.display = 'block';
								document.getElementById("change4").style.display = 'block';
								document.getElementById("change5").style.display = 'block';
								document.getElementById("change6").style.display = 'block';
								document.getElementById("change7").style.display = 'block';

								document.getElementById("new_feature_1").style.display = 'block';
								document.getElementById("new_feature_2").style.display = 'block';
								document.getElementById("new_feature_3").style.display = 'block';
								document.getElementById("new_feature_4").style.display = 'block';
								document.getElementById("new_feature_5").style.display = 'block';
								document.getElementById("new_feature_6").style.display = 'block';
								document.getElementById("new_feature_7").style.display = 'block';

								document.getElementById("output_new_feature_1").style.display = 'block';
								document.getElementById("output_new_feature_2").style.display = 'block';
								document.getElementById("output_new_feature_3").style.display = 'block';
								document.getElementById("output_new_feature_4").style.display = 'block';
								document.getElementById("output_new_feature_5").style.display = 'block';
								document.getElementById("output_new_feature_6").style.display = 'block';
								document.getElementById("output_new_feature_7").style.display = 'block';

								//Positioning and displaying additional information for candidates
								document.getElementById("precision").style.left = (40).toString()+'px';
								document.getElementById("precision").style.top = (515).toString()+"px";
								document.getElementById("precision").style.display = 'block';
								
								//"limit_score" indicates whether the change will grant the candidate an interview or if he would be rejected	
								//setting up the answer						
								if(limit_score==1.0){
									document.getElementById("new_score_text").innerHTML='With the following skills, you would not have been granted an interview:';
								}else if (limit_score==0.0){
									document.getElementById("new_score_text").innerHTML='With the following skills, you would have been granted an interview:';
								}

								// Setting the values of the different range bars and setting up the textual answers
								document.getElementById("current_score_text").innerHTML='Your current skills in IT are:';
								document.getElementById("current_score").value=current_score;
								document.getElementById("new_score").value=new_score;
								document.getElementById("output_current_score").innerHTML=current_score;
								document.getElementById("output_new_score").innerHTML=new_score;
								document.getElementById("output_current_score").style.left=(-310+Number(current_score)).toString()+'px';
								document.getElementById("output_new_score").style.left=(-310+Number(new_score)).toString()+'px';

								//Displays the pop-up window
								document.getElementById("pop-range").style.display = 'block';

							// If answer2==null, this means that modifying the feature cannot change the outcome of the system, and less has to be displayed
							}else{

								//Displaying blocks containing the answer
								document.getElementById("unchange1").style.display = 'block';
								document.getElementById("unchange2").style.display = 'block';
								document.getElementById("unchange3").style.display = 'block';
								document.getElementById("unchange4").style.display = 'block';
								document.getElementById("unchange5").style.display = 'block';
								document.getElementById("unchange6").style.display = 'block';
								document.getElementById("unchange7").style.display = 'block';

								//Positioning and displaying additional information for candidates
								document.getElementById("approximation").style.left = (40).toString()+'px';
								document.getElementById("approximation").style.top = (180).toString()+"px";
								document.getElementById("approximation").style.display = 'block';

								document.getElementById("precision_unique").style.left = (40).toString()+'px';
								document.getElementById("precision_unique").style.top = (515).toString()+"px";
								document.getElementById("precision_unique").style.display = 'block';


								//Displaying the pop-up window and setting up the answer
								document.getElementById("pop-text").innerHTML = answer;
								document.getElementById("pop-text").style.display = 'block';
							}

								

						// If the candidate asked a question about Development Skills								
						}else if(question_feature=='Development Skills'){

								// This part deals with the display and look of the pop-up window
								//Setting the names of the Development Skills sub-skills
								document.getElementById("title_feature_1").innerHTML='Java';
								document.getElementById("title_feature_2").innerHTML='Javascript';
								document.getElementById("title_feature_3").innerHTML='CSS';
								document.getElementById("title_feature_4").innerHTML='HTML';
								document.getElementById("title_feature_5").innerHTML='Software Dev.';
								document.getElementById("title_feature_6").innerHTML='C++';
								document.getElementById("title_feature_7").innerHTML='Web Dev.';

								//Positionning the sub-skills block
								document.getElementById("feature_1").style.left = (40).toString()+'px';
								document.getElementById("feature_1").style.top = (260).toString()+"px";

								document.getElementById("feature_2").style.left = (200).toString()+'px';
								document.getElementById("feature_2").style.top = (260).toString()+"px";

								document.getElementById("feature_3").style.left = (360).toString()+'px';
								document.getElementById("feature_3").style.top = (260).toString()+"px";

								document.getElementById("feature_4").style.left = (520).toString()+'px';
								document.getElementById("feature_4").style.top = (260).toString()+"px";

								document.getElementById("feature_5").style.left = (680).toString()+'px';
								document.getElementById("feature_5").style.top = (260).toString()+"px";

								document.getElementById("feature_6").style.left = (840).toString()+'px';
								document.getElementById("feature_6").style.top = (260).toString()+"px";
	
								document.getElementById("feature_7").style.left = (1000).toString()+'px';
								document.getElementById("feature_7").style.top = (260).toString()+"px";
								
								//Displaying the sub-skill blocks
								document.getElementById("feature_1").style.display = 'block';
								document.getElementById("feature_2").style.display = 'block';
								document.getElementById("feature_3").style.display = 'block';
								document.getElementById("feature_4").style.display = 'block';
								document.getElementById("feature_5").style.display = 'block';
								document.getElementById("feature_6").style.display = 'block';
								document.getElementById("feature_7").style.display = 'block';

								//Display the "More Detail" button
								document.getElementById("details").style.display = 'block';

								// If answer2==null, this means that modifying the feature cannot change the outcome of the system, and less has to be displayed
								if(answer2!=null){

									//This part sets the range bars showing the candidate how he could change the outcome of the system
									//Displaying the blocks containing the answer
									document.getElementById("change1").style.display = 'block';
									document.getElementById("change2").style.display = 'block';
									document.getElementById("change3").style.display = 'block';
									document.getElementById("change4").style.display = 'block';
									document.getElementById("change5").style.display = 'block';
									document.getElementById("change6").style.display = 'block';
									document.getElementById("change7").style.display = 'block';

									document.getElementById("new_feature_1").style.display = 'block';
									document.getElementById("new_feature_2").style.display = 'block';
									document.getElementById("new_feature_3").style.display = 'block';
									document.getElementById("new_feature_4").style.display = 'block';
									document.getElementById("new_feature_5").style.display = 'block';
									document.getElementById("new_feature_6").style.display = 'block';
									document.getElementById("new_feature_7").style.display = 'block';

									document.getElementById("output_new_feature_1").style.display = 'block';
									document.getElementById("output_new_feature_2").style.display = 'block';
									document.getElementById("output_new_feature_3").style.display = 'block';
									document.getElementById("output_new_feature_4").style.display = 'block';
									document.getElementById("output_new_feature_5").style.display = 'block';
									document.getElementById("output_new_feature_6").style.display = 'block';
									document.getElementById("output_new_feature_7").style.display = 'block';

									//Positioning and displaying additional information for candidates
									document.getElementById("precision").style.left = (40).toString()+'px';
									document.getElementById("precision").style.top = (515).toString()+"px";
									document.getElementById("precision").style.display = 'block';

									//"limit_score" indicates whether the change will grant the candidate an interview or if he would be rejected
									//setting up the answer
									if(limit_score==1.0){
										document.getElementById("new_score_text").innerHTML='With the following skills, you would not have been granted an interview:';
									}else if (limit_score==0.0){
										document.getElementById("new_score_text").innerHTML='With the following skills, you would have been granted an interview:';
									}

									// Setting the values of the different range bars and the textual answers
									document.getElementById("current_score_text").innerHTML='Your current skills in Development are:';
									document.getElementById("current_score").value=current_score;
									document.getElementById("new_score").value=new_score;
									document.getElementById("output_current_score").innerHTML=current_score;
									document.getElementById("output_new_score").innerHTML=new_score;
									document.getElementById("output_current_score").style.left=(-310+Number(current_score)).toString()+'px';
									document.getElementById("output_new_score").style.left=(-310+Number(new_score)).toString()+'px';

									//Displays the pop-up window
									document.getElementById("pop-range").style.display = 'block';

								// If answer2==null, this means that modifying the feature cannot change the outcome of the system, and less has to be displayed
								}else{

									//displaying blocks containing the answer
									document.getElementById("unchange1").style.display = 'block';
									document.getElementById("unchange2").style.display = 'block';
									document.getElementById("unchange3").style.display = 'block';
									document.getElementById("unchange4").style.display = 'block';
									document.getElementById("unchange5").style.display = 'block';
									document.getElementById("unchange6").style.display = 'block';
									document.getElementById("unchange7").style.display = 'block';

									//Positioning and displaying additional information to candidates
									document.getElementById("approximation").style.left = (40).toString()+'px';
									document.getElementById("approximation").style.top = (180).toString()+"px";
									document.getElementById("approximation").style.display = 'block';

									document.getElementById("precision_unique").style.left = (40).toString()+'px';
									document.getElementById("precision_unique").style.top = (515).toString()+"px";
									document.getElementById("precision_unique").style.display = 'block';


									//Displaying the pop-up window and setting up the answer
									document.getElementById("pop-text").innerHTML = answer;
									document.getElementById("pop-text").style.display = 'block';

								}

								

								
						// If the candidate asked a question about IT Project Management						
						}else if(question_feature=='IT Project Management'){

								// This part deals with the display and look of the pop-up window
								//Setting the names of the IT project Management sub-skills
								document.getElementById("title_feature_1").innerHTML='Agile';
								document.getElementById("title_feature_2").innerHTML='Schedules';
								document.getElementById("title_feature_3").innerHTML='Project Planning';
								document.getElementById("title_feature_4").innerHTML='Quality';
								document.getElementById("title_feature_5").innerHTML='Troubleshooting';
								document.getElementById("title_feature_6").innerHTML='Cost Management';

								//Positioning the different sub-skill blocks
								document.getElementById("feature_1").style.left = (80).toString()+'px';
								document.getElementById("feature_1").style.top = (260).toString()+"px";

								document.getElementById("feature_2").style.left = (240).toString()+'px';
								document.getElementById("feature_2").style.top = (260).toString()+"px";

								document.getElementById("feature_3").style.left = (400).toString()+'px';
								document.getElementById("feature_3").style.top = (260).toString()+"px";

								document.getElementById("feature_4").style.left = (560).toString()+'px';
								document.getElementById("feature_4").style.top = (260).toString()+"px";

								document.getElementById("feature_5").style.left = (720).toString()+'px';
								document.getElementById("feature_5").style.top = (260).toString()+"px";

								document.getElementById("feature_6").style.left = (880).toString()+'px';
								document.getElementById("feature_6").style.top = (260).toString()+"px";
								
								//Displaying the different sub-skill blocks
								document.getElementById("feature_1").style.display = 'block';
								document.getElementById("feature_2").style.display = 'block';
								document.getElementById("feature_3").style.display = 'block';
								document.getElementById("feature_4").style.display = 'block';
								document.getElementById("feature_5").style.display = 'block';
								document.getElementById("feature_6").style.display = 'block';

								// Display the "More detail" button
								document.getElementById("details").style.display = 'block';

								// If answer2==null, this means that modifying the feature cannot change the outcome of the system, and less has to be displayed
								if(answer2!=null){

									//This part displays the range bars showing the candidate how he could change the outcome of the system
									//Displaying the blocks containg the answer
									document.getElementById("change1").style.display = 'block';
									document.getElementById("change2").style.display = 'block';
									document.getElementById("change3").style.display = 'block';
									document.getElementById("change4").style.display = 'block';
									document.getElementById("change5").style.display = 'block';
									document.getElementById("change6").style.display = 'block';
									document.getElementById("change7").style.display = 'block';

									document.getElementById("new_feature_1").style.display = 'block';
									document.getElementById("new_feature_2").style.display = 'block';
									document.getElementById("new_feature_3").style.display = 'block';
									document.getElementById("new_feature_4").style.display = 'block';
									document.getElementById("new_feature_5").style.display = 'block';
									document.getElementById("new_feature_6").style.display = 'block';
									document.getElementById("new_feature_7").style.display = 'block';

									document.getElementById("output_new_feature_1").style.display = 'block';
									document.getElementById("output_new_feature_2").style.display = 'block';
									document.getElementById("output_new_feature_3").style.display = 'block';
									document.getElementById("output_new_feature_4").style.display = 'block';
									document.getElementById("output_new_feature_5").style.display = 'block';
									document.getElementById("output_new_feature_6").style.display = 'block';
									document.getElementById("output_new_feature_7").style.display = 'block';

									//Positioning and displaying additional information for applicants
									document.getElementById("precision").style.left = (40).toString()+'px';
									document.getElementById("precision").style.top = (515).toString()+"px";
									document.getElementById("precision").style.display = 'block';

									//"limit_score" indicates whether the change will grant the candidate an interview or if he would be rejected
									//setting up the answer
									if(limit_score==1.0){
										document.getElementById("new_score_text").innerHTML='With the following skills, you would not have been granted an interview:';
									}else if (limit_score==0.0){
										document.getElementById("new_score_text").innerHTML='With the following skills, you would have been granted an interview:';
									}

									// Setting the values of the different range bars and the tewtual answers
									document.getElementById("current_score_text").innerHTML='Your current skills in IT Project Management are:';
									document.getElementById("current_score").value=current_score;
									document.getElementById("new_score").value=new_score;
									document.getElementById("output_current_score").innerHTML=current_score;
									document.getElementById("output_new_score").innerHTML=new_score;
									document.getElementById("output_current_score").style.left=(-310+Number(current_score)).toString()+'px';
									document.getElementById("output_new_score").style.left=(-310+Number(new_score)).toString()+'px';

									//Displays the pop-up window
									document.getElementById("pop-range").style.display = 'block';

								// If answer2==null, this means that modifying the feature cannot change the outcome of the system, and less has to be displayed	
								}else{
									//Displaying blocks containing the answer
									document.getElementById("unchange1").style.display = 'block';
									document.getElementById("unchange2").style.display = 'block';
									document.getElementById("unchange3").style.display = 'block';
									document.getElementById("unchange4").style.display = 'block';
									document.getElementById("unchange5").style.display = 'block';
									document.getElementById("unchange6").style.display = 'block';
									document.getElementById("unchange7").style.display = 'block';

									//Positioning and displaying additional information for participants
									document.getElementById("approximation").style.left = (40).toString()+'px';
									document.getElementById("approximation").style.top = (180).toString()+"px";
									document.getElementById("approximation").style.display = 'block';

									document.getElementById("precision_unique").style.left = (40).toString()+'px';
									document.getElementById("precision_unique").style.top = (515).toString()+"px";
									document.getElementById("precision_unique").style.display = 'block';


									//Displaying the pop-up window and setting the answer 
									document.getElementById("pop-text").innerHTML = answer;
									document.getElementById("pop-text").style.display = 'block';
								}

								

								
						
						// If the candidate asked a question about Interpersonal SKills						
						}else if(question_feature=='Interpersonal Skills'){

								// This part deals with the display and look of the pop-up window
								//Setting the name of each Interpersonal sub-skills
								document.getElementById("title_feature_1").innerHTML='Teamwork';
								document.getElementById("title_feature_2").innerHTML='Leadership';
								document.getElementById("title_feature_3").innerHTML='Team Building';
								document.getElementById("title_feature_4").innerHTML='Public Speaking';
								document.getElementById("title_feature_5").innerHTML='Writing';
								document.getElementById("title_feature_6").innerHTML='Presentations';

								//Positioning the sub-skill blocks
								document.getElementById("feature_1").style.left = (80).toString()+'px';
								document.getElementById("feature_1").style.top = (260).toString()+"px";

								document.getElementById("feature_2").style.left = (240).toString()+'px';
								document.getElementById("feature_2").style.top = (260).toString()+"px";

								document.getElementById("feature_3").style.left = (400).toString()+'px';
								document.getElementById("feature_3").style.top = (260).toString()+"px";

								document.getElementById("feature_4").style.left = (560).toString()+'px';
								document.getElementById("feature_4").style.top = (260).toString()+"px";

								document.getElementById("feature_5").style.left = (720).toString()+'px';
								document.getElementById("feature_5").style.top = (260).toString()+"px";

								document.getElementById("feature_6").style.left = (880).toString()+'px';
								document.getElementById("feature_6").style.top = (260).toString()+"px";
								

								//Displaying the sub-skills block
								document.getElementById("feature_1").style.display = 'block';
								document.getElementById("feature_2").style.display = 'block';
								document.getElementById("feature_3").style.display = 'block';
								document.getElementById("feature_4").style.display = 'block';
								document.getElementById("feature_5").style.display = 'block';
								document.getElementById("feature_6").style.display = 'block';

								//Displays the "More Detail" button
								document.getElementById("details").style.display = 'block';

								//If it is possible to change the outcome of the system
								if(answer2!=null){

									//This part displays the range bars showing the candidate how he could change the outcome of the system
									//Displaying the blocks containing the answers
									document.getElementById("change1").style.display = 'block';
									document.getElementById("change2").style.display = 'block';
									document.getElementById("change3").style.display = 'block';
									document.getElementById("change4").style.display = 'block';
									document.getElementById("change5").style.display = 'block';
									document.getElementById("change6").style.display = 'block';
									document.getElementById("change7").style.display = 'block';

									document.getElementById("new_feature_1").style.display = 'block';
									document.getElementById("new_feature_2").style.display = 'block';
									document.getElementById("new_feature_3").style.display = 'block';
									document.getElementById("new_feature_4").style.display = 'block';
									document.getElementById("new_feature_5").style.display = 'block';
									document.getElementById("new_feature_6").style.display = 'block';
									document.getElementById("new_feature_7").style.display = 'block';

									document.getElementById("output_new_feature_1").style.display = 'block';
									document.getElementById("output_new_feature_2").style.display = 'block';
									document.getElementById("output_new_feature_3").style.display = 'block';
									document.getElementById("output_new_feature_4").style.display = 'block';
									document.getElementById("output_new_feature_5").style.display = 'block';
									document.getElementById("output_new_feature_6").style.display = 'block';
									document.getElementById("output_new_feature_7").style.display = 'block';

									//Positioning and displaying for participant additional information
									document.getElementById("precision").style.left = (40).toString()+'px';
									document.getElementById("precision").style.top = (515).toString()+"px";
									document.getElementById("precision").style.display = 'block';

									//"limit_score" indicates whether the change will grant the candidate an interview or if he would be rejected
									//setting up the answer
									if(limit_score==1.0){
										document.getElementById("new_score_text").innerHTML='With the following skills, you would not have been granted an interview:';
									}else if (limit_score==0.0){
										document.getElementById("new_score_text").innerHTML='With the following skills, you would have been granted an interview:';
									}

									// Setting the values of the different range bars and the textual answers
									document.getElementById("current_score_text").innerHTML='Your current Interpersonal Skills are:';
									document.getElementById("current_score").value=current_score;
									document.getElementById("new_score").value=new_score;
									document.getElementById("output_current_score").innerHTML=current_score;
									document.getElementById("output_new_score").innerHTML=new_score;
									document.getElementById("output_current_score").style.left=(-310+Number(current_score)).toString()+'px';
									document.getElementById("output_new_score").style.left=(-310+Number(new_score)).toString()+'px';

									//Displays the pop-up window
									document.getElementById("pop-range").style.display = 'block';

									//For non-Boolean features, only a textual information is provided and candidates cannot get more information
								}else{

									//Displaying the blocks containing the answer
									document.getElementById("unchange1").style.display = 'block';
									document.getElementById("unchange2").style.display = 'block';
									document.getElementById("unchange3").style.display = 'block';
									document.getElementById("unchange4").style.display = 'block';
									document.getElementById("unchange5").style.display = 'block';
									document.getElementById("unchange6").style.display = 'block';
									document.getElementById("unchange7").style.display = 'block';

									//Positioning and displaying additional information for participants
									document.getElementById("approximation").style.left = (40).toString()+'px';
									document.getElementById("approximation").style.top = (180).toString()+"px";
									document.getElementById("approximation").style.display = 'block';

									document.getElementById("precision_unique").style.left = (40).toString()+'px';
									document.getElementById("precision_unique").style.top = (515).toString()+"px";
									document.getElementById("precision_unique").style.display = 'block';

									//Displaying the pop-up window and setting the answer
									document.getElementById("pop-text").innerHTML = answer;
									document.getElementById("pop-text").style.display = 'block';
								}
								


						// If the candidate asked a question about Sport						
						}else if(question_feature=='Sport' && model_name=='3'){	

								// This part deals with the display and look of the pop-up window
								//Setting the title of each Sport
								document.getElementById("title_feature_1").innerHTML='Rugby';
								document.getElementById("title_feature_2").innerHTML='Football';
								document.getElementById("title_feature_3").innerHTML='Boxing';
								document.getElementById("title_feature_4").innerHTML='Basketball';
								document.getElementById("title_feature_5").innerHTML='Athletism';
								document.getElementById("title_feature_6").innerHTML='Gymnastic';
								document.getElementById("title_feature_7").innerHTML='Other';

								//Setting the position of each Sport block
								document.getElementById("feature_1").style.left = (40).toString()+'px';
								document.getElementById("feature_1").style.top = (260).toString()+"px";

								document.getElementById("feature_2").style.left = (200).toString()+'px';
								document.getElementById("feature_2").style.top = (260).toString()+"px";

								document.getElementById("feature_3").style.left = (360).toString()+'px';
								document.getElementById("feature_3").style.top = (260).toString()+"px";

								document.getElementById("feature_4").style.left = (520).toString()+'px';
								document.getElementById("feature_4").style.top = (260).toString()+"px";

								document.getElementById("feature_5").style.left = (680).toString()+'px';
								document.getElementById("feature_5").style.top = (260).toString()+"px";

								document.getElementById("feature_6").style.left = (840).toString()+'px';
								document.getElementById("feature_6").style.top = (260).toString()+"px";
	
								document.getElementById("feature_7").style.left = (1000).toString()+'px';
								document.getElementById("feature_7").style.top = (260).toString()+"px";

								//Displaying each Sport block
								document.getElementById("feature_1").style.display = 'block';
								document.getElementById("feature_2").style.display = 'block';
								document.getElementById("feature_3").style.display = 'block';
								document.getElementById("feature_4").style.display = 'block';
								document.getElementById("feature_5").style.display = 'block';
								document.getElementById("feature_6").style.display = 'block';
								document.getElementById("feature_7").style.display = 'block';

								//Display the "More Detail" Button
								document.getElementById("details").style.display = 'block';

								// If answer2==null, this means that modifying the feature cannot change the outcome of the system, and less has to be displayed
								if(answer2!=null){

									//This part displays the range bars showing the candidate how he could change the outcome of the system
									//The blocks holding the answer are displayed
									document.getElementById("change1").style.display = 'block';
									document.getElementById("change2").style.display = 'block';
									document.getElementById("change3").style.display = 'block';
									document.getElementById("change4").style.display = 'block';
									document.getElementById("change5").style.display = 'block';
									document.getElementById("change6").style.display = 'block';
									document.getElementById("change7").style.display = 'block';

									//Setting the position and displaying additional information for participants
									document.getElementById("precision").style.left = (40).toString()+'px';
									document.getElementById("precision").style.top = (515).toString()+"px";
									document.getElementById("precision").style.display = 'block';

									//"limit_score" indicates whether the change will grant the candidate an interview or if he would be rejected
									//setting up the answer
									if(limit_score==1.0){
										document.getElementById("new_score_text").innerHTML='With the following profile, you would not have been granted an interview:';
									}else if (limit_score==0.0){
										document.getElementById("new_score_text").innerHTML='With the following profile, you would have been granted an interview:';
									}

									// Setting the values of the different range bars and the textual answers
									document.getElementById("current_score_text").innerHTML='Your current profile in sport is the following:';
									document.getElementById("current_score").value=current_score;
									document.getElementById("new_score").value=new_score;
									document.getElementById("output_current_score").innerHTML=current_score;
									document.getElementById("output_new_score").innerHTML=new_score;
									document.getElementById("output_current_score").style.left=(-310+Number(current_score)).toString()+'px';
									document.getElementById("output_new_score").style.left=(-310+Number(new_score)).toString()+'px';

									//Displays the pop-up window
									document.getElementById("pop-range").style.display = 'block';

									// If answer2==null, this means that modifying the feature cannot change the outcome of the system, and less has to be displayed
								}else{

									//The block holding the text are displayed
									document.getElementById("unchange1").style.display = 'block';
									document.getElementById("unchange2").style.display = 'block';
									document.getElementById("unchange3").style.display = 'block';
									document.getElementById("unchange4").style.display = 'block';
									document.getElementById("unchange5").style.display = 'block';
									document.getElementById("unchange6").style.display = 'block';
									document.getElementById("unchange7").style.display = 'block';

									//Displaying and setting position of additional information for participants
									document.getElementById("approximation").style.left = (40).toString()+'px';
									document.getElementById("approximation").style.top = (180).toString()+"px";
									document.getElementById("approximation").style.display = 'block';

									document.getElementById("precision_unique").style.left = (40).toString()+'px';
									document.getElementById("precision_unique").style.top = (515).toString()+"px";
									document.getElementById("precision_unique").style.display = 'block';


									//Displays the pop-up window and sets the answer
									document.getElementById("pop-text").innerHTML = answer;
									document.getElementById("pop-text").style.display = 'block';

								}
								
							

						//Non-Boolean features. Only a sentence is displayed, and candidates cannot get more detail
						}else{
									//The blocks holding the answer are displayed
									document.getElementById("unchange1").style.display = 'block';
									document.getElementById("unchange2").style.display = 'block';
									document.getElementById("unchange3").style.display = 'block';
									document.getElementById("unchange4").style.display = 'block';
									document.getElementById("unchange5").style.display = 'block';
									document.getElementById("unchange6").style.display = 'block';
									document.getElementById("unchange7").style.display = 'block';

									//Additional Information for candidates
									document.getElementById("precision_unique").style.left = (40).toString()+'px';
									document.getElementById("precision_unique").style.top = (515).toString()+"px";
									document.getElementById("precision_unique").style.display = 'block';

									//Displays the pop-up window and sets the answer
									document.getElementById("pop-text").innerHTML = answer;
									document.getElementById("pop-text").style.display = 'block';

								}
					

							// open the pop-up window
							document.getElementById("pop-up").classList.add("open");
						})
  			},

  			// Close the pop-up window
  			close : function () {
  			// close() : close the popup
  				document.getElementById("details").style.display = 'none';
  				document.getElementById("pop-range").style.display = 'none';
  				document.getElementById("pop-text").style.display = 'none';

				document.getElementById("feature_1").style.display = 'none';
				document.getElementById("feature_2").style.display = 'none';
				document.getElementById("feature_3").style.display = 'none';
				document.getElementById("feature_4").style.display = 'none';
				document.getElementById("feature_5").style.display = 'none';
				document.getElementById("feature_6").style.display = 'none';
				document.getElementById("feature_7").style.display = 'none';

  			

  		  		document.getElementById("pop-up").classList.remove("open");
 			 }
			};

var help_pop = {
				//opens the Help pop-up windows for additional precisions
  				open : function (skill) {

				document.getElementById("pop-text").style.color="#686868";

  					
				if(skill=='Python'){
					document.getElementById("pop-text").innerHTML = 'Python is an interpreted, high-level, general-purpose programming language. It supports multiple programming paradigms, including structured, object-oriented, and functional programming. ';
				}else if(skill=='SQL'){
					document.getElementById("pop-text").innerHTML = 'SQL is a domain-specific language used in programming and designed for managing data held in a relational database management system, or for stream processing in a relational data stream management system. ';
				}else if(skill=='No SQL'){
					document.getElementById("pop-text").innerHTML = 'NoSQL is a domain-specific language used in programming and designed for managing data held in non-relational database.';
				}else if(skill=='Microsoft Excel'){
					document.getElementById("pop-text").innerHTML = 'Microsoft Excel is a spreadsheet developed by Microsoft for Windows, macOS, Android and iOS. It features calculation, graphing tools, pivot tables, and a macro programming language called Visual Basic for Applications. ';
				}else if(skill=='Matlab'){
					document.getElementById("pop-text").innerHTML = 'MATLAB is a numerical computing environment and proprietary programming language developed by MathWorks. MATLAB allows matrix manipulations, plotting of functions and data, implementation of algorithms, creation of user interfaces, and interfacing with programs written in other languages.';
				}else if(skill=='Database'){
					document.getElementById("pop-text").innerHTML = ' A database is an organized collection of data, generally stored and accessed electronically from a computer system. We want to know your ability to manage a database, a large set of structured data, and run operations on the database.';
				}else if(skill=='Data Visualisation'){
					document.getElementById("pop-text").innerHTML = 'Data visualisation is the graphic representation of data. It involves producing images that communicate relationships among the represented data to viewers of the images.';
				}else if(skill=='Linux'){
					document.getElementById("pop-text").innerHTML = 'Linux is a family of open source Unix-like operating systems.';
				}else if(skill=='Windows'){
					document.getElementById("pop-text").innerHTML = 'Windows is a group of several proprietary graphical operating system families, all of which are developed and marketed by Microsoft.';
				}else if(skill=='Mac'){
					document.getElementById("pop-text").innerHTML = 'Operating system developed by Apple.';
				}else if(skill=='Cloud'){
					document.getElementById("pop-text").innerHTML = 'Cloud management is the management of cloud computing products and services.';
				}else if(skill=='Modems'){
					document.getElementById("pop-text").innerHTML = 'A wireless router is a device that performs the functions of a router and also includes the functions of a wireless access point. It is used to provide access to the Internet or a private computer network.<br/> A modem is a hardware device that converts data into a format suitable for a transmission medium so that it can be transmitted from one computer to another.';
				}else if(skill=='Cybersecurity'){
					document.getElementById("pop-text").innerHTML = 'Protection of computer systems and networks from the theft or damage to their hardware, software, or electronic data, as well as from the disruption or misdirection of the services they provide.';
				}else if(skill=='IP'){
					document.getElementById("pop-text").innerHTML = 'Setting up and configuring a network.';
				}else if(skill=='Agile'){
					document.getElementById("pop-text").innerHTML = 'Agile approaches develop requirements and solutions through the collaborative effort of a cross-functional team and its customer(s)/end user(s). It advocates adaptive planning, evolutionary development, early delivery, and continual improvement, and it encourages flexible responses to change.';
				}else if(skill=='Schedules'){
					document.getElementById("pop-text").innerHTML = 'Ability to manage and comply with schedules.';
				}else if(skill=='Planning'){
					document.getElementById("pop-text").innerHTML = 'Project planning is part of project management, which relates to the use of schedules to plan and subsequently report progress within the project environment.';
				}else if(skill=='Quality'){
					document.getElementById("pop-text").innerHTML = 'Quality management ensures that an organization, product or service is consistent. Quality management is focused not only on product and service quality, but also on the means to achieve it. ';
				}else if(skill=='Troubleshooting'){
					document.getElementById("pop-text").innerHTML = 'Your ability to solve problems.';
				}else if(skill=='Cost'){
					document.getElementById("pop-text").innerHTML = 'Your ability to manage a budget and the cost of a project.';
				}else if(skill=='Cpp'){
					document.getElementById("pop-text").innerHTML = 'C++ is one of the most widely used programming languages for applications.';
				}else if(skill=='Java'){
					document.getElementById("pop-text").innerHTML = 'Java is a general-purpose programming language, intended for application developers.';
				}else if(skill=='Javascript'){
					document.getElementById("pop-text").innerHTML = 'JavaScript is a programming language. Alongside HTML and CSS, JavaScript is one of the core technologies of the Web. JavaScript enables interactive web pages and is an essential part of web applications.';
				}else if(skill=='HTML'){
					document.getElementById("pop-text").innerHTML = 'HTML is the standard markup language for documents designed to be displayed in a web browser.';
				}else if(skill=='CSS'){
					document.getElementById("pop-text").innerHTML = 'CSS is a style sheet language used for describing the presentation of a document written in a markup language like HTML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript.';
				}else if(skill=='Web'){
					document.getElementById("pop-text").innerHTML = 'Web development is the work involved in developing a website for the Internet or an intranet.';
				}else if(skill=='Software'){
					document.getElementById("pop-text").innerHTML = 'Software development is the process of conceiving, specifying, designing, programming, documenting, testing, and bug fixing involved in creating and maintaining applications, and software components.';
				}else if(skill=='Teamwork'){
					document.getElementById("pop-text").innerHTML = 'Your ability to work in a team.';
				}else if(skill=='Leadership'){
					document.getElementById("pop-text").innerHTML = 'Your ability of being in control and direct a group of people. ';
				}else if(skill=='Team Building'){
					document.getElementById("pop-text").innerHTML = 'Your ability to encourage members of a group to work well together.';
				}else if(skill=='Public Speaking'){
					document.getElementById("pop-text").innerHTML = 'Your ability to speak in public.';
				}else if(skill=='Writing'){
					document.getElementById("pop-text").innerHTML = 'Ability to communicate through writing.';
				}else if(skill=='Presentations'){
					document.getElementById("pop-text").innerHTML = 'Your ability to make presentations in front of an audience.';
				}else if(skill=='Veteran'){
					document.getElementById("pop-text").innerHTML = "If you are a veteran of the UK army. <br/> Strategion was created by veterans of the UK army, and former military fit well in our company. Faithful to our traditions, we keep promoting the employement of veterans.";
				}else if(skill=='Disability'){
					document.getElementById("pop-text").innerHTML = "If you have a disability. <br/> In the UK, under the Equality Act 2010, positive discrimination for candidates with disability is allowed, \
					At Strategeion, our motto is Leving no one behind, this is why we try to promote the employement of candidates with disabilities.";
				}else if(skill=='Volunteering'){
					document.getElementById("pop-text").innerHTML = 'If you have ever been doing volunteering in the past. <br/> Strategeion cares about having a positive impact on communities and is a company dedicated to others. Candidates who have been doing volunteering fit and grow well in our company.';
				}else if(skill=='Profile'){
					document.getElementById("pop-text").innerHTML = '<b>The Candidate Profile you will create does not have to be your real skills. You can invent it. <br/><br/> Please, in order to make the most of our system and study, try to build a realistic Candidate Profile.<br/><br/> Avoid saying that you have some skills in all categories. Likewise avoid saying that you do not possess any skills. It is more realistic to say that you possess some skills in some categories and none in the others.</b>';
					document.getElementById("pop-text").style.color="#b30000";
				}else if(skill=='Warning'){
					document.getElementById("pop-text").innerHTML = '<b>You need to have some skills in at least one of the following categories in order to apply: Data Science, IT, Development, IT Project Management, or Interpersonal Skills. <br/><br/>Please create a Candidate Profile that matches this constraint.</b>';
					document.getElementById("pop-text").style.color="#b30000";
				}						
					
					document.getElementById("pop-up").classList.add("open");
						
  			},

  			close : function () {
  			// close() : close the popup
  		 		document.getElementById("pop-up").classList.remove("open");
 			 }
	};

