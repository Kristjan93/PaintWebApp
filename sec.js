//þarf að skoða: Ekki hægt að gera bara einn punkt með pennannum
// ef texti er valin, ekkert skrifað og annað tól valið þá gerist eh skrýtið
// ef dropdown menu er niðri og ýtt er á canvas, þá virkar ekki draw   - FIXED
// ef þý ýtir oft á canvasið með text valið, þá kemur "undefined" útum allt - FIXED
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
		moveX: undefined,
		moveY: undefined,
		drawAllShapes: function(context){
			context.clearRect(0, 0, canvas.width, canvas.height);
			for(i = 0; i < myDrawing.allShapes.length; i++){
				if(myDrawing.allShapes[i] !== undefined){
					myDrawing.allShapes[i].draw(context, myDrawing.allShapes[i]);
					//console.log("kfkkkkkkkkkkk",myDrawing.allShapes[myDrawing.allShapes.length - 1].objName);
				}
			}
		},
		clearAllShapes: function(){
			myDrawing.allShapes = [];
		}
	};

	$("#myCanvas").mousedown(function(e){
		myDrawing.nextWidth = document.getElementById("idLineSize").value;

		myDrawing.currentStartX = e.pageX - this.offsetLeft;
		myDrawing.currentStartY = e.pageY - this.offsetTop;
		//console.log(myDrawing.tempShape, myDrawing.movingShape);

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
			myDrawing.tempShape = (new Pen(0,0,0,0, myDrawing.nextColor, myDrawing.nextWidth, "pen"));
			myDrawing.nextObject = "pen";
		}
		else if(document.getElementById('idRadioText').checked){
			myDrawing.nextObject = "text";
			myDrawing.tempShape = (new Tex(e.pageX, e.pageY, 0, 0, myDrawing.nextColor, myDrawing.nextWidth, "text", ""));
			$("#idTextBox").css({"top": e.pageY, "left": e.pageX});
			$("#idTextBox").show();
		}
		else if(document.getElementById('idRadioMove').checked){
			myDrawing.nextObject = "move";
			myDrawing.moveX = myDrawing.currentStartX
			myDrawing.moveY = myDrawing.currentStartY
			//console.log("move:::::", myDrawing.allShapes.length)
			for(var a = myDrawing.allShapes.length-1; a >= 0; a--){
				//console.log("i:", a)
				//console.log(myDrawing.allShapes[a]);
				if(myDrawing.allShapes[a].findMe(myDrawing.currentStartX, myDrawing.currentStartY, myDrawing.allShapes[a])){
					//console.log("foundddddddddd", myDrawing.allShapes[a]);
					myDrawing.movingShape = myDrawing.allShapes[a];
					myDrawing.tempShape = myDrawing.allShapes[a];
					myDrawing.tempShape = myDrawing.tempShape;
					//console.log(myDrawing.movingShape.objName);
					//if(myDrawing.tempShape.objName === "pen"){
						//myDrawing.tempShape.x = myDrawing.currentStartX 
						//myDrawing.tempShape.y = myDrawing.currentStartY
					//}
					//console.log(myDrawing.allShapes[i]);
					myDrawing.allShapes.splice(a,1);
					//myDrawing.allShapes.push(myDrawing.tempShape);
					//console.log("found+", myDrawing.allShapes);
					break;
				}
				else{
					console.log("NOT FOUND")
				}
			}
		}
		myDrawing.isDrawing = true;
	});

	$("#myCanvas").mousemove(function(e){

		if(myDrawing.isDrawing === true){
			

			//keeps previous shapes on the canvas
			myDrawing.drawAllShapes(context);
			undoRedo.resetAll();

			x = e.pageX - this.offsetLeft;
			y = e.pageY - this.offsetTop;

			if(myDrawing.nextObject === "line"){
				myDrawing.tempShape = (new Line(myDrawing.currentStartX,
					myDrawing.currentStartY,
					x,
					y,
					myDrawing.nextColor,
					myDrawing.nextWidth,
					"line"));
				myDrawing.tempShape.draw(context, myDrawing.tempShape)
			}

			else if(myDrawing.nextObject === "rect"){
				myDrawing.tempShape = (new Rect(myDrawing.currentStartX,
					myDrawing.currentStartY,
					x - myDrawing.currentStartX,
					y - myDrawing.currentStartY,
					myDrawing.nextColor,
					myDrawing.nextWidth,
					"rect"));
				myDrawing.tempShape.draw(context, myDrawing.tempShape);

			}

			else if(myDrawing.nextObject === "circle"){
				myDrawing.tempShape = (new Circle(myDrawing.currentStartX,
					myDrawing.currentStartY,
					x,
					y,
					myDrawing.nextColor,
					myDrawing.nextWidth,
					"circle"));
				myDrawing.tempShape.centerX = myDrawing.currentStartX + myDrawing.tempShape.radiusX;
				myDrawing.tempShape.centerY = myDrawing.currentStartY + myDrawing.tempShape.radiusY;

			    myDrawing.tempShape.draw(context, myDrawing.tempShape);
			}

			else if(myDrawing.nextObject === "pen"){
				myDrawing.tempShape.xArray.push(x);
				myDrawing.tempShape.yArray.push(y);

				myDrawing.tempShape.draw(context, myDrawing.tempShape);
			}

			else if(myDrawing.nextObject === "text"){
				$("#idTextBox").css({"top": myDrawing.tempShape.startY, "left": myDrawing.tempShape.startX});
			}

			else if(myDrawing.nextObject === "move" && myDrawing.movingShape !== undefined){
				var xOff = (myDrawing.moveX - x)
				var yOff = (myDrawing.moveY - y)

				if(myDrawing.movingShape.objName === "rect"){					
					myDrawing.tempShape = (new Rect(myDrawing.movingShape.startX - xOff,
						myDrawing.movingShape.startY - yOff,
						myDrawing.movingShape.x,
						myDrawing.movingShape.y,
						myDrawing.movingShape.objColor,
						myDrawing.movingShape.objWidth,
						"rect"));
					myDrawing.tempShape.draw(context, myDrawing.tempShape);
				}

				if(myDrawing.movingShape.objName === "text"){
					myDrawing.tempShape = (new Tex(myDrawing.movingShape.startX - xOff,
						myDrawing.movingShape.startY - yOff,
						myDrawing.movingShape.x,
						myDrawing.movingShape.y,
						myDrawing.movingShape.objColor,
						myDrawing.movingShape.objWidth,
						"text",
						myDrawing.movingShape.myText));

					//draw will not work when we call the draw function
					//myDrawing.tempShape.draw(context, myDrawing.tempShape);
					context.font = myDrawing.movingShape.objWidth;
					context.fillStyle = myDrawing.movingShape.objColor;
					context.fillText(myDrawing.movingShape.myText,
						myDrawing.movingShape.startX - xOff,
						myDrawing.movingShape.startY - yOff);
				}

				if(myDrawing.movingShape.objName === "pen"){
					for(var j = 0; j < myDrawing.movingShape.xArray.length; j++){
						myDrawing.movingShape.xArray[j] = myDrawing.movingShape.xArray[j] - xOff
						myDrawing.movingShape.yArray[j] = myDrawing.movingShape.yArray[j] - yOff;
						myDrawing.moveX = x;
						myDrawing.moveY = y;
						// drawing is smother when we dont call this function
						//myDrawing.tempShape.draw(context, myDrawing.tempShape)
						context.beginPath();
						context.lineWidth = myDrawing.movingShape.objWidth;
						context.strokeStyle = myDrawing.movingShape.objColor;
						context.moveTo(myDrawing.movingShape.xArray[j-1], myDrawing.movingShape.yArray[j-1]);
						context.lineTo(myDrawing.movingShape.xArray[j], myDrawing.movingShape.yArray[j]);
						context.closePath();
						context.stroke();
					}
				}
			}
		}
	});

	$("#myCanvas").mouseup(function(e){
    	myDrawing.isDrawing = false;
    	if(myDrawing.tempShape !== undefined){	
    		myDrawing.allShapes.push(myDrawing.tempShape);
    	}  	
    	myDrawing.tempShape = undefined;
    	myDrawing.movingShape = undefined;
	});

	var Shape = Base.extend({
		constructor: function(startX, startY, x, y, color, width, name){
			this.x = x;
			this.y = y;
			this.startX = startX;
			this.startY = startY;
			this.objColor = color;
			this.objWidth = width;
			this.objName = name;
		},
		x: undefined,
		y: undefined,
		startX: undefined,
		startY: undefined,
		objColor: "black",
		objWidth: 1,
		objName: "line",
		findMe: function(x, y, obj){
			var xFound = false,
			    yFound = false;
			if(x >= obj.startX){
				if(x <= (obj.startX + obj.x)){
					xFound = true;
				}
			}
			else{
				if(x >= (obj.startX + obj.x)){
					xFound = true;
				}
			}
			if(y >= obj.startY){
				if(y <= (obj.startY + obj.y)){
					yFound = true;
				}
			}
			else{
				if(y >= (obj.startY + obj.y)){
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

	var Line = Shape.extend({
		draw: function(context, obj){
			context.beginPath();
			context.lineWidth = obj.objWidth;
			context.strokeStyle = obj.objColor;
	        context.moveTo(obj.startX, obj.startY);
	        context.lineTo(obj.x, obj.y);
	        context.stroke();
		},
		findMe: function(context, x, y, i){
			console.log("findMeLine")
		}
	});

	var Rect = Shape.extend({
		draw: function(context, obj){
			context.beginPath();
			context.lineWidth = obj.objWidth;
			context.strokeStyle = obj.objColor;
			context.strokeRect(obj.startX, obj.startY, obj.x, obj.y); // (x,y) (width, height)
			context.stroke();
		}
	});


	var Circle = Shape.extend({
		constructor: function(startX, startY, x, y, color, width, name){
			this.base(startX, startY, x, y, color, width, name);
			this.radiusX = (x - myDrawing.currentStartX) * 0.5;
			this.radiusY = (y - myDrawing.currentStartY) * 0.5;
			this.step = 0.01;
			this.pi2 = Math.PI * 2 - 0.01;
		},
		centerX : undefined,
		centerY : undefined,
		draw: function(context, obj){
			// taka út allt myDrawing og setja this í staðinn
			var radiusX = obj.radiusX
	        	radiusY = obj.radiusY
	        	centerX = obj.startX + obj.radiusX,
	        	centerY = obj.startY + obj.radiusY,
	        	step = 0.01,
	        	a = step,
	        	pi2 = Math.PI * 2 - step;
			    
		    context.beginPath();
		    context.lineWidth = obj.objWidth;
		    context.strokeStyle = obj.objColor;
		    context.moveTo(centerX + radiusX * Math.cos(0),
		               centerY + radiusY * Math.sin(0));

		    for(; a < pi2; a += step) {
		        context.lineTo(centerX + radiusX * Math.cos(a),
		                   centerY + radiusY * Math.sin(a));
		    }
		    context.closePath();
		    context.stroke();
		},
		findMe: function(x, y, obj){
			console.log("finding circle")
			var xa = [];
			var ya = [];
			var radiusX = obj.radiusX
	        	radiusY = obj.radiusY
	        	centerX = obj.startX + obj.radiusX,
	        	centerY = obj.startY + obj.radiusY,
	        	step = 0.01,
	        	a = step,
	        	pi2 = Math.PI * 2 - step;
	        xa.push(centerX + radiusX * Math.cos(a));
	        ya.push(centerY + radiusY * Math.sin(a));
	        for(; a < pi2; a += step) {
		        xa.push(centerX + radiusX * Math.cos(a)),
		        ya.push(centerY + radiusY * Math.sin(a));
		    }
		    var ei = xa.length / 8;
		    var qt = xa.length / 4;
		    var half = xa.length / 2;
		    console.log(xa[half] , x, xa[0])
		    // if(xa[half] < x && xa[0] > x){
		    // 	console.log("xxxxxxxxxxxxx");
		    // }
		    // if(ya[qt] > y && ya[half + qt] < y){
		    // 	console.log("yyyyyyy");
		    // }
		    // console.log("stX:", obj.startX, "x: ", x);
		    console.log(xa.length);
		     for(var i = 0; i < half; i++){
		     	if(xa[i+half] < x && xa[i] > x){
		    		if(ya[i+qt] > y && ya[i+half + qt] < y){
		    			console.log("lajsfnajldbnfkjsdnbfkjsdbnf");
		    		}
		    }
		     }
		    //console.log(xa, ya);
		    return false
		}
	});

	var Pen = Shape.extend({
		constructor: function(startX, startY, x, y, color, width, name){
			this.base(startX, startY, x, y, color, width, name);
			this.xArray = [];
			this.yArray = [];
		},
		draw: function(context, obj){
			for(var j = 0; j < obj.xArray.length; j++){
				context.beginPath();
				context.lineWidth = obj.objWidth;
				context.strokeStyle = obj.objColor;
				//context.moveTo(myDrawing.tempShape.xArray[j-1], myDrawing.tempShape.yArray[j-1]);
				//context.lineTo(myDrawing.tempShape.xArray[j], myDrawing.tempShape.yArray[j]);
				context.moveTo(obj.xArray[j-1], obj.yArray[j-1]);
				context.lineTo(obj.xArray[j], obj.yArray[j]);
				context.closePath();
				context.stroke();
			}
		},
		findMe: function(x, y, obj){
			//console.log(obj)
			for(i = 0; i < obj.xArray.length; i++){
				if(obj.xArray[i] < x+5 && obj.xArray[i] > x-5){
					if(obj.yArray[i] < y+8 && obj.yArray[i] > y-8){
						return true
					}
				}
			}
			return false
		}
	})

	var Tex = Shape.extend({
		constructor: function(startX, startY, x, y, color, width, name, text){
			this.base(startX, startY, x, y, color, width, name);
			this.myText = text;
		},
		draw: function(context, obj){
			// Trying to eliminate the undefined
			if(obj.myDrawing === undefined){
				//console.log("undefined")
				obj.myDrawing = "";
			}
			else{
				context.font = obj.objWidth;
				context.fillStyle = obj.objColor;
				context.fillText(obj.myText, obj.startX, obj.startY);
			}	
		},
		findHeight: function(h){
			//console.log(h)
			if(h == 1){
				return 15
			}
			else if(h == 3){
				return 30
			}
			else if(h == 6){
				return 50
			}
			else if(h == 10){
				return 70
			}
		},
		findOffset: function(h){
			//console.log(h)
			if(h == 1){
				return 13
			}
			else if(h == 3){
				return 25
			}
			else if(h == 6){
				return 45
			}
			else if(h == 10){
				return 70
			}
		}
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
	        myDrawing.tempShape.x = context.measureText(canvasText).width;
	        myDrawing.tempShape.y = myDrawing.tempShape.y - myDrawing.tempShape.findOffset(myDrawing.nextWidth);

	        myDrawing.allShapes.push(myDrawing.tempShape);
	        
	        $("#idTextBox").val('');
	        $("#idTextBox").hide();
	        myDrawing.isDrawing = false;
	        myDrawing.tempShape = undefined;
	    }
	});

	$(".colorPicker").colorpicker().on('changeColor', function(ev){
	  	myDrawing.nextColor = ev.color.toHex();
	});

	var undoRedo = {
			undoneItems: [],
			popItem: function(){
				undoRedo.undoneItems.push( myDrawing.allShapes.pop());
				myDrawing.drawAllShapes(context);
			},
			undoItem: function(){
				myDrawing.allShapes.push(undoRedo.undoneItems[0]);
				undoRedo.undoneItems.splice(0,1);
				myDrawing.drawAllShapes(context);
			},
			resetAll: function(){
				undoRedo.undoneItems = [];
			}
		};

	$("#btnUndo").click(function() {
		//console.log("here");
		undoRedo.popItem();
	});

	$("#btnRedo").click(function(){
		//console.log("here2");
		undoRedo.undoItem();
	});
	$("#btnClear").click(function(){
		undoRedo.resetAll();
		myDrawing.clearAllShapes();
		myDrawing.drawAllShapes(context);
	});




	var userName;
	$("#subUser").click(function(){
		userName = $("#userName").val();
		$("#hiddenDiv").show();

		updateUserInfo(userName);
	});

	$("#Save").click(function(){
			var nameOfSave = $("#saveName").val();
			console.log(nameOfSave);

			if(document.getElementById('savePic').checked){
				var stringifiedArray = JSON.stringify(myDrawing.allShapes);
				var param = { 
					"user": userName, // You should use your own username!
					"name": nameOfSave,
					"content": stringifiedArray,
					"template": false
				};

				$.ajax({
					type: "POST",
					contentType: "application/json; charset=utf-8",
					url: "http://whiteboard.apphb.com/Home/Save",
					data: param,
					dataType: "jsonp",
					crossDomain: true,
					success: function (data) {
						console.log("pic saved");
					},
					error: function (xhr, err) {
						alert("it did not work");
					}
				});
			}
			else {
				var stringifiedArray = JSON.stringify(myDrawing.allShapes);
				var param = { 
					"user": userName, // You should use your own username!
					"name": nameOfSave,
					"content": stringifiedArray,
					"template": true
				};

				$.ajax({
					type: "POST",
					contentType: "application/json; charset=utf-8",
					url: "http://whiteboard.apphb.com/Home/Save",
					data: param,
					dataType: "jsonp",
					crossDomain: true,
					success: function (data) {
						console.log("element saved");
					},
					error: function (xhr, err) {
						alert("it did not work");
					}
				});
			}

	});

	var updateUserInfo = function(userName){
			var param = { 
				"user": userName, // You should use your own username!
				"template": false
			};

			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "http://whiteboard.apphb.com/Home/GetList",
				data: param,
				dataType: "jsonp",
				crossDomain: true,
				success: function (data) {
					for(var i = 0; i < data.length; i++)
					{
						$('#pictures').append($('<option>', { value : data[i].ID }).text(data[i].WhiteboardTitle)); 
					}
				},
				error: function (xhr, err) {
					alert("geting id did not work");
				}
			});

			param = { 
				"user": userName, // You should use your own username!
				"template": true
			};

			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "http://whiteboard.apphb.com/Home/GetList",
				data: param,
				dataType: "jsonp",
				crossDomain: true,
				success: function (data) {
					for(var i = 0; i < data.length; i++)
					{
						$('#elements').append($('<option>', { value : data[i].ID }).text(data[i].WhiteboardTitle)); 
					}
				},
				error: function (xhr, err) {
					alert("geting id did not work");
				}
			});
	};

	$("#SetOnCanvas").click(function(){
			var param = { 
				"id": 1972
			};

			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
				data: param,
				dataType: "jsonp",
				crossDomain: true,
				success: function (data) {
					console.log(data);
				},
				error: function (xhr, err) {
					console.log("somthing whent wrong");
				}
			});
	});

});







