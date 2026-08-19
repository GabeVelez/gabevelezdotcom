(function () {
    // Only apply to case study pages
    if (!document.body.classList.contains("casestudy")) return;

    var sections = Array.prototype.slice.call(document.querySelectorAll(".block"));
    if (sections.length === 0) return;

    // Map to store the colors for each section class
    var colorMap = {
        "block__black": "#1B2021", // --gabe-black
        "block__gray": "#364042",  // --gabe-gray
        "block__sage": "#5D7052",  // --gabe-sage
        "block__red": "#240000",   // --gabe-darkred
        "block__teal": "#235965",  // --gabe-teal
        "block__forrest": "#2A6E3F" // --gabe-forrest
    };

    // Create a fixed background element that will change colors
    var background = document.createElement("div");
    background.className = "dynamic-background";
    background.style.backgroundColor = "#1B2021";
    document.body.prepend(background);

    function update() {
        // Find which section is in the middle of the viewport
        var viewportMiddle = window.scrollY + window.innerHeight / 2;

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var top = section.getBoundingClientRect().top + window.scrollY;
            var bottom = top + section.offsetHeight;

            if (viewportMiddle >= top && viewportMiddle <= bottom) {
                // Use the first block class that has a color mapping
                var colorClass = Array.prototype.find.call(section.classList, function (c) {
                    return colorMap[c];
                });
                if (colorClass) background.style.backgroundColor = colorMap[colorClass];
                break;
            }
        }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
})();
