/*
Nathan Snyder
ANTH 3541: Language and Music final project
Debunking the Expressionist Argument
*/

// fits a number to the range [min, max]
var fitRange = (num, min, max) => 
    (num < min) ? min : 
    (num > max) ? max : 
    num;

// calculates the adjustments that should be made to the slides when the user scrolls
// returns an array where the first element is the top of the slide and the second element is the opacity
function scrollAdjustment(pos) {
    var scrollDiff = $(document).scrollTop() - pos;
    var wh = $(window).height();

    // when |st - pos| > wh: keep top and opacity constant
    // when |st - pos| < wh: top = -scrollDiff^3 / wh^2, opacity = -3 * scrollDiff^2 + 1
    return (scrollDiff < (-1 * wh)) ? [wh, 0] : 
           (scrollDiff > wh) ? [(-1 * wh), 0] : 
           [(-1 * scrollDiff * scrollDiff * scrollDiff / (wh * wh)), ((-3 * scrollDiff * scrollDiff / (wh * wh)) + 1)];
}

// adjusts the tops and opacities of all of the slides
// returns the current slide number
function scrolling() {
    var adjustment = [];
    var currSlide = -1;
    var currSlideOpacity = 0;

    for (let i = 0; i < 10; i++) {
        adjustment = scrollAdjustment($(window).height() * i);

        // if the opacity of this slide is greater than the opacity of the current slide, change currSlide and currSlideOpacity
        if (adjustment[1] > currSlideOpacity) {
            currSlide = i;
            currSlideOpacity = adjustment[1];
        }

        $("#slide" + i).css("top", adjustment[0] + "px");
        $("#slide" + i).css("opacity", adjustment[1]);
        $("#slide" + i + "rect").css("opacity", fitRange(adjustment[1], 0.1, 0.9));
    }

    return currSlide;
}

$(function() {
    var d = new Date();
    var currSlide = 0;

    var periodicAdjustment = setInterval(() => {
        // if the user hasn't manually scrolled in 100ms and the current slide's opacity is not 1, scroll to the top of the current slide in 200ms
        if ((d.getTime() < ((new Date()).getTime() - 100)) && ($("#slide" + currSlide).css("opacity") < 1)) {
            $("html, body").animate({
                scrollTop: ($(window).height() * currSlide) + "px"
            }, 200);
        }
    }, 250);

    $("#scrolltocontinue").text("Scroll down " + (($(window).width() > 700) ? "or click the buttons on the left " : "") + "to continue.");
    
    // triggers when the page is scrolled
    $(document).scroll(() => {
        d = new Date();

        // only change currSlide if scrolling() returns a valid number
        let temp = scrolling();
        if (temp != -1) currSlide = temp;
    });

    $(".sliderect").click(function() {
        // triggers when the user clicks one of the buttons on the left
        $("html, body").animate({
            // scrolls to the slide that the user clicked in 1 second
            scrollTop: ($(window).height() * $(this).attr("data-num")) + "px"
        }, 1000);
        $(this).blur();
    }).mouseover(function() {
        // triggers when the user's mouse hovers over the button
        // change this button's opacity to 0.6 unless it's opacity is already greater than that
        if ($(this).css("opacity") < 0.6) $(this).css("opacity", 0.6);
    }).mouseout(function() {
        // triggers when the user's mouse leaves the button
        // resets the opacity
        $(this).css("opacity", fitRange(scrollAdjustment($(window).height() * $(this).attr("data-num"))[1], 0.1, 0.9));
    });

});
