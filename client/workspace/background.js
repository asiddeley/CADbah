/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

var mesh;

exports.setScene=function(scene){
	
	//BACKGROUND to act as picking target
	mesh=BABYLON.MeshBuilder.CreatePlane("background", {
		width:800,
		height:400,
		sideOrientation:BABYLON.Mesh.DOUBLESIDE,
		sourcePlane:new BABYLON.Plane(0,0,-1,0),
		updateable:true
	}, 	scene);
	var bgm = new BABYLON.StandardMaterial("backgroundmat", scene);
	bgm.diffuseColor=new BABYLON.Color3(0, 0, 0); //black
	mesh.material=bgm;
	CAD.debug("background mesh set");

};

exports.init=function(workspacE){
	//workspace=workspacE;
	//CAD=workspace.CAD; 
	//background=workspace.background;
	return exports;
};

exports.getMesh=function(){return mesh;};