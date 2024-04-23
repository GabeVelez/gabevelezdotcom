$(function() {
    console.log("scroll js file function started");
    $(window).on("scroll", function() {
        console.log("windo scroll began");
        if($(window).scrollTop() > 10) {
            $("header").addClass("nav__active");
            console.log("added class");
        } else {
           $("header").removeClass("nav__active");
           console.log("removed class");
        }
    });
});