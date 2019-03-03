/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
// PRIVATE
var htm="Maximizes the browser content window<br>Hit escape key to exit<br>";

// MIXINS
$.extend(exports, require("./command"));

// PUBLIC
exports.name="fullscreen";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, first, rest){
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen){document.exitFullscreen();}
	}
};


