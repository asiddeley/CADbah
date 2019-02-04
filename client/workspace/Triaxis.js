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


var Triaxis=function(documesh, options){

	this.documesh=documesh;
	this.desc='Three axii of a coordinate system';

}

Triaxis.prototype.axis=function(v1, v2, colour, scene) {
	var ax=BABYLON.Mesh.CreateLines('axis', [v1, v2], scene);
	ax.color=colour;
	return ax;
};

Triaxis.prototype.cone=function(v1, v2, v3, colour, scene){

	//https://doc.babylonjs.com/overviews/how_rotations_and_translations_work
		
	var tip=BABYLON.Mesh.CreateCylinder('tip', //name
		10,	//height, 
		0,	//diameterTop,
		5,	//diameterBottom, 
		4,	//tessellation, 
		1,	//subdivisions
		scene,	//scene 
		false,	//canBeRegenerated(opt), 
		BABYLON.Mesh.DEFAULTSIDE
	);
	tip.material=new BABYLON.StandardMaterial("triaxis", scene);
	tip.material.diffuseColor=colour;
	/* Note that RotationFromAxis() changes the vertex objects provided by normalizing them so if they are used elsewhere, then it's best to provide copies (clones) as arguments */
	tip.rotation = new BABYLON.Vector3.RotationFromAxis(v1.clone(), v2.clone(), v3.clone());
	tip.position=v2;
	
	return tip;
}

Triaxis.prototype.setScene=function(scene, parentMesh, entdata){
	//mesh - optional

	var red=new BABYLON.Color3(1, 0, 0);
	var green=new BABYLON.Color3(0, 1, 0);
	var blue=new BABYLON.Color3(0, 0, 1);	
	
	var v0=new BABYLON.Vector3(0, 0, 0);
	var vx=new BABYLON.Vector3(20, 0, 0);
	var vy=new BABYLON.Vector3(0, 20, 0);
	var vz=new BABYLON.Vector3(0, 0, 20);
	
	var xx=this.axis(v0, vx, red, scene);
	var xxtip=this.cone( vz, vx, vy, red, scene);
	var yy=this.axis(v0, vy, green, scene);
	var yytip=this.cone( vx, vy, vz, green, scene);
	var zz=this.axis(v0, vz, blue, scene);
	var zztop=this.cone( vy, vz, vx, blue, scene);
	
	//add parent so that these move with parent
	if (typeof parentMesh != 'undefined'){
		xx.parent=parentMesh;
		xxtip.parent=parentMesh;
		yy.parent=parentMesh;
		yytip.parent=parentMesh;
		zz.parent=parentMesh;
		zztop.parent=parentMesh;
	}
	
};

exports.Triaxis=Triaxis;

