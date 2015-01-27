$(document).ready(function(){
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	var myDrawing = {
		currentStartX: undefined,
		currentStartY: undefined,
		allShapes: [],
		tempShapes: [],
		nextObject: "line",
		nextColor: "black",
		isDrawing: false,
		drawAllShapes: function(context){
			for(i = 0; i < myDrawing.allShapes.length; i++){
				myDrawing.allShapes[i].draw(context, i);
			}
		}
	};

	$("#myCanvas").mousedown(function(e){
		if(document.getElementById('idRadioRect').checked) {
  			myDrawing.nextObject = "rect";
		}
		else if(document.getElementById('idRadioLine').checked) {
			myDrawing.nextObject = "line";
		}
		else if(document.getElementById('idRadioCircle').checked) {
			myDrawing.nextObject = "circle";
		}
		else if(document.getElementById('idRadioPen').checked) {
			myDrawing.nextObject = "pen";
		}
		myDrawing.currentStartX = e.pageX - this.offsetLeft;
		myDrawing.currentStartY = e.pageY - this.offsetTop;
		myDrawing.isDrawing = true;
	});

	$("#myCanvas").mousemove(function(e){

		if(myDrawing.isDrawing === true){
			context.clearRect(0, 0, canvas.width, canvas.height);

			//keeps previous shapes on the canvas
			myDrawing.drawAllShapes(context);

			x = e.pageX - this.offsetLeft;
			y = e.pageY - this.offsetTop;

			if(myDrawing.nextObject === "line"){
				myDrawing.tempShapes.push(new Line(myDrawing.currentStartX, myDrawing.currentStartY, x, y));
				console.log("mousedown: ", myDrawing.startX, myDrawing.startY);
            	context.beginPath();
	            context.moveTo(myDrawing.currentStartX, myDrawing.currentStartY);
	            context.lineTo(x, y);
	            context.stroke();
			}

			else if(myDrawing.nextObject === "rect"){
				myDrawing.tempShapes.push(new Rect(myDrawing.currentStartX, myDrawing.currentStartY, x - myDrawing.currentStartX, y - myDrawing.currentStartY));
				context.beginPath();
				context.strokeRect(myDrawing.currentStartX, myDrawing.currentStartY, x - myDrawing.currentStartX, y - myDrawing.currentStartY); // (x,y) (width, height)
				context.stroke();
			}

			else if(myDrawing.nextObject === "circle"){
				myDrawing.tempShapes.push(new Circle(myDrawing.currentStartX, myDrawing.currentStartY, x, y));
			    var radiusX = (x - myDrawing.currentStartX) * 0.5,
			        radiusY = (y - myDrawing.currentStartY) * 0.5,
			        centerX = myDrawing.currentStartX + radiusX,
			        centerY = myDrawing.currentStartY + radiusY,
			        step = 0.01,
			        a = step,
			        pi2 = Math.PI * 2 - step;
			    context.beginPath();
			    context.moveTo(centerX + radiusX * Math.cos(0),
			               centerY + radiusY * Math.sin(0));

			    for(; a < pi2; a += step) {
			        context.lineTo(centerX + radiusX * Math.cos(a),
			                   centerY + radiusY * Math.sin(a));
			    }
			    context.closePath();
			    context.stroke();
			}

			else if(myDrawing.nextObject === "pen"){
				console.log("pen");
				context.beginPath();
				context.moveTo(x, y);
				context.arc(x, y, 3, 0, Math.PI * 2, false);
            	context.fill();

			}
		}
	});

	$("#myCanvas").mouseup(function(e){
    	myDrawing.isDrawing = false;
        myDrawing.allShapes.push(myDrawing.tempShapes[myDrawing.tempShapes.length-1]);
        tempShapes = [];
	});

	var Shape = Base.extend({
		constructor: function(startX, startY, x, y){
			this.x = x;
			this.y = y;
			this.startX = startX;
			this.startY = startY;
		},
		x: undefined,
		y: undefined,
		startX: undefined,
		startY: undefined,
	});

	var Line = Shape.extend({
		draw: function(context, i){
			context.beginPath();
	        context.moveTo(myDrawing.allShapes[i].startX, myDrawing.allShapes[i].startY);
	        context.lineTo(myDrawing.allShapes[i].x, myDrawing.allShapes[i].y);
	        context.stroke();
		}
	});

	var Rect = Shape.extend({
		draw: function(context, i){
			context.beginPath();
			context.strokeRect(myDrawing.allShapes[i].startX, myDrawing.allShapes[i].startY, myDrawing.allShapes[i].x, myDrawing.allShapes[i].y); // (x,y) (width, height)
			context.stroke();
		}
	});

	var Circle = Shape.extend({
		draw: function(context, i){
			var radiusX = (myDrawing.allShapes[i].x - myDrawing.allShapes[i].startX) * 0.5,
	        radiusY = (myDrawing.allShapes[i].y - myDrawing.allShapes[i].startY) * 0.5,
	        centerX = myDrawing.allShapes[i].startX + radiusX,
	        centerY = myDrawing.allShapes[i].startY + radiusY,
	        step = 0.01,
	        a = step,
	        pi2 = Math.PI * 2 - step;
			    
		    context.beginPath();
		    context.moveTo(centerX + radiusX * Math.cos(0),
		               centerY + radiusY * Math.sin(0));

		    for(; a < pi2; a += step) {
		        context.lineTo(centerX + radiusX * Math.cos(a),
		                   centerY + radiusY * Math.sin(a));
		    }
		    
		    context.closePath();
		    context.stroke();
		}
	});
});