/*** CADbah - Copyright (c) 2019 Andrew Siddeley - MIT License ***/
// PRIVATE
var htm="Lists all available commands";

// MIXINS
$.extend(exports, require("./command"));

// PUBLIC
// required funcitons for command modules
exports.name="dir";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){
	var cobs=CAD.commander.getCommands();
	var htm="<h3>Directory</h3><ol>";
	for (var i=0; i<cobs.length; i++){
		htm+="<li>"+cobs[i].name+"</li>";
	};
	CAD.msg(htm+"</ol><hr>");
};


