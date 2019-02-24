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
var alias=require("./alias");

// command objects
var cobs=[
	alias,
	require("./dxfin"),
	require("./fullscreen"),
	require("./open"),
	require("./save"),
	require("./zoom")	
];

// executed actions
var acts=[];

exports.input=function(CAD, inputstr){
	
	CAD.msg("&gt;", inputstr);
	inputstr=alias.subst(inputstr);
	CAD.debug("alias subst:", inputstr);
	
	var first=inputstr.split(" ")[0];
	var rest=inputstr.substring(first.length).trim();
	var txt="";
	if (first=="") {return;}
	
	switch(first.toLowerCase()){
		
		// discover commands
		case "dir":
			for (var i=0; i<cobs.length; i++){
				txt+=cobs[i].name;
				txt+=(i+1%3==0)?"\n":"\t";
			}
			alert(txt);
		break;
		
		// help on a command
		case "help":
		case "?":			
			if (rest!=""){
				for (var i=0; i<cobs.length; i++){
					if (cobs[i].name==rest) {txt=cobs[i].desc; break;}
				}
			} 
			if (txt==""){
				txt=(rest)?"Sorry, nothing found for '"+rest+"'.\n":"\n";
				txt+="Enter:\n";
				txt+="dir\tto list all commands.\n";
				txt+="help <command>\tto display information on that command.";
			}
			alert(txt);
			
		break;
		
		// execute command 
		default:
			// find matching command to execute
			for (var i=0; i<cobs.length; i++){		
				if (cobs[i].name==first){
					cobs[i].action(CAD, rest, function(done){acts.push(done);});
					break;
				}
			}
		break;
	}
}




