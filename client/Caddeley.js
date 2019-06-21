/*****************************************************
Caddeley
Computer Aided Design - Elementary !
Copyright (c) 2019 Andrew Siddeley

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
var cout=function(CAD, htm, cssClass, count, limit){
	var p$=$("<p></p>").addClass(cssClass).attr("id", cssClass + count).html(htm);
	//add new message
	CAD.console$.append(p$);
	//delete old messages	
	if (count>limit){
		$("[id="+ cssClass + (count-limit) + "]").remove();
	}
	CAD.console.scrollTop=CAD.console.scrollHeight;
};

// PUBLIC
exports.appname="caddeley";
exports.activate=function(options){

	// check options
	if (typeof options=="undefined") {this.options=options={};}
	else {this.options=options;}
	
	/* Prepare user interfaces and controls...  
	Looks in options for {... div:HTMLelementReference, ...} or
	creates it from scratch if not found */
	//uisetup(this, {autoOpen:false});	
	

	// Prepare canvas
	if (typeof options.canvas=="undefined"){
		//with jquery $ wrapper
		this.canvas$=$('<canvas></canvas>').appendTo(window.document.body);
		//html element
		this.canvas=canvas$.get();
	} else {this.canvas=options.canvas;this.canvas$=$(options.canvas);}

	// Prepare optional console for messages
	if (typeof options.console!="undefined"){
		this.console=options.console;
		this.console$=$(options.console);
	};
		
	// GRAPHIC CONTEXT
	this.gc=this.canvas.getContext("2d");
		
	// DOCUMENT
	this.drawing.activate(this);
	
};

/* convenience function that takes a string and returns an array containing [0] the first word and [1] the remainder of the string */
exports.chop=function(argstr){
	var firstword=argstr.split(" ")[0];
	var rest=argstr.substring(firstword.length).trim();
	return [firstword, rest];
};	
exports.commander=require("./commander.js");
exports.canvas=null;
exports.canvas$=null;
exports.console=null;
exports.console$=null;
exports.cmd=function(input){this.commander.input(this, input);};
exports.div=null;
exports.div$=null;
exports.drawing=require("./drawing.js");

//GRAPHIC CONTEXT
exports.gc=null;

// DEBUGGING
exports.debug=function(){
	for (var i in arguments){
		//cout (CAD, "text", "class", count, limit)
		cout(this, arguments[i],"cad-debug", this.debugcount++, this.debuglimit);
	};
};
exports.debugcount=0;
exports.debuglimit=100;

// ENGINE
exports.engine=null;
	
// MESSAGING
exports.msg=function(){
	for (var i in arguments){
		//cout (CAD, "text", "class", count, limit)
		cout(this, arguments[i],"cad-msg", this.msgcount++, this.msglimit);
	};
};
exports.msgcount=0;
exports.msglimit=100;

// Extended by user in API functions above
exports.options={
	admin:{user:"unnamed", disc:'arch'},
	actionsEnabled:false,
	database:null, //to be determined
};
	



