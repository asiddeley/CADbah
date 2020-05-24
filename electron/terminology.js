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
	// Form binding and input functions  
	var OPTIONS={
		inputs:{}, //input element where commands are typed by user
		inputsTimeout:100,
		form:{} //form that triggers submit
	}

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
		}, OPTIONS.inputsTimeout)
	}
	this.submit=submit

	function onSubmit(ev, success, failure){
		ev.preventDefault() 
		
		//default success/failure functions
		success=success||function(re){cad.msg(re)}
		failure=failure||function(er){cad.debug(er)}

		//pop top or first {prompt, handler} object that was pushed by cad.prompt()
		var ph=(promptstack.length>1)?promptstack.pop():promptstack[0]
		
		//process input one term at a time 
		var input$=$(OPTIONS.inputs)
		var queue=input$.val().split(";")
		var next=queue.shift()
		var rest=queue.join(";")
		input$.val(rest)	
		ph.handler(next, success, failure)

		placeholder(promptstack[promptstack.length-1].prompt, true)

		if (rest.length>0){
			setTimeout(function(){submit(rest)}, OPTIONS.inputsTimeout)			
		}
	}

	var promptstack=[{prompt:"command", handler:run}]

	function escape(){
		//clears the promptstack, keeping the root handler
		while (promptstack.length>1){promptstack.pop()}
		//clear the input	
		$(OPTIONS.inputs).val("")
		//placeholder(promptstack[0].prompt)
	}
	this.escape=escape

	function prompt(text, handler){
		text=text||" "
		handler=handler||function(){}
		promptstack.push({prompt:text, handler:handler})
		placeholder(text)
	}
	this.prompt=prompt

	function placeholder(text){
		//TO DO: calculate c=characters from pixel width of input field
		clearInterval(placeholderid)
		var x=0, d=1, c=80
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





