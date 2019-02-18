/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// This module is written as though it's a single instantiated class, a singleton.

// Private 
var CAD;
var background;
var camera;
var zoomf=-1.5;
var zoomrect;
var zoomrectx;
var zoomrecty;
var zoomrectMD=function(){
	//console.log("zoom mousedown...");
	zoomrect.isVisible=true;
	// find where pointer hits background for upper left of zoom rect
	// Note predicate function to single out background
	var pick=CAD.scene.pick(CAD.scene.pointerX, CAD.scene.pointerY,		
		function(mesh){return mesh===background;}
	);
	if (pick.hit){
		//console.log("pick hit...");
		zoomrectx=pick.pickedPoint.x;
		zoomrecty=pick.pickedPoint.y;
	};
	// done so remove
	window.removeEventListener("mousedown", zoomrectMD);
	// now listen for...
	window.addEventListener("mousemove", zoomrectMM);
	window.addEventListener("mouseup", zoomrectMU);
};

var zoomrectMM=function(){
	//console.log("zoom mouse move...");
	var pick = CAD.scene.pick(CAD.scene.pointerX, CAD.scene.pointerY,
		function(mesh){return mesh===background;}
	);

	if (pick.hit){
		var vx=pick.pickedPoint.x;
		var vy=pick.pickedPoint.y;
		zoomrect.position.x=zoomrectx+(vx-zoomrectx)/2;
		zoomrect.position.y=zoomrecty+(vy-zoomrecty)/2;
		zoomrect.scaling.x=zoomrectx-vx;
		zoomrect.scaling.y=zoomrecty-vy;
		camera.radius=zoomf*Math.abs(Math.max(zoomrect.scaling.x, zoomrect.scaling.y));
		//console.log("zoomrect.scale",zoomrect.scaling.x,zoomrect.scaling.y);
	};	
};

var zoomrectMU=function(){
	//console.log("zoom mouse up...");
	//cleanup
	window.removeEventListener("mousemove", zoomrectMM);
	window.removeEventListener("mouseup", zoomrectMU);

	camera.attachControl(CAD.canvas, true);
	CAD.scene.activeCamera=camera;
	//zoomrect.isVisible=false;

};

// Public methods
exports.init=function(workspace){
	CAD=workspace.CAD; 
	return exports;
};

exports.setScene=function(scene){
	
	//BACKGROUND to act as picking target
	background=BABYLON.MeshBuilder.CreatePlane("background", {
		width:800,
		height:400,
		sideOrientation:BABYLON.Mesh.DOUBLESIDE,
		sourcePlane:new BABYLON.Plane(0,0,1,0),
		updateable:true
	}, 	scene);
	var bgm = new BABYLON.StandardMaterial("backgroundmat", scene);
	//bgm.diffuseColor=new BABYLON.Color3(91, 84.7, 59.6); //beige
	bgm.diffuseColor=new BABYLON.Color3(0, 0, 0); //black
	background.material=bgm;

	//ZOOM rectangle for aiming camera
	//width and height are imutable, use scale to vary height and width instead
	zoomrect=BABYLON.MeshBuilder.CreatePlane("zoomrect", {
		width:1,
		height:1,
		sideOrientation:BABYLON.Mesh.DOUBLESIDE,
		sourcePlane:new BABYLON.Plane(0,0,1,-1),
		updateable:true
	}, scene);	
	var zrm = new BABYLON.StandardMaterial("zoomrectmat", scene);
	zrm.diffuseColor=new BABYLON.Color3(1, 0, 0); //red
	zrm.alpha=0.5;
	zoomrect.material=zrm;
	zoomrect.isVisible=false;
	
	//zoom camera
	camera=new BABYLON.FollowCamera("zoomcam", new BABYLON.Vector3(0, 0, 100), scene);
	camera.radius = 30;
	camera.heightOffset = 10;
	camera.rotationOffset = 0;
	camera.cameraAcceleration = 0.01;
	camera.maxCameraSpeed = 25;
	// camera.attachControl(CAD.canvas, true);	
	// camera.lockedTarget=background; 
	camera.lockedTarget=zoomrect;
};

exports.zoomRect=function(){

	//CAD=workspace.CAD;
	zoomrect.isVisible=true;
	
	//disable camera motion by mouse
	CAD.scene.activeCamera.detachControl(CAD.canvas);

	//now listen for mousedown to start zoom operation
	window.addEventListener("mousedown", zoomrectMD);
};

exports.onDxfin=function(workspace){
	//resize backround
	
};


