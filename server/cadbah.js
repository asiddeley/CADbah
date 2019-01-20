/*******************************************************
CADBAH 

Computer Aided Drafting - Be Architectural Heroes

MIT License

Copyright (c) 2019 Andrew Siddeley

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

********************************/

const path = require("path")
const fs = require("fs")
const fileUpload = require('express-fileupload')


////////////////////////////
// Exports

// Main command handler

exports.handler=function (req, res) {
/***********
Prerequisites (to be passed in ajax data):
req.body.action... ADD, DIR, FILES, UPLOAD, 
req.body.project_number... 
req.body.tab... Gallery | reports
req.body.folder... Collection | deficiency Sheet set
req.body.extension
req.files... populated by middle-ware from ajaxed formData
**********/
	
	//inject uploads_dir, 
	req.body.uploads_dir=global.uploads_dir

	//ensure uploads_dir exists
	var up=path.join(global.appRoot, global.uploads_dir)
	try {if (!fs.statSync(up).isDirectory()){fs.mkdirSync(up)}} 
	catch(err){if (err.code="ENOENT"){fs.mkdirSync(up)}}
	
	console.log("ACTION:", req.body.action)
	
	switch (req.body.action){
	
	case "CLOSE":	
	//fsDXF.close(req, res); 
	break;	
	
	case "NEW":
	//fsDXF.create(req, res); 
	break;		

	case "OPEN":
	//fsDXF.open(req, res); 
	break;	
	
	case "SAVE":
	//fsDXF.save(req, res); 
	break; 
	
	case "SAVEAS":
	//fsDXF.saveas(req, res); 
	break; 

	
	} //switch
}

