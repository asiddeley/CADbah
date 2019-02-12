/*****************************************************
CADBAH = Computer Aided Design Be Architectural Heroes
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


var UI=function(div, title, options){

	// div - DOM element container for user intefaces (UI) 
	this.div$=$('<div></div>');
	if (typeof title != 'undefined' && title != null) {this.alias=title;}
	else {this.alias='UI';} 
	if (typeof options == 'undefined' || options==null) {options={};}
	options=$.extend(
		{ignoreInput:false, draggable:true, title:this.alias},
		options
	);
	
	/* If div is provided, then the intention is to make this UI its own dialog otherwise
	it's assumed this will be a ui contianed in and managed by another UI */
	if (typeof div != 'undefined' && div != null){ 
		this.div$=$(div).append(this.div$);
		//use jquery-ui to turn div$ into a floating dialog box
		this.div$.dialog(options);
	}
	
	// REGISTER EVENTS 
	CAD.fc.on(this.getEvents());
	
	// Init inputHandlers, array of {alias:['a'], desc:'about', handler:function}
	// or an empty array [] if options.ignoreInput is true. Ignoring input 
	// may be necessary if UI is not a stand-alone or used within another dialog
	if (!options.ignoreInput) {this.inputHandlers=this.getInputHandlers();}
	else {this.inputHandlers=[];}
	
	//Add this UI instance to list all ui instances.
	if (typeof UI.instances =='undefined'){UI.instances=[];} 
	else {UI.instances.push(this);}

	return this;
};

UI.prototype.activeUI=function(ui){
	// triggers an activeui event
	// used by inputHandler to activate a ui with a command input
	CAD.fc.trigger('activeui', [ui]);
};

UI.prototype.getInputHandlers=function(){
	//returns an array of {alias:['a'], desc:'about', handler:function}
	//these inputHamdlers are common for all UI if inheritor so chooses
		
	return [{
		inputs:['events', 'ev'],
		desc:'Lists the events the UI responds to',
		handler:this.listEvents
	},{
		inputs:['keywords', 'kw'],
		desc:'Lists the inputs or commands the UI responds to',
		handler:this.listInputs
	},{
		inputs:['clc'],
		desc:'Clear console',
		handler:function(ev){console.clear();}
	}];
};

UI.prototype.getEvents=function(){
	/* 
	Returns a list of event handlers that all UIs respond to.  Event handler below -
	{name:event_name_str, desc:description_str, data:passed_to_handler_as_arg0, handler:fn}
	Beware of using 'this' in event handlers as it will refer to the callers context
	Instead assume 'this' is passed in event data thus... handler(ev){ev.data.toggle();}
	*/
	return [{
		name:'input', 
		desc:'occurs when a user command is entered', 
		data:this, 
		handler:this.onInput
	},{
		name:'activeui',
		desc:'occurs when a UI takes control of mouse events so that UI with control can release it',
		data:this,
		handler:this.onActiveUI
	}];
};

UI.prototype.listEvents=function(ev){
	//keys - Array of event names
	var eh=ev.data.getEvents(); 
	//BIM.fun.log('*** UI:'+ev.data.alias); 
	console.log('*** UI:',ev.data.alias); 
	//list commands and description for eash input handler
	for (var i in eh){
		//BIM.fun.log("event:"+eh[i].name, "description:"+eh[i].desc);
		console.log("event:"+eh[i].name, "description:"+eh[i].desc);
	}
};

UI.prototype.listInputs=function(ev){
	var ih=ev.data.inputHandlers;
	//name of UI
	//BIM.fun.log('*** UI:'+ev.data.alias); 
	console.log('*** UI:',ev.data.alias); 
	//list commands and description for eash input handler
	for (var i in ih){
		//BIM.fun.log("command(aliases):"+ih[i].inputs.join(", "), "description:"+ih[i].desc);
		console.log("command(aliases):"+ih[i].inputs.join(", "), "description:"+ih[i].desc);
	}
};	

UI.prototype.onActiveUI=function(ev, activeGUI){
	// ev - event
	// ev.data - 'this' as passed from UI decendant instance
	// activeGUI - ui in focus
	//console.log('onActiveUI:', activeGUI.alias);
};

UI.prototype.onInput=function(ev, input){
	//CAD.fc.log(input);
	//call others to process input 
	
	var firstWord;
	if (typeof input != 'undefined'){firstWord=input.split(' ',1)[0];} 
	else {firstWord='undefined';}
	
	//var ih=ev.data.getInputHandlers();
	var ih=ev.data.inputHandlers;

	var propagate=true;
	for (var i in ih){
		//if (ih[i].inputs.find(tester)){ //find not defined in Explorer 11
		if (ih[i].inputs.indexOf(firstWord) != -1) {
			//found inputHandler that matches input so execute handler so...
			propagate=false; //stop event propagation
			try{ih[i].handler(ev);} //safely execute handler
			catch(er){console.log(er);}
		}		
	}	
	return propagate;
};

UI.prototype.onFocus=function(ev){
	// focus handler if UI is a dialog
	CAD.fc.trigger('activegui', [ev.data]);
};

UI.prototype.toggle=function(){
	if (this.div$.is(':ui-dialog')){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	}
};

exports.UI=UI;


