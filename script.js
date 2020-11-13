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

    // when |st - pos| > wh, keep top and opacity constant
    // when |st - pos| < wh, top = a(st-pos)^3 + b(st-pos); a = -0.909091 / wh^2; b = -0.0909091
    //                       opacity = 4c(st-pos)^2 + d; c = -1 / wh^2; d = 1
    return (scrollDiff < -wh) ? [wh, 0] : 
           (scrollDiff > wh) ? [-wh, 0] : 
           [((-0.909091 / (wh * wh)) * scrollDiff * scrollDiff * scrollDiff) + (-0.0909091 * scrollDiff), ((-4 / (wh * wh)) * scrollDiff * scrollDiff) + 1];

}

// adjusts the tops and opacities of all of the slides
function scrolling() {
    var adjustment = [];

    // iterate through all the slides and adjust every one
    for (var i = 0; i <= 6; i++) {
        adjustment = scrollAdjustment($(window).height() * i);
        $("#slide" + i).css("top", adjustment[0] + "px");
        $("#slide" + i).css("opacity", adjustment[1]);
        $("#slide" + i + "rect").css("opacity", (adjustment[1] < 0.1) ? 0.1 : adjustment[1]);
    }
}

$(document).ready(function() {
    // height of page = windowHeight * numberOfSlides
    $("html").css("height", ($(window).height() * 7));

    $(".slide").css("top", $(window).height() + "px");
    $(".slide").css("opacity", 0);
    $(".sliderect").css("opacity", 0.1);

    $("#slide0").css("top", "0px");
    $("#slide0").css("opacity", 1);
    $("#slide0rect").css("opacity", 1);

    $(window).on("resize", function() {
        console.log("resizing");
        $("html").css("height", ($(window).height() * 7));
    });

    $(document).scroll(function(){
        scrolling();
    });

});
