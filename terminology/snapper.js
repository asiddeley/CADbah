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
	name:"snapper", 
	about:"returns the paper coordinates near the mouse that match the snap settings",
	action:action,
	alias:"sn",
	topic:"tools", 
	terms:[]
})

///////////
// external interactions
WM.sharedData.watch("snapper", function(s,a,packet,o){
	//p eg. {data:{a:1, b:1, e:1... }, title:"endpoint", date:new Date(), status:"..."}

	//update states from present data
	Object.assign(states, packet.data)	
	console.log("snapper states", states)
	//send respnonse object based on present object with changed states
	WM.sharedData.set("snapper-response", new Object(packet, {"data":states, status:"snapper updated"}))
})

WM.sharedData.watch("ready", function(s,a,packet,o){

	spot=new Path.Circle({
		center:[0,0],
		radius:3,
		strokeColor: "silver"
	})	
	spot.visible=false
	
	zone=new Path.Circle({
		center:[0,0],
		radius:states.radius,
		strokeColor: "red"
	})
	zone.visible=false
	
	tag=new PointText({
		point: [10, 10],
		content: "end",
		fillColor: "silver",
		fontFamily: "Courier New",
		fontSize: 12
	})
	tag.visible=false
	

	snappo={
		a:{name:"active", options:new Options(), process:function(hits){return hits}},
		b:{name:"base", options:new Options(), process:function(hits){}},
		c:{name:"centre", options:new Options(), process:function(hits){}},
		e:{name:"endpoint", options: new Options(), process:function(hits){}},
		n:{name:"nearest"}
	}	

	//console.log("Snapper ready...")	
})

/////////////////
// PRIVATE STATIC

var _success=function(){}
var _failure=function(){}
var states=new SD.SnapperStates()

//defined on cad ready
var snappo={}
const msg="Snap | Box | Cen | Div | End | Grid | Int | Nearest | Position | Right | Tan | Radius | eXit"
const hits=[]

//defined on cad "ready"
var spot={} 
var tag={}
var zone={}
var index=0

function check01(entered){
	return (entered=="1"||"on")?"1":"0"
}

function action(success, failure){
	//success (result)=>{WM.sharedData.set("x-submit-response", {success:true, result:result...})}
	
	_success=success||_success
	_failure=failure||_failure

	cad.prompt(msg, function(entered){
		entered=entered||""
		switch (entered.toUpperCase()){
			case "S":
			case "SNAP":cad.prompt("snap off|0|on|1", function(t){states.snap=check01(t); update(); action()}); break
			case "B":
			case "BOX":cad.prompt("box off|0|on|1", function(t){states.box=check01(t); update(); action()}); break
			case "C":
			case "CEN":cad.prompt("centre off|0|on|1", function(t){states.cen=check01(t); update(); action()}); break
			case "D":
			case "DIV":cad.prompt("divide off|2|3|4|...", function(t){states.div=t; update(); action()}); break
			case "E":
			case "END":cad.prompt("endpoint off|0|on|1", function(t){states.end=check01(t); update(); action()}); break
			case "G":
			case "GRID":cad.prompt("grid off|0|on|1", function(t){states.grid=check01(t); update(); action()}); break
			case "I":
			case "INT":cad.prompt("intersection off|0|on|1", function(t){states.int=check01(t); update(); action()}); break
			case "N":
			case "NEAR":cad.prompt("near off|0|on|1", function(t){states.near=check01(t); update(); action()}); break
			case "P":
			case "POS":cad.prompt("position off|0|on|1", function(t){states.pos=check01(t); update(); action()}); break
			case "R":
			case "RIGHT":cad.prompt("right angle off|0|on|1", function(t){states.right=check01(t); update(); action()}); break
			case "T":
			case "TAN":cad.prompt("tangent off|0|on|1", function(t){states.tan=check01(t); update(); action()}); break
			case "H":
			case "HIT":cad.prompt("hit radius 2..10", function(t){states.radius=t; update(); action()}); break
			case "X":
			case "EXIT":_success(Object.assign(states, {status:"snapper done"})); break
			default: _failure("input not recognized: "+entered)		
		}
	})	
}

function update(options){
	options=options||{}
	Object.assign(states, options)
	WM.sharedData.set("snapper-response", {data:states, status:"snapper updated"})
}

