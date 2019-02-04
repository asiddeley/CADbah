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
var Line=require("./Line.js").Line;


var Docdxf=function(CADbah){
	this.CAD=CADbah;
	this.dxf=new this.DXF();
};

//default drawing - DXF FORMAT
Docdxf.prototype.DXF=function(){
	this.header={};
	this.tables={
		linetype:{
			Continuous: {
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
				"0": {Name:"0", Visible:true, color:16711680}
			}		
		}
	};
	this.blocks={};
	this.entities=[
		{
			type: "LINE",
			vertices: [{x:0,y:0,z:0}, {x:100,y:100,z:0}],
			handle:"1805",
			ownerHandle:"1F",
			layer: "0"
		}	
	];	
};

//placeholder
Docdxf.prototype.dxf={};


Docdxf.prototype.deserialize=function(dxf){
	//merge or overwrite
	this.dxf=dxf;
	
};

Docdxf.prototype.serialize=function(){
	//To do...
	return this.dxf;	
};

Docdxf.prototype.setScene=function(scene){
	//render dxf or meshes
	
	
	var i;
	var line=new Line(this);
	
	for (i=0; i<this.dxf.entities; i++){
		e=this.dxf.entities[i];
		switch (e.type) {
			case "LINE":line.setScene(scene, e);break;			
			
			
		}		
	}	
	
};


exports.Docdxf=Docdxf;
