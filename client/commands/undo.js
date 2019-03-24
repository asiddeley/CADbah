/*** CADbah - Copyright (c) 2019 Andrew Siddeley - MIT License ***/
// PRIVATE STATIC
var htm="Manages the command history, allowing for commands to be undone or redone"+
"&gt;&nbsp;undo<br>"+
"Things done by the last command are undone and affected states are set as they were before the command was executed<br>"+
"&gt;&nbsp;undo redo<br>"+
"Called after an undo, redo cancels the undo and affected states are set as they were after the command<br>"+
"&gt;&nbsp;undo list<br>"+
"Lists the command history<br>";

// MIXINS
$.extend(exports, require("./command"));

// PUBLIC
exports.name="undo";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){
	var first=CAD.chop(argstr)[0].toLowerCase();
	var undoer=CAD.workspace.getItem("undoer");
	switch(first){
		case "redo":undoer.execPro(); break;
		case "list":CAD.msg("<h3>History</h3>"+undoer.list()+"<hr>");break;
		default:undoer.execRetro();			
	};
};


