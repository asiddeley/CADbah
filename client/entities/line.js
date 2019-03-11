/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// PRIVATE STATIC

var entity=require("./Entity.js");

// MIXINS
//var Entity=require('./Entity.js').Entity; 
$.extend(exports, entity);
//var Nameable=require('./features/Nameable'); 
//var Position=require('./features/Position'); 
//var Pickable=require('./features/Pickable');

// PUBLIC
exports.activate=function(docdxf){
	
	this.dxf=docdxf;
	entity.activate(docdxf);
	
	/**
	Line is the Handler for all line data, it extends (inherits methods and properties) from Element.  Only one Line needs to be instanciated per scene.  An instantiated line object does have line data as a property but it is only a temporary to hold default data while it bulds the corresponding BABYLON mesh. 
	**/
	
	//javascript inheritance pattern
	//Entity.call(this, docdxf);
	
	this.desc='A line between 2 points';
	//Note that the following method is inherited from Element...
	//this.addFeatures(
		//Nameable, 
		//Position,
		//Pickable
 	//);
};

exports.features=[];

//inherit prototype and constructor
//Line.prototype=Object.create(Entity.prototype);
//Line.prototype.constructor=Entity;

//default Line data
/*
Line.prototype.data=$.extend(Entity.prototype.data,{
	//override type
	type:"LINE",
	//add to vertices array initiated by Element
	vertices:[].concat(Entity.prototype.data.vertices).concat(
		{
			x:function(){return Math.trunc(Math.random()*1000);},
			y:function(){return Math.trunc(Math.random()*1000);}
		}
	)
});

Line.prototype.deserialize=function(scene, linedata){
	//overwrite default Line data with data from serial source
	Entity.prototype.deserialize(scene, linedata);
	//$.extend(this.data, data);
	this.setScene(scene);
};
*/

//overwrite Entity.setScene()
exports.setScene=function(scene, linedxf){

	var mesh = BABYLON.Mesh.CreateLines("LINE", [
		new BABYLON.Vector3(
			linedxf.vertices[0].x, 
			linedxf.vertices[0].y, 
			linedxf.vertices[0].z
		),
		new BABYLON.Vector3(
			linedxf.vertices[1].x, 
			linedxf.vertices[1].y, 
			linedxf.vertices[1].z
		)
	], scene);

	//call superclass (prototype or static) method to set basics such as colour 
	//Entity.prototype.setScene.call(this, mesh, linedxf); 
	entity.setScene(scene, mesh, linedxf);
};

