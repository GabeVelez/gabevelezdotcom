(function () {
    var isHome = document.body.classList.contains("home");

    function inject(selector, url, done) {
        var el = document.querySelector(selector);
        if (!el) return;
        fetch(url)
            .then(function (response) { return response.text(); })
            .then(function (html) {
                el.innerHTML = html;
                if (done) done(el);
            });
    }

    inject("header", isHome ? "/layout/nav_index.html" : "/layout/nav.html");
    inject("footer", "/layout/footer.html", function () {
        var year = document.getElementById("footer-year");
        if (year) year.textContent = new Date().getFullYear();
    });
})();
