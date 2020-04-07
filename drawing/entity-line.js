/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// PRIVATE STATIC
const graphic=require('../drawing/entity.js')
const lib=require('../drawing/dxf-library.js')

//line data constructor
function Line(options){

	//inherit common graphic stuff
	Object.assign(this, graphic.create())

	//override entity.type="entity" 
	this.dxf='line'
	this.type="line"
	this.vertices.push(new lib.Vertice())
	this.vertices.push(new lib.Vertice())

	//render 
	//tracer(new Path(), )
}

//takes paper.js path and points as input and modifies the path
//meant to be passed to the pointer tool
const tracer=function(path, points){
	points.forEach(function(p, i, all){path.add(p)})
}

//takes dxf line data as input, returns a paper.js path 
//const render=function(path, line){
	//set layer, coloour, linetype
	//graphic.render(path, line)
	//tracer(path, (line.getPoints()))
//}


//features or line property accessors
const features=[
	{name:'start vertice', remark:'line feature', topic:'line',
		get:(line)=>{line.vertices[0]}, 
		set:(line, v)=>{line.vertices[0]=v}
	},
	{name:'end vertice', remark:'line feature', topic:'line',
		get:(line)=>{line.vertices[1]}, 
		set:(line, v)=>{line.vertices[1]=v}
	}
]



// PUBLIC
exports.about="line between 2 vertices"
exports.create=function(options){

	return new Line(options)
}
exports.Data=Line
// combine line features (vertices) and core features (layer, color etc)
exports.features=graphic.features.concat(features)
exports.tracer=tracer



