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

// load  paper.js, the graphic engine of choice
var paper=require('../node_modules/paper/dist/paper-core.js')

// install paper into window scope, so its accessible from anywhere in code
paper.install(window)

// load jquery-ui
require('../node_modules/jquery-ui-dist/jquery-ui.js')

// for CAD events
const EventEmitter=require('events') 
const EE = new EventEmitter()

// terms requires paper to be installed
const terms=require('../terms/terms.js')

// load support functions
const SF=require('./support.js')

const submit=function(ev){
	// console.log('submit occured')
	ev=ev||event			
	var input$=$('#cad-input')
	ev.preventDefault()
	terms.run(input$.val()) 
	input$.val("")
	return false
}

//////////////////////////////////
// PUBLIC 

exports.activate=function(options){

	options==options||{}

	if (typeof options.canvas=="undefined"){
		//with jquery $ wrapper
		this.canvas$=$('<canvas></canvas>').appendTo(window.document.body)
		//html element
		this.canvas=canvas$.get();
	} else {
		this.canvas=options.canvas;
		this.canvas$=$(options.canvas)
		//paper.setup(this.canvas)
	}

	paper.setup(this.canvas)	
	
	// Prepare console for messages
	if (typeof options.console!="undefined"){
		this.console=options.console
		this.console$=$(options.console)
	}

	SF.navbarSetup(options)
	
	// DRAWING DOCUMENT
	this.dxf.activate()
	
	// UNDOER
	//this.undoer.activate(this)
	
	//program input
	$('form').on('submit', submit)

};

exports.canvas=null
exports.canvas$=null
exports.console=null
exports.console$=null
exports.cmd=terms.run


exports.div=null;
exports.div$=null;
//dxf drawing handler
exports.dxf=require("../dxf/dxf.js")
exports.debug=function(){
	for (var i in arguments){
		//cout (CAD, "text", "class", count, limit)
		SF.cout(this, arguments[i],"cad-debug", this.debugcount++, this.debuglimit)
	};
};
exports.debugcount=0
exports.debuglimit=100

exports.emit=function(eventname, parameter){EE.emit(eventname, parameter)}

exports.msg=function(){
	for (var i in arguments){
		//cout (CAD, "text", "class", count, limit)
		SF.cout(this, arguments[i],"cad-msg", this.msgcount++, this.msglimit)
	}
}

exports.msgcount=0
exports.msglimit=100

//event programmer
exports.on=function(eventname, fun){EE.emit(eventname, fun)}

exports.options={
	admin:{user:"unnamed", disc:'arch'},
	actionsEnabled:false,
	database:null, //to be determined
}	

var promptStack=[{msg:'command', callback:submit}]
exports.prompt=function(msg, callback){
	
	//promptstack.push({msg:msg, callback:callback})
	var input$=$('#cad-input')
	var placeholder=input$.attr('placeholder')
	input$.attr('placeholder', msg)
	//hijack submit event
	$('form').off('submit', submit)
	$('form').one('submit', function(e){
		try{			
			callback(input$.val())
			input$.val('')
			return false
		}catch(e){
			CAD.debug(e)
		}finally{
			//restore command line and submit event
			input$.attr('placeholder', placeholder)
			$('form').on('submit', submit)
		}		
	})	
}

exports.run=terms.run
//Object.seal(exports)
//exports.undoer=require("./helpers/undoer")


