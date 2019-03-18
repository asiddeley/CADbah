/***
CADBAH = Computer Aided Design Be Architectural Heroes
Copyright (c) 2019 Andrew Siddeley
MIT License
***/

// This module is written as a single instantiated class, a singleton.

// PRIVATE STATIC
var CAD;
var ulist=[];
var ui=-1;
var Undo=function(operation){
	this.operation=operation; //name of undo operation
	this.set=function(valname, val){this.values[valname]=val;};	
	this.setPro=function(fn){this.pro=fn;};
	this.setRetro=function(fn){this.retro=fn;};	
	this.values={};
};

// PUBLIC

// MIXINS
// mix in functionality including name(), setScene(), onLoadDxf() & other handlers 
// which should be overriden as required
$.extend(exports,
	require("../cadEvents"), 
	require("./tool")
);

exports.name="undoer";

exports.activate=function(workspace){
	CAD=workspace.CAD; 
	return exports;
};

exports.create=function(name){
	/* Check index against undo list. If less it means actions have been undone by goback() so need to purge ulist from index onward to allow list to continue with a revised branch of operations */
	while (ui+1<ulist.length){ulist.pop();}
	var u=new Undo(name);
	ulist.push(u); ui=ulist.length-1;
	return u;
};

exports.dir=function(){
	var htm="<ol>";
	for (var i=0 to ui){
		htm+="<li>"+i.operation+"</li>";
	}
	return htm+"</ol>";
}

exports.goforth=function(){
	//execute retro function and move index back
	if (ui+1 < ulist.length){ulist[ui].pro();ui++;}
	else {CAD.msg("Nothing to redo");}	
};

exports.goback=function(toIndex){
	toIndex=toIndex||ui-1;
	//execute retro function and move index back
	while (ui >= 0 && toIndex<ui){
		CAD.msg("undo &gt;"+ulist[ui].operation);
		try{ulist[ui].retro();ui--;}
		catch(e){CAD.msg("error"+e.msg);}
	}
	if (ui<0){CAD.msg("Nothing to undo");}

};

exports.setScene=function(scene){};




