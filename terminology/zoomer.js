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

///////////
// Requires
const CT=require("../terminology/cadTerminology.js")
const SD=require("../terminology/sharedData")
const REMOTE=require('electron').remote
const WM=REMOTE.require('electron-window-manager')

/////////
// Define snapper as a cad term for user interaction
CT.define({
	name:"zoom", 
	about:"manipulate the view by zooming",
	action:action,
	alias:"zz",
	topic:"tools", 
	terms:[]
})

///////////
// external interactions
WM.sharedData.watch("ready", function(s,a,packet,o){

	box=new Path.Rectangle({
		from:[0,0],
		to:[10,10],
		strokeColor: "silver"
	})	
	box.visible=false
	
	anchor=new Path.Circle({
		center:[0,0],
		radius:3,
		strokeColor: "silver"
	})
	
	anchor.visible=false
	
	perimeter=new Path.Circle({
		center:[0,0],
		radius:3,
		strokeColor: "silver"
	})	
	perimeter.visible=false
	
})

/////////////////
// PRIVATE STATIC

//Tool is a window scope paper.js constructor
const zoomer=new Tool()
zoomer.name="zoomer"
zoomer.onMouseMove=function(e){
	if (anchor.visible) {
		perimeter.position=e.point
		setBox(anchor.position, perimeter.position)
	}
}

zoomer.onMouseUp=function(e){		
	if (!anchor.visible){
		//1st click, set anchor point
		anchor.position=e.point
		anchor.visible=true
		box.visible=true
		perimeter.visible=true
	} else {
		//2nd click set view
		project.view.scale((view.bounds.width/box.bounds.width), box.bounds.center)
		anchor.visible=false
		box.visible=false
		perimeter.visible=false	
		zoomer.done()
	}
}


var _success=function(){}
var _failure=function(){}
var box 
var anchor
var perimeter



function setBox(anchor, perimeter){

	//console.log("anchor, perimeter", anchor, perimeter)
	box.removeSegments()
	var bottom, left, right, top 
	//common centre
	var cx=(anchor.x+perimeter.x)/2
	var cy=(anchor.y+perimeter.y)/2
	//zoom box view ratio (height/width)
	var br=Math.abs((perimeter.y-anchor.y)/(perimeter.x-anchor.x))
	//view view (height/width)
	var vr=view.size.height/view.size.width
	

	if(br>vr){
		//mouse anchor & perimeter points taller than view so
		//box top and bottom match mouse points, left and right relative to centre
		var w2=(Math.abs(perimeter.y-anchor.y)/vr)/2
		top=anchor.y
		bottom=perimeter.y
		left=cx-w2
		right=cx+w2
		box.add([left, top], [right, top], [right,bottom], [left, bottom])
		box.closed=true
		box.visible=true
	} else {
		//mouse anchor & perimeter points flatter than view so
		//left and right match mouse points, top and bottom relative to centre
		var h2=(Math.abs(perimeter.x-anchor.x)*vr)/2
		left=anchor.x
		right=perimeter.x
		top=cy-h2
		bottom=cy+h2
		box.add([left, top], [right, top], [right,bottom], [left, bottom])
		box.closed=true
		box.visible=true
	}
}



function action(success, failure){
	//success (result)=>{WM.sharedData.set("x-submit-response", {success:true, result:result...})}
	
	_success=success||_success
	_failure=failure||_failure

	cad.prompt("Box | Extents | factor | In | Out | Previous | eXit", function(entered){
		entered=entered||""
		switch (entered.toUpperCase()){
			case "B":
			case "BOX":cad.prompt("click 2 points around area to zoom...", function(){
					//in case user wants to cancel tool after it has stated...
					cad.standby()
					clear()
				}) 
				activate(action)
				break
			case "E":
			case "EXTENTS":extents(); action(); break
			case "X":
			case "EXIT":cad.standby(); clear(); _success("zoom done"); break
			default:cad.standby(); clear(); _failure("input not recognized: "+entered)		
		}
	})	
}

function update(options){
	options=options||{}
	Object.assign(states, options)
	WM.sharedData.set("snapper-response", {data:states, status:"snapper updated"})
}

function clear(){
	box.visible=false
	anchor.visible=false
	perimeter.visible=false
}



function activate(callback){
	zoomer.done=callback||function(){}
	console.log("zoomer activated...")
	//paper.js make zoomer the active tool...
	zoomer.activate()
	//if tilemenu.html has focus then onKeyUp in cad.html won't hear keystrokes until it gets focus so... 
	WM.get("cad").focus()
}


// PUBLIC
exports.activate=activate


