/*** CADbah - Copyright (c) 2019 Andrew Siddeley - MIT License ***/
//PUBLIC
var htm="Activates the orbital camera<br>"+
"&gt;&nbsp;orbit x|y|z<br>"+
"Orbits around the specified axis with mouse control<br>"+
"&gt;&nbsp;orbit go<br>"+
"Starts orbit motion<br>"+
"&gt;&nbsp;orbit stop<br>"+
"Stops orbits motion<br>";

//MIXINS
$.extend(exports, require("./command"));

//PUBLIC
//overrides
exports.name="orbit";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){
	var oc=CAD.workspace.getItem("orbiter").camera;
	var bm=CAD.workspace.getItem("background").getMesh();
	//disable current camera
	CAD.scene.activeCamera.detachControl(CAD.canvas);	
	switch(argstr.toLowerCase()){
		case "x":
			//reset orientations
			oc.alpha=-Math.PI;
			oc.beta=0.5*Math.PI;
			//adjust camera distance and target on background
			oc.radius=Math.max(bm.scaling.x, bm.scaling.y);
			oc.target=bm.position;
			break;
		case "y":
			oc.alpha=-0.5*Math.PI;
			oc.beta=Math.PI;
			oc.radius=Math.max(bm.scaling.x, bm.scaling.y);
			oc.target=bm.position;
			break;		
		case "z": 
		default:
			oc.alpha=-0.5*Math.PI;
			oc.beta=0.5*Math.PI;	
			oc.radius=Math.max(bm.scaling.x, bm.scaling.y);
			oc.target=bm.position;
	};
	//activate orbiter
	oc.attachControl(CAD.canvas, true);
	CAD.scene.activeCamera=oc;
	CAD.debug("orbit.action()", oc.radius, oc.target);
};


