(function ( $ ) {

$.fn.skate = function(settings) {
	// Body access.
	var body = $(document.body);
	
	// Local access to the element.
	var me = this;
	
	// Local access to jQuery'd element.
	var jqme = $(me);
	
	// Easy access to defaults.
	var defaults = $.fn.skate.defaults;
	
	// Set options.
	var options = $.extend({}, defaults, settings);
	
	// Whether there is CSS transitions support.
	var transitions = false;
	
	// The next/previous nav that might be created.
	var navNextPrev = [];
	
	// The Slide Nav
	var navSlides = [];
	
	// Whether to show debug messages.
	var debug = options.debug && window.console;

	// Detect support for CSS Transitions.	
	function detectTransitions() {
		var test = document.createElement('p').style;
		if(
			'transition' in test || 
			'WebkitTransition' in test || 
			'MozTransition' in test || 
			'msTransition' in test
		) {
			transitions = true;
			return true;
		} else {
			transitions = false;
			return false;
		}
	}
	
	// Handle autoplay of next slide.
	function autoplayNext() {
		me.slides.current = getNextSlide();
		setNextPreviousFromCurrent();
		setCurrentClass();
	}
	
	// Handle autoplay of previous slide.
	function autoplayPrevious() {
		me.slides.current = getPreviousSlide();
		setNextPreviousFromCurrent();
		setCurrentClass();
	}
	
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
	
	// Set next and previous based on current.
	function setNextPreviousFromCurrent() {
		me.slides.next = getNextSlide(me.slides.current);
		me.slides.previous = getPreviousSlide(me.slides.current);
	}
	
	// Remove target classes and add to the current.
	function setCurrentClass() {
		var foundCurrent = false,
			animationName = options.animation;
		
		// Prep the animation name for firing custom events.
		animationName = animationName.charAt(0).toUpperCase() + animationName.slice(1);
		
		// Fire start events.
		jqme.trigger('skateTransitionStart');
		jqme.trigger('skate' + animationName + 'TransitionStart');
		
		// If we can use CSS to handle the swap, use CSS.
		if(options.css || options.animation === 'none') {
			if(options.css) {
				me.slides.all.each(updateCSSTransitions);
			}
			me.slides.all.removeClass('skate-target');
			me.slides.current
				.one(
					'webkitTransitionEnd MozTransitionEnd transitionEnd', 
					function() {
						// Fire the events at the end of the transition.
						jqme.trigger('skateTransitionEnd');
						jqme.trigger('skate' + animationName + 'TransitionEnd');
					}
				).addClass('skate-target');
			
			// If we aren't doing an animation, there fire end events manually.
			if(options.animation === 'none') {
				jqme.trigger('skateTransitionEnd');
				jqme.trigger('skateNoneTransitionEnd');
			}
			
		// Otherwise, animate it with jQuery.
		} else {
			me.slides.all.each(handleAnimation);
		}
		
		// Animate the height of the container if needed.
		if(options.heightmatch && 
			me.slides.current.outerHeight() !== jqme.outerHeight()
		) {
			jqme.trigger('skateContainerHeightAdjustStart');
			jqme.animate(
					{'height': me.slides.current.outerHeight() + 'px'},
					400,
					function() {
						jqme.trigger('skateContainerHeightAdjustEnd');
					}
				);
		}
		if(navNextPrev.length) {
			me.slides.nav.find('a[href^=#]').removeClass('skate-slide-current');
			me.slides.nav.find('a[href^=#' + me.slides.current.attr('id') + ']')
				.addClass('skate-slide-current'); 
			navNextPrev.find('.skate-prev').attr(
					'href', me.slides.current.data('skate-prev-id')
				).html(
					me.slides.current.data('skate-prev-char')
				);
			navNextPrev.find('.skate-next').attr(
					'href', me.slides.current.data('skate-next-id')
				).html(
					me.slides.current.data('skate-next-char')
				);
		}
		
	}
	
	// Update CSS transitions to respect JS settings.
	function updateCSSTransitions() {
		var el = $(this),
			isCurrent = (el.get(0) === me.slides.current.get(0));
			
		// Set whether we've found the current slide so we can set transitions.
		if(me.slides.all.index(el) >= me.slides.all.index(me.slides.current)) {
			foundCurrent = true;
		}
		
		// Update the CSS.
		switch(options.animation) {
			case 'crossfade':
				$(this).css(
					{
						'-webkit-transition': 'opacity ' + options.transition + 's ease',
						'-moz-transition': 'opacity ' + options.transition + 's ease',
						'transition': 'opacity ' + options.transition + 's ease'
					}
				);
			break;
			case 'slide':
				if(isCurrent) {
					$(this).css(
						{
							'-webkit-transition': '-webkit-transform ' + 
								options.transition + 's ease-in, visibility 0s ease',
							'-moz-transition': '-moz-transform ' + 
								options.transition + 's ease-in, visibility 0s ease',
							'transition': 'transform ' + 
								options.transition + 's ease-in, visibility 0s ease'
						}
					);
				} else if(foundCurrent) {
					$(this).css(
						{
							'-webkit-transition': '-webkit-transform ' + 
								options.transition + 's ease-in, visibility 0s ease ' + 
								options.transition + 's, left 0s ease ' + 
								options.transition + 's',
							'-moz-transition': '-moz-transform ' + options.transition + 
								's ease-in, visibility 0s ease ' + options.transition + 
								's, left 0s ease ' + options.transition + 's',
							'transition': 'transform ' + options.transition + 
								's ease-in, visibility 0s ease ' + options.transition + 
								's, left 0s ease ' + options.transition + 's'
						}
					);
				} else {
					$(this).css(
						{
							'-webkit-transition': '-webkit-transform ' + 
								options.transition + 's ease-in 0s, visibility 0s ease ' + 
								options.transition + 's',
							'-moz-transition': '-moz-transform ' + options.transition + 
								's ease-in 0s, visibility 0s ease ' + 
								options.transition + 's',
							'transition': 'transform ' + options.transition + 
								's ease-in 0s, visibility 0s ease ' + 
								options.transition + 's'
						}
					);
				}
			break;
		}
	}
	
	// Decide how to animate things.
	function handleAnimation() {
		var el = $(this),
			isCurrent = (el.get(0) === me.slides.current.get(0)),
			foundCurrent = false;

		// Set whether we've found the current slide so we can pick a direction.
		if(me.slides.all.index(el) >= me.slides.all.index(me.slides.current)) {
			foundCurrent = true;
		}
		
		// Figure out which animation we need and apply it.
		switch(options.animation) {
			case 'crossfade':
				// If this is the new current slide, fade it in and change the class.
				if(isCurrent) {
					el.animate(
							{'opacity': 1}, 
							options.transition * 1000,
							'linear',
							function() {
								$(this).addClass('skate-target');
								jqme.trigger('skateTransitionEnd');
								jqme.trigger('skateCrossfadeTransitionEnd');
							}
						);
				// If not, fade it out and change the class.
				} else {
					el.animate(
							{'opacity': 0}, 
							options.transition * 1000,
							'linear',
							function() {
								$(this).removeClass('skate-target');
							}
						);
				}
			break;
			case 'slide':
				// If this is the current slide, slide it in and change the class.
				if(isCurrent) {
					el.animate(
							{'left': 0}, 
							options.transition * 1000,
							'linear',
							function() {
								$(this).addClass('skate-target');
								jqme.trigger('skateTransitionEnd');
								jqme.trigger('skateSlideTransitionEnd');
							}
						);
				// If not, figure out how to handle the slide.
				} else {
					// If the current slide is the first slide, and the last slide is the
					// slide we are animating from, and the slide we are animating
					// is not the last slide, move it without animating and clear the 
					// target.  This is to prevent weird overlap as the animation from
					// off screen right to off screen left is 2x as long.
					if(
						me.slides.current.get(0) === me.slides.all.get(0) &&
						me.slides.all.last().is('.skate-target') &&
						this !== me.slides.all.last().get(0)
					) {
						$(this).css('left', foundCurrent ? '100%' : '-100%')
							.removeClass('skate-target');
								
					// Otherwise, animate the slide off screen, then remove the class.
					} else {
						el.animate(
								{'left': foundCurrent ? '100%' : '-100%'}, 
								options.transition * 1000,
								'linear',
								function() {
									$(this).removeClass('skate-target');
								}
							);
					}
				}
			break;
			case 'cards':
				// If the slide is the new current slide, put it in place.
				if(isCurrent) {
					el.css('top', 0).addClass('skate-target');
					setTimeout(
						function() {
							jqme.trigger('skateTransitionEnd');
							jqme.trigger('skateCardsTransitionEnd');
						},
						options.transition * 1000
					);
				// Otherwise, animate the slide out of view.
				} else {
					el.css('z-index', 4).animate(
							{'top': jqme.outerHeight() + 'px'}, 
							options.transition * 1000,
							'linear',
							function() {
								$(this).removeClass('skate-target')
									.css('z-index', '');
							}
						);
				}
			break;
		}
	}
	
	// Handle swapping to next slide.
	me.setKeyboardFocus = function() {
		body.data('skate-key-event-attached', me);
	}
	
	// Handle swapping to next slide.
	me.nextSlide = function() {
		me.slides.current = getNextSlide();
		setNextPreviousFromCurrent();
		setCurrentClass();
	}
	
	// Handle swapping to previous slide.
	me.previousSlide = function() {
		me.slides.current = getPreviousSlide();
		setNextPreviousFromCurrent();
		setCurrentClass();
	}
	
	// Add the transitions to the delay in case the transition time is very long.
	options.delay += options.transition;
	
	// Detect whether the browser does transitions and update whether we will use CSS.
	detectTransitions();
	if(options.css && !transitions) {
		options.css = false;
	}
	
	// An object of slides in the current slider.
	me.slides = {
			'current': false,
			'next': false,
			'previous': false,
			'all': [],
			'nav': jqme.find(options.slidenav)
		};
	
	// The autoplay interval
	me.interval = false;
	
	// Disable CSS support if requested.
	if(!options.css) {
		me.removeClass('skate-css');
	} else {
		me.addClass('skate-css');
	}
	
	// Use the data attribute if the settings didn't specify one.
	if((!settings || !settings.hasOwnProperty('animation')) && jqme.data('skate')) {
		options.animation = jqme.data('skate');
	}
	
	// Validate animation type.  Set a default if invalid.
	switch(options.animation){
		default:
			if(debug) {
				console.log('Invalid animation type.  Using crossfade.');
			}
			options.animation = 'crossfade';
		case 'none':
		break;
		case 'crossfade':
		break;
		case 'slide':
		break;
		case 'cards':
		break;
	}
	
	// Set the animation style for CSS use.
	me.attr('data-skate', options.animation);
	
	// Handle clicks to nav things.
	me.parent().on(
		'click',
		function(e) {
			var el = $(e.target),
				target = $(el.attr('href'));
			// If there is a target and the target is a slide...
			if(target.length && me.slides.all.filter(target).length) {
				e.preventDefault();
				me.slides.current = target;
				setNextPreviousFromCurrent();
				setCurrentClass();
				me.setKeyboardFocus();
				clearInterval(me.interval);
			}
		}
	);
	
	// Enable the slideshow to steal keyboard controls on hover.
	if(options.keyboard) {
		me.parent().on(
			'mouseover',
			function() {
				me.setKeyboardFocus();
			}
		);
	}
	
	// Attach keyboard controls to the first skate instance.
	if(!body.data('skate-key-event-attached') && options.keyboard) {
		body.on(
			'keyup',
			function(e) {
				var body = $(document.body),
					slidecont = body.data('skate-key-event-attached');
				switch(e.keyCode) {
					// right arrow
					case 39:  
						slidecont.nextSlide();
						clearInterval(slidecont.interval);
					break;
					// left arrow
					case 37: 
						slidecont.previousSlide();
						clearInterval(slidecont.interval);
					break;
				}
			}
		).data('skate-key-event-attached', me);
	}
	
	// If CSS and Touch, we need to set events for handling swipes.
	if(options.css && options.touch) {
		jqme.on(
			'touchstart',
			function(e) {
				// If the user is hitting navigation, ignore all of this.
				if($(e.target).is('.skate-slide-navigation *, .skate-next-prev *')) {
					return;
				}
				
				// Otherwise, set the introductory touch and prep to disable CSS.
				e.preventDefault();
				jqme.data('touchstart', e.originalEvent.touches[0].pageX);
				jqme.data('had-skate-css-class', jqme.hasClass('skate-css'));
				jqme.data('animation-type', jqme.attr('data-skate'));
			}
		).on(
			'touchmove',
			function(e) {
				var touchstart = jqme.data('touchstart'),
					touchnow = e.originalEvent.touches[0].pageX,
					enableBackSettings = {
							'transition': 'none', 
							'transform': 'none', 
							'left': 0, 
							'top': 0,
							'opacity': 1,
							'visibility': 'visible',
							'display': 'block'
						},
					currentSlideSettings = {
						'transition': 'none', 
						'transform': 'translateX(' + (touchnow-touchstart) + 'px)',
						'left': 0, 
						'top': 0,
						'opacity': 1,
						'display': 'block'
					};
					
				// If the user is hitting navigation, ignore all of this.
				if($(e.target).is('.skate-slide-navigation *, .skate-next-prev *')) {
					return;
				}
				
				jqme.data('touchlast', touchnow);
			
				// The user is trying to swipe, so disable CSS support temporarily.
				jqme.removeClass('skate-css');
				jqme.attr('data-skate', 'none');
				
				// Remove all styles and hide all slides.
				me.slides.all.removeAttr('style').css('display', 'none');
				
				// Depending on the direction, show the correct "background" slide.
				if(touchnow-touchstart < 0) {
					me.slides.next.css(enableBackSettings);
				} else {
					me.slides.previous.css(enableBackSettings);
				}
				
				// Make sure the current slide is visible.
				me.slides.current.css(currentSlideSettings);
			}
		).on(
			'touchend',
			function(e) {
				var translate = 'translateX(0)',
					touchnow = jqme.data('touchlast'),
					touchstart = jqme.data('touchstart'),
					wascurrent = me.slides.current;
					
				// If the user is hitting navigation, ignore all of this.
				if($(e.target).is('.skate-slide-navigation *, .skate-next-prev *')) {
					return;
				}
				
				// If the user just tapped, there won't be any last-touch data.
				if(!touchnow) {
					// If the target is an anchor, click it.
					if($(e.target).is('a')) {
						$(e.target).is('a').trigger('click');
						
					// If not, find something to click.
					} else if(me.slides.current.children('a').length) {
						me.slides.current.children('a').trigger('click');
					}
				
				// The user has swiped, so we need to figure out what to do.
				} else {
					// Set the transitions for the old current to animate out.
					wascurrent.css(
							{
								'-webkit-transition': '-webkit-transform .1s ease-in',
								'-moz-transition': '-webkit-transform .1s ease-in',
								'transition': 'transform .1s ease-in'
							}
						);
						
					// Set where the old current will animate to and prep the new current.
					if(touchnow-touchstart < -20) {
						translate = 'translateX(-100%)';
						me.slides.current = getNextSlide();
					} else if(touchnow-touchstart > 20) {
						translate = 'translateX(100%)';
						me.slides.current = getPreviousSlide();
					}
					
					// Set a transition end and animate out.
					wascurrent.one(
							'webkitTransitionEnd MozTransitionEnd transitionEnd',
							function() {
								
								// Add back CSS support if it was there.
								if(jqme.data('had-skate-css-class')) {
									jqme.addClass('skate-css');
								}
								
								// Set next and previous, and set the current class.
								setNextPreviousFromCurrent();
								setCurrentClass();
								
								// Reset the animation.
								jqme.attr('data-skate', jqme.data('animation-type'));
								
								// Clear all styles from slides.
								setTimeout(
									function(){
										me.slides.all.removeAttr('style');
									}, 500
								);
								
								// Clear data from the gesture.
								jqme.data('touchstart', '');
								jqme.data('touchlast', '');
								jqme.data('had-skate-css-class', '');
								jqme.data('animation-type', '');
							}
						).css('transform', translate);
				}
			}
		);
	} else if(options.touch && debug) {
		console.log('CSS support must be enabled to use touch controls.');
	}
	
	// Set the initial slides.
	me.slides.all = me.find(options.slides);
	me.slides.current = me.slides.all.filter(options.first);
	
	// If the URL's hash matches a slide, set that as the current and clear the hash.
	if(location.hash && me.slides.all.filter($(location.hash)).length) {
		me.slides.current = me.slides.all.filter($(location.hash));
		location.hash = '';
	}
	
	// If merging is requested.
	if(options.createnav === 'merge') {
		// Prep slides for rearranging the nav.
		jqme.find(options.nextprevnav).each(
			function() {
				var el = $(this),
					parent = el.closest(me.slides.all),
					anext = el.find('a.skate-next'),
					aprev = el.find('a.skate-prev');
				parent.data('skate-next-id', anext.attr('href'))
					.data('skate-next-char', anext.html());
				parent.data('skate-prev-id', aprev.attr('href'))
					.data('skate-prev-char', aprev.html());
			}
		).remove();
	} else if(options.createnav === 'create') {
		me.slides.all.each(
				function() {
					var uuid = 'skate-uuid-', i = 1;
					$(this).data('skate-next-char', options.next)
						.data('skate-prev-char', options.previous);
					if(!$(this).attr('id')) {
						while($('#' + uuid+i).length) {
							i++;
						}
						$(this).attr('id', uuid+i);
					}
				}
			).each(
				function() {
					var el = $(this);
					el.data('skate-next-id', '#' + getNextSlide(el).attr('id'))
						.data('skate-prev-id', '#' + getPreviousSlide(el).attr('id'));
				}
			);
	}
	
	// Create the navigation shell.
	if(
		options.createnav === 'merge' || 
		options.createnav === 'create'
	) {
		if(!jqme.find(options.slidenav).length) {
			navNextPrev = jqme.parent().append('<nav></nav>');
			
		}
		navNextPrev = jqme.find(options.slidenav).append(
				'<ul class="skate-next-prev"><li><a href="#" class="skate-prev"></a></li>' + 
				'<li><a href="#" class="skate-next"></a></li></ul>'
			);

		if(options.createnav === 'create' && !jqme.find('.skate-slide-navigation').length) {
			navSlides = $('<ul class="skate-slide-navigation"></ul>')
			jqme.find(options.slidenav).prepend(navSlides);
			
			me.slides.all.each(
					function() {
						navSlides.append($('<li><a href="#' + $(this).attr('id') + '">' + options.dot + '</a></li>'));
					}
				);
		}
	}
		
	setNextPreviousFromCurrent();
	setCurrentClass();
	
	// If autoplay, start autoplaying.
	if(options.autoplay) {
		me.interval = setInterval(autoplayNext, options.delay * 1000);
	}
	
	// Fire the skateReady event.  For some reason, jQuery needs it to be in a setTimeout.
	setTimeout(
		function() {
			jqme.trigger('skateReady');
		}, 1
	);
	
	// Return the modified element.
	return this;
};

$.fn.skate.defaults = {
	'debug': false,				// Whether to show debug messages.
	'autoplay': true,			// Whether to autoplay the slide show.
	'animation': 'crossfade', 	// Animation types: slide, cards, crossfade, or none.
	'delay': 5,					// How long to show a single slide.
	'transition': .5,			// How long it should take to transition between slides.
	'slides': '> *',			// Query to get slide elements relative to container.
	'first': ':first-child',	// Filter slides and use this as the first slide.
	'nextprevnav': 'li > nav',	// Selector to get to the left/right navs.
	'slidenav': '~ nav',		// Selector to get to the slide nav.
	'createnav': 'merge',		// Handle nav by: merge, create, or none
	'previous': '≺',			// The html for the previous link.
	'next': '≻',				// The html for the next link.
	'dot': '●',					// The html for the next link.
	'css': true,				// Whether to use CSS3 transitions when available.
	'keyboard': true,			// Whether this slider has keyboard control capability.
	'touch': true,				// Whether this slider has touch control capability.
	'heightmatch': true			// Whether to resize the container to fit the slide.
};

}( jQuery ));