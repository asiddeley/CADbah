/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// PRIVATE STATIC

var entity=require("../entity.js");

//line data constructor
function Line(){
	/* Constructor of an object identical to applicable object created by dxf-parser node library */
	
	//inherit common entity stuff
	Object.assign(this, entity.create());
	
	//override entity.type="entity" 
	this.type="line";
	
}

// MIXINS
$.extend(exports, entity);
//var Nameable=require('./features/Nameable'); 
//var Position=require('./features/Position'); 
//var Pickable=require('./features/Pickable');

// PUBLIC
exports.activate=function(drawing){
	//Meant to be called once (by drawing module) to activate this module
	//other modules that may require this module don't need to activate it.
	this.drawing=drawing;
};

exports.create=function(options){
	return new Line(options);
}

exports.description="line between 2 vertices"

exports.features=[];

exports.setGC=function(gc, line){
	//Caddeley rendering with canvas
	//defaults
	gc.lineWidth=1;
	gc.moveTo(line.vertices[0].x, line.vertices[0].y);
	gc.lineTo(line.vertices[1].x, line.vertices[1].y);
	gc.stroke();
};

//override Entity.setScene()
exports.setScene=function(scene, line){

	var mesh = BABYLON.Mesh.CreateLines("LINE", [
		new BABYLON.Vector3(
			line.vertices[0].x, 
			line.vertices[0].y, 
			line.vertices[0].z
		),
		new BABYLON.Vector3(
			line.vertices[1].x, 
			line.vertices[1].y, 
			line.vertices[1].z
		)
	], scene);

	//call superclass (prototype or static) method to set basics such as colour 
	//Entity.prototype.setScene.call(this, mesh, linedxf); 
	entity.setScene(scene, mesh, line);
};

