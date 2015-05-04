//need to implement some kind of namespace for variables so they don't
//interfere with webpages?

var gameSettings = {
  /*This code gets the attributes of the browser viewport. I can use document instead of window
  if this doesn't seem to be a good solution. Also apparently screen.width and screen.height do
    something */
  screenWidth: $(window).width(),
  screenHeight: $(window).height(),
  pageWidth: $(document).width(),
  pageHeight: $(document).height(),
  playerRadius: 40,
  shipColor: "Red",
  playerRotationSpeed: 15,
  playerMovementSpeed: 0.2
}

var playerData = {
  xCoordinate: gameSettings.screenWidth/2,
  yCoordinate: gameSettings.screenHeight/2,
  xVector: 0,
  yVector: 0,
  angle: 0
}

var shipUrl = chrome.extension.getURL("images/ship.png");
var svg = d3.select("body").append("img")
  .attr("src", shipUrl)
  .attr("class", "playerShip")
  .style("z-index", "2147483647")
  .style("position", "absolute")

var player = d3.selectAll(".playerShip").data([playerData])
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", gameSettings.playerRadius)
  .attr("height",gameSettings.playerRadius)
  //.attr("fill", shipColor)
  .attr("id", "player")
  .attr("transform", "translate(" + gameSettings.pageWidth/2 +
     "," + gameSettings.pageHeight/2 + ")")

//player rotation
player.rotate = function(keyCode) {
  //data on the d3 player object is stored as an object inside an array
  var playerData = player.data()[0];
  if (keyCode === 37) {
    playerData.angle -= gameSettings.playerRotationSpeed;
  }
  if (keyCode === 39) {
    playerData.angle += gameSettings.playerRotationSpeed;
  }
  var transformation = "rotate(" + playerData.angle + "deg)";
  player.style("transform", transformation);
}

//player thrust
player.increaseThrust = function(keyCode) {
  var playerData = player.data()[0];
  var radians = (playerData.angle * Math.PI) / 180;
  //calculate vector increases based on player anger
  playerData.xVector += Math.sin(radians) * gameSettings.playerMovementSpeed;
  playerData.yVector += Math.cos(radians) * gameSettings.playerMovementSpeed;
}

//keypress listener
d3.select("body").on("keydown", function() {
  d3.event.preventDefault();
  if(d3.event.keyCode === 37 || d3.event.keyCode === 39) {
    player.rotate(d3.event.keyCode);
  }
  if (d3.event.keyCode === 38) {
    player.increaseThrust();
  }
})

//player movement
var movePlayer = function() {
  var playerData = player.data()[0];
  playerData.xCoordinate += playerData.xVector;
  playerData.yCoordinate += playerData.yVector;
  var playerStyle = {
    left: playerData.xCoordinate + "px",
    bottom: playerData.yCoordinate + "px"
  }
  player.style(playerStyle);
}

//redraw player every frame
d3.timer(movePlayer)

