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

var filed=require("file-dialog");
var DxfParser=require("dxf-parser");

exports.dxfin=function(CAD){
	
	
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
}


