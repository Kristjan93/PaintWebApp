//þarf að skoða: Ekki hægt að gera bara einn punkt með pennannum
// ef texti er valin, ekkert skrifað og annað tól valið þá gerist eh skrýtið

$(document).ready(function(){
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	var myDrawing = {
		currentStartX: undefined,
		currentStartY: undefined,
		allShapes: [],
		tempShapes: undefined,
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
		var testCol = $('#picker').css("backgroundColor");
		console.log(testCol);
		myDrawing.currentStartX = e.pageX - this.offsetLeft;
		myDrawing.currentStartY = e.pageY - this.offsetTop;

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
			myDrawing.tempShapes = (new Pen(0,0,0,0)); // það er ekki hægt að gera einn punkt
			myDrawing.nextObject = "pen";
		}
		else if(document.getElementById('idRadioText').checked) {
			myDrawing.nextObject = "text";
			myDrawing.tempShapes = (new Tex(e.pageX, e.pageY));
			$("#idTextBox").css({"top": e.pageY, "left": e.pageX});
			$("#idTextBox").show();
			
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
				myDrawing.tempShapes = (new Line(myDrawing.currentStartX, myDrawing.currentStartY, x, y, myDrawing.nextColor));
				//console.log("mousedown: ", myDrawing.startX, myDrawing.startY);
            	context.beginPath();
	            context.moveTo(myDrawing.currentStartX, myDrawing.currentStartY);
	            context.lineTo(x, y);
	            //context.strokeStyle = myDrawing.nextColor;
	            context.stroke();
			}

			else if(myDrawing.nextObject === "rect"){
				myDrawing.tempShapes = (new Rect(myDrawing.currentStartX, myDrawing.currentStartY, x - myDrawing.currentStartX, y - myDrawing.currentStartY, myDrawing.nextColor));
				context.beginPath();
				context.strokeRect(myDrawing.currentStartX, myDrawing.currentStartY, x - myDrawing.currentStartX, y - myDrawing.currentStartY); // (x,y) (width, height)
				///context.strokeStyle = myDrawing.nextColor;
				context.stroke();
			}

			else if(myDrawing.nextObject === "circle"){
				myDrawing.tempShapes = (new Circle(myDrawing.currentStartX, myDrawing.currentStartY, x, y));
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
				//console.log("pen");
				//console.log(myDrawing.tempShapes[0]);
				var len = myDrawing.tempShapes.xArray.length -1
				myDrawing.tempShapes.xArray.push(x);
				myDrawing.tempShapes.yArray.push(y);

				for(var j = 1; j < len; j++){
					context.beginPath();
					context.moveTo(myDrawing.tempShapes.xArray[j-1], myDrawing.tempShapes.yArray[j-1]);
					context.lineTo(myDrawing.tempShapes.xArray[j], myDrawing.tempShapes.yArray[j]);
					context.closePath();
					context.stroke();
				}
			}

			else if(myDrawing.nextObject === "text"){
				//$("#idTextBox").show();
				$("#idTextBox").css({"top": myDrawing.tempShapes.startY, "left": myDrawing.tempShapes.startX});

			}

		}
	});

	$("#myCanvas").mouseup(function(e){
		//console.log("mouseUPPPP")
    	myDrawing.isDrawing = false;
        myDrawing.allShapes.push(myDrawing.tempShapes);
        //console.log(myDrawing.tempShapes);
        myDrawing.tempShapes = undefined;
        //console.log(myDrawing.tempShapes);
        //console.log(myDrawing.allShapes[0].xArray);
	});

	var Shape = Base.extend({
		constructor: function(startX, startY, x, y, color){
			this.x = x;
			this.y = y;
			this.startX = startX;
			this.startY = startY;
			this.objColor = color;
		},
		x: undefined,
		y: undefined,
		startX: undefined,
		startY: undefined,
		objColor: "black",
	});

	var Line = Shape.extend({
		draw: function(context, i){
			context.beginPath();
	        context.moveTo(myDrawing.allShapes[i].startX, myDrawing.allShapes[i].startY);
	        context.lineTo(myDrawing.allShapes[i].x, myDrawing.allShapes[i].y);
	        //context.strokeStyle = myDrawing.nextColor;
	        context.stroke();
		}
	});

	var Rect = Shape.extend({
		draw: function(context, i){
			context.beginPath();
			context.strokeRect(myDrawing.allShapes[i].startX, myDrawing.allShapes[i].startY, myDrawing.allShapes[i].x, myDrawing.allShapes[i].y); // (x,y) (width, height)
			//context.strokeStyle = myDrawing.nextColor;
			context.stroke();
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
		constructor: function(startX, startY, x, y){
			this.base(startX, startY, x, y);
			this.xArray = [];
			this.yArray = [];
		},
		draw: function(context, i){
			for(var j = 0; j < this.xArray.length; j++){
				context.beginPath();
				context.moveTo(myDrawing.allShapes[i].xArray[j-1], myDrawing.allShapes[i].yArray[j-1]);
				context.lineTo(myDrawing.allShapes[i].xArray[j], myDrawing.allShapes[i].yArray[j]);
				context.closePath();
				context.stroke();
			}
			//context.beginPath();
			//console.log(myDrawing.allShapes[i].xArray.length);
			//context.moveTo(xArray[])

		}
	})

	var Tex = Shape.extend({
		constructor: function(startX, startY, x, y, text){
			this.myText = text;
		},
		draw: function(context, i){
			console.log(myDrawing.allShapes[i].myText);
			console.log(myDrawing.allShapes[i].startX);
			console.log(myDrawing.allShapes[i].startY);
			context.fillText(myDrawing.allShapes[i].myText, myDrawing.allShapes[i].startX, myDrawing.allShapes[i].startY);
		}
	})


	$("#idTextBox").keypress(function(e) {
	    if(e.which == 13) {
	        var canvasText = $(this).val();
	        context.fillText(canvasText, myDrawing.currentStartX, myDrawing.currentStartY);

	        myDrawing.tempShapes.myText = canvasText;
	        myDrawing.tempShapes.startX = myDrawing.currentStartX;
	        myDrawing.tempShapes.startY = myDrawing.currentStartY;
	        myDrawing.allShapes.push(myDrawing.tempShapes);
	        
	        $("#idTextBox").val('');
	        $("#idTextBox").hide();
	        myDrawing.isDrawing = false;
	    }
	});

	$('#picker').colpick({
		flat:true,
		layout:'hex',
		submit:0,
		onSubmit:function(hsb,hex,rgb,el) {
			$(el).css('background-color', '#'+hex);
			$(el).colpickHide();
			console.log("jejejejjebjsbdkabfljbnalfna")
	}
	});


});







