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

const cad=require('../electron/CAD.js')
const inter=require('./interpreter.js')

var terms=[]

var Term=function(options){
	options=options||{}
	this.name=options.name||'unnamed' 
	this.about=options.about||'No description'
	this.alias=options.alias||null
	this.action=options.action||function(){}
	this.topic=options.topic||'none' 
	this.terms=options.terms||[]
}

var addTerm=function(term){
	if (!(term instanceof Term)) {return}
	//store it
	terms.push(term)
	//program name
	inter.addvar(term.name, term.action)
	//program alias
	if (typeof term.alias=='string'){
		inter.addvar(term.alias, term.action)
	}
}

////////////////////////////////
// CORE TERMS

// clear
addTerm(new Term({
	name:'clear', 
	about:'Clears the message console',
	action:function(){cad.console$.empty()},
	alias:'cls',
	topic:'core', 
	terms:['no parameters']
}))

// debug
addTerm(new Term({
	name:'debug', 
	about:`Controls whether debugging messages are shown<br>
		&gt;true<br>
		shows debugging messages<br>"
		&gt;false<br>
		hides debugging messages`,
	action:function(showTrue){
		showTrue=showTrue||1
		//change the contents of <style> </style> 
		var bug$=$("#cad-debug-style")
		if (bug$.length==0){
			cad.debug("missing style tag (id='cad-debug-style')")
			return
		}
		if(showTrue==1){
			bug$.html(bug$.html().replace("display:none","display:block"))
			cad.msg('Error messages displayed')
		} 
		else if(showTrue==0) {
			bug$.html(bug$.html().replace("display:block","display:none"))
			cad.msg('Error messages hidden')			
		}
		cad.console.scrollTop=cad.console.scrollHeight
	},
	alias:null,
	topic:'core', 
	terms:['no parameters']
}))

// echo
var echomode=true
addTerm(new Term({
	name:'echo', 
	about:'Enables or disables the display of user input on the console',
	action:function(){echomode=!echomode},
	alias:null,
	topic:'core', 
	terms:['no parameters']
}))
exports.getEcho=function(){return echomode}

// terminology - dir
addTerm(new Term({
	name:'terminology', 
	about:'Lists all available terms or commands',
	action:function(){
		var names=terms.map(function(t){return t.name})
		var aliasterms=terms.filter(function(t){return (typeof t.alias == 'string')})
		var dir=names.concat(aliasterms.map(function(t){return t.alias + ' (alias)'}))
		dir.sort()
		var htm=dir.reduce(
			function(ac, cv){return ac+'<li>'+cv+'</li>'}, 
			'<h3>Terminology</h3><ol>'
		)
		cad.msg(htm+"</ol><hr>")
	},
	alias:'dir',
	topic:'core', 
	terms:['no parameters']
}))

////////////////////////////////
// PUBLIC
exports.addTerm=addTerm
exports.createTerm=function(options){return new Term(options)}
exports.Term=Term
exports.run=inter.run

////////////////////////////////
// Load rest of the terms
// require('./point.js')
require('./line.js')


