(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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




},{"./cameras.js":2,"./lights.js":3,"./useful/cad-fc.js":4}],2:[function(require,module,exports){
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


var ArcRotateCamera=function(topFeatures){

	this.setScene=function(scene, mesh, canvas){
		//new ArcRotateCamera(name, alpha, beta, radius, target, scene)
		var cam = new BABYLON.ArcRotateCamera(
			"ArcRotateCamera", //name
			1, //alpha
			0.8, //beta
			100, //radius
			new BABYLON.Vector3(0, 0, 0), //target
			CAD.scene
		);
		
        cam.attachControl(CAD.options.canvas, true);	

		return cam;
	};
};


exports.views={
	main:new ArcRotateCamera( )
};




},{}],3:[function(require,module,exports){
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
*/

var Hemispheric=function(){}
Hemispheric.prototype.setScene=function(scene, mesh){
	var mesh=new BABYLON.HemisphericLight('hemiTop', new BABYLON.Vector3(0,10,0), CAD.scene);
};

exports.lights={
	main:new Hemispheric(),
	hemi:new Hemispheric()
};




},{}],4:[function(require,module,exports){
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

// function collection 
exports.fc={

	// grows textarea fit text - useful for typing in a small textarea 
	autoHeight:function(el){$(el).css('height','auto').css('height', el.scrollHeight+5);},
	
	cameraPause:function(eventName){
		if (typeof eventName=='undefined') {eventName='cameraplay';}
		//detach camera
		setTimeout(
			function(){CAD.scene.activeCamera.detachControl(CAD.options.canvas);},
			0
		);
		
		//and setup one-time event to restore or attach camera
		CAD.fun.one([{
			name:eventName,
			data:{},
			handler:function(){
				console.log('attach camera');
				//CAD.scene.activeCamera.attachControl(CAD.options.canvas, false); //preventDefalut(), I.e mouse events do not propagate.  Default
				CAD.scene.activeCamera.attachControl(CAD.options.canvas, true); //does not perventDefault(), I.e. mouse events propagate
			}
		}]);		
	},
	
	cameraPlay:function(eventName){
		if (typeof eventName=='undefined') {eventName='cameraplay';}
		CAD.fun.trigger(eventName);	
	},

	//returns a BABYLON.Vector3 representing the closest axis to the argument vector
	//thanks to http://stackoverflow.com/questions/25825464/get-closest-cartesian-axis-aligned-vector-in-javascript
	closestAxis:function(vector3){
		var r=new BABYLON.Vector3(0,0,0); //result
		var x=vector3.x, y=vector3.y, z=vector3.z;
		// absolute values for direction cosines, bigger value equals closer to basis axis
		var xn=Math.abs(x), yn=Math.abs(y), zn=Math.abs(z);
		if ((xn>=yn)&&(xn>=zn)) {(x>0) ? r.copyFromFloats(1,0,0):r.copyFromFloats(-1,0,0);
		} else if ((yn>xn)&&(yn>=zn)) {(y>0) ? r.copyFromFloats(0,1,0):r.copyFromFloats(0,-1,0);
		} else if ((zn>xn)&&(zn>yn)) {(z>0) ? r.copyFromFloats(0,0,1):r.copyFromFloats(0,0,-1);
		} else {r.copyFromFloats(1,0,0);}
		return r;
	},
	
	dump:function(txt){	CAD.ui.blackboard.divDump$.show().text(txt);},
	
	isActionEnabled:function(){	return CAD.fun.isActionEnabledValu;	},
	
	isActionEnabledValu:false,
	
	//this.trigger('bimMsg', message);
	log:function() {for (var a in arguments) CAD.ui.blackboard.log(arguments[a].toString());},

	matchAll:function(sourceMesh, targetMesh) {
		FeaturesUI.prototype.matchAll(sourceMesh, targetMesh);
	},
	
	on:function(eventHandlers){
		//eventHandlers eg. [ eventHandler, eventHandler2...]
		//eventHandler eg. {name:'bimInput', data:this, handler:this.onInput }
		var ee=eventHandlers;
		//add event handlers to board, the acting event manager
		for (var n in ee){CAD.options.board$.on(ee[n].name, ee[n].data, ee[n].handler);}	
	},
	
	one:function(eventHandlers){
		//eventHandlers - [{name:'bimInput', data:this, handler:this.onInput }...]
		var ee=eventHandlers;		
		for (var n in ee){CAD.options.board$.one(ee[n].name, ee[n].data, ee[n].handler);}	
	},

	off:function(eventHandlers){
		//eventHandler eg. {name:'bimInput', data:this, handler:this.onInput }
		var ee=eventHandlers;
		//add event handlers to board, the acting event manager
		for (var n in ee){CAD.options.board$.off(ee[n], ee[n].data, ee[n].handler);}	
	},

	randomInt:function(s) {
		s=(typeof s=='undefined')?100:s; //default is 100
		return (Math.trunk(Math.random()*s)); 
	},
	
	randomV3:function(s) {
		s=(typeof s=='undefined')?100:s; //default is 100
		return (new babylon.Vector3(Math.random()*s,  Math.random()*s, Math.random()*s)); 
	},
	
	randomV3I:function(s) {
		//random vertex of 3 integers
		s=(typeof s=='undefined')?100:s; //default is 100
		return (new babylon.Vector3(
			Math.trunk(Math.random()*s), 
			Math.trunk(Math.random()*s),
			Math.trunk(Math.random()*s)
		)); 
	},
	
	trigger:function(eventName, optArrOfExtraArgs){
		//CAD.ui.uiBlackboard.div$.trigger(ev, arg1);
		//CAD.fun.log('CAD.trigger:'+ev);
		CAD.options.board$.trigger(eventName, optArrOfExtraArgs);
	},
			
	uid:function(name){
		//Returns a simple unique id string based on a given name and
		//how many time that name is called.  If no name given then 'id' is the default name.
		//eg. 'cell1', 'line1', 'cell2', 'line2', 'line3', 'id1' ...
		name=(typeof name == 'undefined')?'id':name.toString();
		var count=this.uidstore[name];
		count=(typeof count == 'undefined')?1:count+1; //define or increment id number
		this.uidstore[name]=count; //save count
		return name+count.toString();
	},
	uidstore:{ },
	unique:function(name){return this.uid(name);}
};


},{}]},{},[1]);
