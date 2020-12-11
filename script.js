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

// calculates the adjustment to top that should be made when the user scrolls
function adjustTop(pos) {
    var scrollDiff = $(document).scrollTop() - pos;
    var wh = $(window).height();

    // when |st - pos| > wh: keep top constant
    // when |st - pos| < wh: top = -scrollDiff^3 / wh^2
    return (scrollDiff < (-1 * wh)) ? wh : 
           (scrollDiff > wh) ? (-1 * wh) : 
           (-1 * scrollDiff * scrollDiff * scrollDiff / (wh * wh));
}

// calculates the adjustment to opacity that should be made when the user scrolls
function adjustOpacity(pos) {
    var scrollDiff = $(document).scrollTop() - pos;
    var wh = $(window).height();

    // when |st - pos| > wh: keep opacity as 0
    // when |st - pos| < wh: opacity = (-3 * scrollDiff^2 / wh^2) + 1
    return (Math.abs(scrollDiff) > wh) ? 0 : 
           ((-3 * scrollDiff * scrollDiff / (wh * wh)) + 1);
}

// adjusts the tops and opacities of all of the slides
// returns the current slide number
function scrolling() {
    var opacity = 0;
    var currSlide = -1;
    var currSlideOpacity = 0;

    $(".slide").each((index, slide) => {
        opacity = adjustOpacity($(window).height() * index);

        // if the opacity of this slide is greater than the opacity of the current slide, change currSlide and currSlideOpacity
        if (opacity > currSlideOpacity) {
            currSlide = index;
            currSlideOpacity = opacity;
        }

        $(slide).css("top", adjustTop($(window).height() * index) + "px");
        $(slide).css("opacity", opacity);
        $(".sliderect[data-num=" + index + "]").css("opacity", fitRange(opacity, 0.1, 0.9));
    });

    return currSlide;
}

$(function() {
    var d = new Date();
    var currSlide = scrolling();
    var mobileNotificationSeen = false;
    var oneColumnLayout = [0, 4, 7, 8];
    var twoColumnLayout = [1, 3];
    var threeColumnLayout = [2, 5, 6];

    var periodicAdjustment = setInterval(() => {
        // if the user hasn't manually scrolled in 100ms and the current slide's opacity is not 1, scroll to the top of the current slide in 200ms
        if ((d.getTime() < ((new Date()).getTime() - 100)) && ($("#slide" + currSlide).css("opacity") < 1)) {
            $("html, body").animate({
                scrollTop: ($(window).height() * currSlide) + "px"
            }, 200);
        }
    }, 250);

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
        $(this).css("opacity", fitRange(adjustOpacity($(window).height() * $(this).attr("data-num")), 0.1, 0.9));
    });

    // make the mobile notification disappear when it's clicked
    $("#mobilenotification").click(function() {
        $(this).css("display", "none");
    });

    // changes the appearance of the page when the user resizes the window
    function windowOnResize() {
        $("#scrolltocontinue").text("Scroll down " + (($(window).width() > 700) ? "or click the buttons on the left " : "") + "to continue.");

        // resize the videos
        $(".video").each((index, video) => {
            let parentHeight = $(video).parent().parent().parent().height() * 0.4;
            let projHeight = $(video).width() * 315 / 560; // height/width ratio = 315/560
            $(video).css("height", Math.min(projHeight, parentHeight) + "px");
        });

        // If the user has already received the warning, don't bother with the rest of the function
        if (mobileNotificationSeen) return;

        // warn the user if the text overlaps
        for(let i of threeColumnLayout) {
            if (document.getElementById("slide" + i + "p1").getBoundingClientRect().bottom > document.getElementById("slide" + i + "p2").getBoundingClientRect().top) {
                $("#mobilenotification").css("display", "block");
                mobileNotificationSeen = true;
                return;
            }
        }
    }

    windowOnResize();

    // when the window is resized, call windowOnResize()
    $(window).on("resize", windowOnResize);

});
