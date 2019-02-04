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


var UI=require('./UI.js').UI;


var Tabsui=function(div, title){

	// This class extends UI, call super constructor
	// note that call always requires this as its first arg
	UI.call(this, div, title); 
	
	this.tabcount=0;
	
	//create empty tab group, add tabs child-uis later with addTabb
	this.createTabgroup();
	
	//use jquery-ui to turn div$ into a floating dialog box
	//note that this.div$ was initialized by UI.call() above
	this.div$.dialog({
		draggable:true,
		title:this.alias,
		autoOpen:true, 
		width:500,
		position:{ my: "right bottom", at: "center", of: window }
	});

	return this;
};

// Inherit prototype from UI
Tabsui.prototype=Object.create(UI.prototype);
Tabsui.prototype.constructor=Tabsui;
Tabsui.prototype.addTab=function(){

	var c, index, tab$, panel$, ui;
	this.divTabgroup$.tabs('destroy');

	for (index in arguments){
		ui=arguments[index];
		c=this.tabcount++;
		id='tab'+ c.toString();
		tab$=$('<li></li>').append( $('<a></a>').attr('href', "#"+id).text(ui.alias) );
		panel$=$('<div></div>').attr('id', id).append(ui.div$);
		this.divUL$.append(tab$);
		this.divTabgroup$.append(panel$);	
	}
	
	//use jquery-ui to turn it into a tab widget
	this.divTabgroup$.tabs({
		// jquery-ui tabs activate event is triggered when tab in focus.
		// Get bim to broadcast it. 
		// listeners include partsUI to initialize mini sample scene
		// per jquery-ui docs, divs={newTab:{}, oldTab:{}, newPanel:{}, oldPanel:{}}
		activate: function( ev, divs ) {
			/////////BIM.fun.trigger('tabsactivate', [divs]); //activeui instead
			
			// ev - ontabsactive custom event triggered by tabbedUI when tab clicked.
			// ev.data - 'this' as passed from 
			// divs - div of tab that was just activated (got focus) in the jquery-ui tabs widget
			// divs = {newTab:{}, oldTab:{}, newPanel:{}, oldPanel:{}} per jquery-ui docs, 
			//console.clear();
			var activeUI,i,ui;
			for (i in UI.instances){
				ui=UI.instances[i];
				if (divs.newPanel.find('div')[0]==ui.div$[0]){activeUI=ui;}
			}
			BIM.fun.trigger('activeui', [activeUI]);
			
		}
	});
	return this;
};

Tabsui.prototype.tabs=function(){
	//use jquery-ui to turn it into a tab widget
	this.divTabgroup$.tabs();
}

Tabsui.prototype.createTabgroup=function(){

	/*************************
	DOM structure for jquery tabs, see example at https://api.jqueryui.com/tabs/
	<div id="tabs" > This is a group of tabs...
		<ul>
			<li><a href="#tab-1"><span>One</span></a></li>
			<li><a href="#tab-2"><span>Two</span></a></li>
			<li><a href="#tab-3"><span>Three</span></a></li>
		</ul>
		<div id="panel-tab-1">
		<p>First tab is active by default:</p>
		<pre><code>$( "#tabs" ).tabs(); </code></pre>
		</div>
		<div id="panel-tab-2">...
	</div>
	*******************************/

	this.divTabgroup$=$('<div></div>');
	this.div$.append(this.divTabgroup$);
	
	this.divUL$=$('<ul></ul>');
	this.divTabgroup$.append(this.divUL$);

	//use jquery-ui to turn it into a tab widget
	this.divTabgroup$.tabs();
};

//DOM element with jquery wrapper, provided via API and holds all UI
//TabbedUI.prototype.board$=null;

//DOM element for blackboard, logging user input etc
Tabsui.prototype.div$=null;
	
Tabsui.prototype.divTabgroup$=null;

Tabsui.prototype.divUL$=null;

Tabsui.prototype.getInputHandlers=function(){
	//returns an array of {alias:['a'], desc:'about', handler:function}
	//these inputHamdlers are common for all UI if inheritor so chooses
	var ih=UI.prototype.getInputHandlers.call(this);
	
	return ih.concat([{
		inputs:['ui'],
		desc:'show the main UI', 
		handler:function(ev){ ev.data.toggle(); }
	}]);	
};

Tabsui.prototype.getEvents=function(){
	var eh=UI.prototype.getEvents.call(this);
	
	return eh.concat([
		////{name:'bimFeatureOK', data:this, handler:this.onFeatureOK },
		//{name:'input', data:this, handler:this.onInput },
		//{name:'tabsactivate', data:this, handler:this.onTabsactivate }
	]);
};

exports.Tabsui=Tabsui;

