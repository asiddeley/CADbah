/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

$.extend(exports, require("./tool"));
exports.mixins.push("skybox");
exports.name="skybox";


exports.activate=function(workspace, options){
	
	this.workspace=workspace;
	
	this.options=$.extend({
		name:"Skybox-classic",
		decals:"resources/skyboxes/hilltop",
		size:5000
	}, options||{});
	//make init chainable
	return this;
};

exports.setScene=function(scene){

	var mesh=BABYLON.Mesh.CreateBox(
		this.options.name,
		this.options.size,
		scene,
		false,
		BABYLON.Mesh.DEFAULTSIDE);
	// a way to relate mash back to it's creator/handler. Useful for calling back when mesh is picked or other events. 
	mesh.cadtype=this;
	
	var m=new BABYLON.StandardMaterial(this.options.name, scene);
	m.backFaceCulling = false;
	m.disableLighting = true;
	m.diffuseColor = new BABYLON.Color3(0, 0, 0);
	m.specularColor = new BABYLON.Color3(0, 0, 0);
	m.reflectionTexture = new BABYLON.CubeTexture(this.options.decals, scene);
	m.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	
	mesh.material = m;
	mesh.infiniteDistance = true;
};












