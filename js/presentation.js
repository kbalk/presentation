/* 
 * pfController.js
 *
 * Initializes the model and view for the presentation framework, then
 * handles button and keystroke events.
 *
 */

$(document).ready(initPage);

/* ------------------------------------------------------------------
 * initPage
 *
 * Once the document is ready, this function provides the callbacks
 * for the start button and form modal.  When a user provides a 
 * non-blank markdown filename, we call startSlideshow() to begin 
 * initializing the slideshow.
 *
 * The possible logic flows are as follows:
 *    click StartButton -> Form Modal -> type non-blank filename 
 *          -> click Submit -> get file -> get fails
 *          -> Alert Modal -> click OK -> Form Modal (repeat)
 *    click StartButton -> Form Modal -> type non-blank filename 
 *          -> click Submit -> get file -> get succeeds 
 *          -> slideshow started
 *    click StartButton -> Form Modal -> click Close -> StartButton
 * ----------------------------------------------------------------- */
function initPage()
{
    'use strict';

    // If we've gotten this far, JavaScript is enabled, so hide the
    // warning to notify the user that JavaScript is disabled.
    $('#noJS').hide();

    // Make sure the user can only exit the modal using the buttons
    // within the modal and not by clicking elsewhere on the screen.
    // 
    // The form modal is activated by the "Start slideshow" button,
    // so hide it until then.
    $('#form-modal').modal( { backdrop: false, keyboard: false } );
    $('#form-modal').modal('hide');

    // If the "Start slideshow" button is clicked, check the form for 
    // a non-blank filename.  If we have a non-blank filename, we can
    // start the show.
    $('#submit-btn').on('click', function () { 
        var $markdownFile = $('#markdown-file');
        var filename = $markdownFile.val().trim();

        if (filename.length === 0) {
            $markdownFile.closest('.form-group').addClass('has-error'); 
        }
        else {
            $markdownFile.closest('.form-group').removeClass('has-error');
            startSlideshow(filename);
        }
    });

    // If the form modal is closed, go back to the start button.
    $('#form-close-btn').on('click', function () { 
        $('#start-show').show();
    });
}

/* ------------------------------------------------------------------
 * alertDialog
 *
 * Display an error.  When the user closes the alert, end the 
 * slideshow by returning to the form modal.
 * ----------------------------------------------------------------- */
function alertDialog(errorMsg)
{
    'use strict';

    // Insert the error message and show the alert.
    errorMsg = errorMsg.replace(/(\n)+/g, '<br />');
    $('#alert-body').html(errorMsg);

    // Make sure the user can only exit the modal using the buttons
    // within the modal and not by clicking elsewhere on the screen.
    $('#alert-modal').modal( { backdrop: false, keyboard: false } );

    // If the alert modal is closed, go back to the form modal.
    $('#alert-close-btn').on('click', function () { 
        $('#form-modal').modal('show');
    });

    $('#alert-modal').modal('show');
}

/* ------------------------------------------------------------------
 * startSlideshow
 *
 * Attempts to read in the markdown file, and if successful, updates
 * the html title, builds the screen and initializes the handlers
 * for the screen control buttons.
 * ----------------------------------------------------------------- */
function startSlideshow(markdownFile) 
{
    'use strict';

    // Form submission complete, hide the form and the start button.
    $('#form-modal').modal('hide');
    $('#start-show').hide();

    // Read in the markdown file.  If the file can't be read, generate
    // an alert modal and exit.
    if (pfModel.init(markdownFile) === false) {
        alertDialog(pfModel.getErrorMsg());
        return;
    }

    // If a title for the slideshow wasn't provided, use the placeholder 
    // value.
    var $presentationTitle = $('#presentation-title');
    var title = $presentationTitle.val().trim() ||
                $presentationTitle.attr('placeholder');
    document.title = title;

    // Add the slides to the html, activate the carrousel and initialize 
    // the text in the slide count box.
    pfView.init(pfModel.getSlides());

    // Create the drop 'up' list of slide items.
    pfView.createDropUpList(pfModel.getTitles());

    // After creating the page, initialize the buttons that control slide 
    // movement.
    initControls();
}

/* ------------------------------------------------------------------
 * initControls
 *
 * Collection of bindings to buttons:  the dropup, next, previous,
 * and special keystrokes.
 * ----------------------------------------------------------------- */
function initControls() 
{
    'use strict';

    // If a slide title is selected from the drop up list, show the slide.
    $('.dropdown-menu li a').on('click', function (event) {
        pfView.showSlide(event, $(this));
    });

    // Cycles to the previous slide
    $('#prev-slide-btn').on('click', function (){ 
        pfView.moveLeft();
    });

    // Cycles to the next slide
    $('#next-slide-btn').on('click', function (){ 
        pfView.moveRight();
    });

    // Listen for keydown anywhere in body.
    $('body').on('keydown', function (event) {
        return keystroke(event);
    });

    // Listen for keyup anywhere in body.
    $('body').on('keyup', function (event) {
        return keystroke(event);
    });
}

/* ------------------------------------------------------------------
 * keystroke
 *
 * Determines if the left or right arrow key was pressed and calls
 * the appropriate function to change the screen.
 * ----------------------------------------------------------------- */
function keystroke(event) 
{
    'use strict';

    // Left arrow?
    if (event.which == 37) {
        pfView.moveLeft();
    }

    // Right arrow?
    else if (event.which == 39) {
        pfView.moveRight();
    }
}
