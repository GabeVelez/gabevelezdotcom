$(function() {
    console.log("Dynamic background script loaded");
    
    // Only apply to case study pages
    if (!$('body').hasClass('casestudy')) {
        console.log("Not a case study page, skipping dynamic background");
        return;
    }
    
    // Get all section blocks
    const $sections = $('.block');
    
    if ($sections.length === 0) {
        console.log("No block sections found on page");
        return;
    }
    
    console.log("Found " + $sections.length + " sections with class 'block'");
    
    // Create a fixed background element that will change colors
    const $backgroundElement = $('<div class="dynamic-background"></div>');
    $('body').prepend($backgroundElement);
    console.log("Added dynamic background element to body");
    
    // Map to store the colors for each section class
    const colorMap = {
        'block__black': '#1B2021', // --gabe-black
        'block__gray': '#364042',  // --gabe-gray
        'block__sage': '#5D7052',  // --gabe-sage
        'block__red': '#240000',   // --gabe-darkred
        'block__teal': '#235965',  // --gabe-teal
        'block__forrest': '#2A6E3F' // --gabe-forrest
    };

    // Set initial color explicitly (not using CSS var)
    const initialColor = '#1B2021';
    $backgroundElement.css('background-color', initialColor);
    
    // Log section types for debugging
    $sections.each(function() {
        const classes = Array.from(this.classList);
        const blockClass = classes.find(c => c.startsWith('block__'));
        console.log("Section with classes: " + classes.join(', ') + 
                    (blockClass ? " (has block class: " + blockClass + ")" : " (no block class)"));
    });

    // Simple scroll-based detection as a fallback to Intersection Observer
    $(window).on('scroll', function() {
        // Find which section is in the middle of the viewport
        const viewportMiddle = $(window).scrollTop() + ($(window).height() / 2);
        
        $sections.each(function() {
            const $section = $(this);
            const sectionTop = $section.offset().top;
            const sectionBottom = sectionTop + $section.outerHeight();
            
            if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
                // Find all block classes and use the first one that has a color mapping
                const blockClasses = Array.from($section[0].classList)
                    .filter(className => className.startsWith('block__'));

                // Find the first class that has a color defined
                const colorClass = blockClasses.find(className => colorMap[className]);

                // Apply color
                if (colorClass) {
                    $backgroundElement.css('background-color', colorMap[colorClass]);
                    console.log("Setting background to " + colorClass + " color");
                }

                // Only process the first matching section
                return false;
            }
        });
    });
    
    // Trigger a scroll event to set the initial color based on position
    $(window).trigger('scroll');
});
