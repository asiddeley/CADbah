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


const cad=require('../electron/CAD.js')
const CT=require('../terminology/cadTerminology.js')
const line=require('../drawing/entity-line.js')

//const CT=cad.terminology
//const LINE=require('../drawing/line.js') //OR
//const LINE=cad.drawing.Line
//const tracer=cad.drawing.Line.prototype.tracer
//var path=new Path(); LINE.tracer(path, points); LINE.commit(path) 

const tracer=function(path, points){
	points.forEach(function(p, i, all){path.add(p)})
}

const action=function(success, failure){
	cad.pointer.activate({tracer:tracer, echo:true})
	cad.prompt('[x1, y1, x2, y2...][point & click...]OK', function(responseText){
		var points=[]
		//responseText.split(',').forEach(function(n, i, all){
		//	if (i%2==1){points.push(new Point(Number(all[i-1]), Number(n)))}
		//})
		points=cad.pointer.getPoints()
		var path=new Path()
		path.strokeColor = 'black'
		//paper point = cad vertice
		//line.tracer(path, points)
		cad.add(new line.Data({points:points}))
		//LINE.tracer(path, points)
		//
		//LINE.commit(path, undoer)
		cad.pointer.standby(success)
		//failure('line failed')
		success('line created')
	})
}

const undoer=function(id){
	
	
}

CT.define({
	name:'line', 
	alias:'ln',
	about:'adds lines to the drawing',
	topic:'entities',
	action:action,
	inputs:[
		{name:'success', type:'function', optional:true, remark:'success callback'},
		{name:'failure', type:'function', optional:true, remark:'failure callback'}
	]
})


