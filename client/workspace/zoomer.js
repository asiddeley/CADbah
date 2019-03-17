/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// This module is written as a single instantiated class, a singleton.

// PRIVATE STATIC
var CAD;
var workspace;
var backgroundmesh;
var camera;
var done; //callback provided by caller (zoom command) needed for undoer
var undoer=require("../workspace/undoer");
var addUndo;
var u=0;
var v=0;
var x=0;
var y=0;
var zoom_uvxy=function(u,v,x,y){
	CAD.msg("ZOOM",u,v,x,y);
};

var zoomf=-1.0;
var zoomrect;
var zoomrectMD=function(){
	//console.log("zoom mousedown...");
	zoomrect.isVisible=true;
	// find where pointer hits background for upper left of zoom rect
	// Note predicate function to single out background
	var pick=CAD.scene.pick(CAD.scene.pointerX, CAD.scene.pointerY,		
		function(mesh){return mesh===backgroundmesh;}
	);
	if (pick.hit){u=pick.pickedPoint.x;	v=pick.pickedPoint.y;};
	
	// done so remove
	window.removeEventListener("mousedown", zoomrectMD);
	// now listen for...
	window.addEventListener("mousemove", zoomrectMM);
	window.addEventListener("mouseup", zoomrectMU);
};

var zoomrectMM=function(){
	//console.log("zoom mouse move...");
	var pick = CAD.scene.pick(
		CAD.scene.pointerX, CAD.scene.pointerY,
		function(mesh){return mesh===backgroundmesh;}
	);
	if (pick.hit){
		setExtents(u, v, pick.pickedPoint.x, pick.pickedPoint.y);
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

	if (typeof addUndo=="function"){
		//finish the undo object by defining the pro (forward) and retro functions
		undo.setPro(function(){zoom_uvxy(this.f.u, this.f.v, this.f.x, this.f.y);});
		undo.setRetro(function(){zoom_uvxy(this.b.u, this.b.v, this.b.x, this.b.y);});	
		//execute callback with undo object as argument 		
		addUndo(undo);
	}
};

var setExtents=function(xfixed, yfixed, xmoved, ymoved){

	//check if xfixed is an array like this [{x:0,y:0},{x:1,y:1}]
	if (arguments.length==1){
		u=xfixed[0].x; v=xfixed[0].y; x=xfixed[1].x; y=xfixed[1].y;	
	} else {
		u=xfixed; v=yfixed;	x=xmoved; y=ymoved;
	}
                    
	zoomrect.position.x=u+(x-u)/2;
	zoomrect.position.y=v+(y-v)/2;
	zoomrect.scaling.x=Math.abs(x-u);
	zoomrect.scaling.y=Math.abs(y-v);
	
	//adjust camera distance to updated zoom rectangle size
	camera.radius=zoomf*Math.abs(Math.max(zoomrect.scaling.x, zoomrect.scaling.y));
};

// MIXINS
// mix in functionality including name(), setScene(), onLoadDxf() & other handlers 
// which should be overriden as required
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

exports.zoomRect=function(addUndoFn){
	CAD.debug("zoomer.zoomRect...");
	
	addUndo=addUndoFn;
	if (typeof addUndo=="function"){
		undo=undoer.create(CAD, "zoom rect");
		undo.set("b",{u:u, v:v, x:x, y:y});		
	};

	//use background for pick target
	backgroundmesh=workspace.getItem("background").getMesh();
	//show mesh
	zoomrect.isVisible=true;
	//disable camera motion by mouse
	CAD.scene.activeCamera.detachControl(CAD.canvas);
	//hold tracking until zoom rectangle finished on mouseup 
	camera.lockedTarget=null;
	//now listen for mousedown to start zoom operation
	window.addEventListener("mousedown", zoomrectMD);
};

// override
exports.onLoadDXF=function(workspace){
	//zoom to extents	
};

exports.zoomExtents=function(addUndo){
	CAD.debug("zoomer.zoomExtents...");
	
	if (typeof addUndo=="function"){
		undo=undoer.create(CAD, "zoom extents");
		//record the before condition of the zoom rectangle
		undo.set("b",{u:u, v:v, x:x, y:y});	
	};
	
	zoomrect.isVisible=true;
	//disable camera motion by mouse
	CAD.scene.activeCamera.detachControl(CAD.canvas);
	//get bounding box, min and max coordinates of docdxf eg.[{},{}]
	var ext=CAD.docdxf.getExtents();
	//change background extents to match dxf document
	workspace.getItem("background").setExtents(ext);
	//change zoom Rectangle extents
	setExtents(ext);
	//ensure camera settings good
	camera.attachControl(CAD.canvas, true);
	CAD.scene.activeCamera=camera;
	camera.lockedTarget=zoomrect;	
	//hide rect, allow some time for follow camera animation
	setTimeout(function(){zoomrect.isVisible=false;}, 2000);
	
	if (typeof addUndo=="function"){
		//record the finished condition of the zoom rectangle. 
		//Note that u,v,x & y are static vars ie. scoped to this zoomer module.
		undo.set("f",{u:u, v:v, x:x, y:y});	
		//set the forward operation
		undo.setPro(function(){zoom_uvxy(this.f.u, this.f.v, this.f.x, this.f.y);});
		//set the backward operation
		undo.setRetro(function(){zoom_uvxy(this.b.u, this.b.v, this.b.x, this.b.y);});	
		//register the undo object
		addUndo(undo);
	};
};