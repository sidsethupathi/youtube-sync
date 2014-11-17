

var myApp = angular.module('myApp', []);

/* Dependency injection for socket */
myApp.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

// User logic
myApp.controller('UserCtrl', ['$scope', 'socket', function($scope, socket) {

	$scope.start = function() {
    socket.emit('start');
		console.log("starting something");
	};

	socket.on('start', function(data) {
    var seconds = new Date().getTime() / 1000;
		console.log("we received a start code at " + seconds);
	});

  socket.on('scores', function(data) {
    $scope.scores = [];
    for(var key in data.scores) {
      $scope.scores.push({name: key, score: data.scores[key]});
    }
    $scope.scores.sort(function(a,b) {
      return b.score - a.score;
    });
  });

  socket.on('time', function(data) {
    $scope.time_left = data.key;
  });

}]);

// Game Logic
myApp.controller('GameCtrl', ['$scope', 'socket', function($scope, socket) {
  $scope.submitAnswer = function() {
    if($scope.user_answer == $scope.answer) {
      socket.emit('user:answer', {
        answer: $scope.user_answer
      });
    } else {
      count = 0;
    }
    $('#qanswer').val('');

  };

  socket.on('question', function(data) {
    $scope.question = data.question;
    $scope.answer = data.answer;
    console.log(data);
  });

}]);

// Blink Logic - this could probably be done a lot cleaner...
count = 2;

function initBlink()
{

    var state = false;
    setInterval(function()
        {
            if(count < 2) {
                state = !state;
                var color = (state?'red':'white');
                document.body.style.backgroundColor=color;
                count++;
            }
        }, 100);
}

initBlink();