function Options(options){
/***
	options.tolerance: Number — the tolerance of the hit-test — default: paperScope.settings.hitTolerance
	options.class: Function — only hit-test against a specific item class, or any of its sub-classes, by providing the constructor function against which an instanceof check is performed: Group, Layer, Path, CompoundPath, Shape, Raster, SymbolItem, PointText, …
	options.match: Function — a match function to be called for each found hit result: Return true to return the result, false to keep searching
	options.fill: Boolean — hit-test the fill of items — default: true
	options.stroke: Boolean — hit-test the stroke of path items, taking into account the setting of stroke color and width — default: true
	options.segments: Boolean — hit-test for segment.point of Path items — default: true
	options.curves: Boolean — hit-test the curves of path items, without taking the stroke color or width into account
	options.handles: Boolean — hit-test for the handles (segment.handleIn / segment.handleOut) of path segments.
	options.ends: Boolean — only hit-test for the first or last segment points of open path items
	options.position: Boolean — hit-test the item.position of of items, which depends on the setting of item.pivot
	options.center: Boolean — hit-test the rectangle.center of the bounding rectangle of items (item.bounds)
	options.bounds: Boolean — hit-test the corners and side-centers of the bounding rectangle of items (item.bounds)
	options.guides: Boolean — hit-test items that have Item#guide set to true	
	options.selected: Boolean — only hit selected items
***/
	
	options=options||{}
	this.tolerance=options.tolerance||10
	this.class=options.class||Path
	this.match=options.match||function(hit){
		hits.push(hit)
		return false
	}
	this.fill=options.fill||false
	this.stroke=options.stroke||false
	this.segments=options.segments||true
	this.curves=options.curves||false
	this.handles=options.handles||false
	this.ends=options.ends||true
	this.position=options.position||false
	this.center=options.centre||false
	this.bounds=options.bounds||false
	this.guides=options.guides||false
	this.selected=options.selected||false	
}
const options=new Options()

////////////////
// PUBLIC ACCESS

/***
	HIT RESULT from project.hitTest(point)
	hit={type:t, name:n, item:i, location:l, color:c, segment:s, point:p}	
	
	type = describes the hit result. For example, if you hit a segment point, the type would be 'segment'.
	Eg. 'handle-in', 'handle-out', 'curve', 'stroke', 'fill', 'bounds', 'center', 'pixel' for type.bounds, 

	name= If the HitResult has a hitResult.type of 'bounds', this property describes which corner of the bounding rectangle was hit. 
	Eg. 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-center', 'top-center', 'right-center', 'bottom- center' 

	item = item that was hit
	
	location = If the HitResult has a type of ‘curve’ or ‘stroke’, this property gives more information about the exact position
	that was hit on the path.

	color = If the HitResult has a type of ‘pixel’, this property refers to the color of the pixel on the Raster that was hit.

	segment = If the HitResult has a type of ‘stroke’, ‘segment’, ‘handle-in’ or ‘handle-out’, 
	this property refers to the segment that was hit or that is closest to the hitResult.location on the curve. 
	Describes the actual coordinates of the segment, handle or bounding box corner that was hit.
***/


exports.clear=function(){
	cycle=0
	spot.visible=false
	tag.visible=false
	zone.visible=false
}

exports.probe=function(point){
	//snapper function accessed by pointer tool
	//given a point, returns the best matching point based on snap options and user input 
	
	//exit if snap not active
	if (states.snap!="1"){return point}

	if (point==null){
		//no arguments means cycle through previous hits	
		if (index >= hits.length-1){index=0}
		else {index+=1}
	} else {
		//fresh point to probe so reset everything
		index=0		
		hits.length=0
		//need to hide these or else they'll be added to the hits
		tag.visible=false
		spot.visible=false
		zone.visible=false
		//project.hitTest is a window scope paper.js function, it fills hits[] via options.match()
		project.hitTest(point, options)		
		zone.position=point	
		zone.radius=states.radius/view.zoom
		zone.visible=states.zone	
		zone.strokeWidth=1/view.zoom
	}

	if (hits.length>0){
		var f=1/view.zoom
		var pt=hits[index].point
		spot.position=pt
		spot.strokeWidth=f
		spot.visible=true
		tag.content="snap("+(1+index).toString()+"/"+hits.length.toString()+")" + "end"
		tag.point=new Point(pt.x+5, pt.y-5)
		tag.radius=states.radius*f
		tag.visible=true
		tag.scale=f
		tag.fontSize=10*f
		tag.strokeWidth=f
		return pt
	} else {return point}	

}

