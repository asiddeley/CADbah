/************************************************************
	CADbah = Computer Aided Drafting Be Architectural Heroes
	Copyright (C) 2018, 2019, Andrew SIddeley

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

	
****************************************************************/


var CADdoc=function(CADbah){
	this.CADbah=CADbah;
	
	
	
	
}

//default drawing - DXF FORMAT
CADdoc.prototype.data={
	header:{},
	tables:{
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
	},
	blocks:{},
	entities:[
		{
			type: "LINE",
			vertices: [{x:0,y:0,z:0}, {x:100,y:100,z:0}],
			handle:"1805",
			ownerHandle:"1F",
			layer: "0"
		}	
	]	
};

CADdoc.prototype.deserialize=function(CADdocData){
	//merge or overwrite
	this.data=CADdocData;
	
}

CADdoc.prototype.serialize=function(){
	var json={};
	//To do...
	return json;	
}

CADdoc.prototype.setScene=function(scene){
	
	var i;
	var line=new require("/entities/").Line(this);
	
	for (i=0, i<this.data.entities, i++){
		e=this.data.entities[i];
		switch(e.type){
			case "LINE":
			break;			
			
			
		}		
	}	
	
}






exports.CADdoc=CADdoc;
