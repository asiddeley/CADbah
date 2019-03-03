/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
// PRIVATE
var CAD;
var htm="Controls zooming and panning for navigating to parts of the drawing<br>";
htm+="&gt;zoom rect [mouse press-move-release]<br>";
htm+="Zoom to part of scene indicated by mouse<br>";
htm+="&gt;zoom extents<br>";
htm+="Zooms to the full extent of the drawing";

// MIXINS
$.extend(exports, require("./command"));

// PUBLIC
// overrides
exports.name="zoom";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr, callback){
	switch(argstr.toLowerCase()){
		case "r":
		case "rect": 
			//CAD.workspace.zoomer.zoomRect(callback);
			try { CAD.workspace.getTool("zoomer").zoomRect(callback);}
			catch(er){CAD.debug("zoom command...",er);}
		break;
		default:		
	}
};

