/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019, 2020 Andrew Siddeley
MIT License
***/

// PRIVATE STATIC

const line=require("./dxf_line.js")
var {Bounds}=require("./support.js")


// CAD context - initialized in activate()
var CAD

// current drawing
var dxf 

// drawing constructor - data structure
function Dxf(){

	this.header={
		$INSBASE:{x:0,y:0,z:0},
		$EXTMIN:{x:0,y:0,z:0},
		$EXTMAX:{x:10,y:10,z:0}
	}
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
	}
	this.blocks={}
	this.entities=[
		line.create(this)
		//new line.Line(this)
	]	
}


render=function(entities){
	
	entities=entities||dxf.entities
	var e, i
	for (i=0; i<entities.length; i++){
		e=entities[i];
		//CAD.debug("entity:",e.type);
		switch (e.type){
			case "LINE":line.render(e); break;

			
		}		
	};
	
	CAD.debug("drawing.setScene() done");
};

// MIXINS
// none

// PUBLIC



exports.activate=function(cad){
	//cad.msg("drawing activate...", cad);
	CAD=cad;
	
	line.activate(cad);
	dxf=new Dxf();

	//setup event handlers
	cad.on('dxfchanged, callrender', render)
};

exports.initialize=function(cad){exports.activate(cad)}

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
	return new Bounds(dxf.header.$EXTMIN,	dxf.header.$EXTMAX);
};

//set drawing
exports.setDxf=function(data){
	if (typeof data == "undefined"){
		dxf=new Dxf()
		CAD.emit('dxfchanged')
	} else if (data instanceof Dxf){
		dxf=data
		CAD.emit('dxfchanged')
	} else if (typeof data == 'object' ){
		//data is from a dxf parser so merge data
		dxf=new Dxf()
		Object.assign(dxf, data)
		CAD.emit('dxfchanged')
	}
}

exports.serialize=function(){
	//To do...
	return dxf	
}

exports.render=render

