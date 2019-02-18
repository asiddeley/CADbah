/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
exports.desc="Maximizes browser content window.  Hit escape key to exit.";
exports.name="fullscreen";
exports.action=function(CAD, first, rest){
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen){document.exitFullscreen();}
	}
};


