$('.no-animation .skate').skate({debug: true, animation: 'none', 'css': location.href.indexOf('js-only') > -1 ? false : true, 'keyboard': false});
cfskate = $('.crossfade-animation .skate').skate({debug: true, animation: 'crossfade', 'css': location.href.indexOf('js-only') > -1 ? false : true});
$('.slide-animation .skate').skate({debug: true, animation: 'slide', 'css': location.href.indexOf('js-only') > -1 ? false : true});
$('.cards-animation .skate').skate({debug: true, animation: 'cards', 'css': location.href.indexOf('js-only') > -1 ? false : true});


$('.no-animation > h1').html($('.no-animation > h1').html() + ' (Keyboard Controls Disabled)');
$('.crossfade-animation > h1').html($('.crossfade-animation > h1').html() + ' (Keyboard Attached Here By Default)');
cfskate.setKeyboardFocus();