$(function() {
    if ($("body").hasClass("home")) {
        $("header").load("/layout/nav_index.html");
    } else {
        $("header").load("/layout/nav.html");
    }
    $("footer").load("/layout/footer.html");
});