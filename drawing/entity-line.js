/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// PRIVATE STATIC
const entity=require('../drawing/entity.js')
const lib=require('../drawing/dxf-library.js')


//line data constructor
function Line(options){

	//inherit common entity stuff 
	Object.assign(this, entity.create(options))

	options=options||{}
	//override entity.type="entity" 
	this.type="line"

	if (options.points){
		//cad.msg('points detected')
		this.vertices=this.vertices.concat(options.points)
	}

	trace(this.path, this.vertices) 

}

//input paper.js path, points to modify path. Meant to be passed to the pointer tool
const trace=function(path, points){
	points.forEach(function(p, i, all){path.add(p)})
	return path
}

//input line data
const render=function(line){
	//sets layer, colour, linetype
	entity.render(line)
	//sets path
	trace(line.path, line.vertices)
}

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
exports.features=entity.features.concat(features)
exports.trace=trace



