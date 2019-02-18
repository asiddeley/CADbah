/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

var filed=require("file-dialog");

//required exports for any command
exports.desc="Opens a cadbah document.";
exports.name="open";
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


