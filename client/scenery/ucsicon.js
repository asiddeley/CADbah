/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// This module is intended as a single instantiated class (singleton).

// PRIVATE STATIC
var marginf=0.95;

var setSceneAxis=function(v1, v2, colour, scene) {
	var ax=BABYLON.Mesh.CreateLines('axis', [v1, v2], scene);
	ax.color=colour;
	return ax;
};

var setSceneCone=function(v1, v2, v3, colour, scene){

	//https://doc.babylonjs.com/overviews/how_rotations_and_translations_work
		
	var tip=BABYLON.Mesh.CreateCylinder('tip', //name
		10,	//height, 
		0,	//diameterTop,
		5,	//diameterBottom, 
		4,	//tessellation, 
		1,	//subdivisions
		scene,	//scene 
		false,	//canBeRegenerated(opt), 
		BABYLON.Mesh.DEFAULTSIDE
	);
	tip.material=new BABYLON.StandardMaterial("ucsicon", scene);
	tip.material.diffuseColor=colour;
	/* Note that RotationFromAxis() changes the vertex objects provided by normalizing them so if they are used elsewhere, then it's best to provide copies (clones) as arguments */
	tip.rotation = new BABYLON.Vector3.RotationFromAxis(v1.clone(), v2.clone(), v3.clone());
	tip.position=v2;
	return tip;
};

var setPosition=function(ev, m){
	workspace.CAD.debug("ucsicon.setPosition()");
	m=m||workspace.getItem("background").getMesh();
	//locate at bottom corner of background
	if (typeof m != 'undefined'){
		ucsicon.position.x=m.position.x-(0.5 * marginf * m.scaling.x);
		ucsicon.position.y=m.position.y-(0.5 * marginf * m.scaling.y);	
	};	
};

var ucsicon;

var workspace;


// MIXINS, functions like name(), setScene(), onLoadDxf() to be overriden as required
$.extend(exports, require("../cadEvents"), require("../tool"));

// PUBLIC
exports.activate=function(ws, options){
	workspace=ws;
	this.options=$.extend({
		placement:"background"
		//placement:"origin"]
	}, options||{});

	
	$(document).on("backgroundchanged", setPosition);

	return this;
};

exports.name="ucsicon";
exports.desc="Three axii of a coordinate system";

exports.setScene=function(scene){

	var red=new BABYLON.Color3(1, 0, 0);
	var green=new BABYLON.Color3(0, 1, 0);
	var blue=new BABYLON.Color3(0, 0, 1);	
	
	var v0=new BABYLON.Vector3(0, 0, 0);
	var vx=new BABYLON.Vector3(20, 0, 0);
	var vy=new BABYLON.Vector3(0, 20, 0);
	var vz=new BABYLON.Vector3(0, 0, 20);
	
	var xx=setSceneAxis(v0, vx, red, scene);
	var xxtip=setSceneCone( vz, vx, vy, red, scene);
	var yy=setSceneAxis(v0, vy, green, scene);
	var yytip=setSceneCone( vx, vy, vz, green, scene);
	var zz=setSceneAxis(v0, vz, blue, scene);
	var zztip=setSceneCone( vy, vz, vx, blue, scene);

	ucsicon=xx;
	//group lines and tips as one
	xxtip.parent=ucsicon;
	yy.parent=ucsicon;
	yytip.parent=ucsicon;
	zz.parent=ucsicon;
	zztip.parent=ucsicon;

	setPosition();
};



