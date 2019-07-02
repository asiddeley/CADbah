/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
// PRIVATE
var CAD;
var htm="Controls zooming and panning for navigating to parts of the drawing<br>"+
"&gt;zoom rect [mouse press-move-release]<br>"+
"Zoom to part of scene indicated by mouse<br>"+
"&gt;zoom extents<br>"+
"Zooms to the full extent of the drawing";

function actionForCadbah(CAD, argstr){
	switch(argstr.toLowerCase()){
		case "r":
		case "rect": 
			//CAD.workspace.zoomer.zoomRect(callback);
			try { CAD.workspace.getTool("zoomer").zoomRect();}
			catch(er){CAD.debug("zoom command error...",er);}
		break;
		
		case "extents": 
			//CAD.workspace.zoomer.zoomRect(callback);
			try { 
				CAD.workspace.getTool("zoomer").zoomExtents();
			}
			catch(er){CAD.debug("zoom command error...",er);}
		break;
	
		default:		
	}
};

function actionForCaddeley(CAD, argstr){
	switch(argstr.toLowerCase()){
		case "r":
		case "rect": CAD.debug("zoom rectangle not available");
		break;
		
		case "extents": 
			//CAD.workspace.zoomer.zoomRect(callback);
			try { 
				CAD.graphics.wipe(CAD.gc);
				CAD.graphics.fit(CAD.gc, CAD.drawing.getBounds());
				CAD.drawing.data.setGC(CAD.gc);
			}
			catch(er){CAD.debug("zoom command error...",er);}
		break;
	
		default:		
	}
};






// MIXINS
$.extend(exports, require("../command"));

// PUBLIC
// overrides
exports.allowed=["cadbah", "caddeley"];
exports.name="zoom";
exports.help=function(CAD){return htm;};

/**
action executes the zoom command 
@param {object} CAD CADbah library
@param {string} argstr arguments for the zoom command
@param {function} optional callback to force additional user input
@returns nil
**/
exports.action=function(CAD, argstr){
	switch(CAD.appname){		
		case "cadbah": actionForCadbah(CAD, argstr); break;	
		case "caddeley": actionForCaddeley(CAD, argstr); break;		
	}
};


