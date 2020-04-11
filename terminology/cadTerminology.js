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

//////////////////
// PRIVATE STATIC

const cad=require('../electron/CAD.js')
const {Terminology}=require('../electron/support.js')
const cadterms=new Terminology()

////////////////////////////////
// CORE TERMS
cadterms.define({
	name:'wipe', 
	about:'Wipes the message console clean',
	action:function(){cad.wipe()},
	alias:null,
	topic:'core', 
	terms:[]
})

cadterms.define({
	name:'debugshow', 
	about:`Controls whether debugging messages are shown<br>
		&gt;true<br>
		shows debugging messages<br>"
		&gt;false<br>
		hides debugging messages`,
	action:function(param){
		cad.prompt('debug messages (hide 0, show 1)', function(val){			
			cad.debugshow(val)			
		})
	},
	alias:'bug',
	topic:'core',
	param:{}
})

var echomode=true
cadterms.define({
	name:'echo', 
	about:'Enables or disables the display of user input on the console',
	action:function(){echomode=!echomode},
	alias:null,
	topic:'core', 
	terms:[]
})

exports.getEcho=function(){return echomode}

cadterms.define({
	name:'terminology', 
	about:'Lists all available terms or commands',
	action:function(success, failure){
		cad.msg(cadterms.directory()) 
		success('terminology listed')
	},
	alias:'dir',
	topic:'core', 
	terms:[]
})

////////////////////////////////
// PUBLIC
exports.addTerm=cadterms.addTerm
exports.define=cadterms.define
exports.createTerm=function(options){return cadterms.createTerm(options)}
exports.Term=cadterms.Term
exports.run=cadterms.run

////////////////////////////////
// Load and define rest of the terms
//require('./pointer.js')
require('./line.js')
require('./standby.js')
require("./layer.js")

