<<<<<<< HEAD
#Drawing application, using JavaScript and HTML5(canvas).
  * More information about the project can be found in projectDescription.txt
  * Made a paint application using with canvas.  Go ahead and tray it!
=======
# Vef_paint

In this assignment, your task is to write a drawing application, using JavaScript and HTML5. It should use the HTML5 canvas element, and use object-oriented design for the JavaScript code. A use case for your application could be for a teacher which wants to use your application instead of a regular whiteboard.

The application should be capable of the following:

(40%) it should be possible to add primitive drawing objects to the drawing, i.e.:
circle
rectangle
line
text
pen (i.e. a freehand drawing)
This should work similarly as in most drawing programs (MSPaint, Gimp etc.). The pen should be the default drawing object.
(10%) It should be able to manipulate various properties of the drawing objects, such as their color(s), linewidth, font etc.
(10%) the application should support undo and redo. It is sufficient that each object added to the drawing can be "undone" (and redone). A penstroke should be considered a single object, i.e. when that object is undone it should disappear completely.
(10%) all elements should be movable.
(10%) it should be possible to save and load a drawing (See below: an API is provided which makes this easier).
Also, the following will be considered in the final grade as well:

(10%) code quality (consistency in indentation, variable names, brace placements, whitespace usage etc., structure of the code (are there many global variables? Is the code split up into different files?)
(10%) usability: is it easy to use the application? Does it have sensible defaults? 
Bonus points (which could bring the grade up to 12) will be awarded if the solution contains any of the following features:

A more advanced undo/redo: such as when an object is moved, when the color is changed and more.
Multiple move: The ability to move many objects simultaneously (i.e. select many objects first, then move them all together).
The ability to group primitives (rect, circle, line etc.) together into a template, which can be saved and then added to a new whiteboard with ease (example: a teacher might want to create a "binary tree node" template, containing a circle with text inside, and two arrows pointing downwards from the circle)
Math formulas, and symbols commonly used in math (such as Pi, the sum symbol etc.). You are free to experiment with the implementation of this, one possibility is to be able to write equations in some sort of a language which would then be converted to a drawing by the application (see example here).
>>>>>>> origin/master
