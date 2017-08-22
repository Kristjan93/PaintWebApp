# PaintWebApp
> 'Masterfully' designed microsoft paint inspired application.

See the application in action [here.](https://paint-web-app.herokuapp.com/index.html)

Or clone this repository and open index.html in your favorite browser.

## Background
This application was built using pure object-oriented design in javaScript and the HTML5 canvas element.

## Functionality
You can add predefined primitive drawing objects that work similarly as in most drawing programs.
  * circle
  * rectangle
  * line
  * text
  * pen (i.e. a freehand drawing)

You can manipulate various properties of the drawing objects.
These properties are fixed(unchangeable) once the object is drawn.  **All except move**. 
  * color picker
  * line size
  * font (only with text)
  * move

General workflow functionality is possible such as
  * undo and redo
  * save drawing 
  * clear canvas

## Notes
It was pointed out that the top color bar was misdirecting as it is not the color picker.
In the top left corner is a hex-input with a box, the box is the color picker.
