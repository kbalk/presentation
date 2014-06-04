/*
 * pfModel
 *
 * Contains the logic for obtaining the markdown file, creating the array 
 * of slides (still in markdown) and the list of titles from those slides.
 *
 * pfModel.init() must be called before any other functions in this
 * module are invoked.
 *
 */

var pfModel = (function ($) {
    'use strict';

    var SLIDE_SEPARATOR = "\n---\n"; 

    var mdPathname;
    var mdTitles   = [];
    var mdSlides = [];

    var errorMsg = '';

    /* ------------------------------------------------------------------
     * createSlides - "private" function
     *
     * Takes the contents of the markdown file and creates an array of 
     * slides.  No transformation is performed on the slide text (other
     * than converting DOS line terminators to a single newline character).
     * ----------------------------------------------------------------- */
    var createSlides = function (mdText) {
        // Convert DOS line terminators to a single newline.
        mdText = mdText.replace(/\r\n/g, "\n");

        // Convert the markdown text into separate slides of markdown text.
        mdSlides = mdText.split(SLIDE_SEPARATOR);
    };

    /* ------------------------------------------------------------------
     * createTitles - "private" function
     *
     * For each slide in the slide array, the first H1 header found is
     * used as the slide title, otherwise 'Untitled' is used.  Creates
     * an array of these titles in mdTitles.
     * ----------------------------------------------------------------- */
    var createTitles = function () {
        var lines = []; 
        var numSlides = mdSlides.length;

        // The first line with a single leading hash symbol (representing 
        // H1) will be treated as the title of the slide. 
        for (var idx = 0; idx < numSlides; idx++) {

            // Create an array of lines from the blob of slide text to
            // make it easier to match on a header.  Using the raw markdown 
            // to match on a header instead of the rendered markdown does 
            // run the risk of not supporting markdown variants for headers.
            lines = mdSlides[idx].split("\n").map($.trim);

            var foundTitle = false;
            var numLines = lines.length;

            for (var idx2 = 0; idx2 < numLines; idx2++) {
                // If a single '#' is found, we've got the title and we
                // search no further.
                if (lines[idx2].match(/^\s*#\s*\w/)) {
                    foundTitle = true;
                    mdTitles.push(lines[idx2].replace(/^\s*#\s*/, ''));
                    break;
                }
            }

            // If no header was found, use a placeholder of 'Untitled'.
            if (!foundTitle) {
                mdTitles.push('[Untitled]');
            }
        }
    };

    /* ------------------------------------------------------------------
     * init - "public" function
     *
     * Reads in the markdown file, then invokes the function to create
     * an array of slides and an array of slide titles.
     * ----------------------------------------------------------------- */
    var init = function (pathname) {
        var mdText = '';
        var isSuccess = true;

        errorMsg = '';
        mdPathname = pathname;

        // Synchronously retrieve the markdown file.
        var jqxhr = $.ajax({
            url:         mdPathname,
            type:        'GET',
            async:       false,
            beforeSend:  function (xhr) {
                xhr.overrideMimeType('text/plain');
            }
        });

        jqxhr.fail(function (jqxhr, textStatus, errorThrown) {
            isSuccess = false;

            errorMsg = 'Unable to read the markdown file:  ' + mdPathname;
            if (errorThrown.length !== 0) {
                errorMsg = errorMsg + "\n" + errorThrown;
            }
        });

        jqxhr.always(function (data) {
                mdText = data;
        });

        // If the file was successfully retrieved, create the array of
        // slides and extract the slides titles from the text.
        if (isSuccess && mdText.length !== 0) {
            createSlides(mdText);
            createTitles();
        }

        return isSuccess;
    };

    /* ------------------------------------------------------------------
     * getSlides - "public" function
     *
     * Returns the array of slides containing markdown text.
     * ----------------------------------------------------------------- */
    var getSlides = function () {
        return mdSlides;
    };

    /* ------------------------------------------------------------------
     * getTitles - "public" function
     *
     * Returns the array of slide titles.
     * ----------------------------------------------------------------- */
    var getTitles = function () {
        return mdTitles;
    };

    /* ------------------------------------------------------------------
     * getErrorMsg - "public" function
     *
     * Returns the error message from the last attempt to get the file.
     * ----------------------------------------------------------------- */
    var getErrorMsg = function () {
        return errorMsg;
    };

    return {
        init: init,
        getSlides: getSlides,
        getTitles: getTitles,
        getErrorMsg: getErrorMsg
    };

}) (jQuery);
