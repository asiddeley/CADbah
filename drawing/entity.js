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
}

const tracer=function (path, drawing){
	//defaults
	drawing=drawing||cad.drawing
	path=path||new Path()
	//TODO diameter=pdsize (acad system variable)

	if (drawing.color=="BYLAYER"){
		//path.color=drawing.getColorByLayer(drawing.layer);			
	}
	else {
		//path.color=drawing.getColorByIndex(drawing.color)
	}
	return path
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
exports.tracer=tracer


exports.deserialize=function(entity){}
exports.serialize=function(){}

