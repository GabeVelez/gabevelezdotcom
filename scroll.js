(function () {
    var header = document.querySelector("header");
    if (!header) return;
    window.addEventListener("scroll", function () {
        header.classList.toggle("nav__active", window.scrollY > 10);
    }, { passive: true });
})();
