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
//const line=require('../drawing/entity-line.js')

var _success

const action=function(success, failure){
	//cad.pointer.activate({trace:line.trace, echo:true})
	cad.prompt("Add|Current|Edit|Info|List OK", function(entered){
		_success=success
		entered=entered||""
		switch (entered.toUpperCase()){
			case "A":
			case "ADD":cad.prompt("enter new layer name", add); break
			case "C":
			case "CURRENT":cad.prompt("enter layer to make current", current); break
			case "E":
			case "EDIT":cad.prompt("enter new layer name", edit); break 
			case "I":
			case "INFO":cad.prompt("All|<layer name> OK", info); break
			case "L":
			case "LIST":list(); break
			default: success("layer input not recognized")		
		}
	})
}

const add=function(entered){
	//cad.echo("layer add not inplemented: "+entered)
	_success("layer add not inplemented. " + entered)	
}
const current=function(entered){
	//cad.echo("layer current not inplemented")
	_success("layer current not inplemented. " + entered)
}
const edit=function(entered){
	//cad.echo("layer edit not inplemented")
	_success("layer edit not inplemented. " + entered)
	
}
const info=function(entered){
	//cad.echo("layer info not inplemented")
	_success("layer info not inplemented. " + entered)
}
const list=function(entered){
	//cad.echo("layer list not inplemented")
	//_success("layer list not inplemented. " + entered)
	
	
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


