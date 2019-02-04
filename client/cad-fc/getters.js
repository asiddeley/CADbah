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

// getters function collection (fc)
exports.fc={
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
	canvas:function() {return CAD.canvas;},	
	scene: function() {return CAD.scene;},
	uid: function(name) {return CAD.fc.uid(name);},
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




