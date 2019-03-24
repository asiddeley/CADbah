/*****************************************************
CADbah
Copyright (c) 2019 Andrew Siddeley
MIT License
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
	require("./license"),
	require("./undo"),
	require("./alert")
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
			// execute the command
			cobs[i].action(CAD, rest);
			break;
		}
	}
}




