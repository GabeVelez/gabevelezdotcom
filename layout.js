$(function() {
    if ($("body").hasClass("casestudy")) {
        $("header").load("../layout/nav.html");
        $("footer").load("../layout/footer.html");
    } else {
    $("header").load("layout/nav.html");
    $("footer").load("layout/footer.html");
}
});