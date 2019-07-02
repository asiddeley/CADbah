/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

exports.clone=function(obj){
	//uses jquery extend to return a copy of object obj 
	//return $.extend({}, (obj || {}));
	//returns a copy of object obj 
	return Object.assign({},(obj||{}));
	
};

exports.cloneInit=function(obj, options){
	console.log("cloneInit not implemented...", obj, options);	
};

