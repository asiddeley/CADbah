/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// PRIVATE STATIC

var line=require("./entities/line.js");
var {Bounds}=require("./helpers/bounds.js");
//var extents=require("./features/extents.js");

var CAD; //set with drawing.activate()

//drawing data constructor
function Drawing(){

	this.header={
		$INSBASE:{x:0,y:0,z:0},
		$EXTMIN:{x:0,y:0,z:0},
		$EXTMAX:{x:10,y:10,z:0}
	};
	this.tables={
		linetype:{
			Continuous:{
               name: "Continuous",
               description: "Solid line",
               patternLength: 0
            },
            HIDDEN2: {
               name: "HIDDEN2",
               description: "Hidden (.5x) _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _",
               pattern:[0.125, -0.0625],
               patternLength: 0.1875
            }
		},
		layer:{
			handle: "2",
			ownerHandle: "0",
			layers: {
				"0":{Name:"0", Visible:true, color:16711680},
				"A-WALL":{Name:"0", Visible:true, color:16711680}
			}		
		}
	};
	this.blocks={};
	this.entities=[
		line.create(this)
		//new line.Line(this)
	];	
};

// MIXINS
// none

// PUBLIC
exports.activate=function(CADbah){
	//CADbah.msg("drawing activate...", CADbah);
	CAD=CADbah;
	line.activate(this);
	this.data=new Drawing();
	//make it chainable, eg. drawing.activate(CADbah).setScene(scene)
	return exports;
};

exports.deserialize=function(dxf){
	//merge or overwrite
		
};

exports.getColorByIndex=function(index){
	return "Black";
};

exports.getColorByLayer=function(layer){

	return "Black";
};

exports.getExtents=function(){
	//eg. [{x:0,y:0,z:0},{x:1,y:1,z:1}]
	return [this.data.header.$EXTMIN, this.data.header.$EXTMAX];
};

exports.getBounds=function(){
	//eg. [{x:0,y:0,z:0},{x:1,y:1,z:1}]
	return new Bounds(this.data.header.$EXTMIN,	this.data.header.$EXTMAX);
};


exports.setDrawing=function(drawingData){
	if (typeof drawingData == "undefined"){drawingData=new Drawing()}

	//To do - change to this.data
	this.data=drawingData;

	//Display using Babylon scene OR
	if (CAD.appname == "cadbah"){
		CAD.scene.dispose();
		CAD.scene = new BABYLON.Scene(CAD.engine);
		CAD.workspace.setScene(CAD.scene);
		this.setScene(CAD.scene);		
	}
	//Canvas Graphic Context
	else if (CAD.appname == "caddeley" ){
		CAD.graphics.wipe(CAD.gc);
		this.setGC(CAD.gc);
	}
	//trigger drawing change
}

exports.serialize=function(){
	//To do...
	return this.data;	
};

exports.setGC=function(gc, tx){
	//render using canvas graphic context
	var e;
	for (var i=0; i<this.data.entities.length; i++){
		e=this.data.entities[i];
		//CAD.debug("entity:",e.type);
		switch (e.type){
			case "LINE":line.setGC(gc,e,tx);break;			
		}		
	};
	
	CAD.debug("drawing.setGC() done");
};

exports.setScene=function(scene){
	//render dxf or meshes
	var e;
	for (var i=0; i<this.data.entities.length; i++){
		e=this.data.entities[i];
		//CAD.debug("entity:",e.type);
		switch (e.type){
			case "LINE":line.setScene(scene,e);break;			
		}		
	};
	
	CAD.debug("drawing.setScene() done");
};

