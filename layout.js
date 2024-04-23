$(function() {
    $("header").load("layout/nav.html");
    $("footer").load("layout/footer.html");
});

$(document).ready(function() {
    $(window).on("scroll", function() {
        if ($(this).scrollTop() > 50) {
            $(".navbar").addClass("nav__active");
        } else {
            $(".navbar").removeClass("nav__active");
        }
    });
});