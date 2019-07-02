/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/
// PRIVATE
var filed=require("file-dialog");
var DxfParser=require("dxf-parser");
var htm="Displays a file dialog for the user to select a dxf file. The file is then uploaded, converted into a native cadbah document and displayed in the workspace<br>";

// MIXINS
$.extend(exports, require("../command"));

// PUBLIC
// required exports for any command
exports.allowed=["caddeley", "cadbah"];
exports.name="dxfin";
exports.help=function(CAD){return htm;};
exports.action=function(CAD, argstr){
	var c=5; 

	//setup file reader
	var reader = new FileReader();
	reader.onprogress = function(evt){
		if (evt.lengthComputable){
			CAD.msg("loaded:"+ Math.round(100 * evt.loaded / evt.total)+"%");	
		} else {
			//animate the dots
			CAD.msg("loading.....".substr(0, 7+(c++ % 5)));		
		}				
	};
	reader.onloadend = function(evt){
		//success
		var fileReader = evt.target;
		if (fileReader.error) {CAD.msg("error reading file")};
		var parser = new DxfParser();
		try {
			CAD.drawing.setDrawing(parser.parseSync(fileReader.result));
			CAD.msg("DXF file loaded");
			//CAD.cmd("zoom extents");
		}
		catch(err) {
			//return console.error(err.stack);
			CAD.debug(err.stack);
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
		CAD.msg("loading file:", files[0].name);
		// execute reader with file as arg
		reader.readAsText(files[0]);
	});
};


