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

// MIXINS
$.extend(exports, require("../cadEvents.js"));

// PUBLIC
exports.activate=function(CADbah){

	this.CAD=CADbah;
	this.name="workspace";

	this.tools=[
		require("./background").activate(this),
		require("./light").activate(this),
		require("./orbiter").activate(this),
		require("./skybox").activate(this),
		require("./ucsicon").activate(this),
		require("./undoer").activate(this),
		require("./zoomer").activate(this)
	];
	
	//make it chainable
	return this;
};

exports.getItem=function(toolname){
	return this.tools.find(function(t){
		return (t.name==toolname);		
	});
};

exports.getTool=function(toolname){
	return this.tools.find(function(t){
		return (t.name==toolname);		
	});
};

exports.setScene=function(scene){
	//render meshes	
	for (i=0; i<this.tools.length; i++){
		CAD.debug("workspace.setScene()...", this.tools[i].name);
		this.tools[i].setScene(scene);
	};
};

