/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/


// This module is written as though it's a single instantiated class (singleton).

// PRIVATE STATIC

// initial camera settings
var alpha=-0.5*Math.PI;
var beta=0.5*Math.PI;
var radius=500;
var target=new BABYLON.Vector3(0, 0, 0);	

// MIXINS, functions like name(), setScene(), onLoadDxf() to be overriden as required
$.extend(exports, 
	require("../cadEvents"), 
	require("../tool")
);

// PUBLIC
exports.activate=function(workspace){
	this.workspace=workspace;
	this.name="orbiter";

	/*
	var that=this, count=0;
	workspace.CAD.scene.onAfterCameraRenderObservable.add(function(){
		if ((count++ % 10)==0){workspace.CAD.debug("Alpha:" + that.camera.alpha + ", Beta:" + that.camera.beta);};
	});	
	*/
	
	return this;
};

exports.name="orbiter";

exports.setScene=function(scene){
	this.camera=new BABYLON.ArcRotateCamera(this.name, alpha, beta, radius,	target,	scene);
	//scene.activeCamera.panningSensibility = 0;
	this.camera.attachControl(CAD.canvas, true);
	return this.camera;
};


