$(function() {
    $("header").load("layout/nav.html");
    $("footer").load("layout/footer.html");
});

$(document).ready(function() {
    $(window).on("scroll", function() {
        // Log a message when the scroll event occurs
        console.log("Scroll event occurred");

        if ($(this).scrollTop() > 20) {
            $(".navbar").addClass("nav__active");
            // Log a message when the nav__active class is added
            console.log("nav__active class added");
        } else {
            $(".navbar").removeClass("nav__active");
            // Log a message when the nav__active class is removed
            console.log("nav__active class removed");
        }
    });
});