//þarf að skoða: Ekki hægt að gera bara einn punkt með pennannum
// ef texti er valin, ekkert skrifað og annað tól valið þá gerist eh skrýtið
// ef dropdown menu er niðri og ýtt er á canvas, þá virkar ekki draw   - FIXED
// ef þý ýtir oft á canvasið með text valið, þá kemur "undefined" útum allt
//Breytist um font þegar texti er teiknaður aftur

$(document).ready(function(){
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	var myDrawing = {
		currentStartX: undefined,
		currentStartY: undefined,
		allShapes: [],
		tempShape: undefined,
		movingShape: undefined,
		nextObject: "line",
		nextColor: "black",
		nextWidth: 1,
		isDrawing: false,
		drawAllShapes: function(context){
			for(i = 0; i < myDrawing.allShapes.length; i++){
				myDrawing.allShapes[i].draw(context, i);
			}
		}
	};

	$("#myCanvas").mousedown(function(e){
		myDrawing.nextWidth = document.getElementById("idLineSize").value;

		myDrawing.currentStartX = e.pageX - this.offsetLeft;
		myDrawing.currentStartY = e.pageY - this.offsetTop;

		if(document.getElementById('idRadioRect').checked){
  			myDrawing.nextObject = "rect";
		}
		else if(document.getElementById('idRadioLine').checked){
			myDrawing.nextObject = "line";
		}
		else if(document.getElementById('idRadioCircle').checked){
			myDrawing.nextObject = "circle";
		}
		else if(document.getElementById('idRadioPen').checked){
			myDrawing.tempShape = (new Pen(0,0,0,0, myDrawing.nextColor, myDrawing.nextWidth));
			myDrawing.nextObject = "pen";
		}
		else if(document.getElementById('idRadioText').checked){
			myDrawing.nextObject = "text";
			myDrawing.tempShape = (new Tex(e.pageX, e.pageY, 0, 0, myDrawing.nextColor, myDrawing.nextWidth));
			$("#idTextBox").css({"top": e.pageY, "left": e.pageX});
			$("#idTextBox").show();
		}
		else if(document.getElementById('idRadioMove').checked){
			myDrawing.nextObject = "move";
			for(i = myDrawing.allShapes.length-1; i >= 0; i--){
				//console.log(i);
				if(myDrawing.allShapes[i].findMe(myDrawing.currentStartX, myDrawing.currentStartY, i)){
					myDrawing.movingShape = myDrawing.allShapes[i];

					console.log(i);
					//console.log("found-", myDrawing.allShapes);
					myDrawing.allShapes.splice(i,1);
					//console.log("found+", myDrawing.allShapes);
					break;
				}
			}
		}
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
				myDrawing.tempShape = (new Line(myDrawing.currentStartX, myDrawing.currentStartY, x, y, myDrawing.nextColor, myDrawing.nextWidth));

            	context.beginPath();
            	context.lineWidth = myDrawing.nextWidth;
            	context.strokeStyle = myDrawing.nextColor;
	            context.moveTo(myDrawing.currentStartX, myDrawing.currentStartY);
	            context.lineTo(x, y);
	            context.stroke();
			}

			else if(myDrawing.nextObject === "rect"){
				myDrawing.tempShape = (new Rect(myDrawing.currentStartX, myDrawing.currentStartY, x - myDrawing.currentStartX, y - myDrawing.currentStartY, myDrawing.nextColor, myDrawing.nextWidth));
				context.beginPath();
				context.lineWidth = myDrawing.nextWidth;
				context.strokeStyle = myDrawing.nextColor;
				context.strokeRect(myDrawing.currentStartX, myDrawing.currentStartY, x - myDrawing.currentStartX, y - myDrawing.currentStartY); // (x,y) (width, height)
				context.stroke();
			}

			else if(myDrawing.nextObject === "circle"){
				myDrawing.tempShape = (new Circle(myDrawing.currentStartX, myDrawing.currentStartY, x, y, myDrawing.nextColor, myDrawing.nextWidth));
			    var radiusX = (x - myDrawing.currentStartX) * 0.5,
			        radiusY = (y - myDrawing.currentStartY) * 0.5,
			        centerX = myDrawing.currentStartX + radiusX,
			        centerY = myDrawing.currentStartY + radiusY,
			        step = 0.01,
			        a = step,
			        pi2 = Math.PI * 2 - step;
			    context.beginPath();
			    context.lineWidth = myDrawing.nextWidth;
			    context.strokeStyle = myDrawing.nextColor;
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
				var len = myDrawing.tempShape.xArray.length -1

				myDrawing.tempShape.xArray.push(x);
				myDrawing.tempShape.yArray.push(y);

				for(var j = 1; j < len; j++){
					context.beginPath();
					context.lineWidth = myDrawing.nextWidth;
					context.strokeStyle = myDrawing.nextColor;
					context.moveTo(myDrawing.tempShape.xArray[j-1], myDrawing.tempShape.yArray[j-1]);
					context.lineTo(myDrawing.tempShape.xArray[j], myDrawing.tempShape.yArray[j]);
					context.closePath();
					context.stroke();
				}
			}

			else if(myDrawing.nextObject === "text"){
				$("#idTextBox").css({"top": myDrawing.tempShape.startY, "left": myDrawing.tempShape.startX});
			}

			else if(myDrawing.nextObject === "move" && myDrawing.movingShape !== undefined){
				myDrawing.tempShape = (new Rect(myDrawing.movingShape.startX - (myDrawing.movingShape.startX - x),
					myDrawing.movingShape.startY - (myDrawing.movingShape.startY - y),
					myDrawing.movingShape.x,
					myDrawing.movingShape.y));

				context.beginPath();
				context.lineWidth = myDrawing.nextWidth;
				context.strokeStyle = myDrawing.nextColor;
				context.strokeRect(myDrawing.movingShape.startX - (myDrawing.movingShape.startX - x) ,
					myDrawing.movingShape.startY - (myDrawing.movingShape.startY - y),
					myDrawing.movingShape.x,
					myDrawing.movingShape.y); // (x,y) (width, height)
				context.stroke();

				//myDrawing.tempShape.startX = tempShape.startX - (tempShape.startX - x);
				//myDrawing.tempShape.startY = tempShape.startY - (tempShape.startY - y);

			}
		}
	});

	$("#myCanvas").mouseup(function(e){
    	myDrawing.isDrawing = false;
    	if(myDrawing.tempShape === undefined){
    		console.log("Drawing undefined - dont push on allShapes")
    	}
    	else{
    		myDrawing.allShapes.push(myDrawing.tempShape);
    	}
    	myDrawing.tempShape = undefined;
    	myDrawing.movingShape = undefined;
	});

	var Shape = Base.extend({
		constructor: function(startX, startY, x, y, color, width){
			this.x = x;
			this.y = y;
			this.startX = startX;
			this.startY = startY;
			this.objColor = color;
			this.objWidth = width;
		},
		x: undefined,
		y: undefined,
		startX: undefined,
		startY: undefined,
		objColor: "black",
		objWidth: 1,
	});

	var Line = Shape.extend({
		draw: function(context, i){
			context.beginPath();
			context.lineWidth = myDrawing.allShapes[i].objWidth;
			context.strokeStyle = myDrawing.allShapes[i].objColor;
	        context.moveTo(myDrawing.allShapes[i].startX, myDrawing.allShapes[i].startY);
	        context.lineTo(myDrawing.allShapes[i].x, myDrawing.allShapes[i].y);
	        context.stroke();
		},
		findMe: function(context, x, y, i){
			console.log("findMeLine")
		}
	});

	var Rect = Shape.extend({
		draw: function(context, i){
			context.beginPath();
			context.lineWidth = myDrawing.allShapes[i].objWidth;
			context.strokeStyle = myDrawing.allShapes[i].objColor;
			context.strokeRect(myDrawing.allShapes[i].startX, myDrawing.allShapes[i].startY, myDrawing.allShapes[i].x, myDrawing.allShapes[i].y); // (x,y) (width, height)
			context.stroke();
		},
		findMe: function(x, y, i){
			//console.log("findMeRect", myDrawing.allShapes[i]);
			//console.log(x);
			var xFound = false,
			    yFound = false;
			if(x >= myDrawing.allShapes[i].startX){
				if(x <= (myDrawing.allShapes[i].startX + myDrawing.allShapes[i].x)){
					//console.log("x found")
					xFound = true;
				}
			}
			else{
				if(x >= (myDrawing.allShapes[i].startX + myDrawing.allShapes[i].x)){
					//console.log("x found")
					xFound = true;
				}
			}
			if(y >= myDrawing.allShapes[i].startY){
				if(y <= (myDrawing.allShapes[i].startY + myDrawing.allShapes[i].y)){
					//console.log("Y found")
					yFound = true;
				}
			}
			else{
				if(y >= (myDrawing.allShapes[i].startY + myDrawing.allShapes[i].y)){
					//console.log("Y found")
					yFound = true;
				}
			}

			if(xFound && yFound){
				return true;
			}
			else{
				return false;
			}
		}
	});

	var Circle = Shape.extend({
		draw: function(context, i){
			// taka út allt myDrawing og setja this í staðinn
			var radiusX = (myDrawing.allShapes[i].x - myDrawing.allShapes[i].startX) * 0.5,
	        radiusY = (myDrawing.allShapes[i].y - myDrawing.allShapes[i].startY) * 0.5,
	        centerX = myDrawing.allShapes[i].startX + radiusX,
	        centerY = myDrawing.allShapes[i].startY + radiusY,
	        step = 0.01,
	        a = step,
	        pi2 = Math.PI * 2 - step;
			    
		    context.beginPath();
		    context.lineWidth = myDrawing.allShapes[i].objWidth;
		    context.strokeStyle = myDrawing.allShapes[i].objColor;
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

	var Pen = Shape.extend({
		constructor: function(startX, startY, x, y, color, width){
			this.base(startX, startY, x, y, color, width);
			this.xArray = [];
			this.yArray = [];
		},
		draw: function(context, i){
			for(var j = 0; j < this.xArray.length; j++){
				context.beginPath();
				context.lineWidth = myDrawing.allShapes[i].objWidth;
				context.strokeStyle = myDrawing.allShapes[i].objColor;
				context.moveTo(myDrawing.allShapes[i].xArray[j-1], myDrawing.allShapes[i].yArray[j-1]);
				context.lineTo(myDrawing.allShapes[i].xArray[j], myDrawing.allShapes[i].yArray[j]);
				context.closePath();
				context.stroke();
			}
		}
	})

	var Tex = Shape.extend({
		constructor: function(startX, startY, x, y, color, width, text){
			this.base(startX, startY, x, y, color, width);
			this.myText = text;
		},
		draw: function(context, i){
			// Trying to eliminate the undefined
			if(myDrawing.allShapes[i].myDrawing === undefined){
				//console.log("undefined")
				myDrawing.allShapes[i].myDrawing = "";
			}
			else{
				//console.log("still")
				context.font = myDrawing.allShapes[i].objWidth + 2 + "px Arial";
				context.fillStyle = myDrawing.allShapes[i].objColor;
				context.fillText(myDrawing.allShapes[i].myText, myDrawing.allShapes[i].startX, myDrawing.allShapes[i].startY);
			}	
		}
	})
	var Move = Shape.extend({
		
	})


	$("#idTextBox").keypress(function(e){
	    if(e.which == 13 && myDrawing.isDrawing) {
	        var canvasText = $(this).val();
	        context.fillStyle = myDrawing.nextColor;
	        context.font = myDrawing.nextWidth + 2 + "px Arial";
	        context.fillText(canvasText, myDrawing.currentStartX, myDrawing.currentStartY);

	        myDrawing.tempShape.myText = canvasText;
	        myDrawing.tempShape.startX = myDrawing.currentStartX;
	        myDrawing.tempShape.startY = myDrawing.currentStartY;
	        myDrawing.tempShape.objColor = myDrawing.nextColor;
	        myDrawing.tempShape.objWidth = myDrawing.nextWidth + 2 + "px Arial";

	        myDrawing.allShapes.push(myDrawing.tempShape);
	        
	        $("#idTextBox").val('');
	        $("#idTextBox").hide();
	        myDrawing.isDrawing = false;
	    }
	});

	$(".colorPicker").colorpicker().on('changeColor', function(ev){
	  	myDrawing.nextColor = ev.color.toHex();
	});

});







