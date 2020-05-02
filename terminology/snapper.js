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
WM.sharedData.watch("snapper", function(s,a,present,o){
	//p eg. {data:{a:1, b:1, e:1... }, title:"endpoint", date:new Date()}

	Object.assign(states, present.data, {status:"snapper signalled"})	
	//console.log("snapper states", states)
	//send respnonse object based on present object with changed states
	WM.sharedData.set("snapper-response", new Object(present, {"data":states}))
})

WM.sharedData.watch("ready", function(s,a,present,o){
	//path=new Path(); path.strokeColor="silver"

	marker=new SymbolDefinition(new Path.Circle({
		center:[0,0],
		radius:3,
		strokeColor: "silver"
	}))	
	console.log("Snapper ready...")
})

/////////////////
// PRIVATE STATIC

var _success=function(){}
var _failure=function(){}
const states={a:0, b:0, c:0, e:0, g:0, i:0, m:0, p:0, q:0, t:0, status:"none"}
const m01="enter state 0|1"
const hits=[]

//marker shape is defined when cad triggers "ready"
var marker={} 
var markers=[]
function mark (point, index){
	if (index<markers.length){
		var m=markers[index]
		m.position=point
		m.visible=true
		//console.log("marker positioned")
	} else {
		//create more marker instances as needed
		var m=marker.place(point)
		m.visible=true
		//m.position=point
		markers.push(m)
		//console.log("marker created")
	}
}

function check01(entered){
	//cad.xFunction()
	//result=entered
	return (entered=="1")?true:false
}

function action(success, failure){
	//success (result)=>{WM.sharedData.set("x-submit-response", {success:true, result:result...})}
	
	_success=success||_success
	_failure=failure||_failure
	
	cad.prompt("Active|Base|Cent|Grid|Int|Mid|Perp|Quad|Tan|Settings|eXit", function(entered){
		entered=entered||""
		switch (entered.toUpperCase()){
			case "A":
			case "Active":cad.prompt(m01, function(t){states.a=check01(t); action()}); break
			case "B":
			case "Base":cad.prompt(m01, function(t){states.b=check01(t); action()}); break
			case "C":
			case "Cent":cad.prompt(m01, function(t){states.c=check01(t); action()}); break
			case "E":
			case "End":cad.prompt(m01, function(t){states.e=check01(t); action()}); break
			case "G":
			case "Grid":cad.prompt(m01, function(t){states.g=check01(t); action()}); break
			case "I":
			case "Int":cad.prompt(m01, function(t){states.i=check01(t); action()}); break
			case "M":
			case "Mid":cad.prompt(m01, function(t){states.m=check01(t); action()}); break
			case "P":
			case "Perp":cad.prompt(m01, function(t){states.p=check01(t); action()}); break
			case "Q":
			case "Quad":cad.prompt(m01, function(t){states.q=check01(t); action()}); break
			case "T":
			case "Tan":cad.prompt(m01, function(t){states.t=check01(t); action()}); break
			case "X":
			case "EXIT":_success(Object.assign(states, {status:"snapper commanded"})); break
			default: _failure("input not recognized: "+entered)		
		}
	})	
}

const options={
	//options.tolerance: Number — the tolerance of the hit-test — default: paperScope.settings.hitTolerance
	tolerance:10,
	//options.class: Function — only hit-test against a specific item class, or any of its sub-classes, by providing the constructor function against which an instanceof check is performed: Group, Layer, Path, CompoundPath, Shape, Raster, SymbolItem, PointText, …
	"class":Path,
	//options.match: Function — a match function to be called for each found hit result: Return true to return the result, false to keep searching
	match:function(hit){hits.push(hit); return false},
	//options.fill: Boolean — hit-test the fill of items — default: true
	fill:false,
	//options.stroke: Boolean — hit-test the stroke of path items, taking into account the setting of stroke color and width — default: true
	stroke:false,
	//options.segments: Boolean — hit-test for segment.point of Path items — default: true
	segments:true,
	//options.curves: Boolean — hit-test the curves of path items, without taking the stroke color or width into account
	curves:false,
	//options.handles: Boolean — hit-test for the handles (segment.handleIn / segment.handleOut) of path segments.
	handles:false,
	//options.ends: Boolean — only hit-test for the first or last segment points of open path items
	ends:true,
	//options.position: Boolean — hit-test the item.position of of items, which depends on the setting of item.pivot
	position:false,
	//options.center: Boolean — hit-test the rectangle.center of the bounding rectangle of items (item.bounds)
	center:false,
	//options.bounds: Boolean — hit-test the corners and side-centers of the bounding rectangle of items (item.bounds)
	bounds:false,
	//options.guides: Boolean — hit-test items that have Item#guide set to true	
	guides:false,
	//options.selected: Boolean — only hit selected items
	selected:false	
}

/////////////////
// PUBLIC ACCESS

/******
 	HIT RESULT
	hit={type:t, name:n, item:i, location:l, color:c, segment:s, point:p}	

	WHERE
	type = describes the hit result. For example, if you hit a segment point, the type would be 'segment'.
	Eg. 'handle-in', 'handle-out', 'curve', 'stroke', 'fill', 'bounds', 'center', 'pixel' for type.bounds, 

	name= If the HitResult has a hitResult.type of 'bounds', this property describes which corner of the bounding rectangle was hit. 
	Eg. 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-center', 'top-center', 'right-center', 'bottom- center' 

	item = item that was hit

	location = If the HitResult has a type of ‘curve’ or ‘stroke’, this property gives more information about the exact position that was hit on the path.

	color = If the HitResult has a type of ‘pixel’, this property refers to the color of the pixel on the Raster that was hit.
	
	segment = If the HitResult has a type of ‘stroke’, ‘segment’, ‘handle-in’ or ‘handle-out’, this property refers to the segment that was hit or that is closest to the hitResult.location on the curve.

	Describes the actual coordinates of the segment, handle or bounding box corner that was hit.
*/


exports.probe=function(point, showMarkers){

	//snapper function accessed by pointer tool
	//given a point, returns the best matching point based on snap options and user input 
	
	//hits=[{snap, point, hit_point, hit_entity}]
	
	//reset 
	hits.length=0
	//if (!showMarkers){
		markers.forEach(function(m){m.visible=false})
	//}

	//probe	- hitTest is a window scope paper.js function
	project.hitTest(point, options)

	//show resulting snap points
	hits.forEach(function(h,i){
		mark(h.point,i)	
	})

	if (hits.length==0){
		//nothing found near point
		return point
	}	
	else if (hits.length==1){
		//console.log("ONE...", hits[0].point)		
		return hits[0].point
	}
	//for multiple hits, get user to choose best	
	else {hits.length>0}{
		//console.log("MORE...")	
		return hits[0].point
	}

}


