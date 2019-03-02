/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/


// This module is written as though it's a single instantiated class (singleton).

// PRIVATE STATIC

// MIXINS, functions like name(), setScene(), onLoadDxf() to be overriden as required
$.extend(exports, require("../cadEvents"), require("./tool"));

// PUBLIC
exports.activate=function(workspace){
	this.workspace=workspace;
	this.r=500;
	this.t=new BABYLON.Vector3(0, 0, 0);	
	return this;
};

exports.name="orbiter";

exports.setScene=function(scene){
	//.ArcRotateCamera(name, alpha, beta, radius, target, scene)
	var cam=new BABYLON.ArcRotateCamera(this.name, 0.1, 0.1, this.r, this.t, scene);
	//scene.activeCamera.panningSensibility = 0;
	cam.attachControl(CAD.canvas, true);
	return cam;
};


