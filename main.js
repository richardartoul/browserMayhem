//need to implement some kind of namespace for variables so they don't
//interfere with webpages?

//disables scrolling if page fits in viewport
//networking test
var socket = io('http://localhost:3000');


var getUrl = function(callback) {
	chrome.runtime.sendMessage({'query': "url"}, function(response) {
		callback(response.url);
	});
}

var updatePlayerLocation = function() {
	socket.emit('playerLocation', player.networkObj());
}

if (gameSettings.pageHeight <= gameSettings.screenHeight || gameSettings.pageWidth <= gameSettings.screenWidth) {
  $("body").css("overflow", "hidden");
}

// socket.emit('playerUrl', gameSettings.currentUrl);

var player = new Ship();
getUrl(function(foundUrl){
	socket.emit('playerUrl', {url: foundUrl, player: player.shipId});
});
// socket.emit('playerUrl', {url: getUrl(), player: player.shipId});

socket.on("otherPlayerLocation", function(otherPlayerObj) {
	console.log(otherPlayerObj);
});

setInterval(updatePlayerLocation,5000);

  var gameLoop = function() {
  //could make render() call physics as well as renderBullets, but maybe better to keep modular?
  player.physics();
  player.render();
  player.renderBullets();
  // updatePlayerLocation();
  // getUrl();
}

d3.timer(gameLoop);
