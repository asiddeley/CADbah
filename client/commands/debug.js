/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
****/
// PRIVATE
var htm="Controls wheter debugging messages are shown<br>"+
"&gt; debug show<br>"+
"shows debugging messages<br>"+
"&gt; debug hide<br>"+
"hides debugging messages";

// MIXINS
$.extend(exports, require("./command"));

// PUBLIC
// required funcitons for command modules
exports.name="debug";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){
	switch(argstr.toLowerCase()){
		case "show": $(".cad-debug").show(); break;
		case "hide": $(".cad-debug").hide(); break;
		default: $(".cad-debug").show();
	}
};


