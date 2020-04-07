/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

/////////////////
// PRIVATE STATIC

// Bounds
function Bounds(p, q){
	//bounding box object
	//2012-
	//2015-08-29
	//2020
	p=p||new Vertice()
	q=q||new Vertice()

	this.top=Math.max(p.y, q.y)
	this.left=Math.min(p.x, q.x)
	this.right=Math.max(p.x, q.x)
	this.bottom=Math.min(p.y, q.y)

}

Bounds.prototype.add=function(bounds){
	this.left = Math.min(this.left, bounds.left)
	this.right = Math.max(this.right, bounds.right)
	this.bottom = Math.min(this.bottom, bounds.bottom)
	this.top = Math.max(this.top, bounds.top)
}

Bounds.prototype.getHeight=function(){return (this.top - this.bottom)}
Bounds.prototype.getWidth=function(){return (this.right - this.left)}
Bounds.prototype.getCentre=function(){return (this.right + this.left)/2}
Bounds.prototype.getMiddle=function(){return (this.top + this.bottom)/2}
Bounds.prototype.getRightBottom=function(){return [this.right, this.bottom]}
Bounds.prototype.getLeftTop=function(){return [this.left, this.top]}
// End of Bounds
/////////////


function Vertice(x,y){
	this.x=x||Math.trunc(Math.random()*1000)
	this.y=y||Math.trunc(Math.random()*1000)
}




/////////
// PUBLIC

// Support
exports.Bounds=Bounds
exports.Vertice=Vertice









