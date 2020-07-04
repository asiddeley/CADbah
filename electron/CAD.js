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
//PRIVATE STATIC

//first, install paper into window scope so its accessible from anywhere in code
const paper=require("../node_modules/paper/dist/paper-core.js")
paper.install(window)

//requires
const $UI=require("../node_modules/jquery-ui-dist/jquery-ui.js")
const DXF=require("../drawing/dxf.js")
//const EventEmitter=require("events") 
//const EE = new EventEmitter()
const TERMS=require("../terminology/cadTerminology.js")
const SF=require("./support.js")
const REMOTE=require("electron").remote
const WM=REMOTE.require("electron-window-manager")
const POINTER=require("../terminology/pointer.js")
const STANDBY=require("../terminology/standby.js")

//private variables
var OPTIONS={
	canvas:{},
	navbar:{},
	inputs:{},
	inputsTimeout:250,
	form:{}
}

var onmousewheel=function(e){console.log(e.deltaY)}

//DEP
//var dxf={}


////////////////////////
//external interactions

WM.sharedData.watch("command", function(self, action, newvalue, oldvalue){
	//command watch, set from tilemenu.html or other rendering process
	//report success|failure result to other process(es) via sharedData
	//newvalue eg. {command:"snapper;e;1;exit", title:"endpoint", date:"20200418..."}
	var success=function(result){
		WM.sharedData.set("command-response", {
			success:true, 
			result:result, 
			date:new Date()
		})		
	}
	var failure=function(error){
		WM.sharedData.set("command-response", {
			success:false,
			result:error, 
			date:new Date()
		})
	}
	
	TERMS.submit(newvalue.data, success, failure)	
})

//////////////////////////////////
// PUBLIC 
exports.ready=function(options){

	options=options||{}

	if (typeof options.canvas=="undefined"){
		var c$=$("<canvas></canvas>").appendTo(window.document.body)
		options.canvas=c$.get()
	}

	if (typeof options.form=="undefined"){
		var f$=$("<form></form>").appendTo(window.document.body)
		options.form=f$.get()
	}

	if (typeof options.inputs=="undefined"){
		//<input id="cad-inputs" type="text" placeholder="command">
		var i$=$("<input></input>").appendTo(options.form)
		i$.attr("type","text").attr("placeholder","command")
		options.inputs=i$.get()
		//<input type="submit" value="Ok">			
		var ok$=$("<input></input>").appendTo(window.document.body)
		ok$.attr("type","submit").val("OK")
	} 

	Object.assign(OPTIONS, options)
	
	//to allow for wheel to control zoom or other. Change handler with; cad.onmousewheel(handler)
	OPTIONS.canvas.addEventListener('wheel', function(e){onmousewheel(e)})	

	paper.setup(options.canvas)	
	SF.navbarSetup(options)

	//DEPRECATED - just use terminology actions and paper.js elements
	//dxf=new DXF.Dxf()
	
	//pass options, mainly {inputs:HTMLinputElement} to bind the form input element to the terminology processor
	TERMS.ready(options)
	
	//ready broadcast for modules that require paper setup
	WM.sharedData.set("ready", {data:{}, cad:exports, date: new Date()})
}

//shortcut
exports.add=function(entity){
	CAD.echo(entity.type + " added")
	//DXF.add(entity)
}

//run a command directly, bypassing the command line input
exports.cmd=TERMS.run

//debug - programming & error messages
exports.debug=function(){
	for (var i in arguments){
		WM.sharedData.set("report", {html:arguments[i], date:new Date(), debug:true})
	}
}

exports.debugshow=function(val){
	console.log("debugshow:", val)
}

//DEPRECATED
//exports.getdxf=function(){return dxf}

exports.echo=function(text, timeout){
	timeout=timeout||4000
	WM.sharedData.set("status", {text:text, timeout:timeout, date:new Date()})	
}

//exports.emit=function(eventname, parameter){EE.emit(eventname, parameter)}

exports.escape=TERMS.escape

exports.msg=function(){
	for (var i in arguments){
		WM.sharedData.set("report", {text:arguments[i], date:new Date()})
	}
}

//exports.on=function(eventname, fun){EE.emit(eventname, fun)}

exports.options={
	admin:{user:"unnamed", disc:"arch"},
	actionsEnabled:false,
	database:null, 
}	

exports.onmousewheel=function(handler){
	onmousewheel=handler||function(){}
	//OPTIONS.canvas.addEventListener('wheel', handler)	
}


//tools for getting points from the project
exports.pointer=POINTER

//method for prompting user for specific input
exports.prompt=TERMS.prompt

//pass command directly to the Terminology processor, bypassing form/input element
exports.run=function(content){
	exports.msg("RUN:",content)
	TERMS.run(content)
}

exports.report=exports.msg

exports.status=exports.echo

//passes command to the form/input element and triggers submit event 
exports.submit=TERMS.submit

//make the standby tool active thereby deactivating current tool
exports.standby=STANDBY.activate

exports.wipe=function(){
	WM.sharedData.set("report", {wipe:true, date:new Date()})
}


////////////
// globalize
window.cad=exports
window.CAD=exports
