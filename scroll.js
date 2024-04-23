$(document).ready(function() {

    console.log("Scroll loaded");

    var $navbar = $(".navbar");

    // Listen for the scroll event on the window
    $(window).on("scroll", function() {
        // Check if the scroll position is greater than 0 (i.e., scrolled down from the top)
        if ($(this).scrollTop() > 0) {
            // Add a class to the navbar to change its background color
            $navbar.addClass("nav__active");
        } else {
            // Remove the class if the scroll position is at the top
            $navbar.removeClass("nav__active");
        }
    });
});
    