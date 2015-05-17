//need to implement some kind of namespace for variables so they don't
//interfere with webpages?

//disables scrolling if page fits in viewport
if (gameSettings.pageHeight <= gameSettings.screenHeight || gameSettings.pageWidth <= gameSettings.screenWidth) {
  $("body").css("overflow", "hidden");
}

socket.emit('playerUrl', gameSettings.currentUrl);

var player = new Ship();

  var gameLoop = function() {
  //could make render() call physics as well as renderBullets, but maybe better to keep modular?
  player.physics();
  player.render();
  player.renderBullets();
  updatePlayerLocation();
  // getUrl();
}

d3.timer(gameLoop);
