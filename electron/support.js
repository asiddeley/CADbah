/*****
CADBAH
Computer Aided Design * Be Architectural Heroes
Copyright (c) 2018, 2019, 2020  Andrew Siddeley
MIT License
*****/



exports.cout=function(CAD, htm, cssClass, count, limit){
	var p$=$("<p></p>").addClass(cssClass).attr("id", cssClass + count).html(htm);
	//add new message
	CAD.console$.append(p$);
	//delete old messages	
	if (count>limit){
		$("[id="+ cssClass + (count-limit) + "]").remove();
	}
	CAD.console.scrollTop=CAD.console.scrollHeight;
}

exports.navbarSetup=function(options){
	options=options||{}
	input$=$(options.input||'cad-input')
	// setup Navbar using jquery-ui controlgroup widget
	$(options.navbar||'cad-navbar').controlgroup({items:{
		// widgetToApply:selector
		"button": "a, button, input[type=text], input[type=button], input[type=submit]",
		"controlgroupLabel": ".ui-controlgroup-label",
		"checkboxradio": "input[type='checkbox'], input[type='radio']",
		"selectmenu": "select",
		"menu":"ul, .dropdown-items",
		"spinner": ".ui-spinner-input"
	}});
	// init dropdown menus... 
	$(".menu").menu().css("position","absolute", "width", "200px").hide()
	// auto cleanup any open dropdown menus
	$(".menu").on('mouseleave',function(){$(".menu").hide()})
	// auto clear dropdown autohide (DDAH)
	$(".menu").on('mouseenter',function(){clearTimeout(document.DDAH)})
	// submit event
	/*
	$('form').on('submit', function(ev){
		// console.log('submit occured')
		ev=ev||event			
		var input$=$('#cad-input')
		ev.preventDefault()
		CAD.run(input$.val()) 
		input$.val("")
		return false
	})		
	*/
	// attach menus to navbar buttons
	$(options.navbar||'cad-navbar').find('button').each(function(i, e){
		var mid=$(e).attr('menu')
		var bid=$(e).attr('id')
		//console.log('attaching ', mid, ' to ', bid)
		$(e).mouseenter({mid:mid, bid:bid}, function(ev){
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
		})
	})
}
