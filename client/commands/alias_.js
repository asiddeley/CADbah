/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// Required exports for any command
exports.desc="Aliases are custom command abreviations or shortcuts.\n(c)lear\tClears the current alias list.";
exports.name="alias";
exports.action=function(CAD, argstr){


	switch(argstr.toLowerCase()){
		case "clear": aliases={}; break;
		case "load"
		case "undefined": break; //do nothing
		default:		
	
		
		
	}
};

// This module is writen like a single instantiated class
// Private static members of this module 
var aliases={};
var load=function(){
	
	
};


// Public methods
exports.subst=function(cmd){
	var r=aliases[cmd];
	return (typeof r=="undefined")?cmd:r;
};

