Skate
=====

Skate is a CSS-based and jQuery extended slide carrousel / image rotator / whatever-you-call-it.

*Skate is a work in progress!* I'm playing with this in my free time.  While you can probably make use of the work up to this point, you may want to hold off doing anything production related with this code until this message is gone.

Features:
* Responsive.
* Animations for crossfade, slide, and cards.
* Great CSS-only fallbacks.
* Controls via mouse (i.e. next and previous buttons, and slide navigation).
* Controls via keyboard with left and right arrows. Interaction steals keyboard focus (e.g. hover, click);
* Controls via touch (i.e. swipe right and left, see know bugs).
* Any content can be in a slide.
* Setting for autoplay.
* Transition speed and slide delay settings applied to both JS animations and CSS transitions.
* Setting to adjust slide container height for dealing with multiple height slides within one deck. (JS Feature)
* Custom events: skateReady, skateContainerHeightAdjustStart, skateContainerHeightAdjustEnd, skateTransitionStart, skateTransitionEnd, skateNoneTransitionStart, skateNoneTransitionEnd, skateCrossfadeTransitionStart, skateCrossfadeTransitionEnd, skateSlideTransitionStart, skateSlideTransitionEnd, skateCardsTransitionStart, skateCardsTransitionEnd

Features to implement in no particular order:
* Progress bar for current slide duration.
* Container classes change to indicate current activity.
* Selector settings for tweaking default elements. (Needs testing; JS Feature)
* Create navigation in JS or reuse CSS navigation elements.

Features under consideration:
* Ajax load additional slides.

Other hopes and dreams that are at the very bottom of the priority list:
* Solve the Montevallo problem if possible.
* Custom namespaces.

Know Bugs:
* When using swipe touch controls with height match going from a taller slide to a shorter slide, not-active slides can be seen in the background during height animation.