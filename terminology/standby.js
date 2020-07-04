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

const CT=require('../terminology/cadTerminology.js')

const standby=new Tool()
standby.name='standby'

CT.define(CT.createTerm({
	name:'standby', 
	alias:'esc',	
	about:'deactivates current paper tool',
	topic:'tools', 	
	action:function(success){
		cad.msg('current tool:'+tool.name)
		//tools.find(tool => tool.name == 'standby').activate()
		success('tools on standby')
	},
	inputs:[{name:'success', type:'function', remark:'success callback'}]
}))

exports.activate=function(){
	standby.activate()
	//clear handler a tool may have linked to onmousewheel event 
	cad.onmousewheel()	
}

