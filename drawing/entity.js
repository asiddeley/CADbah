/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
/////////////////
// PRIVATE STATIC


var Entity=function(){
	/*
	Entity data constructor
	Compatible with dxf-parser node library 
	Super class for all cad dxf entities
	Common colour and layer information 
	Includes an empty vertices array, but no actual vertices
	*/
	this.type="entity"
	this.color="BYLAYER"
	this.layer="0"
	this.linetype="BYLAYER"
	this.vertices=[]
	
	//paper setups
	//layer
	
	this.path=new Path()
	this.path.strokeColor='black'
	render(this)
	cad.add(this)
	
}

const trace=function (path, points){}

const render=function (entity){
	//defaults
	//TODO diameter=pdsize (acad system variable)

	if (entity.color!="BYLAYER"){
		//path.color=cad.dxf.getColorByLayer(entity.layer);			
	} else {
		//path.color=drawing.getColorByIndex(drawing.color)
	}
	return entity.path
}

//features or graphic property accessors
const features=[
	{name:'type', remark:'core feature', topic:'entity',
		get:function(e){return e.type}},
	{name:'colour', remark:'core feature', topic:'entity',
		get:function(e){return e.color}, 
		set:function(e,co){e.color=co}
	},
	{name:'layer', remark:'core feature', topic:'entity',
		get:function(e){return e.layer}, 
		set:function(e,la){e.layer=la}
	},
	{name:'linetype', remark:'core feature', topic:'entity',
		get:function(e){return e.linetype}, 
		set:function(e,lt){e.linetype=lt}
	}
]

/////////
// PUBLIC

exports.about='Base for all drawing entities'
exports.create=function(options){return new Entity(options)}
exports.Data=Entity
exports.features=features
exports.render=render
exports.trace=trace


exports.deserialize=function(entity){
	
	
}

exports.serialize=function(){
	
	
}

