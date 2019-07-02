/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
// This (singleton) module when activated, manages canvases, contexts and such


// PRIVATE STATIC
//var {Bounds}=require("./bounds.js");

var CAD;
var canvases=[];
//current graphic context
var gc;

function addCanvas(name, bounds){

	//canvas already exists so remove from DOM
	//if (canvases.hasOwnProperty(name)){canvases[name].remove();}
	if (name in canvases){canvases[name].remove();}

	//create new canvas
	var c$;	
	c$=$("<canvas></canvas>").appendTo(CAD.div$);
	c$.attr("width", bounds.width());
	c$.attr("hieght", bounds.height());
	this.canvases[name]=c$;		
	
	return c$.get();
};




// MIXINS
// none

// PUBLIC
exports.activate=function(cadbah){
	CAD=cadbah;	
	gc=addCanvas("0", CAD.drawing.getBounds()).getContext("2d");
}

exports.wipe=function(){
	//resert the graphic context
	gc.resetTransform();
	gc.clearRect(0, 0, gc.canvas.clientWidth, gc.canvas.clientHeight);
	gc.lineWidth=1;
	gc.strokeStyle="black";
}                

exports.fit=function(bounds){
	CAD.debug("fit()...");

	//fit factors (pixels per drawing unit)
	var fx=gc.canvas.clientWidth/bounds.getWidth();
	var fy=gc.canvas.clientHeight/bounds.getHeight();
	var f=(fx<fy)?fx:fy;
	CAD.debug("fit:",f);
	//CAD.debug("PIXEL RATIO:", window.devicePixelRatio);
	
	//first move canvas origin to centre of drawing
	gc.translate(bounds.getCentre(), bounds.getMiddle());
	//then scale to fit drawing units to canvas units 
	gc.scale(f, f);
};



exports.onNewDrawing=function(drawing){
	//delete all canvases
	//add a canvas foreach drawing layer
	
}
	
