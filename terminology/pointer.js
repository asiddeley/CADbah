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

// PRIVATE STATIC

const CT=require('../terminology/cadTerminology.js')

const pointer=new Tool()
pointer.name='pointer'

var echo=false

var onMouseUp=function(e){
	if (echo){CAD.input(Math.round(e.point.x) + ', ' + Math.round(e.point.y))}
	points.push(e.point)
}

var onMouseMove=function(e){
	path.removeSegments()
	//note that points.concat doesn't change points in any way
	trace(path, points.concat(e.point))	
}

var path=null
var points=[]
var trace=function(){}

CT.define({
	name:'pointer', 
	about:'returns the paper coordinates of the mouse when clicked',
	action:function(){
		//paper commands installed in window scope
		tools.find(tool => tool.name == 'pointer').activate()
	},
	alias:'pp',
	topic:'tools', 
	terms:[]
})


// PUBLIC
exports.activate=function(options){
	options=options||{}
	echo=options.echo||false
	trace=options.trace||function(){}

	if (path==null){path=new Path()}
	path.strokeColor='silver'
	pointer.onMouseMove=onMouseMove
	pointer.onMouseUp=onMouseUp
	
	//paper commands installed in window scope
	tools.find(tool => tool.name == 'pointer').activate()
}

exports.getPoints=function(){return points}

exports.setTrace=function(traceFunction){trace=traceFunction}

exports.standby=function(success){
	//clear everything
	trace=function(){}
	path.removeSegments()
	points=[]
	tools.find(tool => tool.name == 'standby').activate()
	success('pointer on standby')
}