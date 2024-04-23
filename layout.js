$(function() {
    $("header").load("layout/nav.html");
    $("footer").load("layout/footer.html");
});

$(function() {
    $(window).on("scroll", function() {
        if($(window).scrollTop() > 50) {
            $(".navbar").addClass("nav__active");
        } else {
            //remove the background property so it comes transparent again (defined in your css)
           $(".navbar").removeClass("nav__active");
        }
    });
});