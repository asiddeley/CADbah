/*****************************************************
CADbah
Computer Aided Design Be Architectural Heroes
Copyright (c) 2019, 2020 Andrew Siddeley

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

// REQUIRES

const CT=require("../terminology/cadTerminology.js")
const snapper=require("./snapper.js")
const REMOTE=require("electron").remote
const WM=REMOTE.require("electron-window-manager")

// Define as a cad term for user interaction
CT.define({
	name:"pointer", 
	about:"returns the paper coordinates of the mouse when clicked",
	action:activate,
	alias:"pp",
	topic:"tools", 
	terms:[]
})

//Tool is a window scope paper.js constructor
const pointer=new Tool()
pointer.name="pointer"
pointer.onMouseMove=function(e){
	path.removeSegments()
	var point=snapper.probe(e.point)
	//note that points.concat doesn't change points in any way
	trace(path, points.concat(point))	
	tentative=null
}

pointer.onMouseUp=function(e){
	//if (echo){CAD.input(Math.round(e.point.x) + ", " + Math.round(e.point.y))}
	path.removeSegments()	
	//confirm tentative-point or else get a fresh point 
	points.push(tentative||snapper.probe(e.point))
	tentative=null
}

pointer.onKeyUp=function(ev){
	//cycle through multiple hits by pressing shift	
	//console.log("SHIFT...")
	if (ev.key=="shift"){
		tentative=snapper.probe()
	}
}

var path=null
var points=[]
var tentative=null
var trace=function(){}

function activate(options){
	//console.log("pointer activated...")
	options=options||{}
	//default tracer just draws circles at each point...
	trace=options.trace||function(path, points){
		//points.forEach(function(p){path.add(new Path.Circle(p, 3))})	
	}

	if (path==null){path=new Path()}
	path.strokeColor="silver"
	
	pointer.activate()
	//if tilemenu.html has focus then onKeyUp in cad.html won't hear keystrokes until it gets focus so... 
	WM.get("cad").focus()
}


// PUBLIC
exports.activate=activate

exports.getPoints=function(){return points}

exports.standby=function(success){
	success=success||function(){}
	//clear everything
	trace=function(){}
	path.removeSegments()
	points=[]
	tools.find(tool => tool.name == "standby").activate()
	success("pointer on standby")
}


