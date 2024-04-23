$(window).on("scroll", function() {
    console.log("scroll dude");
    if($(window).scrollTop() > 10) {
        $(".header").addClass("nav__active");
    } else {
       $(".header").removeClass("nav__active");
    }
});