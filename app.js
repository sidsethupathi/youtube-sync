var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/frontend'));
app.set('view engine', 'jade');
app.locals.pretty = true;


/* Express Routing */
app.get('/', function(req, res) {
	res.sendfile('views/static.html');
});

app.get('/old', function(req, res) {
	res.render('index');
});


/* Helper vars */

/* Socket IO Events */
io.on('connection', function(socket) {

	socket.on('start', function() {
		// TODO validate user name...
		io.emit("start", {
			data: "start"
		});
	});

	socket.on('change song', function(data) {
		io.emit('change song', {
			url: data.url
		});
	});

	socket.on('ping', function() {
		socket.emit('pong');
	});

});

var sendData = function(recip, event, data) {
	recip.emit(event, data);
};

var sendUserInfo = function(recip) {
	recip.emit('client:user info', {
		users: users.get()
	});
};


/* Set up server */

http.listen(port, function() {
	console.log('listening on ' + port);
});

