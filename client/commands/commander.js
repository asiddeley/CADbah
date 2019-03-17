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
// PRIVATE
var alias=require("./alias");
var last_inputstr="";

// command objects. Note that these do not need activating 
var cobs=[
	alias,
	require("./dxfin"),
	require("./fullscreen"),
	require("./open"),
	require("./save"),
	require("./zoom"),	
	require("./orbit"),
	require("./clear"),
	require("./dir"),
	require("./help"),
	require("./debug"),
];

// executed actions
var actioned=[];

//PUBLIC
exports.getCommands=function(){return cobs;}

exports.input=function(CAD, inputstr){
	if (!inputstr){inputstr=last_inputstr;};
	CAD.msg("&gt;"+inputstr);
	inputstr=alias.subst(inputstr);
	CAD.debug("alias subst:"+inputstr);
	
	var first=inputstr.split(" ")[0];
	var rest=inputstr.substring(first.length).trim();
	var htm="";
	if (first=="") {return;}
	
	// find matching command to execute
	for (var i=0; i<cobs.length; i++){		
		if (cobs[i].name==first){
			// valid so keep a copy
			last_inputstr=inputstr;
			// execute the command
			cobs[i].action(CAD, rest, function(undoobj){actioned.push(undoobj);});
			break;
		}
	}
}




