var socket = io('http://localhost:3000');

// socket.emit('playerUrl', {url: player.url, playerId: player.shipId});

var getUrl = function() {
	chrome.runtime.sendMessage({'query': "url"}, function(response) {
		return response.url;
	});
}

var updatePlayerLocation = function() {
	socket.emit('playerLocation', player.networkObj());
}