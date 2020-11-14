/*
Nathan Snyder
ANTH 3541: Language and Music final project
Debunking the Expressionist Fallacy
*/

// calculates the adjustments that should be made to the slides when the user scrolls
// returns an array where the first element represents the top of the slide and the second represents the opacity
function scrollAdjustment(pos) {
    var scrollDiff = $(document).scrollTop() - pos;
    var wh = $(window).height();

    // when |st - pos| > wh: keep top and opacity constant
    // when |st - pos| < wh: top = -scrollDiff^3 / wh^2, opacity = -5 * scrollDiff^2 + 1
    return (scrollDiff < -wh) ? [wh, 0] : 
           (scrollDiff > wh) ? [-wh, 0] :
           [(-1 * scrollDiff * scrollDiff * scrollDiff / (wh * wh)), ((-5 * scrollDiff * scrollDiff / (wh * wh)) + 1)];
}

// adjusts the tops and opacities of all of the slides
// returns the current slide number
function scrolling() {
    var adjustment = [];
    var currSlide = -1;
    var currSlideOpacity = 0;

    for (let i = 0; i <= 6; i++) {
        adjustment = scrollAdjustment($(window).height() * i);

        // if the opacity of this slide is greater than the opacity of the current slide, change currSlide and currSlideOpacity
        if (adjustment[1] > currSlideOpacity) {
            currSlide = i;
            currSlideOpacity = adjustment[1];
        }

        $("#slide" + i).css("top", adjustment[0] + "px");
        $("#slide" + i).css("opacity", adjustment[1]);
        $("#slide" + i + "rect").css("opacity", (adjustment[1] < 0.1) ? 0.1 : adjustment[1]);
    }

    return currSlide;
}

$(document).ready(function() {
    var d = new Date();
    var currSlide = 0;

    // place all slides below the window except for the 0th one
    $(".slide").css("top", $(window).height() + "px");
    $("#slide0").css("top", "0px");

    // triggers when the user changes the size of the window
    $(window).on("resize", function() {
        // height of page = window height * number of slides
        $("html").css("height", ($(window).height() * 7));
    });

    // triggers when the page is scrolled
    $(document).scroll(function(){
        d = new Date();

        // only change currSlide if scrolling() returns a valid number
        let temp = scrolling();
        if (temp != -1) currSlide = temp;
    });

    // triggers every 200ms
    var periodicAdjustment = setInterval(() => {
        // if the user hasn't manually scrolled in 100ms and the current slide's opacity is not 1, scroll to the top of the current slide
        if ((d.getTime() < ((new Date()).getTime() - 100)) && ($("#slide" + currSlide).css("opacity") < 1)) {
            $("html, body").animate({
                scrollTop: ($(window).height() * currSlide) + "px"
            }, 200);
        }
    }, 200);

});
