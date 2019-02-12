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


var Entity=function(docdxf){
	
	this.docdxf=docdxf;
	this.desc='foundation of all CADbah scene-model entities';
	/*this.features=[];
	if (Array.isArray(extraFeatures)){ 
		//this.Features=extraFeatures; 
		for (var i in this.Features){this.addFeature(extraFeatures[i]);}	
	}
	else {this.Features=[];}
	//console.log(this.Features);
	*/
};

Entity.prototype.setScene=function(scene, mesh, entdxf){
	if (typeof scene!="undefined"){
		//defaults
		if (typeof entdxf=="undefined"||entdxf==null){entdxf=this.dxf();}
		if (typeof mesh=="undefined"||mesh==null){
			//TODO diameter=pdsize (acad system variable)
			mesh=BABYLON.Mesh.CreateSphere("mySphere", {diameter:10},scene);
		}
		//set colour
		if (entdxf.color=="BYLAYER"){
			//console.log("Entity.setScene():", entdxf);
			mesh.color=this.docdxf.getColorByLayer(entdxf.layer);			
		}
		else {
			mesh.color=this.docdxf.getColorByIndex(entdxf.color);	
		}
	}
};

Entity.prototype.addFeatures=function(){
	//adds a feature constructor function to the handler being constructed
	for (var a in arguments) {
		this.Features.push(arguments[a]);
		//console.log(arguments[a]);
	}
};

//default entity data with random location
Entity.prototype.dxf=function(){
	return {
		type:"ENTITY",
		color:"BYLAYER",
		layer:"0",
		linetype:"BYLAYER",
		vertices:[{
			x:function(){return Math.trunc(Math.random()*1000);},
			y:function(){return Math.trunc(Math.random()*1000);}
		}]
	};
};

Entity.prototype.deserialize=function(scene, entityData){
	//overwrite default element data with data from serial source
	$.extend(this.data, entityData);
	this.setScene(scene);
};


Entity.prototype.dispose=function(mesh){
	//disposes mesh and any children, that is someMesh where someMesh.parent == mesh
	var cc=mesh.getChildren();
	for (var c in cc){cc[c].dispose();}
	mesh.dispose();
}

Entity.prototype.getFeatures=function(mesh) {
	/**********
	Returns a fresh object of features:
	{name:{feature}, position:{feature}...}
	A feature is a object scoped to a particular mesh like this:
	{label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditer}
	**********/
	//console.log('getfeatures(), this:');console.log(this);
	//Hope there's no confusion with Features, features & feature.
	var i, feature, features={};
	for (i in this.Features){
		feature=new this.Features[i](mesh);
		features[feature.alias]=feature;
	}
	return features;
}

Entity.prototype.getType=function() {
	return this.constructor.name;
}


Entity.prototype.serialize=function(){
	var json={};
	
	return json;
}

exports.Entity=Entity;



