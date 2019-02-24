/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

//required exports for any command
exports.desc="Zoom tool:\nzoom rect <press-move-release>\t";
exports.desc+="Zooms to part of scene indicated by pointer";
exports.name="zoom";
exports.action=function(CAD, argstr, callback){
	switch(argstr.toLowerCase()){
		case "r":
		case "rect": CAD.workspace.zoomer.zoomRect(callback);
		break;
		default:		
	}
};


