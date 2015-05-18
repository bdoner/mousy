document.onready = function() {
	var host = document.location.host;
	var dispatcher = new WebSocketRails(host + '/websocket');
	//window.dispatcher = dispatcher;
	var canvas = document.getElementById('canvas');
	canvas.width = screen.availWidth;
	canvas.height = screen.availHeight;
	var context = canvas.getContext('2d');

	printStats({'online': 0, 'color': '#ffffff' });

	function MouseUpdate(x, y, connection_id) {
		this.x = x;
		this.y = y;
		this.connection_id = connection_id;
	}

	function clearCanvas() {
		//context.fillStyle = "#ffffff";
		//context.fillRect(0, 0, canvas.width, canvas.height);
		context.clearRect(0, 0, canvas.width, canvas.height);

		drawMouse(_lastX, _lastY, _color);
	}

	function drawMouse(x, y, color) {
		context.strokeStyle = color;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x + 11, y + 9);
		context.lineTo(x + 7, y + 11);
		context.lineTo(x + 10, y + 19);
		context.lineTo(x + 8, y + 20);
		context.lineTo(x + 4, y + 12);
		context.lineTo(x, y + 15);
		context.lineTo(x, y);
		context.stroke();
	}

	function printStats(data) {
		context.fillStyle = "#000000";
		context.font = "14px Consolas";
		context.fillText("Online now: " + data.online, 20, 20);
		context.fillText("Your color: ", 20, 40);

		context.fillStyle = _color;
		context.fillRect(105, 30, 12, 12);
	}



	var _connection_id = '';
	dispatcher.on_open = function(data) {
		//console.log('Connection has been established: ', data);
		_connection_id = data.connection_id;
		// You can trigger new server events inside this callback if you wish.
	}

	var _color = '#000000';
	dispatcher.bind('mice_update', function(message) {
    	//console.log('Recieved message: ', message);
	
    	clearCanvas();
		printStats(message);
		var mice = message.mice;
    	for(var i in mice) {
			if(_connection_id == mice[i].connection_id) {
				_color = mice[i].color;
				continue;
			}
		
			drawMouse(mice[i].x, mice[i].y, mice[i].color);
    	}
    	//console.log(context);
	});

	var _lastX, _lastY;
	canvas.onmousemove = function (event) {
		event = event || window.event; // IE-ism
		// Use event.pageX / event.pageY here
		_lastX = event.pageX;
		_lastY = event.pageY;
		drawMouse(event.pageX, event.pageY, _color);
		dispatcher.trigger('mouse_move', new MouseUpdate(event.pageX, event.pageY, _connection_id), function (success) {}, function (err) {
			console.log(':(');
			console.log(err);
		});
	}
};
