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

var Consoleui=require("./Consoleiu.js").Consoleui;
var Tabsui=require("./Tabsui.js").Tabsui;

exports.uisetup=function(CAD, options){
	// already done in CAD...
	//if (typeof options == 'undefined'){options={};}
	
	// Create place for user interfaces and controls if not found
	if (typeof options.div == 'undefined'){
		CAD.div$=$('<div></div>').appendTo(window.document.body);
		CAD.div=CAD.div$.get();
	} 
	else {
		//wrap div with jquery if not already
		if (CAD.div instanceof window.Element){CAD.div$=$(CAD.div);}
	}
	
	/* If div is 1st arg, then the intention is to make this UI its own dialog otherwise, null is the 1st arg meaning this UI will be contianed in and managed by another UI such as a Tabsui */
	CAD.uis.tabsui=new Tabsui(CAD.div$, "tabs");
	
	//add individual uis as tabs to tabsui
	CAD.uis.tabsui.addTab( 
		new Consoleui(null, "Command line")
		//new entitiesui(null, 'Entities'),
	); 
};
	
