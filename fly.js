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
  playerRotationSpeed: 10,
  playerAcelleration: 0.2,
  playerDecelleration: 0.03,
  teleportBuffer: 50
}

//test
if (gameSettings.pageHeight <= gameSettings.screenHeight || gameSettings.pageWidth <= gameSettings.screenWidth) {
  $("body").css("overflow", "hidden");
}

var playerData = {
  xCoordinate: gameSettings.screenWidth/2,
  yCoordinate: gameSettings.screenHeight/2,
  xVector: 0,
  yVector: 0,
  angle: 0,
  turning: 0,
  accelerating:0
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

  //this should probably be moved to the drawPlayer function
  var transformation = "rotate(" + playerData.angle + "deg)";
  player.style("transform", transformation);
}

//keypress listener
d3.select("body").on("keydown", function() {
  var playerData = player.data()[0];
  if(d3.event.keyCode === 37) {
    d3.event.preventDefault();
    playerData.turning = -1;
  }
  if (d3.event.keyCode === 39) {
    d3.event.preventDefault();
    playerData.turning = 1;
  }
  if (d3.event.keyCode === 38) {
    d3.event.preventDefault();
    playerData.accelerating = 1;
  }
})

d3.select("body").on("keyup", function() {
  var playerData = player.data()[0];
  if(d3.event.keyCode === 37|| d3.event.keyCode === 39) {
    d3.event.preventDefault();
    playerData.turning = 0;
  }
  if (d3.event.keyCode === 38) {
    d3.event.preventDefault();
    playerData.accelerating = 0;
  }
})

//game loop
var gameLoop = function() {
  var playerData = player.data()[0];

  //handles acceleration
  if (playerData.accelerating) {
    var radians = (playerData.angle * Math.PI) / 180;
    //calculate vector increases based on player anger
    playerData.xVector += Math.sin(radians) * gameSettings.playerAcelleration;
    playerData.yVector += Math.cos(radians) * gameSettings.playerAcelleration;
  }
  else {
      //handles decelleration
    if (playerData.xVector > 0) { 
      playerData.xVector -= playerData.xVector * gameSettings.playerDecelleration;
    }
    if (playerData.yVector > 0) {
      playerData.yVector -= playerData.yVector * gameSettings.playerDecelleration;
    }
    if (playerData.xVector < 0) { 
      playerData.xVector += -playerData.xVector * gameSettings.playerDecelleration;
    }
    if (playerData.yVector < 0) {
      playerData.yVector += -playerData.yVector * gameSettings.playerDecelleration;
    }
  }

  //handles rotation
  if (playerData.turning === -1) {
    playerData.angle -= gameSettings.playerRotationSpeed;
  }
  if (playerData.turning === 1) {
    playerData.angle += gameSettings.playerRotationSpeed;
  }

}

//player movement
var drawPlayer = function() {
  var playerData = player.data()[0];

  //handles going offscreen
  if (playerData.xCoordinate > gameSettings.screenWidth + gameSettings.playerRadius) {
    playerData.xCoordinate = 0 - gameSettings.playerRadius;
  }
  else if (playerData.xCoordinate < 0 - gameSettings.playerRadius) {
    playerData.xCoordinate = gameSettings.screenWidth + gameSettings.playerRadius;
  }
  if(playerData.yCoordinate < 0 - gameSettings.playerRadius) {
    playerData.yCoordinate = gameSettings.screenHeight + gameSettings.playerRadius;
  }
  else if (playerData.yCoordinate > gameSettings.screenHeight + gameSettings.playerRadius) {
    playerData.yCoordinate = 0 - gameSettings.playerRadius;
  }

  playerData.xCoordinate += playerData.xVector;
  playerData.yCoordinate += playerData.yVector;
  var transformation = "rotate(" + playerData.angle + "deg)";

  var playerStyle = {
    left: playerData.xCoordinate + "px",
    bottom: playerData.yCoordinate + "px",
    transform: transformation
  }

  //updates css properties of ship to actually move it
  player.style(playerStyle);  

  // if (playerData.yCoordinate > gameSettings.screenHeight) {
  //   playerData.yCoordinate = 0 - gameSettings.playerRadius;
  // }
  // if (playerData.yCoordinate < gameSettings.screenHeight) {
  //   playerData.yCoordinate = gameSettings.screenHeight + gameSettings.playerRadius;
  // }
}

//redraw player every frame
d3.timer(drawPlayer);
d3.timer(gameLoop);

