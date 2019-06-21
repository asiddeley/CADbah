/*** CADbah - Copyright (c) 2019 Andrew Siddeley - MIT License ***/
// PRIVATE STATIC
var htm="&gt;&nbsp;alert message...<br>"+
"Displays an alert dialog box with the message provided<br>";

// MIXINS
$.extend(exports, require("../command"));

// PUBLIC
exports.allowed=["cadbah", "caddeley"];
exports.name="alert";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){alert(argstr);};


