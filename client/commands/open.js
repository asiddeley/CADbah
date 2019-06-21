/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
// PRIVATE
var filed=require("file-dialog");
var htm="Displays a file dialog for the user to select a native CAD'bah' file for upload. Once uploaded file is displayed in the workspace.";

// MIXINS
$.extend(exports, require("../command"));

// PUBLIC
exports.allowed=["cadbah"];
exports.name="open";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){

	//show file dialog
	filed({accept:"bah"}).then(function(files){
		
		//TO DO upload files to server so sceneloader can retrieve
		
		var f=files[0];		
		console.log("loading file...", f);
		BABYLON.SceneLoader.Load(
			"./uploads/", 
			f.name, 
			CAD.engine, 
			function(scene) {
				CAD.fc.clearScene(CAD); 
				CAD.scene=scene;
				CAD.workspace.setScene();
				
			}
		);	
	});
};


