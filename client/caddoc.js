/************************************************************
	CADbah = Computer Aided Drafting Be Architectural Heroes
	Copyright (C) 2018, 2019, Andrew SIddeley

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

	
****************************************************************/

//For jquery or $, don't encapsulate with browserify instead load in HTML with <script...>
var Element=require('elements/Element'); //encapsulate with browserify

var Line=function(extraFeatures){
	//First step of javascript inherit pattern, call constructor...
	Element.call(this, extraFeatures);
	//TO DO...
};

//Next steps of js inheritance patterns, inherit prototype and constructor...
Line.prototype=Object.create(Element.prototype);
Line.prototype.constructor=Element;

//define the rest of the prototypes...
Line.prototype.setScene=function(scene, mesh){

	//Important convention - if calling the prototype method then always do it first
	var featureized_mesh=Element.prototype.setScene.call(this, scene, mesh); 
	// TO DO...
	return $.extend(mesh, featureized_mesh);
};



