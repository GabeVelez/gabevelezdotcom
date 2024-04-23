$(function() {
    $(window).on("scroll", function() {
        console.log("Scroll loaded");
        if($(window).scrollTop() > 50) {
            $(".navbar").addClass("nav__active");
            console.log("nav__active class added");
        } else {
            //remove the background property so it comes transparent again (defined in your css)
           $(".navbar").removeClass("nav__active");
           console.log("nav__active class removed");
        }
    });
});