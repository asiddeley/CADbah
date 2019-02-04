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

var Documesh=require("./Documesh").Documesh; 
var Light=require("./Lights").Hemispheric;
var Camera=require("./Cameras").Camera;
var Triaxis=require("./Triaxis").Triaxis;


var Workspace=function(CADbah){
	//First step of javascript inherit pattern, call constructor...
	Documesh.call(this, CADbah);
	
	this.desc="Basic workspace";
	this.addmeshmaker(
		new Light(),
		new Camera(),
		new Triaxis()
	);
};

//Next steps of js inheritance patterns, inherit prototype and constructor...
Workspace.prototype=Object.create(Documesh.prototype);
Workspace.prototype.constructor=Documesh;

exports.Workspace=Workspace;



