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

function Skybox(workspace, options){

	if (typeof options != "object"){options={};}
	//bimSuperType:null,
	cadtype="Skybox";
	desc="wrapper with skybox, ground, units, lights and views";
	$.extend(this.options, options);

};

Skybox.prototype.options={
	name:"basic skybox",
	decals:"resources/skyboxes/sky1",
	size:1000	
};
		
Skybox.prototype.getFeatures=function(worldbox){
	//TO BE REWORKED...
	return $.extend({}, 

		//superType's (model) features - like calling super 
		//worldBox.handler.getFeatures(worldBox), 
		//space's features - overriding some things set by model such as bimType
		{ 
			cadtype:{ valu:worldbox.handler.bimType, onFeature:function(){}, widget:'text'}, 
		}
	);
};
	
Skybox.prototype.setScene=function(scene){

	var mesh=BABYLON.Mesh.CreateBox(
		this.options.name,
		this.options.size,
		scene,
		false,
		BABYLON.Mesh.DEFAULTSIDE);
	// a way to relate mash back to it's creator/handler. Useful for calling back when mesh is picked or other events. 
	mesh.cadtype=this;
	
	var m=new BABYLON.StandardMaterial(this.options.name, scene);
	m.backFaceCulling = false;
	m.disableLighting = true;
	m.diffuseColor = new BABYLON.Color3(0, 0, 0);
	m.specularColor = new BABYLON.Color3(0, 0, 0);
	m.reflectionTexture = new BABYLON.CubeTexture(this.options.decals, scene);
	m.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	
	mesh.material = m;
	mesh.infiniteDistance = true;
};

/** skybox Class
@usage sb=new Skybox();
*/
exports.Skybox=Skybox;

/** returns a Skybox object with a snow theme
@usage sb=brownbox();
*/
exports.cad=function(workspace){return new Skybox(workspace,{
	name:"Skybox-cad",
	decals:"resources/skyboxes/cad"
});};

/** returns a Skybox object with a cloudy theme
@usage sb=clooudbox();
*/
exports.hilltop=function(workspace){return new Skybox(workspace,{
	name:"Skybox-classic",
	decals:"resources/skyboxes/hilltop"
});};










