/*****
CADBAH
Computer Aided Design * Be Architectural Heroes
Copyright (c) 2018, 2019, 2020  Andrew Siddeley
MIT License
*****/

//don't require cad.  This file may be required by separate processes cad.html vs tilemenu.html
//var cad=require('../electron/CAD.js')


///////////////////////////////////
// LOCAL 

MessageBoard=function(options){
	options=options||{}
	if(!options.el){var div=$('<div></div>');$('body').append(d)}
	this.el=options.el||div	
	this.count=options.count||0
	this.limit=options.limit||100
	this.cssDebug=options.cssDebug||'cad-debug'
	this.cssMessage=options.cssMessage||'cad-message'
	this.msg=options.msg||'Message Board'
}

MessageBoard.prototype.wipe=function(){
	this.count=0
	$(this.el).empty()
}

MessageBoard.prototype.debug=function(msg){
	var p$=$("<p></p>")
	p$.addClass(this.cssDebug).attr("id", this.cssDebug + this.count).html(msg)
	$(this.el).append(p$)
	if (this.count>this.limit){
		$("[id="+ this.cssDebug + (this.count-this.limit) + "]").remove()
	}
	this.gotoBottom()
}

MessageBoard.prototype.debugShow=function(showTrue){
	showTrue=showTrue||1
	// change the contents of <style> </style> 
	var bug$=$("#cad-debug-style")
	if (bug$.length==0){
		// error
		this.debug("missing style tag (id='cad-debug-style')")
		return
	}
	if(showTrue==1){
		bug$.html(bug$.html().replace("display:none","display:block"))
		this.msg('Error messages displayed')
	} 
	else if(showTrue==0) {
		bug$.html(bug$.html().replace("display:block","display:none"))
		this.msg('Error messages hidden')			
	}
	this.gotoBottom()
}

MessageBoard.prototype.message=function(msg){
	var p$=$("<p></p>")
	p$.addClass(this.cssMessage).attr("id", this.cssMessage + this.count).html(msg)
	$(this.el).append(p$)
	if (this.count>this.limit){
		$("[id="+ this.cssMessage + (this.count-this.limit) + "]").remove()
	}
	this.gotoBottom()
}

MessageBoard.prototype.gotoBottom=function(){
	$(this.el).animate({scrollTop: $(this.el)[0].scrollHeight}, 200)
}



////////////////////////////////////
// EXPORTS
exports.LocalStore=function(path, defaultContent, defaultContentRules){
	if (arguments.length < 3){
		throw('LocalStore requires 3 arguments')
	}
	content=defaultContent||{}
	try { 
		if(!defaultContentRules) {content = require(path)}
	}
	catch(err){
		//console.log('Error reading JSON from (path):', path)
	}	
	Object.assign(this, content)
	//console.log('localStore:',this)
	this.stringify=function(){return JSON.stringify(this)}
	this.set=function(name, val){
		if (name && val){this[name]=val}
		try {FSP.writeFileSync(path, this.stringify())}
		catch(err){
			console.log('Error saving JSON to (path): ', path)
		}
	}
}


exports.MessageBoard=MessageBoard

exports.navbarSetup=function(options){
	options=options||{}
	input$=$(options.input||'cad-input')
	// setup Navbar using jquery-ui controlgroup widget
	$(options.navbar||'cad-navbar').controlgroup({items:{
		// widgetToApply:selector
		"button": "a, button, input[type=text], input[type=button], input[type=submit]",
		"controlgroupLabel": ".ui-controlgroup-label",
		"checkboxradio": "input[type='checkbox'], input[type='radio']",
		"selectmenu": "select",
		"menu":"ul, .dropdown-items",
		"spinner": ".ui-spinner-input"
	}});
	// init dropdown menus... 
	$(".menu").menu().css("position","absolute", "width", "200px").hide()
	// auto cleanup any open dropdown menus
	$(".menu").on('mouseleave',function(){$(".menu").hide()})
	// auto clear dropdown autohide (DDAH)
	$(".menu").on('mouseenter',function(){clearTimeout(document.DDAH)})
	// attach menus to navbar buttons
	$(options.navbar||'cad-navbar').find('button').each(function(i, e){
		var mid=$(e).attr('menu')
		var bid=$(e).attr('id')
		//console.log('attaching ', mid, ' to ', bid)
		$(e).mouseenter({mid:mid, bid:bid}, function(ev){
			//note how data is passed using first argument of mouseenter
			var navbutton=ev.data.bid; 
			var menu=ev.data.mid;
			$('.menu').hide();
			// Show and position menu of interest at its navbutton
			$('#'+ menu).show().position({
				my:'left top',
				at:'left bottom',
				of:'#'+navbutton
			});
			// autohide in case menu is left hanging - don't forget to disarm if entered
			document.DDAH=setTimeout(function(){$('#'+menu).hide();}, 2000);
		})
	})
}

////////////////////////
// dictionary and interperter

exports.Terminology=function(){

	var addvar=function(name, content){
		context+=`var ${name}=contexto.${name};`
		contexto[name]=content
	}
	var contexto={'hello':function(){return 'hello world!'}}
	var context='var hello=contexto.hello;'
	var terms=[]
	
	this.addTerm=function(term){
		if (!(term instanceof this.Term)) {
			if (typeof term == 'object'){term=new this.Term(term)}
			else {return}
		}
		terms.push(term)
		addvar(term.name, term.action)
		if (typeof term.alias=='string'){addvar(term.alias, term.action)}
	}
	this.define=this.addTerm

	this.directory=function(title){
		title=title||'Terminology'
		var names=terms.map(function(t){return t.name})
		var aliasterms=terms.filter(function(t){return (typeof t.alias == 'string')})
		var dir=names.concat(aliasterms.map(function(t){return t.alias + ' (alias)'}))
		dir.sort()
		var htm=dir.reduce(
			function(ac, cv){return ac+'<li>'+cv+'</li>'}, 
			`<h3>${title}</h3><ol>`
		)
		return (htm+"</ol><hr>")
	}

	this.run=function(term, success, failure){
		//term eg: 'line' not 'line(0,0,10,10)'
		var body=`${context} return ${term}(success, failure);`
		try{
			var fun=new Function('contexto', 'success', 'failure', body)
			fun(contexto, success, failure)
		} catch (er) {
			if (typeof failure=='function'){failure(er)}
		}
	}

	this.Term=function(options){
		options=options||{}
		this.name=options.name||'unnamed' 
		this.about=options.about||'No description'
		this.alias=options.alias||null
		this.action=options.action||function(){}
		this.topic=options.topic||'none' 
		this.terms=options.terms||[]
	}
	
	this.createTerm=function(options){
		return new this.Term(options)		
	}
	
} 