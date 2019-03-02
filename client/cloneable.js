/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

exports.clone=function(obj){
	//uses jquery extend to return a copy of object obj ie. exports object of a module
	return $.extend({}, (obj || {}));	
};

exports.cloneInit=function(obj, options){
	console.log("cloneInit not implemented...", obj, options);	
};

