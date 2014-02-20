$.fn.skate.defaults.autoplay = false;
$.fn.skate.defaults.debug = true;
$.fn.skate.defaults.css = location.href.indexOf('js-only') > -1 ? false : true;

$('.no-animation .skate').skate({animation: 'none', 'keyboard': false});
cfskate = $('.crossfade-animation .skate').skate({animation: 'crossfade'});
$('.slide-animation .skate').skate();
$('.cards-animation .skate').skate();


$('.no-animation > h1').html($('.no-animation > h1').html() + ' (Keyboard Controls Disabled)');
$('.crossfade-animation > h1').html($('.crossfade-animation > h1').html() + ' (Keyboard Attached Here By Default)');
cfskate.setKeyboardFocus();



$(document.body).on(
	'skateReady skateTransitionStart skateTransitionEnd' +
		' skateNoneTransitionStart skateNoneTransitionEnd' +
		' skateCrossfadeTransitionStart skateCrossfadeTransitionEnd' +
		' skateSlideTransitionStart skateSlideTransitionEnd' +
		' skateCardsTransitionStart skateCardsTransitionEnd' ,
	function(e) {
		//console.log('Skate Event Fired:', e.type);
	}
);