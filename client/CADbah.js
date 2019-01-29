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
//var babylon=require('babylon');

///////////////////////////////////
//load following with browserify...
//var TabbedUI=require('united/TabbedUI');
//var BlackboardUI=require('united/BlackboardUI');
//var PartsUI=require('united/PartsUI');
//var PickerUI=require('united/PickerUI');
//var PeekerUI=require('united/PeekerUI');
//var PokerUI=require('united/PokerUI');
//var FeaturesUI=require('united/FeaturesUI');

//camera.noRotationConstraint=true;
var CAD={};

CAD.canvas$=null;
CAD.board$=null;
//CAD.database=null;
CAD.engine=null;

// The a, b, c, d & e main API methods...
CAD.admin=function(user, options){
	user=(typeof user=='undefined')?'admin':user;
	options=(typeof options == 'undefined')?{}:options;
	$.extend(this.options, {admin:user}, options);
};
	
CAD.board=function(div, options){
	if (typeof div == 'undefined'){div=$('<div></div>').appendTo(window.document.body);}
	if (typeof options == 'undefined'){options={};}
	//wrap div with jquery if not already
	if (div instanceof window.Element){div=$(div);}
	
	$.extend( this.options, {board$:div}, options );	
	
	var tui=new TabbedUI(div, "Main");
	this.ui.blackboard=new BlackboardUI(null, "Command line");
	tui.addTab( 
		this.ui.blackboard, 
		//new PartsUI(null, 'Part'),
		//new PeekerUI(null, 'Peek')
		//new PickerUI(null, 'Pick'),
		//new PokerUI(null, 'Poke')
	); 
}

CAD.canvas=function(canvas){ $.extend(this.options, {canvas:canvas}); }

CAD.database=function(udata){ $.extend(this.options, {database:udata}); }
	
CAD.engage=function(){

	var that=this;	
	// prepare engine
	var c=this.options.canvas;
	var engine = new babylon.Engine(c,  true);
	this.options.engine=engine;
	// why warning re. webgl dest rect smaller than viewport rect?
	// See, http://doc.babylonjs.com/classes/2.5/Engine, try this...
	// this.engine.setViewport(new babylon.Viewport(0,0,700,500));
	
	// initialize the scene
	this.scene=new babylon.Scene(engine);
	var s=this.scene;
	
	// set light in scene
	this.lights.main.setScene(this.scene);
	
	// visit all parts to set the babylon scene		
	//this.model.handler.setScene(this.model);
	
	// initialize scene materials
	//this.fun.log('initializing tcm');
	//for (var key in this.tcmLib) {
	//	var m=this.tcmLib[key];
	//	m.handler.setScene(m);
		//that.fun.log(key);that.fun.log(m.handler.type);
	//}
	
	// initialize main view__camera for the scene
	this.views.main.setScene(this.scene);
	
	// This is a cool Babylon feature
	// s.debugLayer.show();
	
	// engage the engine!
	engine.runRenderLoop(function(){ s.render();} );
};
	
// function collection 
CAD.fc=require("./useful/cad-fc.js").fc;

// getters
CAD.get={
	activeModel:function(am) {
		if(typeof am!='undefined') {this.activeModelObj=am;}
		if(this.activeModelObj==null) {this.activeModelObj=CAD.model;}
		return this.activeModelObj;	
	},
	activeModelObj:null,
	
	//gets or sets current mesh - newly created or picked
	cMesh:function(cm){
		if(typeof cm!='undefined') {this.cMeshObj=cm;}
		else {return this.cMeshObj};	
	},
	cMeshObj:null,
	nextAvailableV3:function(){
		return new BABYLON.Vector3(
			10*Math.floor(Math.random()*10), 
			10*Math.floor(Math.random()*10), 
			10*Math.floor(Math.random()*10)
		);		
	},
	bb:function(){ return CAD.ui.blackboard;},
	canvas:function() {return CAD.options.canvas;},	
	scene: function() {return CAD.scene;},
	uid: function(name) {return CAD.fun.uid(name);},
	//global variable storage
	val:function(key, valu){
		//TO DO...
		//usage - store 'hello world' as 'msg'
		//CAD.get.val('msg','hello world'); 
		//usage - retrieve 'msg'
		//CAD.get.val('msg');
		console.log(key.toString() + '='+ valu.toString());
	},
	valstore:{}
};


	
// main light
CAD.lights=require("./lights.js").lights;
	
// Extended by user in API functions above
CAD.options={
	admin:{user:"unnamed", disc:'arch'},
	actionsEnabled:false,
	board:null,
	canvas:null,
	database:null,
	engine:null		
};	
	
	
//Babylon scene, analog to CAD.model, initialized by engage()
CAD.scene=null;
	
	
//User interfaces, initialized by this.board()
CAD.ui={};
	
//View library, A view is the CAD analog to babylon camera
//CAD.views={ main:arcRotateCamera };
CAD.views=require('./cameras.js').views;



window.CAD=CAD;
return CAD;



