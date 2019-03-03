/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
// PRIVATE
var filed=require("file-dialog");
var DxfParser=require("dxf-parser");
var htm="Displays a file dialog for the user to select a dxf file. The file is then uploaded, converted into a native cadbah document and displayed in the workspace<br>";

// PUBLIC
// required exports for any command
exports.name="dxfin";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){

	//setup file reader
	var reader = new FileReader();
	reader.onprogress = function(evt){};
	reader.onloadend = function(evt){
		//success
		
		CAD.fc.clearScene(CAD);
		CAD.scene=new BABYLON.Scene(CAD.engine);
		CAD.workspace.setScene(CAD.scene);
	
		var fileReader = evt.target;
		if (fileReader.error) {console.log("error reading file")};
		var parser = new DxfParser();
		try {
			CAD.docdxf.dxf = parser.parseSync(fileReader.result);
			console.log("DXF:", CAD.docdxf);
			CAD.docdxf.setScene(CAD.scene);			
		}
		catch(err) {
			return console.error(err.stack);
		};
	};
	reader.onabort = function(evt){};
	reader.onerror = function(evt){
		switch(evt.target.error.code) {
		case evt.target.error.NOT_FOUND_ERR:
			alert('File Not Found!');
			break;
		case evt.target.error.NOT_READABLE_ERR:
			alert('File is not readable');
			break;
		case evt.target.error.ABORT_ERR:
			break; 
		default:
			alert('An error occurred reading this file.');
		};
	};

	//show file dialog
	filed({accept:"dxf"}).then(function(files){
		// files contains an array of FileList
		console.log("loading file:", files[0].name);
		// execute reader with file as arg
		reader.readAsText(files[0]);
	});
};


