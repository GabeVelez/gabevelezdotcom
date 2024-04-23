$(document).ready(function() {

    console.log("Scroll loaded");

    var $navbar = $(".navbar");
    console.log("should have read navbar class");

    $(window).on("scroll", function() {
    console.log("got past window on scroll");

        if ($(this).scrollTop() > 50) {
            console.log("read if statement");

            $navbar.addClass("nav__active");
            console.log("class added");

        } else {
            console.log("read else");

            $navbar.removeClass("nav__active");
            console.log("class removed");
        }
    });
});