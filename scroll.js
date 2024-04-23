$(document).ready(function() {

    console.log("Scroll loaded");

    var $navbar = $(".navbar");

    console.log("should have read navbar classs");

    // Listen for the scroll event on the window
    $(window).on("scroll", function() {
        console.log("got past window on scroll");
        // Check if the scroll position is greater than 0 (i.e., scrolled down from the top)
        if ($(this).scrollTop() > 50) {
            console.log("read if");
            // Add a class to the navbar to change its background color
            $navbar.addClass("nav__active");
            console.log("class added");
        } else {
            console.log("read else");
            // Remove the class if the scroll position is at the top
            $navbar.removeClass("nav__active");
            console.log("class removed");
        }
    });
});