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


