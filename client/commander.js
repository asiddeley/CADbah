/*****************************************************
CADbah
Copyright (c) 2019 Andrew Siddeley
MIT License
*****************************************************/
// PRIVATE
var alias=require("./commands/alias");
var last_inputstr="";
var recursion_limit=10;

// command objects. Note that these do not need activating 
var commands=[
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
	return commands.sort(function(a,b){
		return (a.name <= b.name)?-1:1;
	});
}

exports.input=function(CAD, inputStr){
	input(CAD, inputStr, 0);
}


//PRIVATE
function input(CAD, inputstr, recursion_count){
	if (!inputstr){inputstr=last_inputstr;};
	CAD.msg("&gt; "+inputstr);
	inputstr=alias.subst(inputstr);
	CAD.debug("alias substitution:"+inputstr);
	
	var first=inputstr.split(" ")[0];
	var leftover;
	var rest=inputstr.substring(first.length).trim();
	var htm="";
	if (first=="") {return;}
	
	// find matching command to execute
	for (var i=0; i<commands.length; i++){		
		if (commands[i].name==first){
			// valid so keep a copy
			last_inputstr=inputstr;
			// check if command is allowed in "cadbah" or "caddeley"
			if (commands[i].allowed.includes(CAD.appname)){
				// execute the command
				leftover=commands[i].action(CAD, rest);
				// continue executing the leftover command_string an action may return... 
				if (typeof r!="undefined" && recursion_count<recursion_limit){
					input(CAD, leftover, recursion_count++);
				}
			} 
			else {
				CAD.msg("Sorry, that command not allowed in " + CAD.appname);
			}
			break;
		}
	}
}




