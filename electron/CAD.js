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
var paper=require('../node_modules/paper/dist/paper-core.js')
paper.install(window)

//requires
const $UI=require('../node_modules/jquery-ui-dist/jquery-ui.js')
const drawing=require("../drawing/drawing.js")
const EventEmitter=require('events') 
const TERMS=require('../terms/terms.js')
const SF=require('./support.js')
const REMOTE = require('electron').remote
const WM=REMOTE.require('electron-window-manager')
const POINTER=require('../terms/pointer.js')

//definitions
const EE = new EventEmitter()
var input$

const onSubmit=function(ev, success, failure){
	ev.preventDefault() 
	//console.log('submit occured...', ev, 'success:', success, 'failure', failure)
	
	var cad=exports
	success=success||function(re){cad.msg(re)}
	failure=failure||function(er){cad.debug(er)}

	//pop top {prompt, handler} object that was pushed by cad.prompt()
	var ph
	if(promptstack.length>1){ph=promptstack.pop()}
	else{ph=promptstack[0]}
	
	//execute the command 
	ph.handler(input$.val(), success, failure)

	//cleanup
	input$.val('')
	input$.attr('placeholder', promptstack[promptstack.length-1].prompt)
	return false
}

//default command handler
var promptstack=[{prompt:'command', handler:TERMS.run}]

const submit=function(command, success, failure){
	//loads the command line and pulls the trigger 
	exports.input(command)
	$('form').trigger('submit',[window.event, success, failure])
}

WM.sharedData.watch('xSubmit', function(prop, action, newValue, oldValue){
	//listen for xSubmit from the tilemenu.html rendering process
	console.log('xSubmit received', newValue.command)
	submit(newValue.command,
		function(result){
			//report success result to other process via sharedData
			WM.sharedData.set('xSuccess', {result:result, date:new Date()})
		},
		function(er){
			//report failure error to other process via sharedData
			WM.sharedData.set('xFailure', {result:er, date:new Date()})
		}		
	)	
})


//////////////////////////////////
// PUBLIC 

exports.activate=function(options){

	options==options||{}

	if (typeof options.canvas=="undefined"){
		this.canvas$=$('<canvas></canvas>').appendTo(window.document.body)
		this.canvas=canvas$.get()
	} else {
		this.canvas=options.canvas
		this.canvas$=$(options.canvas)
	}


	paper.setup(this.canvas)	
	SF.navbarSetup(options)
	drawing.activate()

	//UNDOER
	//this.undoer.activate(this)
	
	//program the command input
	input$=$('#cad-input')
	$('form').on('submit', onSubmit)

}

exports.canvas=null
exports.canvas$=null
exports.cmd=TERMS.run

//debug - programming & error messages
exports.debug=function(){
	for (var i in arguments){
		WM.sharedData.set('xMessage', {html:arguments[i], date:new Date(), debug:true})
	}
}

exports.debugshow=function(val){
	console.log('debugshow:', val)
}

exports.emit=function(eventname, parameter){EE.emit(eventname, parameter)}

exports.escape=function(){
	//resets the promptstack	
}

exports.input=function(content){
	//aggregates content to the command line without submitting it
	if (typeof content=='string') {
		var comma=(input$.val().length>0)?', ':''
		input$.val(input$.val()+ comma + content)
	}
}

exports.msg=function(){
	for (var i in arguments){
		WM.sharedData.set('xMessage', {html:arguments[i], date:new Date()})
	}
}

exports.on=function(eventname, fun){EE.emit(eventname, fun)}

exports.options={
	admin:{user:"unnamed", disc:'arch'},
	actionsEnabled:false,
	database:null, 
}	

exports.pointer=POINTER

exports.prompt=function(prompt, handler){
	promptstack.push({prompt:prompt, handler:handler})
	input$.attr('placeholder', prompt)
}

//input content to interpreter, bypassing command line
exports.run=function(content){
	exports.msg('RUN:',content)
	TERMS.run(content)
}

exports.wipe=function(){
	WM.sharedData.set('xMessage', {wipe:true, date:new Date()})
}

//exports.undoer=require("./helpers/undoer")


