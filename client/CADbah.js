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
// PRIVATE STATIC
var FC=require("./cad-fc/cad-fc.js");
var uisetup=require("./uis/uisetup.js").uisetup;

var cout=function(CAD, htm, cssClass, count, limit){
	var p$=$("<p></p>").addClass(cssClass).attr("id", cssClass + count).html(htm);
	//add new message
	CAD.console$.append(p$);
	//delete old messages	
	if (count>limit){
		$("[id="+ cssClass + (count-limit) + "]").remove();
	}
	CAD.console.scrollTop=CAD.console.scrollHeight;
};
// PUBLIC
exports.activate=function(options){

	// check options
	if (typeof options=="undefined") {this.options=options={};}
	else {this.options=options;}
	
	/* Prepare user interfaces and controls...  
	Looks in options for {... div:HTMLelementReference, ...} or
	creates it from scratch if not found */
	uisetup(this, {autoOpen:false});	
	

	// Prepare canvas
	if (typeof options.canvas=="undefined"){
		//with jquery $ wrapper
		this.canvas$=$('<canvas></canvas>').appendTo(window.document.body);
		//html element
		this.canvas=canvas$.get();
	} else {this.canvas=options.canvas;this.canvas$=$(options.canvas);}

	// Prepare optional console for messages
	if (typeof options.console!="undefined"){
		this.console=options.console;
		this.console$=$(options.console);
	};
		
	// prepare engine
	this.engine = new BABYLON.Engine(this.canvas, true);
	/* 	Why warning, webgl dest rect smaller than viewport rect?
	See: http://doc.babylonjs.com/classes/2.5/Engine, 
	Try this...  this.engine.setViewport(new BABYLON.Viewport(0,0,700,500)); */
	
	// initialize the scene
	this.scene=new BABYLON.Scene(this.engine);
	
	// WORKSPACE
	this.workspace.activate(this).setScene(this.scene);

	// DOCUMENT
	//this.docdxf=new Docdxf(this);
	this.docdxf.activate(this);
	// set the BABYLON scene by traverses all entities in document 
	this.docdxf.setScene(this.scene);
	
	// This is a cool Babylon feature
	// this.scene.debugLayer.show();
	
	// engage the engine
	var that=this;
	this.engine.runRenderLoop(function(){ that.scene.render();} );
};

exports.commander=require("./commands/commander.js");
exports.canvas=null;
exports.canvas$=null;
exports.console=null;
exports.console$=null;
exports.cmd=function(input){this.commander.input(this, input);};
exports.div=null;
exports.div$=null;
exports.docdxf=require("./entities/Docdxf.js");

// DEBUGGING
exports.debug=function(){
	for (var i in arguments){
		//cout (CAD, "text", "class", count, limit)
		cout(this, arguments[i],"cad-debug", this.debugcount++, this.debuglimit);
	};
};
exports.debugcount=0;
exports.debuglimit=100;

// ENGINE
exports.engine=null;
	
// function collection 
exports.fc=FC;

// MESSAGING
exports.msg=function(){
	for (var i in arguments){
		//cout (CAD, "text", "class", count, limit)
		cout(this, arguments[i],"cad-msg", this.msgcount++, this.msglimit);
	};
};
exports.msgcount=0;
exports.msglimit=100;

// Extended by user in API functions above
exports.options={
	admin:{user:"unnamed", disc:'arch'},
	actionsEnabled:false,
	database:null, //to be determined
};
	
// Babylon scene, initialized by CAD.activate()
exports.scene=null;
// Manages tools including light, camera, background, skybox, zoomer etc
exports.workspace=require("./workspace/workspace.js");
exports.uis={};


