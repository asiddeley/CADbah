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
	
	dump:function(txt){	CAD.uis.consoleui.divDump$.show().text(txt);},
	
	isActionEnabled:function(){	return CAD.fun.isActionEnabledValu;	},
	
	isActionEnabledValu:false,
	
	//this.trigger('bimMsg', message);
	log:function() {for (var a in arguments) CAD.uis.consoleui.log(arguments[a].toString());},

	matchAll:function(sourceMesh, targetMesh) {
		FeaturesUI.prototype.matchAll(sourceMesh, targetMesh);
	},
	
	on:function(eventHandlers){
		//eventHandlers eg. [ eventHandler, eventHandler2...]
		//eventHandler eg. {name:'bimInput', data:this, handler:this.onInput }
		var ee=eventHandlers;
		//add event handlers to board, the acting event manager
		for (var n in ee){CAD.div$.on(ee[n].name, ee[n].data, ee[n].handler);}	
	},
	
	one:function(eventHandlers){
		//eventHandlers - [{name:'bimInput', data:this, handler:this.onInput }...]
		var ee=eventHandlers;		
		for (var n in ee){CAD.div$.one(ee[n].name, ee[n].data, ee[n].handler);}	
	},

	off:function(eventHandlers){
		//eventHandler eg. {name:'bimInput', data:this, handler:this.onInput }
		var ee=eventHandlers;
		//add event handlers to board, the acting event manager
		for (var n in ee){CAD.div$.off(ee[n], ee[n].data, ee[n].handler);}	
	},

	randomInt:function(s) {
		s=(typeof s=='undefined')?100:s; //default is 100
		return (Math.trunk(Math.random()*s)); 
	},
	
	randomV3:function(s) {
		s=(typeof s=='undefined')?100:s; //default is 100
		return (new BABYLON.Vector3(Math.random()*s,  Math.random()*s, Math.random()*s)); 
	},
	
	randomV3I:function(s) {
		//random vertex of 3 integers
		s=(typeof s=='undefined')?100:s; //default is 100
		return (new BABYLON.Vector3(
			Math.trunk(Math.random()*s), 
			Math.trunk(Math.random()*s),
			Math.trunk(Math.random()*s)
		)); 
	},
	
	trigger:function(eventName, optArrOfExtraArgs){
		//CAD.ui.uiBlackboard.div$.trigger(ev, arg1);
		//CAD.fun.log('CAD.trigger:'+ev);
		CAD.div$.trigger(eventName, optArrOfExtraArgs);
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

