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

/////////////////////////
//load following in HTML with <script>
//var $=require('jquery'); 
//var BABYLON=require('BABYLON');


var CAD={};

CAD.activate=function(options){

	// check options
	if (typeof options=="undefined") {this.options=options={};}
	else {this.options=options;}
	
	/* Prepare user interfaces and controls...  
	Looks in options for {... div:HTMLelementReference, ...} or
	creates it from scratch if not found */
	require("./uis/uisetup.js").uisetup(this, options);	

	// Prepare canvas
	if (typeof options.canvas=="undefined"){
		//with jquery $ wrapper
		this.canvas$=$('<canvas></canvas>').appendTo(window.document.body);
		//html element
		this.canvas=canvas$.get();
	} 
	else {this.canvas=options.canvas;this.canvas$=$(options.canvas);}
	
	// prepare engine
	this.engine = new BABYLON.Engine(this.canvas, true);
	/* 	Why warning, webgl dest rect smaller than viewport rect?
	See: http://doc.babylonjs.com/classes/2.5/Engine, 
	Try this...  this.engine.setViewport(new BABYLON.Viewport(0,0,700,500)); */
	
	// initialize the scene
	this.scene=new BABYLON.Scene(this.engine);
	
	// WORKSPACE
	// includes camera and light
	this.workspace=new this.Workspace(this);
	this.workspace.setScene(this.scene);

	// DOCUMENT
	this.docdxf=new this.Docdxf(this);
	// set the BABYLON scene by traverses all entities in document 
	this.docdxf.setScene(this.scene);
	
	// This is a cool Babylon feature
	// this.scene.debugLayer.show();
	
	// engage the engine
	var that=this;
	this.engine.runRenderLoop(function(){ that.scene.render();} );
};


CAD.canvas=null;
CAD.canvas$=null;
CAD.div=null;
CAD.div$=null;
CAD.Docdxf=require("./entities/Docdxf.js").Docdxf;
CAD.docdxf=null;
CAD.engine=null;
	
// function collection 
CAD.fc=require("./cad-fc/cad-fc.js");

// getters function collection
// eg. CAD.get("scene");
CAD.get=require("./cad-fc/getters.js").fc;
	
// Extended by user in API functions above
CAD.options={
	admin:{user:"unnamed", disc:'arch'},
	actionsEnabled:false,
	database:null, //to be determined
};	
	
// Babylon scene, initialized by CAD.activate()
CAD.scene=null; 
// workspace is a documesh and includes such things as Triaxis (UCSicon), lights, views 
CAD.Workspace=require("./workspace/workspaces.js").Workspace;
CAD.workspace=null; 
CAD.uis={};
	


window.CAD=CAD;
return CAD;



