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
// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
//define( function(require, exports, module){

//var babylon=require('babylon'); //load via <script> in HTML
//var $=require('jquery'); //load via <script> in HTML  
var Entity=require('./Entity.js').Entity; //load via browserify
//var Nameable=require('./features/Nameable'); 
//var Position=require('./features/Position'); 
//var Pickable=require('./features/Pickable');

var Line=function(caddoc){
	/****
	Line is the Handler for all line data, it extends (inherits methods and properties) from Element.  Only one Line needs to be instanciated per scene.  An instantiated line object does have line data as a property but it is only a temporary to hold default data while it bulds the corresponding BABYLON mesh. 
	**/
	
	//javascript inheritance pattern
	Entity.call(this, caddoc);
	
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
Line.prototype.data=$.extend(Entity.prototype.data,{
	//override type
	type,"LINE",
	//add to vertices array initiated by Element
	vertices:[].concat(Entity.prototype.data.vertices).concat(
		{
			x:function(){return Math.trunc(Math.random()*1000);},
			y:function(){return Math.trunc(Math.random()*1000);}
		}
	)
});

Line.prototype.deserialize(scene, lineData){
	//overwrite default Line data with data from serial source
	Entity.prototype.deserialize(lineData);
	//$.extend(this.data, data);
	this.setScene(scene);
};


//override Element.setScene
Line.prototype.setScene=function(scene){

	this.mesh = BABYLON.Mesh.CreateLines("LINE", [
		new BABYLON.Vector3(this.data.vertices[0].x, this.data.vertices[0].y, 0),
		new BABYLON.Vector3(this.data.vertices[1].x, this.data.vertices[1].y, 0),
	], scene);
	
	//call super (Element) for basics such as colour 
	Entity.prototype.setScene.call(this, scene); 

};

exports.Line=Line;