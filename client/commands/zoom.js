/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

//required exports for any command
exports.desc="Zoom tool.\n(w)indow\tPick upper left and lower right of area to zoom to";
exports.name="zoom";
exports.action=function(CAD, argstr){

	switch(argstr.toLowerCase()){
		case "r":
		case "rect": CAD.workspace.zoomer.zoomRect(CAD.workspace);
		break;
		default:		
	}
};


