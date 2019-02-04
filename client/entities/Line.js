/*****************************************************
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*****************************************************/

 
var Entity=require('./Entity.js').Entity; 
//var Nameable=require('./features/Nameable'); 
//var Position=require('./features/Position'); 
//var Pickable=require('./features/Pickable');

var Line=function(docdxf){
	/**
	Line is the Handler for all line data, it extends (inherits methods and properties) from Element.  Only one Line needs to be instanciated per scene.  An instantiated line object does have line data as a property but it is only a temporary to hold default data while it bulds the corresponding BABYLON mesh. 
	**/
	
	//javascript inheritance pattern
	Entity.call(this, docdxf);
	
	this.desc='A line between 2 points';
	//Note that the following method is inherited from Element...
	this.addFeatures(
		//Nameable, 
		//Position,
		//Pickable
 	);

};

//inherit prototype and constructor
Line.prototype=Object.create(Entity.prototype);
Line.prototype.constructor=Entity;

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
Line.prototype.setScene=function(scene, linedxf){

	mesh = BABYLON.Mesh.CreateLines("LINE", [
		new BABYLON.Vector3(
			linedxf.vertices[0].x, 
			linedxf.vertices[0].y, 
			linedxf.vertices[0].z
		),
		new BABYLON.Vector3(
			linedxf.vertices[1].x, 
			linedxf.vertices[1].y, 
			linedxf.vertices[0].z
		),
	], scene);

	//call superclass (prototype or static) method to set basics such as colour 
	Entity.prototype.setScene.call(this, mesh, linedxf); 
};

exports.Line=Line;