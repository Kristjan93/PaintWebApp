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
			myDrawing.tempShape.xArray.push(myDrawing.currentStartX);
			myDrawing.tempShape.yArray.push(myDrawing.currentStartY);
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

			//look for a shape at a given point. Start from the newest
			for(var a = myDrawing.allShapes.length-1; a >= 0; a--){
				if(myDrawing.allShapes[a].findMe(myDrawing.currentStartX, myDrawing.currentStartY, myDrawing.allShapes[a])){
					myDrawing.movingShape = myDrawing.allShapes[a];
					myDrawing.tempShape = myDrawing.allShapes[a];
					// if a shape is found we remove it ad redraw it later
					myDrawing.allShapes.splice(a,1);
					break;
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
				if(myDrawing.movingShape.objName === "line"){
					myDrawing.tempShape = (new Line(myDrawing.movingShape.startX- xOff,
						myDrawing.movingShape.startY - yOff,
						myDrawing.movingShape.x - xOff,
						myDrawing.movingShape.y - yOff,
						myDrawing.movingShape.objColor ,
						myDrawing.movingShape.objWidth ,
						"line"));

					myDrawing.tempShape.draw(context, myDrawing.tempShape)
			
				}
				else if(myDrawing.movingShape.objName === "rect"){					
					myDrawing.tempShape = (new Rect(myDrawing.movingShape.startX - xOff,
						myDrawing.movingShape.startY - yOff,
						myDrawing.movingShape.x,
						myDrawing.movingShape.y,
						myDrawing.movingShape.objColor,
						myDrawing.movingShape.objWidth,
						"rect"));

					myDrawing.tempShape.draw(context, myDrawing.tempShape);
				}

				else if(myDrawing.movingShape.objName === "text"){
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

				else if(myDrawing.movingShape.objName === "pen"){
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

				else if(myDrawing.movingShape.objName === "circle"){

					myDrawing.tempShape = (new Circle(myDrawing.movingShape.startX - xOff,
						myDrawing.movingShape.startY - yOff,
						myDrawing.movingShape.x,
						myDrawing.movingShape.y,
						myDrawing.movingShape.objColor,
						myDrawing.movingShape.objWidth,
						"circle"));
					myDrawing.tempShape.radiusX = myDrawing.movingShape.radiusX
					myDrawing.tempShape.radiusY = myDrawing.movingShape.radiusY

				    myDrawing.tempShape.draw(context, myDrawing.tempShape);
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
		findMe: function(x, y, obj){
			var x1 = 0,
				x2 = 0;
				y1 = 0;
				y2 = 0;
			if(obj.startX <= obj.x){
				x1 = obj.startX;
				x2 = obj.x;
				y1 = obj.startY;
				y2 = obj.y;
			}
			else{
				x1 = obj.x;
				x2 = obj.startX;
				y1 = obj.y;
				y2 = obj.startY;
			}
			//conpare the slopes to see if we find the line
			var slope = obj.findSlope(x1, y1, x2, y2);
			var targetSlope = obj.findSlope(x1,y1, x, y);
			if(x < x2 && x > x1){
				if(Math.abs(slope - targetSlope) < 0.1){
					return true
				}
			}
			return false;
		},
		findSlope: function(x1, y1, x2, y2){
			return (y1 - y2) / (x2 - x1);
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
		    var qt = xa.length / 4;
		    var half = xa.length / 2;
		    var count = 0;
		    for(var i = 0; i < half; i++){
		     	if(xa[i+half] < x && xa[i] > x){
		    		if(ya[i+qt] > y && ya[i+half + qt] < y){
		    			count++
		    		}
		    	}
		    }
		    if(count > 60){
		    	return true
		    }
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
				context.moveTo(obj.xArray[j-1], obj.yArray[j-1]);
				context.lineTo(obj.xArray[j], obj.yArray[j]);
				context.closePath();
				context.stroke();
			}
		},
		findMe: function(x, y, obj){
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
			if(obj.myDrawing === undefined){
				obj.myDrawing = "";
			}
			else{
				context.font = obj.objWidth;
				context.fillStyle = obj.objColor;
				context.fillText(obj.myText, obj.startX, obj.startY);
			}	
		},
		findHeight: function(h){
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
		undoRedo.popItem();
	});

	$("#btnRedo").click(function(){
		undoRedo.undoItem();
	});
	$("#btnClear").click(function(){
		undoRedo.resetAll();
		myDrawing.clearAllShapes();
		myDrawing.drawAllShapes(context);
	});

	var userInfo = {
		userName: undefined,
		nameOfsave: undefined,

		isValidUser: function(){
			if(userInfo.userName == ""){
				$(".hiddenDiv").hide();	
				alert("plese type in username");
				return false;
			}
			return true;
		}
	};

	var userName;
	$("#subUser").click(function(){
		userInfo.userName = $("#userName").val();
		if(userInfo.isValidUser()){
			updateUserInfo(false);
			updateUserInfo(true);
			$(".hiddenDiv").show();	
		}
	});

	var updateUserInfo = function(isElem){
		$('#pictures').find('option').remove().end();
		$('#elements').find('option').remove().end();
		var param = { 
			"user": userInfo.userName,
			"template": isElem
		};

		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://whiteboard.apphb.com/Home/GetList",
			data: param,
			dataType: "jsonp",
			crossDomain: true,
			success: function (data) {
				if(!isElem){
					for(var i = 0; i < data.length; i++)
					{
						$('#pictures').append($('<option>', { value : data[i].ID }).text(data[i].WhiteboardTitle)); 
					}
				}
				else{
					for(var i = 0; i < data.length; i++)
					{
						$('#elements').append($('<option>', { value : data[i].ID }).text(data[i].WhiteboardTitle)); 
					}
				}
			},
			error: function (xhr, err) {
				alert("geting id did not work");
			}
		});
	};


	$("#Save").click(function(){
			userInfo.nameOfsave = $("#saveName").val();
			updateUserInfo(false);
			updateUserInfo(true);
			var localAjaxCall = function(isElem){
				var stringifiedArray = JSON.stringify(myDrawing.allShapes);
				var param = { 
					"user": userInfo.userName, 
					"name": userInfo.nameOfsave,
					"content": stringifiedArray,
					"template": isElem
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
			};

			if(document.getElementById('savePic').checked){
				localAjaxCall(false);
				updateUserInfo(false);
				updateUserInfo(true);
				return;
			}
			else if(document.getElementById('saveElem').checked){
				localAjaxCall(true);
				alert("plese select Element or Picture");
				return;
			}
			alert("plese select Element or Picture");
	});

	//reseting and loading whole new canvas
	$("#loadPic").click(function(){
		setToCanvas(false);
	});
	//addes shapes to current canvas
	$("#LoadElem").click(function(){
		setToCanvas(true);
	});


	var setToCanvas = function(isElem){
			var id;
			if(!isElem){
				myDrawing.clearAllShapes();
				id = myDrawing.nextWidth = document.getElementById("pictures").value;
			}
			else{
				id = myDrawing.nextWidth = document.getElementById("elements").value;
			}
			var param = {
				"id": id
			};

			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
				data: param,
				dataType: "jsonp",
				crossDomain: true,
				success: function (data) {
					if(data === false){
						alert("You dont have anything saved")
					}
					console.log(data);
					var storedShapes = JSON.parse(data.WhiteboardContents);

					for(var i = 0; i < storedShapes.length; i++){
						var obj = storedShapes[i];

						if(obj.objName === "circle"){
							myDrawing.tempShape = (new Circle(obj.startX,
							obj.startY,
							obj.x,
							obj.y,
							obj.objColor,
							obj.objWidth,
							"circle",
							obj.radiusX,
							obj.radiusY,
							obj.step,
							obj.pi2));
							console.log(myDrawing.tempShape);
						}

						else if(obj.objName === "rect"){
							myDrawing.tempShape = (new Rect(obj.startX,
							obj.startY,
							obj.x,
							obj.y,
							obj.objColor,
							obj.objWidth,
							"rect"));
						}
						else if(obj.objName === "pen"){
							myDrawing.tempShape = (new Pen(obj.startX,
							obj.startY,
							obj.x,
							obj.y,
							obj.objColor,
							obj.objWidth,
							"pen"));
							myDrawing.tempShape.xArray = obj.xArray;
							myDrawing.tempShape.yArray = obj.yArray;
						}
						else if(obj.objName === "line"){
							myDrawing.tempShape = (new Line(obj.startX,
							obj.startY,
							obj.x,
							obj.y,
							obj.objColor,
							obj.objWidth,
							"line"));
						}
						else if(obj.objName === "text"){
							myDrawing.tempShape = (new Tex(obj.startX,
							obj.startY,
							obj.x,
							obj.y,
							obj.objColor,
							obj.objWidth,
							"text",
							obj.myText));
						}
						myDrawing.allShapes.push(myDrawing.tempShape);
					}
					myDrawing.drawAllShapes(context);
				},
				error: function (xhr, err) {
					console.log("somthing whent wrong");
				}
			});
	};


});







