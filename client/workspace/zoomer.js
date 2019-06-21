/*** CADbah - Copyright (c) 2019 Andrew Siddeley - MIT License ***/

// This module is written as a single instantiated class, a singleton.

// PRIVATE STATIC
var CAD;
var workspace;
var backgroundmesh;
var camera;
var done; //callback provided by caller (zoom command) needed for undoer
var undoer=require("../workspace/undoer");
var undo; 
//var addUndo;
var u=0;
var v=0;
var x=0;
var y=0;
var zoom_uvxy=function(u,v,x,y){
	CAD.msg("ZOOM",u,v,x,y);
};

var zoomf=-1.0;
var zoomRectMesh;
var zoomRectMD=function(){
	
	window.removeEventListener("mousedown", zoomRectMD);	
	
	zoomRectMesh.isVisible=true;
	// find where pointer hits background for upper left of zoom rect
	var pick=CAD.scene.pick(
		CAD.scene.pointerX, CAD.scene.pointerY,	
		//predicate function to single out background
		function(mesh){return mesh===backgroundmesh;}
	);
	if (pick.hit){
		u=pick.pickedPoint.x;
		v=pick.pickedPoint.y;
		
		//start a new transaction
		undo=undoer.create("zoom rect"); 
		undo.set("b",{u:u, v:v, x:x, y:y});		
		
		//next, listen for...
		window.addEventListener("mousemove", zoomRectMM);
		window.addEventListener("mouseup", zoomRectMU);		
	} else {
		//missed so fadeout zoomRectMesh
		setTimeout(function(){zoomRectMesh.isVisible=false;}, 2000);
	}
};

var zoomRectMM=function(){
	var pick = CAD.scene.pick(
		CAD.scene.pointerX, CAD.scene.pointerY,
		function(mesh){return mesh===backgroundmesh;}
	);
	if (pick.hit){
		zoomRectSetExtents(u, v, pick.pickedPoint.x, pick.pickedPoint.y);
	};
};

var zoomRectMU=function(){
	//cleanup
	window.removeEventListener("mousemove", zoomRectMM);
	window.removeEventListener("mouseup", zoomRectMU);

	//fade zoom window
	zoomRectFlash();
	//camera.attachControl(CAD.canvas, true); //why is this necessary for a follow cam?
	//CAD.scene.activeCamera=camera;
	//camera.lockedTarget=zoomRectMesh;
	//hide rect, allow some time for follow camera animation
	//setTimeout(function(){zoomRectMesh.isVisible=false;}, 2000);

	undo.setPro(function(){
		var f=this.get("f");
		zoomRectSetExtents(f.u, f.v, f.x, f.y);
		zoomRectFlash();
	});
	
	undo.setRetro(function(){
		var b=this.get("b");
		zoomRectSetExtents(b.u, b.v, b.x, b.y);
		zoomRectFlash();
	});	
};

var zoomRectSetExtents=function(ufixed, vfixed, xmoved, ymoved){

	//single argument means ufixed is an array such as [{x:0,y:0},{x:1,y:1}]
	if (arguments.length==1){u=ufixed[0].x; v=ufixed[0].y; x=ufixed[1].x; y=ufixed[1].y;}
	else {u=ufixed; v=vfixed;	x=xmoved; y=ymoved;}
	
	zoomRectMesh.position.x=u+(x-u)/2;
	zoomRectMesh.position.y=v+(y-v)/2;
	zoomRectMesh.scaling.x=Math.abs(x-u);
	zoomRectMesh.scaling.y=Math.abs(y-v);
	
	//adjust camera distance to updated zoom rectangle size
	camera.radius=zoomf*Math.abs(Math.max(zoomRectMesh.scaling.x, zoomRectMesh.scaling.y));
};

var zoomRectFlash=function(){
	//camera.attachControl(CAD.canvas, true); //why needed for a follow cam?
	zoomRectMesh.isVisible=true;
	CAD.scene.activeCamera=camera;
	camera.lockedTarget=zoomRectMesh;
	//hide rect, allow some time for follow camera animation
	setTimeout(function(){zoomRectMesh.isVisible=false;}, 2000);
};


// MIXINS
$.extend(exports,
	require("../cadEvents"), 
	require("../cloneable"), 
	require("./tool")
);

// PUBLIC
exports.activate=function(ws){
	workspace=ws;
	CAD=workspace.CAD; 
	return exports;
};

exports.name="zoomer";

// override
exports.setScene=function(scene){
	
	//ZOOM rectangle for aiming camera
	//width and height are imutable, use scale to vary height and width instead
	zoomRectMesh=BABYLON.MeshBuilder.CreatePlane("zoomRectMesh", {
		width:1,
		height:1,
		sideOrientation:BABYLON.Mesh.DOUBLESIDE,
		sourcePlane:new BABYLON.Plane(0,0,1,-1),
		updateable:true
	}, scene);	

	var zrm = new BABYLON.StandardMaterial("zoomrectmat", scene);
	zrm.diffuseColor=new BABYLON.Color3(1, 0, 0); //red
	zrm.alpha=0.5;
	zoomRectMesh.material=zrm;
	zoomRectMesh.isVisible=false;

	//zoom camera
	camera=new BABYLON.FollowCamera("zoomcam", new BABYLON.Vector3(0, 0, 100), scene);
	camera.radius = 30;
	camera.heightOffset = 0;
	camera.rotationOffset = 0;
	camera.cameraAcceleration = 0.1;
	camera.maxCameraSpeed = 25;
};

exports.zoomRect=function(){
	
	CAD.debug("zoomer.zoomRect()");
	
	//use background for pick target
	backgroundmesh=workspace.getItem("background").getMesh();
	
	//show mesh
	zoomRectMesh.isVisible=true;
	
	//disable camera motion by mouse in case it is an orbit or other camera
	CAD.scene.activeCamera.detachControl(CAD.canvas);

	//hold camera follow until zoom rectangle finalized on mouseup 
	camera.lockedTarget=null;
	
	//now listen for mousedown to start zoom operation
	window.addEventListener("mousedown", zoomRectMD);
};

// override
exports.onLoadDXF=function(workspace){
	//zoom to extents	
};

exports.zoomExtents=function(){
	CAD.debug("zoomer.zoomExtents()");
	
	//start a new undo transaction
	undo=undoer.create(CAD, "zoom extents");
	
	//save the initial extents of the zoom rectangle
	undo.set("start",{u:u, v:v, x:x, y:y});	
	
	//show the zoom window
	zoomRectMesh.isVisible=true;
	
	//disable camera motion by mouse
	CAD.scene.activeCamera.detachControl(CAD.canvas);
	
	//get bounding box, min and max coordinates of drawing eg.[{},{}]
	var ext=CAD.drawing.getExtents();
	
	//change background extents to match dxf document
	workspace.getItem("background").setExtents(ext);
	
	//change zoom window extents	
	zoomRectSetExtents(ext);

	//show and fade zoom window
	zoomRectFlash();	

	//save final extents of the zoom rectangle
	undo.set("finish",{u:u, v:v, x:x, y:y});
	
	//set the forward operation
	undo.setPro(function(){
		var f=this.get("finish");
		zoomRectSetExtents(f.u, f.v, f.x, f.y);
		zoomRectFlash();
	});
	
	//set the backward operation
	undo.setRetro(function(){
		var s=this.get("start");
		zoomRectSetExtents(s.u, s.v, s.x, s.y);
		zoomRectFlash();
	});	

};