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

const terms=require('../terms/terms.js')

// pointer
const pointer=new Tool()
pointer.name='pointer'
pointer.onMouseUp=function(e){
	CAD.msg(e.point.toString())
}

terms.addTerm(terms.createTerm({
	name:'pointer', 
	about:'returns the paper coordinates of the mouse when clicked',
	action:function(){
		//paper commands installed in window scope
		tools.find(tool => tool.name == 'pointer').activate()
	},
	alias:'pp',
	topic:'tools', 
	terms:['none']
}))

// escape
const escape=new Tool()
escape.name='escape'

terms.addTerm(terms.createTerm({
	name:'escape', 
	about:'exits from an active tool',
	action:function(){
		tools.find(tool => tool.name == 'escape').activate()
	},
	alias:'esc',
	topic:'tools', 
	terms:['no parameters']
}))


// PUBLIC



