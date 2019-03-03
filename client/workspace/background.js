/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

var mesh;
var scalex=800;
var scaley=400;
var options={
	width:1,
	height:1,
	sideOrientation:BABYLON.Mesh.DOUBLESIDE,
	sourcePlane:new BABYLON.Plane(0,0,-1,0),
	updateable:true
};

exports.activate=function(workspace){
	this.worspace=workspace;
	return exports;
};

exports.getMesh=function(){return mesh;};

exports.name="background";

exports.setScene=function(scene){
	
	//BACKGROUND to act as picking target
	mesh=BABYLON.MeshBuilder.CreatePlane("background", options, scene);
	mesh.scaling.x=scalex;
	mesh.scaling.y=scaley;
	var bgm = new BABYLON.StandardMaterial("backgroundmat", scene);
	bgm.diffuseColor=new BABYLON.Color3(0, 0, 0); //black
	mesh.material=bgm;
	//CAD.debug("background mesh set");
};



