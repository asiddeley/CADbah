/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// STATIC
var marginf=1.05; 
var mesh;
var scalex=800;
var scaley=400;
var options={
	width:1,
	height:1,
	sideOrientation:BABYLON.Mesh.DOUBLESIDE,
	// BABYLON.Plane(x_axis, y_axis, z_axis, offset)
	sourcePlane:new BABYLON.Plane(0,0,-1,-1),
	updateable:true
};

// MIXINS


// PUBLIC
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

exports.setExtents=function(extents){

	var u=extents[0].x*marginf;
	var v=extents[0].y*marginf;
	var x=extents[1].x*marginf;
	var y=extents[1].y*marginf;
	//what about z
	
	mesh.position.x=u+(x-u)/2;
	mesh.position.y=v+(y-v)/2;
	mesh.scaling.x=Math.abs(x-u);
	mesh.scaling.y=Math.abs(y-v);	
	
	//CAD.workspace.getItem("ucsicon").setPosition(mesh);
	$(document).trigger("backgroundchanged",[mesh]);
	
};

