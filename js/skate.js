(function ( $ ) {

$.fn.skate = function(settings) {
	
	// Local access to the element.
	var me = this;
	
	// Local access to jQuery'd element.
	var jqme = $(me);
	
	// Easy access to defaults.
	var defaults = $.fn.skate.defaults;
	
	// Set options.
	var options = $.extend({}, defaults, settings);
	
	// Whether to show debug messages.
	var debug = options.debug && window.console;
	
	// An object of slides in the current slider.
	me.slides = {
			'current': false,
			'next': false,
			'previous': false,
			'all': []
		};
	
	// Get the next slide relative to slide or the first if slide is the last item.
	function getNextSlide(slide) {
		var next = false;
		if(!slide) {
			slide = me.slides.current;
		}
		next = me.slides.all.filter(slide).next();
		if(!next.length) {
			next = me.slides.all.first();
		}
		return next;
	}
	
	// Get the previous slide relative to slide or the last if slide is the first item.
	function getPreviousSlide(slide) {
		var previous = false;
		if(!slide) {
			slide = me.slides.current;
		}
		previous = me.slides.all.filter(slide).prev();
		if(!previous.length) {
			previous = me.slides.all.last();
		}
		return previous;
	}
	
	function setNextPreviousFromCurrent() {
		me.slides.next = getNextSlide(me.slides.current);
		me.slides.previous = getPreviousSlide(me.slides.current);
	}
	
	// Validate animation type.  Set a default if invalid.
	switch(options.animation){
		default:
			if(debug) {
				console.log('Invalid animation type.  Using crossfade.');
			}
			options.animation = 'crossfade';
		break;
		case 'crossfade':
		case 'slide':
		case 'card':
		break;
	}
	
	me.on(
		'click',
		function(e) {
			var el = $(e.target),
				target = $(el.attr('href'));
			if(target.length && me.slides.all.filter(target).length) {
				e.preventDefault();
				me.slides.all.removeClass('skate-target');
				target.addClass('skate-target');
			}
		}
	);
	
	me.slides.all = me.find(options.slides);
	me.slides.current = me.slides.all.filter(options.first);
	
	me.slides.current.addClass('skate-target');
	
	setNextPreviousFromCurrent();
	
	//console.log(me.slides.all, me.slides.next, me.slides.previous, me.slides.current);
	
	// Return the modified element.
	return me;
};

$.fn.skate.defaults = {
	'debug': false,				// Whether to show debug messages.
	'animation': 'crossfade', 	// Animation types: slide, card, crossfade.
	'delay': 5,					// How long to show a single slide.
	'transition': .5,			// How long it should take to transition between slides.
	'slides': '> *',			// Query to get slide elements relative to container.
	'first': ':first-child',	// Filter slides and use this as the first slide.
};

}( jQuery ));