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
function scrolling() {
    var adjustment = [];

    // iterate through all the slides and adjust every one
    for (var i = 0; i <= 6; i++) {
        adjustment = scrollAdjustment($(window).height() * i);
        $("#slide" + i).css("top", adjustment[0] + "px");
        $("#slide" + i).css("opacity", (adjustment[1] < 0) ? 0 : adjustment[1]);
        $("#slide" + i + "rect").css("opacity", (adjustment[1] < 0.1) ? 0.1 : adjustment[1]);
    }
}

$(document).ready(function() {
    // height of page = windowHeight * numberOfSlides
    $("html").css("height", ($(window).height() * 7));

    $(".slide").css("top", $(window).height() + "px");
    $("#slide0").css("top", "0px");

    $(window).on("resize", function() {
        console.log("resizing");
        $("html").css("height", ($(window).height() * 7));
    });

    $(document).scroll(function(){
        scrolling();
    });

});
