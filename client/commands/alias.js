/*** CADBAH - Copyright (c) 2019 Andrew Siddeley - MIT License ***/

// This module is writen like a single instantiated class

// PRIVATE STATIC
var htm="Manages custom command abreviations<br>"+
"&gt; alias add [alias] [commands|expression(s)]<br>"+
"Adds an alias definition<br>"+
"&gt; alias clear<br>"+
"Clears alias definitions for current session<br>"+
"&gt; alias load [filename]<br>"+
"Loads an alias file, adding definitions.<br>";

// PUBLIC
// MIXINS
$.extend(exports,require("./command"));

exports.name="alias";
exports.help=function(CAD){return htm;}
exports.action=function(CAD, argstr){
	if (typeof argstr!="undefined"){
		var first=argstr.split(" ")[0].trim();
		var rest=argstr.substring(first.length).trim();
		switch(first){
			case "clear":aliases={}; break;
			case "load":load(CAD, rest); break;
			case "list":list(CAD, rest); break;
			case "add":add(CAD, rest); break;		
			case "undefined": break; 
		}
	};
};

exports.subst=function(cmd){return subst(cmd, 0);}

// PRIVATE STATIC

var aliases={};

var add=function(CAD, argstr){
	var first=argstr.split(" ")[0].trim();
	var rest=argstr.substring(first.length).trim();
	aliases[first]=rest;	
};

var load=function(CAD, argstr){
	var url=argstr.split(" ")[0].trim();
	console.log("alias file...",url);
	//var rest=argstr.substring(url.length).trim();
	
	$.ajax({
		dataType: "json",
		url: url,
		//data: {},
		success: function(json){
			aliases=json;
			CAD.debug("alias data...", json);
		},
		error:function(err){CAD.debug("alias file load fail", err);}
	});
};

var list=function(CAD, argstr){
	var keys=Object.keys(aliases);
	var msg="Aliases:\n";
	for (var k in keys){
		msg+=keys[k]; 
		if (k%6==0){msg+="\t";} else {msg+="\n";}		
	}
	alert(msg);
};

var subst=function(cmd, i){
	// show progress
	var indent=">";	for (var j=0; j<i; j++) {indent+=">";}
	console.log(indent+"alias:",cmd);
	
	if (i>10){
		// limit recursions in case of circular referencing
		return cmd;
	} else {
		// recursive call in case alias is an alias
		var r=aliases[cmd];	
		return (typeof r=="undefined")?cmd:subst(r,i++);
	}
};
