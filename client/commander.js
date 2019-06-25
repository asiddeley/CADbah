/*****************************************************
CADbah
Copyright (c) 2019 Andrew Siddeley
MIT License
*****************************************************/
// PRIVATE
var alias=require("./commands/alias");
var last_inputstr="";

// command objects. Note that these do not need activating 
var cobs=[
	alias,
	require("./commands/dxfin"),
	require("./commands/fullscreen"),
	require("./commands/open"),
	require("./commands/save"),
	require("./commands/zoom"),	
	require("./commands/orbit"),
	require("./commands/clear"),
	require("./commands/dir"),
	require("./commands/help"),
	require("./commands/debug"),
	require("./commands/license"),
	require("./commands/undo"),
	require("./commands/alert")
];

//PUBLIC
exports.getCommands=function(){
	return cobs.sort(function(a,b){return (a.name <= b.name)?-1:1;});
}

exports.input=function(CAD, inputstr){
	if (!inputstr){inputstr=last_inputstr;};
	CAD.msg("&gt; "+inputstr);
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
			// check if command is allowed in "cadbah" or "caddeley"
			if (cobs[i].allowed.includes(CAD.appname)){
				// execute the command
				cobs[i].action(CAD, rest);
			} 
			else {
				CAD.msg("Sorry, that command not allowed in " + CAD.appname);
			}
			break;
		}
	}
}




