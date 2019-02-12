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

/*** SEE 
https://doc.babylonjs.com/resources/save_babylon  
***/

//place for temporary anchor element <a> used to download file
var objectUrl;

exports.savefile=function(CAD){
	
	//delete if previously created
	if(objectUrl) {window.URL.revokeObjectURL(objectUrl);}

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


