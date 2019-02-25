/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// This module is written as though it's a single instantiated class, a singleton.

// Private Static
var CAD;
var workspace;
var backgroundmesh;
var camera;
var done; //callback provided by caller (zoom command) needed for undoer
var undoer=require("../workspace/undoer");
var undo;
var u=0;
var v=0;
var x=0;
var y=0;
var zoom=function(u,v,x,y){
	CAD.msg("ZOOM",u,v,x,y);
};

var zoomf=-1.5;
var zoomrect;
var zoomrectMD=function(){
	//console.log("zoom mousedown...");
	zoomrect.isVisible=true;
	// find where pointer hits background for upper left of zoom rect
	// Note predicate function to single out background
	var pick=CAD.scene.pick(CAD.scene.pointerX, CAD.scene.pointerY,		
		function(mesh){return mesh===backgroundmesh;}
	);
	if (pick.hit){
		//console.log("pick hit...");
		u=pick.pickedPoint.x;
		v=pick.pickedPoint.y;
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
		function(mesh){return mesh===backgroundmesh;}
	);

	if (pick.hit){
		x=pick.pickedPoint.x;
		y=pick.pickedPoint.y;
		zoomrect.position.x=u+(x-u)/2;
		zoomrect.position.y=v+(y-v)/2;
		zoomrect.scaling.x=u-x;
		zoomrect.scaling.y=v-y;
		camera.radius=zoomf*Math.abs(Math.max(zoomrect.scaling.x, zoomrect.scaling.y));
		//console.log("zoomrect.scale",zoomrect.scaling.x,zoomrect.scaling.y);
	};	
};

var zoomrectMU=function(){
	//cleanup
	window.removeEventListener("mousemove", zoomrectMM);
	window.removeEventListener("mouseup", zoomrectMU);

	camera.attachControl(CAD.canvas, true);
	CAD.scene.activeCamera=camera;
	
	camera.lockedTarget=zoomrect;
	
	//hide rect, allow some time for follow camera animation
	setTimeout(function(){zoomrect.isVisible=false;}, 2000);
	
	if (typeof done=="function"){
		//finalize undo object by defining the pro (forward) and retro functions
		undo.setPro(function(){zoom(this.f.u, this.f.v, this.f.x, this.f.y);});
		undo.setRetro(function(){zoom(this.b.u, this.b.v, this.b.x, this.b.y);});	
		//execute callback with undo object as argument 
		done(undo);
	}
};

// exports=require("tool"); //extends tools

// Public methods
exports.init=function(workspacE){
	workspace=workspacE;
	CAD=workspace.CAD; 

	//CAD.debug(backgroundmesh.toString());
	return exports;
};

exports.setScene=function(scene){
	
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
	camera.heightOffset = 0;
	camera.rotationOffset = 0;
	camera.cameraAcceleration = 0.1;
	camera.maxCameraSpeed = 25;
};

exports.zoomRect=function(callback){

	done=callback;
	if (typeof done=="function"){
		undo=undoer.create(CAD, "zoom rect");
		undo.set("b",{u:u, v:v, x:x, y:y});		
	};

	//use background for pick target
	backgroundmesh=workspace.background.getMesh();
	
	//CAD=workspace.CAD;
	zoomrect.isVisible=true;
	
	//disable camera motion by mouse
	CAD.scene.activeCamera.detachControl(CAD.canvas);
	
	//hold tracking until zoom rectangle finished on mouseup 
	camera.lockedTarget=null;

	//now listen for mousedown to start zoom operation
	window.addEventListener("mousedown", zoomrectMD);
};

exports.onLoadDxf=function(workspace){
	//zoom to extents	
};


