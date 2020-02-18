/*****
CADBAH
Computer Aided Design * Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
*****/
///// Imports
//var $=require('jquery')

///// Exports 
exports.attachMenu=function (navbuttonIdStr, menuIdStr){
	var bids=navbuttonIdStr.split(" ");
	var mids=menuIdStr.split(" ");
	for (var i in bids){
		// Register following function triggered by each nav button
		// When executed, function positions menu at each navbutton location
		$('#'+bids[i]).mouseenter({bid:bids[i], mid:mids[i]}, function(ev){
			//note how data is passed using first argument of mouseenter
			var navbutton=ev.data.bid; 
			var menu=ev.data.mid;
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
	console.log('attachMenu done.')
};


