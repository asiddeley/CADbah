/*****************************************************
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*****************************************************/

// PRIVATE STATIC

var line=require("./entities/line.js");
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
	];	
};

// MIXINS
// none

// PUBLIC

exports.activate=function(CADbah){
	//CADbah.msg("drawing activate...", CADbah);
	CAD=CADbah;
	line.activate(this);
	this.drawing=new Drawing();
};


exports.deserialize=function(dxf){
	//merge or overwrite
	this.drawing=dxf;	
};

exports.getColorByIndex=function(index){
	return "Black";
};

exports.getColorByLayer=function(layer){

	return "Black";
};

exports.getExtents=function(){
	//eg. [{x:0,y:0,z:0},{x:1,y:1,z:1}]
	return [this.drawing.header.$EXTMIN, this.drawing.header.$EXTMAX];
}

exports.setDrawing=function(drawing){
	if (typeof drawing == "undefined"){drawing=new Drawing}

	this.drawing=drawing;

	//Display using Babylon scene OR
	if (CAD.appname == "cadbah"){
		CAD.scene.dispose();
		CAD.scene = new BABYLON.Scene(CAD.engine);
		CAD.workspace.setScene(CAD.scene);
		this.setScene(CAD.scene);		
	}
	//Canvas Graphic Context
	else if (CAD.appname == "caddeley" ){
		this.setGC(CAD.gc);
	}
	//trigger drawing change
}

exports.serialize=function(){
	//To do...
	return this.drawing;	
};

exports.setGC=function(gc){
	//render using canvas graphic context
	var e;
	for (var i=0; i<this.drawing.entities.length; i++){
		e=this.drawing.entities[i];
		CAD.debug("entity:",e.type);
		switch (e.type){
			case "LINE":line.setGC(gc,e);break;			
		}		
	};
	
	CAD.debug("drawing.setGC() done");
};

exports.setScene=function(scene){
	//render dxf or meshes
	var e;
	for (var i=0; i<this.drawing.entities.length; i++){
		e=this.drawing.entities[i];
		CAD.debug("entity:",e.type);
		switch (e.type){
			case "LINE":line.setScene(scene,e);break;			
		}		
	};
	
	CAD.debug("drawing.setScene() done");
};

