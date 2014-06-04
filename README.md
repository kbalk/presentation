# Presentation

This is a simple javascript-based presentation framework that supports
markdown text and html as input and uses Bootstrap for styling.

The intent behind creating this presentation framework was to learn
jQuery and Bootstrap and to create something productive in the
process.  There are several other presentation frameworks available that
support markdown as input, some with powerful "wow" factors (reveal.js).

This framework is simpler, without the same pizazz, but it does the
job.  It's available for those who might like to use it as is or
customize it further for their own purposes.

## Features

Presentation frameworks that use markdown text as input vary in how the 
user provides that text, how the screen is designed and what special
effects are supported, which keys control the keyboard, and the way in 
which the slide summary is presented.

This framework handles those issues as follows:

### Location of slide content

The content for all of the slides in a slideshow is contained within a
single markdown file.

* The markdown or html contents for each slide is separated by a line of
three dashes starting in column one and ending with a linefeed, i.e, "^---\n".

    ```markdown
    # Slide 1
    Introductory text
    ---
    # Slide 2
    More verbiage
    ```

* The markdown file is expected to reside under the 'slides' directory
of the distribution directory.  More than one slideshow can be maintained
by creating subdirectories under 'slides'.

* The presentation home page (presentation.html) provides a start button
and a form to input the presentation title and the location of the markdown
file.  Refresh the page to start and select another slideshow.
      
### Screen design

* Bootstrap.js powers the slide carrousel.  The default Bootstrap theme 
is used, but customization using one of the other Bootstrap themes is 
possible.

### Keys controlling the slideshow

* There are permanently visible left and right arrow buttons on the bottom
of the screen to move between slides.

* The left and right arrows on the keyboard will also work.

### Slide summary

* The list of slides in the presentation is available through a dropup 
menu permanently fixed to the bottom of the screen.  Selecting a slide 
title will take you to that slide.

* A slide title is assumed to be the first H1 header found for that slide.
If no H1 header is found, 'Untitled' is used for the title.

## Installation

1.  Download the latest version from https://github.com/kbalk/presentation.

2.  Unzip the contents.

3.  Test the functionality using the example presentation:
    * Start your web server or use 'start_web.sh' (found in the distribution)
      to start a simple Python HTTP server.
    * From the browser, open presentation.html.  For example:
        ```
        http://localhost:8080/presentation.html
        ```
    * Click on the "Start slideshow" button and type in a markdown file 
      of 'slides/example.md'.  If no slideshow title is input, a default
      of 'Presentation' will be used.
    * The example slideshow reviews the capabilities of this tool and
      provides sample markdown text.

4.  Create your own slideshow and store it under the slides directory
    or create a subdirectory and store your markdown file and images there.

### Prerequisites

There is no need to download the following libraries as they are either
provided with the release or referenced to the appropriate location.

Library                                       | Purpose 
----------------------------------------------| --------------------------
[Bootstrap.js 3.1](http://getbootstrap.com/)  | Web development framework 
[jQuery.js 1.11](https://jquery.com/)         | JavaScript library
[Marked.js](https://github.com/chjj/marked)   | Markdown parser
[Highlight.js](http://highlightjs.org/)       | Syntax highlighting 

### Directory Structure

Subdirectory  | Contents
-------------| ------------
css    | Bootstrap CSS, customizations in styles.css
fonts  | Some Bootstrap glyphicons
js     | Source files specific to this tool
lib    | Bootstrap, jQuery and Marked javascript plugins
slides | Location of markdown file(s) for slideshow content

## Slide content

* [GitHub Flavored Markdown](https://help.github.com/categories/88/articles) is supported, courtesy of the marked.js parser.

* Code blocks are shown with syntax highlighting, courtesy of highlight.js.

* Some extensions are supported:
    - For centering the text and images of an individual slide:

      ```
      `center`
      ```

    - For specifying a background image:

      ```
      `background-image:  slides/dominos.jpg`
      ```

      However, the rendering of the next and previous slide is not
      always smooth.

* HTML can be used directly; uninterpreted by the markdown parser.
    - For example, to shift an image to the right: 

      ```
      <img src="slides/motorcycle-sm.jpg" alt="motorcycle" class="pull-right"></img>
      ```
* HTML with Bootstrap styling is also possible:
    - For example, to use Bootstrap's font colors:

      ```
      <p class="text-primary text-center">Bootstrap's primary color is blue</p>
      ```

* Headers are automatically followed by a html break for better presentation.

* An image file referenced in the markdown file has the same restriction on 
  location as the markdown file itself, i.e., the file must be located under 
  the 'slides' directory.
    - For example:

      ```
      ![Presenter](slides/presentation.jpg)
      ```
