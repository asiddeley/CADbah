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

define(
// load dependencies...
['jquery', 'babylon',  'textures/TMCstdLib'],


// modelHandlers inherits from partHandlers
var Skybox=$.extend( {}, {

	bimSuperType:null,
	bimType:'worldBox',
	desc:'wrapper with skybox, ground, units, lights and views',
	
	create:function(userHash) { return $.extend( {}, Worldbox, userHash); },

	creaters:{
		sky:function(){
			var s=WORLDBOX.create(); 
			//WORLDBOX.setUnits(s, units.create( 'metres' ) );
			return s;
		},
		snow:function(){
			var s=WORLDBOX.create(); 
			//WORLDBOX.setUnits(s, units.create( 'feet' ) );
			return s;
		}
	},
		
	getFeatures:function(worldbox){
		return $.extend(
			//new object  
			{}, 
			//superType's (model) features - like calling super 
			//worldBox.handler.getFeatures(worldBox), 
			//space's features - overriding some things set by model such as bimType
			{ 
				bimType:{ valu:worldbox.handler.bimType, onFeature:function(){}, widget:'text'}, 
			}
		);
	},
	
	setScene:function(worldbox){

		worldbox.baby=BABYLON.Mesh.CreateBox(
			worldbox.name, 
			worldbox.size, 
			BIM.scene, 
			false, 
			babylon.Mesh.DEFAULTSIDE);
		// note two way relation between BIM part and babylon element 
		worldbox.baby.bim=worldbox;
		
		var m=new babylon.StandardMaterial("skyBox", BIM.scene);
		worldbox.baby.material = m;
		worldbox.baby.infiniteDistance = true;
		
		m.backFaceCulling = false;
		m.disableLighting = true;
		m.diffuseColor = new babylon.Color3(0, 0, 0);
		m.specularColor = new babylon.Color3(0, 0, 0);
		m.reflectionTexture = new babylon.CubeTexture("textures/worldBoxes/brownBlue", BIM.scene);
		m.reflectionTexture.coordinatesMode = babylon.Texture.SKYBOX_MODE;
	},
	
});


// Construct model data.  
var Worldbox={
	handler:WORLDBOX,
	lights:{},
	model:null,
	name:'unnamed',
	/*************
	textures:[
		tcm.create( $.extend( {name:'Up'}, tcm.colour.blue), 
		tcm.create( $.extend( {name:'Down') tcm.colour.fireBrick),
		tcm.create( $.extend( {name:'North'}, tcm.colour.cyan), 
		tcm.create( $.extend( {name:'East'}, tcm.colour.cyan), 	
		tcm.create( $.extend( {name:'South') tcm.colour.coral),
		tcm.create( $.extend( {name:'West') tcm.colour.coral),		
	],
	******************/
	size:100,
	views:{}

};











