`center`
# Presentation framework for markdown 

Expects a single markdown file containing text for a series of slides.
Presents the parsed results via a carousel slide viewer.

![Presenter](slides/presentation.jpg)
---
# Prerequisites

Libraries provided with installation; no separate downloads necessary.

|Library                                       | Purpose |
|----------------------------------------------| --------------------------
|[Bootstrap.js 3.1](http://getbootstrap.com/)  | Web development framework |
|[jQuery.js 1.11](https://jquery.com/)         | JavaScript library |
|[Marked.js](https://github.com/chjj/marked)   | Markdown parser |
|[Highlight.js](http://highlightjs.org/)       | Syntax highlighting |

---
# Slide Control

* Left, right buttons at bottom of screen.

* Left, right arrows on keyboard.

* Select slide title to go directly to a slide:
    - Title is first H1 header for that slide.
    - If no H1 header, 'Untitled' is used.
---
# Markdown File Location

* JavaScript restricts markdown file to the same domain, 
same directory or subdirectories as this framework.

* For multiple slide shows, use a different 'slides' subdirectory for each 

---
# Image File Location

* Image files have the same restrictions as the markdown file.

* References to image files must include the 'slides' directory and 
if necessary, any subdirectories under that. 

For example:

```
   ![Presenter](slides/presentation.jpg)
```

---
# Slide Text

Content of each slide separated by line of three dashes (`\n---\n`). 

*   [GitHub Flavored Markdown](https://help.github.com/categories/88/articles)
*   Code blocks shown with syntax highlighting.
*   Some extensions supported:
    - Centering a slide.
    - Specifying a background image.
*   HTML can be used directly; uninterpreted by markdown parser.
---
# Syntax Highlighting

```
#!/usr/bin/python

odd = []
even = []
num_strings = [1,21,53,84,50,66,7,38,9]

# Separate odd and even numbers
for num in num_strings:
    if (num % 2):
        odd.append(num)
    else:
        even.append(num)

print even
print odd
```
---

`center`

# Centering 

Centers text and images:

```
   `center`
```

![Meditation](slides/meditator-sm.jpg)
---

`background-image:  slides/dominos.jpg`
# Background Images

But ... slower rendering of next and previous slide:

```
    `background-image:  slides/dominos.jpg`
```

---
# HTML Within Markdown 

To shift an image to the right: 

```
   <img src="slides/motorcycle-sm.jpg" alt="motorcycle" class="pull-right"></img>
```

<img src="slides/motorcycle-sm.jpg" alt="motorcycle" class="pull-right"></img>

---
# HTML With Bootstrap Styling

To use Bootstrap's font colors:

```
   <p class="text-primary text-center">Bootstrap's primary color is blue</p>
```

<p class="text-primary text-center">Bootstrap's primary color is blue</p>
---
# Final Remarks

Further framework customizations are possible:

* Elimination of the start button if only one presentation is ever used.
* Application of a Bootstrap theme.
* Additional extensions to markdown parser.

<p></p>
<img src="slides/end.jpg" alt="Finish" class="center-block"></img>
