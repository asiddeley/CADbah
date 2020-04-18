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


//const cad=require('../electron/CAD.js')
const CT=require("../terminology/cadTerminology.js")
const LAY=require('../drawing/dxf-layer.js')
const LIB=require('../electron/support.js')

var _success=function(){cad.status('layer_success')}
var _failure=function(){cad.status('layer_failure')}

const action=function(success, failure){
	_success=success||_success
	_failure=failure||_failure
	cad.prompt("Current | Edit | List | New | Report | eXit", function(entered){
		entered=entered||""
		switch (entered.toUpperCase()){
			case "C":
			case "CURRENT":cad.prompt("enter layer to make current", current); break
			case "E":
			case "EDIT":cad.prompt("enter new layer name", edit); break 
			case "L":
			case "LIST":list(); break;
			case "N":
			case "NEW":cad.prompt("enter new layer name", add); break
			case "R":
			case "REPORT":cad.prompt("All|<layer name> OK", report); break
			case "X":
			case "EXIT":_success("layer done"); break
			default: _failure("layer input not recognized: "+entered)		
		}
	})
}

const add=function(entered){
	LAY.create({name:entered})
	_success(entered + " layer added")
	//continue in layer 
	action()
}
const current=function(entered){
	_success("layer current not inplemented. " + entered)
	action()
}
const edit=function(entered){
	_success("layer edit not inplemented. " + entered)
	action()
}
const list=function(entered){
	cad.report(LIB.format("Layer Names", LAY.getNames()))
	action()	
}

const report=function(entered){
	_success("layer info not inplemented. " + entered)
	action()
}



const undoer=function(id){
	
	
}

CT.define({
	name:'layer', 
	alias:'la',
	about:'various layer creation & discovery functions',
	topic:'layers',
	action:action,
	inputs:[
		{name:'success', type:'function', optional:true, remark:'success callback'},
		{name:'failure', type:'function', optional:true, remark:'failure callback'}
	]
})


