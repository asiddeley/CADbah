/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// PRIVATE STATIC

var entity=require("../drawing/entity.js");
//var {$V}=require("../helpers/sylvester.src.plus.js");

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
exports.activate=function(){
	//Meant to be called once (by drawing module) to activate this module
	//other modules that may require this module don't need to activate it.
	//NO!! remove activate() - Should only be used top level to set cadbah
	//this.drawing=drawing;
};

exports.create=function(options){
	return new Line(options);
}

exports.description="line between 2 vertices";

exports.features=[];

exports.setGC=function(gc, line, tx){
	//Caddeley rendering with canvas
	//defaults
	//gc.lineWidth=1;
	var v=$V([line.vertices[0].x, line.vertices[0].y, 0]);
	//CAD.debug("vector:", v.inspect());	
	var v=tx.multiply(v);
	//CAD.debug("line X tx:", v.inspect());
	//CAD.debug("tx:", tx.inspect());
	//CAD.debug("line:", Math.round(v.e(1)), Math.round(v.e(2)));

	gc.moveTo(Math.round(v.e(1)), Math.round(v.e(2)));
	
	v=$V([line.vertices[1].x, line.vertices[1].y, 0]);
	v=tx.multiply(v);	
	gc.lineTo(Math.round(v.e(1)), Math.round(v.e(2)));
	
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

