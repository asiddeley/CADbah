/*** CADbah - Copyright (c) 2019 Andrew Siddeley - MIT License ***/

// This module is written as a single instantiated class (singleton)

// PRIVATE STATIC
var CAD;
var history=[];
var hi=-1;
var Undo=function(name){
	this.name=name; //name of undo operation
	this.get=function(valname){return this.values[valname];};
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
	/* Check index against undo list. If less it means actions have been undone by goback() so need to purge history from index onward to allow list to continue with a revised branch of operations */
	while (hi+1<history.length){history.pop();}
	var u=new Undo(name);
	history.push(u); hi=history.length-1;
	return u;
};

var li=function(i, u){
	//var f="PRO:\n"+u.pro.toString(); //unescaped literal err
	//CAD.debug(JSON.stringify(u.name));
	//define an command
	//CAD.cmd("alias add " + i + " alert " + txt );
	var h="<li onclick='alert(\""+u.name+"\");'>"+u.name+"</li>";
	return h;
};

exports.list=function(){
	var htm="<ol>";
	for (var i=0; i<=hi; i++){
		htm+=li(i,history[i]);
	}
	return htm+"</ol>";
};

exports.execPro=function(){
	//execute pro function and move index forward
	if (hi+1 < history.length){
		CAD.debug("redoing:"+history[hi].name);
		try{ 
			history[hi].pro(); 
			hi++;
			CAD.msg(history[hi].name + " redone");
		} catch(e){CAD.msg("redo error:" + e.msg);}		
		hi++;
	} else {CAD.msg("Nothing to redo");}	
};

exports.execRetro=function(){
	//execute retro function and move index back	
	if (hi >=0 ){
		CAD.debug("undoing:"+history[hi].name);
		try{
			history[hi].retro(); 
			hi--;
			CAD.msg(history[hi].name + " undone");
		} catch(e){ CAD.msg("undo error:" + e.msg);}
	} else { CAD.msg("Nothing to undo"); }
};

exports.setScene=function(scene){};




