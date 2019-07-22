/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
****/
// PRIVATE
var htm="Clears the message console";

// MIXINS
$.extend(exports, require("../command"));

// PUBLIC
// required funcitons for command modules
exports.allowed=["cadbah", "caddeley"];
exports.engineTypes=["babylonjs","paperjs"];
exports.name="clear";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){
	CAD.console$.empty();
	//Return leftover argstr for further processing
	return argstr;
};


