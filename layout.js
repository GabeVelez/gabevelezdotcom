$(function() {
    $("header").load("layout/nav.html");
    $("footer").load("layout/footer.html");
    $(window).on("scroll", function() {
        if($(window).scrollTop() > 50) {
            $("header").addClass("header__active");
        } else {
            //remove the background property so it comes transparent again (defined in your css)
           $("header").removeClass("header__active");
        }
    });
});