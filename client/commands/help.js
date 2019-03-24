/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
****/
// PRIVATE
var htm="Provides help on a specified command<br>"+
"&gt; help [command]";

// MIXINS
$.extend(exports, require("./command"));

// PUBLIC
// required funcitons for command modules
exports.name="help";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){
	var h, cobs=CAD.commander.getCommands();

	for (var i=0; i<cobs.length; i++){
		if (cobs[i].name==argstr) {
			h="<h3>"+cobs[i].name+"</h3>"+cobs[i].help(CAD)+"<hr>"; 
			break;
		}
	}

	if (!h){
		h=(typeof argstr=="string")?"&gt; '"+argstr+"' is not a valid command<br>":""; 
		h+="<h3>help</h3>"+htm+"<hr>";
	}
	CAD.msg(h);
};


