/*****
CADBAH
Computer Aided Design * Be Architectural Heroes
Copyright (c) 2018, 2019, 2020  Andrew Siddeley
MIT License
*****/

/////////////////////////////
// dictionary and interperter with functions to bind to a form's input element

function Terminology(){
	
	const terms=[]
	const addTerm=function(term){
		if (!(term instanceof this.Term)) {
			if (typeof term == 'object'){term=new this.Term(term)}
			else {return}
		}
		terms.push(term)
	}
	this.addTerm=addTerm
	this.define=addTerm

	this.directory=function(title){
		title=title||'Terminology'
		var names=terms.map(function(t){return t.name})
		var aliasterms=terms.filter(function(t){return (typeof t.alias == 'string')})
		var dir=names.concat(aliasterms.map(function(t){return t.alias + ' (alias)'}))
		dir.sort()
		return dir
	}
	
	function runExpression(expression, success, failure){
		var body=`return ${expression}`
		try {
			var fun=new Function(body)
			success(fun())
		} catch (er) {
			failure(er)
		}
	}
	
	const run=function(command, success, failure){
		//command = term OR expression
		success=success||function(){}
		failure=failure||function(){}
		var term=terms.find(function(i){return command.includes(i.name)})
		//console.log("running...", term)
		if (term){
			try {term.action(success, failure)}
			catch(e){failure(e)}
		} else {
			runExpression(command, success, failure)			
		}		
	}
	this.run=run
	
	function Term(options){
		options=options||{}
		this.name=options.name||'unnamed' 
		this.about=options.about||'No description'
		this.alias=options.alias||null
		this.action=options.action||function(){}
		this.inputs=options.inputs||[] 
	}
	this.Term=Term
	
	this.createTerm=function(options){
		return new Term(options)		
	}
	
	///////////////////////////////////////////
	// Form binding and input options & functions 
	
	var OPTIONS={
		//number of characters for the input placeholder before it starts bouncing or boinks 
		boinkThreshold:80,
		//character that separates commands in the input field
		splitter:";",
		//input element where commands are inputted by the user
		inputs:{}, 
		//default wait time in milliseconds before promptstack action handlers are executed 
		timeout:100,
		//HTML form element that triggers submit
		form:{} 
	}

	//ready, sets the options and binds the form element submit event to the root handler
	function ready(options){
		options=options||{}
		Object.assign(OPTIONS, options)
		$(options.form).on("submit", onSubmit)
	}
	this.ready=ready

	const bind=function(form){ready({form:form})}
	this.bind=bind

	function submit(text, success, failure){
		$(OPTIONS.inputs).val(text||"")
		//console.log("Submitting...", text)
		setTimeout(function(){
			$(OPTIONS.form).trigger("submit",[success, failure])
		}, OPTIONS.timeout)
	}
	this.submit=submit

	function onSubmit(ev, success, failure){
		ev.preventDefault() 
		
		//default success/failure functions
		success=success||function(re){cad.msg(re)}
		failure=failure||function(er){cad.debug(er)}

		//pop top or first {prompt, handler} object that was pushed by cad.prompt()
		var head=(promptstack.length>1)?promptstack.pop():promptstack[0]
		var sp=OPTIONS.splitter
		var id
		
		//process input one term at a time 
		var input$=$(OPTIONS.inputs)
		var queue=input$.val().split(sp)
		var command=queue.shift()
		var remains=queue.join(sp)
		//input$.val(remains)
		//allows terminology/action to release the HOLD by calling success()/failure().  
		//Eg. terminology line
		var setter=(head.hold==true)?function(){HOLD=true}:function(){HOLD=false}
		head.handler(
			command, 
			function(){setter();success()},
			function(){setter();failure()}
		)

		//looking ahead...
		//show prompt
		var next=promptstack[promptstack.length-1]
		//placeholder(promptstack[promptstack.length-1].prompt)
		placeholder(next.prompt)
		//console.log("NEXT PROMPT:",next.prompt)
		HOLD=next.hold||false
		if (HOLD==false){input$.val(remains)}

		//process remaining commands or hold if required by current handler 
		if (remains.length>0){
			//setTimeout(function(){submit(rest)}, OPTIONS.timeout)		
			id=setInterval(function(){
				//loop until hold release ie. success() called in terminology 
				if (HOLD==false){	
					input$.val(remains)	
					submit(remains)
					clearTimeout(id)	
				} 
			}, OPTIONS.timeout)
		}
	}
	var HOLD=false

	var promptstack=[{prompt:"command", handler:run, hold:false}]

	function escape(){
		//clears the promptstack, keeping the root handler
		while (promptstack.length>1){promptstack.pop()}
		//clear the input	
		$(OPTIONS.inputs).val("")
		//placeholder(promptstack[0].prompt)
	}
	this.escape=escape

	function prompt(text, handler, hold){
		//text for placeholder to prompt user for input
		text=text||" "
		//true means wait for for hold release before processing more commands from prompt stack
		hold=hold||false
		//handler for processing text
		handler=handler||function(){}
		promptstack.push({prompt:text, handler:handler, hold:hold})
		placeholder(text)
	}
	this.prompt=prompt

	function placeholder(text){
		//console.log("PROMPT:",text)
		clearInterval(placeholderid)
		var x=0, d=1, c=OPTIONS.boinkThreshold
		//scrolls text back and forth in form/input area when text is wider than the area 
		function boink(){
			//change direction
			if (x+d+c>text.length+2){d=-1} else if (x+d<-2){d=1}
			x+=d
			$(OPTIONS.inputs).attr("placeholder", text.substring(x,x+c))
		}	
		if (text.length>c) {placeholderid=setInterval(boink, 100)}
		else {$(OPTIONS.inputs).attr("placeholder", text)}	
	}
	var placeholderid=null
}

//////////
//exports

exports.Terminology=Terminology





