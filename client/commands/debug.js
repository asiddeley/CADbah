/*** CADBAH - Copyright (c) 2019 Andrew Siddeley - MIT License ***/
// PRIVATE
var htm="Controls wheter debugging messages are shown<br>"+
"&gt;debug show<br>"+
"shows debugging messages<br>"+
"&gt;debug hide<br>"+
"hides debugging messages";

// MIXINS
$.extend(exports, require("../command"));

// PUBLIC
// required funcitons for command modules
exports.allowed=["cadbah", "caddeley"];
exports.name="debug";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){
	//change the contents of <style> </style> 
	var bug$=$("#cad-debug-style");
	if (bug$.length==0){
		CAD.debug("missing style tag (id='cad-debug-style')");
		return;
	}
	switch(argstr.toLowerCase()){
		case "show": 
			//$(".cad-debug").show(); 
			bug$.html(bug$.html().replace("display:none","display:block"));
		break;
		case "hide": 
			//$(".cad-debug").hide(); 
			bug$.html(bug$.html().replace("display:block","display:none"));
		break;
		default: 
			//$(".cad-debug").show();
			bug$.html(bug$.html().replace("display:none","display:block"));
	}
	CAD.console.scrollTop=CAD.console.scrollHeight;
};


