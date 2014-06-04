/*
 * pfView
 *
 * Contains the logic for taking the array of slides in markdown text and
 * creating the html page.  Also handles changes to the screen when any of 
 * the control buttons are selected, i.e., moves the screen to the left or
 * the right or to the selected screen title.
 *
 * pfView.init(slideList) must be called before any other functions in
 * this module are invoked.
 *
 */

var pfView = (function ($) {
    'use strict';

    var slides = [];
    var numSlides = 0;
    var backgrounds = [];

    /* ------------------------------------------------------------------
     * initMarkdown - "private" function
     *
     * Initializes the markdown parser and create prototypes to customize 
     * some of the rendering functions performed by the parser.
     * ----------------------------------------------------------------- */
    var initMarkdown = function () {

        // Save the function for the original render so we call it as needed.
        var parent = marked.Renderer.prototype;

        // Initialize our own renderer.
        var renderer = new marked.Renderer();

        // Under Bootstrap, tables won't render with the proper padding 
        // unless the table class is used.
        renderer.table = function (header, body) {
            return '<table class="table">\n' +
                '<thead>\n' +
                header +
                '</thead>\n' +
                '<tbody>\n' +
                body +
                '</tbody>\n' +
                '</table>\n';
        };

        // Add a break after the heading so it stands out.
        renderer.heading = function(text, level, raw) {
            return parent.heading.call(this, text, level, raw) +
                  (this.options.xhtml ? '<br/>' : '<br>') + '\n';
        };

        // Special effects are supported by extending the usage of inline 
        // code (`xxx`) in markdown text.  Specifically, these are effects
        // that impact the entire slide, rather than a line of html.  For
        // example, specifying background images or a command to center
        // the slide text.
        //
        // To alter the slide, we've overriddene marked's renderer for 
        // codespan, processing the codes we support and passing all others 
        // to the original renderer's codespan().
        renderer.codespan = function (code) {
            if (code.match(/background-image:/)) {
                var imgUrl = code.match(/background-image:\s*(.*)\s*/m) || [''];
                if (imgUrl[1].length) {
                    backgrounds[marked.slideNum] = imgUrl[1];
                }
                return '';
            }
            else if (code.match(/center/)) {
                $('#slide-' + marked.slideNum).css('text-align', 'center');
                return '';
            }

            return parent.codespan.call(this, code);
        };

        // Set marked options to allow for code highlighting and a
        // renderer that supports our own codespan().
        marked.setOptions({
            renderer:  renderer,
            breaks:    true,
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            }
        });

        // Add a new attribute to marked to support the current slide
        // number; we'll use this to indicate which slide to apply the 
        // special effects.
        marked.prototype.slideNum = 0;
    };

    /* ------------------------------------------------------------------
     * markdownSlide - "private" function
     *
     * Updates the current slideNumber and then invokes the markdown
     * parser.  Note that prototypes for the renderer were initialized
     * in initMarkdown() so we could customize the parser.
     * ----------------------------------------------------------------- */
    var markdownSlide = function (slideNum, src) {
        marked.slideNum = slideNum;
        return marked.call(this, src);
    };

    /* ------------------------------------------------------------------
     * updatePage - "private" function
     *
     * Common code for any of the functions that cause a different slide 
     * to be displayed.  Removes a background image, if one is displayed, 
     * adds a background image if one is to be displayed.  Updates the 
     * display of the current slide number. 
     * ----------------------------------------------------------------- */
    var updatePage = function(slideNum) {
        // The '#bg' selector is used to identify the background image.  
        // If a background image is currently in place, remove it.
        if ($('#bg').length) {
            $('#bg').remove();
        }

        // If this current slide has an associated background image, apply
        // it using an image element with an id of '#bg'.
        if (slideNum in backgrounds) {
            $('#slide-show').prepend(
                '<img id="bg" src="' + backgrounds[slideNum] + '"/>');
        }

        // Update the slide number to indicate which slide we're currently 
        // viewing.
        $('#slide-count').html(slideNum + ' / ' + numSlides);
    };

    /* ------------------------------------------------------------------
     * init - "public" function
     *
     * Initializes the markdown parser and screen.  For each slide, takes 
     * the markdown text and converts it into an html and stores it within
     * the carousel.
     * ----------------------------------------------------------------- */
    var init = function (mdSlides) {
        slides = mdSlides;
        numSlides = mdSlides.length;

        // Initialize the markdown plugin, setting the appropriate options
        // and extensions to the renderer.
        initMarkdown();

        // Tell the carousel not to wrap, i.e., the carousel should NOT 
        // automatically cycle continuously nor should it have hard stops.
        $('.carousel').carousel( { wrap: false } );

        // Create just the divisions for the individual slides first,
        // then add the converted markdown text for each slide in another 
        // loop.  A division has to pre-exist to apply any special effects
        // that may be specified in markdown inline code.
        var list = [];
        var idx;
        for (idx = 1; idx <= numSlides; idx++) {
            list.push('<div class="item">' +
                      '<div class="container center-block" id="slide-' + idx + 
                      '">' +
                      '</div>' +
                      '</div>');
        }
        $('.carousel-inner').append(list.join(''));

        // Convert the markdown text into html and insert it the divisions
        // just created.
        for (idx = 1; idx <= numSlides; idx++) {
            $('#slide-' + idx).html(markdownSlide(idx, slides[idx - 1]));
        }

        // Activate the first page.
        $('.carousel-inner').find('div:first').addClass('active');

        // Check for any requested background image and set the slide
        // number to one.
        updatePage(1);
    };

    /* ------------------------------------------------------------------
     * createDropUpList - "public" function
     *
     * Creates the dropup list of slide titles.
     * ----------------------------------------------------------------- */
    var createDropUpList = function (titles) {
        var numTitles = titles.length;

        if (numTitles !== numSlides) {
            alert('Program error!\n' +
                  'Number of titles not equal to number of slides.');
        }

        var list = [];
        for (var idx = 0; idx < numTitles; idx++) {
            list.push('<li role="presentation">' + 
                      '<a role="menuitem" tabindex=-1 href="#">' + 
                      titles[idx] + 
                      '</a>' +
                      '</li>');
        }

        $('#slide-list').append(list.join(''));
    };

    /* ------------------------------------------------------------------
     * showSlide - "public" function
     *
     * When the user selects a slide from the dropup list, the screen
     * is updated to that slide and the slide number is updated as well.
     * ----------------------------------------------------------------- */
    var showSlide = function (event, obj) {
        event.preventDefault();

        // Make the current slide inactive.
        $('.carousel-inner').find('.item.active').removeClass('active');

        // Obtain the dropup selection index, make it 1-based for the item list.
        var idx = obj.parent().index() + 1;

        // Make the selected slide active.
        $('.carousel-inner')
            .find('div:nth-child(' + idx + ')')
            .addClass('active');

        updatePage(idx);
    };

    /* ------------------------------------------------------------------
     * moveLeft - "public" function
     *
     * Updates the screen to the previous slide and updates the slide 
     * number.
     * ----------------------------------------------------------------- */
    var moveLeft = function () {
        $('#slide-show').carousel('prev');

        var slideNum = $('.carousel-inner').find('.item.active').index('.item');
        if (slideNum === 0) {
            slideNum = 1;
        }

        updatePage(slideNum);
    };

    /* ------------------------------------------------------------------
     * moveRight - "public" function
     *
     * Updates the screen to the next slide and updates the slide number.
     * ----------------------------------------------------------------- */
    var moveRight = function () {
        $('#slide-show').carousel('next');

        var slideNum = $('.carousel-inner')
                            .find('.item.active')
                            .index('.item') + 2;
        if (slideNum > numSlides) {
            slideNum = numSlides;
        }

        updatePage(slideNum);
    };

    return {
        init: init,
        createDropUpList: createDropUpList,
        showSlide: showSlide,
        moveLeft: moveLeft,
        moveRight: moveRight
    };

}) (jQuery);
