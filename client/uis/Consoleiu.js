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

//BABYLON & CAD loaded at runtime via <HTML> <HEAD> <script>...

var UI=require("./UI.js").UI;

var Consoleui = function(div, title){

	// This class extends UI, call super constructor
	UI.call(this, div, title); 
	
	//using <xmp> to escape any html code that may be input, such as "<button>...</button>"
	this.divLog$=$('<xmp></xmp>').addClass('ui-dialog-content');
	this.div$.append(this.divLog$);
	
	this.divForm$=$('<form></form>').submit(function(ev){
		ev.preventDefault(); //inhibit page reload
		//get text and pass it to CAD for processing
		CAD.input($(this).find('input:text').val()); 
		return false; //prevent further bubbling of event
	});
	this.divInput$=$('<input type="text" placeholder="Command">');
	this.divOk$=$('<input type="submit" value="Ok">');
	this.divForm$.append(this.divInput$, this.divOk$);
	this.divForm$.controlgroup({items:{
		"button":"button, input[type=text], input[type=submit]"
	}});
	this.div$.append(this.divForm$);

	//jquery wrapped DOM element for big text dumps such as serialized scene
	this.divDump$=$('<xmp></xmp>');
	this.div$.append(this.divDump$);
	this.divDump$.addClass('ui-dialog-content').css('height', '300px').hide();
	
	return this;
};

// Inherit prototype from UI
Consoleui.prototype=Object.create(UI.prototype);
Consoleui.prototype.constructor=Consoleui;
Consoleui.prototype=Consoleui.prototype;
			
//DOM element for big text dumps	
Consoleui.prototype.divDump$=null;

Consoleui.prototype.divLog$=null;
	
Consoleui.prototype.getInputHandlers=function(){
	//returns an array of {alias:['a'], desc:'about', handler:function}
	//these inputHamdlers are common for all UI if inheritor so chooses
	var ih=UI.prototype.getInputHandlers.call(this);
	
	return ih.concat([
		{
			inputs:['bb'],
			desc:'open/close the blackboard', 
			handler:this.toggle
		},{
			inputs:['debug'],
			desc:'',
			handler:this.toggleDebug		
		},{
			inputs:['dump'],
			desc:'list scene contents',
			handler:function(){
				if (ev.data.divDump$.is(':visible')==true){
					ev.data.divDump$.hide();
				} else {
					var s=JSON.stringify(BABYLON.SceneSerializer.Serialize(CAD.scene) );
					s=s.replace(/(.{100})/g, "$1\n");
					ev.data.divDump$.show().html(s);
				}
			}
		},{
			inputs:['dumpg'],
			desc:'list scene geometry contents',			
			handler:function(){
				var g=JSON.stringify(BABYLON.SceneSerializer.Serialize(CAD.scene).geometries);
				g=g.replace(/(.{100})/g, "$1\n");
				ev.data.divDump$.show().text(g);
			}
		},{
			inputs:['dumpm'],
			desc:'list scene meshes contents',
			handler:function(){
				var m=JSON.stringify(BABYLON.SceneSerializer.Serialize(CAD.scene).meshes);
				m=m.replace(/(.{100})/g, "$1\n");
				ev.data.divDump$.show().text(m);
			}
		}	
	]);	
};
	
Consoleui.prototype.getEvents=function(){
	var eh=UI.prototype.getEvents.call(this);
	
	return eh.concat([
		{name:'input', data:this, handler:this.onInput },
		{name:'bimMsg', data:this, handler:function(ev, msg){ev.data.log(msg);}},
		{name:'bimMsg', data:this, handler:function(ev, msg){ev.data.log('CAD FC');}}
	]);
};
	

//override	
Consoleui.prototype.onInput=function(ev, input){
	ev.data.log("> "+input);
	UI.prototype.onInput.call(this, ev, input);
};

Consoleui.prototype.log=function(msg){
	//insert returns every 100 characters
	msg=msg.replace(/(.{100})/g, "$1\n");
	
	//add message to the store
	this.logStore.push(msg);
	//limit store to the last n messages
	if (this.logStore.length>50){this.logStore.shift();}
	//show last n items of the store
	var htm='', n=10, l=this.logStore.length;
	//make sure n is smaller or equal to the number of items to print
	n=(n>l)?l:n; 
	//for (var i=l-n; i<l; i++){ htm+=this.logStore[i]+'<br>';}
	for (var i=l-n; i<l; i++){ htm+=this.logStore[i]+'\n';}
	$(this.divLog$).html(htm);
};
	
Consoleui.prototype.logStore=[];
	
Consoleui.prototype.toggleDebug=function(){
	if (!this.toggleDebugB) {
		CAD.scene.debugLayer.shouldDisplayLabel=function(node){return true;}
		CAD.scene.debugLayer.shouldDisplayAxis=function(mesh){return true;}
		CAD.scene.debugLayer.show();			
		this.toggleDebugB=true;
	} else {
		CAD.scene.debugLayer.hide();			
		this.toggleDebugB=false;
	};
};
	
Consoleui.prototype.toggleDebugB=false;

exports.Consoleui=Consoleui;

