/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// PRIVATE

// PUBLIC

// MIXINS
// mix in functionality including name(), setScene(), onLoadDxf() & other handlers 
// which should be overriden as required

$.extend(exports,
	require("../cadEvents"), 
	require("../tool")
);

exports.activate=function(workspace){
	this.workspace=workspace;
	//make it chainable
	return this;	
};

exports.name="light";

exports.setScene=function(scene){
	
	var mesh=new BABYLON.HemisphericLight(
		"top",
		new BABYLON.Vector3(0,10,0),
		scene
	);
	return mesh;
};





