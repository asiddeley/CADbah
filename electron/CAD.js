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

//requires
//first, install paper into window scope so its accessible from anywhere in code
const paper=require("../node_modules/paper/dist/paper-core.js"); paper.install(window)
const $UI=require("../node_modules/jquery-ui-dist/jquery-ui.js")
const DXF=require("../drawing/dxf.js")
const EventEmitter=require("events") 
const EE = new EventEmitter()
const TERMS=require("../terminology/cadTerminology.js")
const SF=require("./support.js")
const REMOTE=require("electron").remote
const WM=REMOTE.require("electron-window-manager")
const POINTER=require("../terminology/pointer.js")

// private variables
const queue_timeout=25
var canvas=null
var canvas$=null
var dxf={}
var input$

// array with default command handler for use by cad.prompt(...)
var promptstack=[{prompt:"command", handler:TERMS.run}]

const onSubmit=function(ev, success, failure){
	ev.preventDefault() 
	
	//var cad=exports
	success=success||function(re){cad.msg(re)}
	failure=failure||function(er){cad.debug(er)}

	//pop top or first {prompt, handler} object that was pushed by cad.prompt()
	var ph=(promptstack.length>1)?promptstack.pop():promptstack[0]
	
	//process input one term at a time 
	var queue=input$.val().split(";")
	var nextCommand=queue.shift()
	ph.handler(nextCommand, success, failure)

	//cleanup
	input$.attr("placeholder", promptstack[promptstack.length-1].prompt)
	input$.val("")
	setTimeout(function(){
		var remainingCommands=(queue.join(";"))
		if (remainingCommands.length>0){
			input$.val(remainingCommands)
			setTimeout(submit, queue_timeout)			
		}
	}, queue_timeout)
}


const submit=function(input, success, failure){
	//loads the command line and pulls the trigger 
	exports.input(input)
	$("form").trigger("submit",[success, failure])
}

////////////////////////
//external interactions

//listen for x-submit from the tilemenu.html rendering process
WM.sharedData.watch("x-submit", function(self, action, newvalue, oldvalue){
	//report success|failure result to other process(es) via sharedData
	//newvalue eg. {command:"snapper;e;1;exit", title:"endpoint", date:"20200418..."}
	var success=function(result){
		WM.sharedData.set("x-submit-response", {
			success:true, 
			result:result, 
			date:new Date()
		})		
	}
	var failure=function(error){
		WM.sharedData.set("x-submit-response", {
			success:false,
			result:error, 
			date:new Date()
		})
	}
	
	submit(newvalue.command, success, failure)	
})

//////////////////////////////////
// PUBLIC 
exports.activate=function(options){

	options=options||{}

	if (typeof options.canvas=="undefined"){
		canvas$=$("<canvas></canvas>").appendTo(window.document.body)
		canvas=canvas$.get()
	} else {
		canvas=options.canvas
		canvas$=$(options.canvas)
	}

	paper.setup(canvas)	
	SF.navbarSetup(options)
	dxf=new DXF.Dxf()

	//UNDOER
	//this.undoer.activate(this)
	
	//program the command input
	input$=$(options.input||"#cad-input")
	$("form").on("submit", onSubmit)
}

//shortcut
exports.add=function(entity){
	CAD.echo(entity.type + " added")
	//DXF.add(entity)
}

exports.cmd=TERMS.run

//debug - programming & error messages
exports.debug=function(){
	for (var i in arguments){
		WM.sharedData.set("xMessage", {html:arguments[i], date:new Date(), debug:true})
	}
}

exports.debugshow=function(val){
	console.log("debugshow:", val)
}

exports.getdxf=function(){return dxf}

exports.echo=function(text, timeout){
	timeout=timeout||4000
	WM.sharedData.set("x-echo", {text:text, timeout:timeout, date:new Date()})	
}

exports.emit=function(eventname, parameter){EE.emit(eventname, parameter)}

exports.escape=function(){
	//clear the promptstack, keeping default
	while (promptstack.length>1){promptstack.pop()}
	//clear the input	
	input$.val("")
}

exports.input=function(content){
	//aggregates content to the command line without submitting it
	if (typeof content=="string") {
		var comma=(input$.val().length>0)?", ":""
		input$.val(input$.val()+ comma + content)
	}
}

exports.msg=function(){
	for (var i in arguments){
		WM.sharedData.set('x-message', {text:arguments[i], date:new Date()})
	}
}

exports.xFunction=function(argo){
	//EXPERIMENTAL
	argo=argo||{}
	var tag=argo.tag||"toggle"
	var input=JSON.stringify(argo.input||{a:1, b:2})
	var body=argo.body||"return {a:a, b:b}"

	WM.sharedData.set("x-function", {
		tag:tag, 
		input:input,
		body:body,
		date:new Date()
	})
}

exports.on=function(eventname, fun){EE.emit(eventname, fun)}

exports.options={
	admin:{user:"unnamed", disc:"arch"},
	actionsEnabled:false,
	database:null, 
}	

exports.pointer=POINTER

exports.prompt=function(prompt, handler){
	promptstack.push({prompt:prompt, handler:handler})
	input$.attr("placeholder", prompt)
}

//input content to interpreter, bypassing command line
exports.run=function(content){
	exports.msg("RUN:",content)
	TERMS.run(content)
}

exports.report=exports.msg
exports.status=exports.echo
exports.wipe=function(){
	WM.sharedData.set("x-message", {wipe:true, date:new Date()})
}

//exports.undoer=require("./helpers/undoer")
window.cad=exports
window.CAD=exports
