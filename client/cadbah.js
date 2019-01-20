/**********************************
CADBAH * Computer Aided Design * Be Architectural Heroes

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
**/



function cadcmd(action){
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:action,
			branch:"camel.argo.branch", //null or result of args below
			casdok:"camel.argo.casdok",
			docnum:"camel.argo.docnum",
			pronum:"camel.argo.pronum"
		}),
		error: function(err){ console.log(err.message);},
		success: function(r){ },
		type:"POST",
		url:"/uploads"
	});
}

function inputHandler(ev){
	ev.preventDefault(); //disable normal form submit behavior that refreshes page
	var i=$("#myInput").val(); //get text from form 
	$("#myInput").val(''); //clear the form
	//BIM.input(i); //pass command to BIM for processing
	return false; //prevent further bubbling of event
};

/******************
initializes drop-down menus with homemade functions by providing DOM tag ids. Eg. "file tool..." and extension "-menu" for corresponding drop-downs menu ids "file-menu tool-menu..."
*/
function attachMenus(navbuttonIdStr, menuExtStr){
	var ids=navbuttonIdStr.split(" "), i;
	for (i in ids){
		// Register following function triggered by each nav button
		// When executed, function positions menu at each navbutton location
		$('#'+ids[i]).mouseenter({id:ids[i], ext:menuExtStr}, function(ev){
			//note how data is passed using first argument of mouseenter
			var navbutton=ev.data.id; 
			var menu=ev.data.id + ev.data.ext;
			$('.menu').hide();
			// Show and position menu of interest at its navbutton
			$('#'+ menu).show().position({
				my:'left top',
				at:'left bottom',
				of:'#'+navbutton
			});
			// autohide in case menu is left hanging - don't forget to disarm if entered
			document.DDAH=setTimeout(function(){$('#'+menu).hide();}, 2000);
		});
	};
};



function onFileSelected(evt) {
    progress.style.width = '0%';
    progress.textContent = '0%';

    var file = evt.target.files[0];
    var output = [];
    output.push(
		'<li><strong>', encodeURI(file.name), 
		'</strong> (', file.type || 'n/a', ') - ',
        file.size, ' bytes, last modified: ',
        file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
        '</li>'
	);
    document.getElementById('file-description').innerHTML = '<ul>' + output.join('') + '</ul>';

    $progress.addClass('loading');

    var reader = new FileReader();
    reader.onprogress = updateProgress;
    reader.onloadend = onSuccess;
    reader.onabort = abortUpload;
    reader.onerror = errorHandler;
    reader.readAsText(file);
}

function abortUpload() {
    console.log('Aborted read!')
}

function errorHandler(evt) {
    switch(evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
    case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
    case evt.target.error.ABORT_ERR:
        break; // noop
    default:
        alert('An error occurred reading this file.');
    }
}

function updateProgress(evt) {
    console.log('progress');
    console.log(Math.round((evt.loaded /evt.total) * 100));
    if(evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded /evt.total) * 100);
        if (percentLoaded < 100) {
            progress.style.width = percentLoaded + '%';
            progress.textContent = percentLoaded + '%';
        }
    }
}

function onSuccess(evt){
    var fileReader = evt.target;
    if(fileReader.error) return console.log("error onloadend!?");
    progress.style.width = '100%';
    progress.textContent = '100%';
    setTimeout(function() { $progress.removeClass('loading'); }, 2000);
    var parser = new window.DxfParser();
    var dxf = parser.parseSync(fileReader.result);
    
    // Three.js changed the way fonts are loaded, and now we need to use FontLoader to load a font
    //  and enable TextGeometry. See this example http://threejs.org/examples/?q=text#webgl_geometry_text
    //  and this discussion https://github.com/mrdoob/three.js/issues/7398 
    var font;
    var loader = new THREE.FontLoader();
    loader.load( 'helvetiker_regular.typeface.json',
	function(response) {
        font = response;
		console.log("Loader font...", response);
        cadCanvas = new ThreeDxf.Viewer(dxf, document.getElementById('cad-view'), null, null, font);
    });

}