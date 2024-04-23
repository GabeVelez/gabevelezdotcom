$(function() {
    $(window).on("scroll", function() {
        if($(window).scrollTop() > 10) {
            $("header").addClass("nav__active");
        } else {
           $("header").removeClass("nav__active");
        }
    });
});