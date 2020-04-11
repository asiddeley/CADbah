/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019, 2020 Andrew Siddeley
MIT License
***/

// PRIVATE STATIC
const cad=require('../electron/CAD.js')
const lib=require('./dxf-library.js')
const line=require('./entity-line.js')


// current drawing
var data

// drawing constructor - data structure
function Dxf(){

	this.header={
		$INSBASE:{x:0,y:0,z:0},
		$EXTMIN:{x:0,y:0,z:0},
		$EXTMAX:{x:10,y:10,z:0},
		$CECOLOR:'black'
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
	
	this.entities=[]	

}




////////////
// PUBLIC

exports.about='dxf'

exports.add=function(entity){
	data.entities.push[entity]	
}

exports.activate=function(){
	//line.activate(cad)
	data=new Dxf()	
	//setup event handlers
	//CAD.on('dxfchanged, callrender', render)
}

//not required - one drawing open at a time for now
exports.create=function(options){return new Dxf(options)}

//current drawing
exports.data=data

//deseiralize
exports.deserialize=function(dxf){}

//activate alias
exports.initialize=function(cad){exports.activate(cad)}

//getters
exports.getColorByIndex=function(index){
	return "Black"
}

exports.getColorByLayer=function(layer){

	return "Black"
}

exports.getExtents=function(){
	//eg. [{x:0,y:0,z:0},{x:1,y:1,z:1}]
	return [this.data.header.$EXTMIN, this.data.header.$EXTMAX]
}

exports.getBounds=function(){
	//eg. [{x:0,y:0,z:0},{x:1,y:1,z:1}]
	return new lib.Bounds(drawing.header.$EXTMIN,	drawing.header.$EXTMAX)
}

//renderer
exports.render=function(){
	data.entities.forEach(function(entity){
		//CAD.debug("entity:",e.type);
		switch (entity.type){
			case 'line':line.render(entity); break;

			
		}		
	})
}

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



