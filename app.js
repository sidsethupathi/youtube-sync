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

});

var sendData = function(recip, event, data) {
	recip.emit(event, data);
};

var sendUserInfo = function(recip) {
	recip.emit('client:user info', {
		users: users.get()
	});
};

var sendQuestion = function(recip) {
	recip.emit('question', {
		question: _question,
		answer: _answer
	});
};

var sendScores = function(recip) {
	recip.emit('scores', {
		scores: scores
	});
};

var sendData = function(recip, event, data) {
	recip.emit('time', {
		key: data
	});
};

var incrementScore = function(key) {
	if(isNaN(scores[key])) {
		scores[key] = 1;
	} else {
		scores[key]++;
	}
};


/* Game Logic */

http.listen(port, function() {
	console.log('listening on ' + port);
});

count = 120;
setInterval(function() {
	if(count < 0) {
		scores = {};
		sendScores(io);
		console.log("clearing scores list");
		count = 120;
	} else {
		sendData(io, "time", count);
		count--;
	}
	
}, 1000);

