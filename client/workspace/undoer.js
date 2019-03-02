/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// This module is written as like a single instantiated class, a singleton.

// PRIVATE STATIC
var CAD;
var ulist=[];
var ui=-1;
var Undo=function(){
	this.set=function(name, val){this[name]=val;};	
	this.setPro=function(fn){this.pro=fn;};
	this.setRetro=function(fn){this.retro=fn;};
};

// PUBLIC

// MIXINS
// mix in functionality including name(), setScene(), onLoadDxf() & other handlers 
// which should be overriden as required
$.extend(exports,
	require("../cadEvents"), 
	require("./tool")
);

exports.activate=function(workspace){
	CAD=workspace.CAD; 
	return exports;
};

exports.create=function(name){
	/* Check index against undo list. If less it means actions have been undone by goback() so need to purge ulist from index onward to allow list to continue with a revised branch of actions. */
	while (ui+1<ulist.length){ulist.pop();}
	var u=new Undo(name);
	ulist.push(u); ui=ulist.length-1;
	return u;
};

exports.name="undoer";

exports.setScene=function(scene){
	
};

exports.goforth=function(){
	//execute retro function and move index back
	if (ui+1 < ulist.length){ulist[ui].pro();ui++;}
	else {CAD.msg("Nothing to redo");}	
};

exports.goback=function(){
	//execute retro function and move index back
	if (ui >= 0){ulist[ui].retro();ui--;}
	else {CAD.msg("Nothing to undo");}
};
