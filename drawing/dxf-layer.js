/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019, 2020 Andrew Siddeley
MIT License
***/

// PRIVATE STATIC

// drawing constructor - data structure
function Dlayers(options){
	options=options||{}	
	this.handle=options.handle||"2"
	this.ownerHandle=option.handle||"0",
	//default layer
	this.layer=[new Dlayer()]
}

function Dlayer(options){
	options=options||{}
	this.name=options.name||"unnamed"
	this.visible=options.visible||true
	this.color=options.color||"black"	
	this.linetype=options.linetype||"continuous"
	
	//dxf
	cad.getdxf().tables.layer[this.name]=this
	//paper
	this.layer=new Layer({
		name:this.name
	})
	
}


////////////
// PUBLIC

exports.about='dxf-layer table and layer components'

exports.create=function(options){
	return new Dlayer(options)
}

exports.init=function(dxf){
	dxf=dxf||cad.dxf
	//initializes the layertable in the dxf
	dxf.tables.layers=new Layers()
}

exports.getNames=function(){
	var dxf=cad.getdxf()
	//console.log('dxf...'); console.log(dxf)
	var names=Object.keys(dxf.tables.layer.layers)	
	return names
}

//deseiralize
exports.deserialize=function(dxf){}

exports.serialize=function(){
	//To do...
	return dxf	
}



