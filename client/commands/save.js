/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

//temp anchor <a> used to download file
var objectUrl; 

//required exports for any command
exports.desc="Saves the current cadbah document to server.";
exports.name="save";
exports.action=function(CAD, argstr){
	
	//delete if previously created
	if(objectUrl) {window.URL.revokeObjectURL(objectUrl);}
	
	/* SEE https://doc.babylonjs.com/resources/save_babylon  */
	var serializedScene = BABYLON.SceneSerializer.Serialize(CAD.scene);

	var strScene = JSON.stringify(serializedScene);

	//TO DO CAD.scenename??
	var filename="unnamed";
	var ext=".bah";
	if (filename.toLowerCase().lastIndexOf(ext) !== (filename.length - ext.length) || filename.length < (ext.length + 1)){ filename += ext;	}

	var blob = new Blob ( [ strScene ], { type : "octet/stream" } );

	// turn blob into an object URL; saved as a member, so can be cleaned out later
	objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

	var link = window.document.createElement("a");
	link.href = objectUrl;
	link.download = filename;
	var click = document.createEvent("MouseEvents");
	click.initEvent("click", true, false);
	link.dispatchEvent(click);      
};


