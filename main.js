//need to implement some kind of namespace for variables so they don't
//interfere with webpages?

//disables scrolling if page fits in viewport
//networking test
var socket = io('https://blooming-depths-9616.herokuapp.com/');

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

//networking to receive other players locations from server
socket.on("otherPlayerLocation", function(otherPlayerObj) {
	//change it so network doesnt send self location?
	//add new players
	if (otherPlayerObj.player !== gameSettings.playerId) {
		if (!gameSettings.otherShips[otherPlayerObj.player]) {
			gameSettings.otherShips[otherPlayerObj.player] = new OtherShip(otherPlayerObj);
		}
		//update existing players and re-render them
		else {
			//should probably be moved into gameloop
			gameSettings.otherShips[otherPlayerObj.player].update(otherPlayerObj);
			// gameSettings.otherShips[otherPlayerObj.player].render();
		}
	}
});

setInterval(updatePlayerLocation,5);

  var gameLoop = function() {
  //could make render() call physics as well as renderBullets, but maybe better to keep modular?
  player.physics();
  player.render();
  player.renderBullets();
  //rendeer all other player ships
  for (var key in gameSettings.otherShips) {
  	gameSettings.otherShips[key].render();
  	console.log(gameSettings.otherShips[key].xVector);
  }
}

d3.timer(gameLoop);
