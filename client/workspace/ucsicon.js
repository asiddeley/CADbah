/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// This module is written as like a single instantiated class (singleton).

// PRIVATE STATIC

axis=function(v1, v2, colour, scene) {
	var ax=BABYLON.Mesh.CreateLines('axis', [v1, v2], scene);
	ax.color=colour;
	return ax;
};

cone=function(v1, v2, v3, colour, scene){

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
}

// PUBLIC

// MIXINS, functions like name(), setScene(), onLoadDxf() to be overriden as required
$.extend(exports,
	require("../cadEvents"), 
	require("./tool")
);

exports.activate=function(workspace, options){
	this.workspace=workspace;
	this.name="ucsicon";
	this.options=$.extend({
		placement:"background"
		//placement:"origin"]
	}, options||{});
		
	this.desc='Three axii of a coordinate system';
	return this;
};

exports.name="ucsicon";

exports.setScene=function(scene, parentMesh, entdata){

	//mesh - optional

	var red=new BABYLON.Color3(1, 0, 0);
	var green=new BABYLON.Color3(0, 1, 0);
	var blue=new BABYLON.Color3(0, 0, 1);	
	
	var v0=new BABYLON.Vector3(0, 0, 0);
	var vx=new BABYLON.Vector3(20, 0, 0);
	var vy=new BABYLON.Vector3(0, 20, 0);
	var vz=new BABYLON.Vector3(0, 0, 20);
	
	var xx=axis(v0, vx, red, scene);
	var xxtip=cone( vz, vx, vy, red, scene);
	var yy=axis(v0, vy, green, scene);
	var yytip=cone( vx, vy, vz, green, scene);
	var zz=axis(v0, vz, blue, scene);
	var zztop=cone( vy, vz, vx, blue, scene);
	
	//add parent so that these move with parent
	if (typeof parentMesh != 'undefined'){
		xx.parent=parentMesh;
		xxtip.parent=parentMesh;
		yy.parent=parentMesh;
		yytip.parent=parentMesh;
		zz.parent=parentMesh;
		zztop.parent=parentMesh;
	}
};