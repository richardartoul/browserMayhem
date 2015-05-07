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
  playerTopSpeed: 10,
  teleportBuffer: 50,
  bulletSpeed: 20,
  bulletRadius: 20
}

//bullet objects
var Bullet = function(xCoordinate,yCoordinate,bulletSpeed,angle) {
  if ((angle >= -90 && angle <= 0) || (angle >= 270 && angle <= 360)) {
    this.xCoordinate = xCoordinate + calculateYVector(10,angle);
    this.yCoordinate = yCoordinate - calculateXVector(10,angle);
  }
  if ((angle >= -180 && angle <= -90) || (angle >= 180 && angle <= 270)) {
    this.xCoordinate = xCoordinate - calculateYVector(10,angle);
    this.yCoordinate = yCoordinate - calculateXVector(10,angle);  
  }
  if ((angle >= -270 && angle <= -180) || (angle >= 90 && angle <= 180)) {
    this.xCoordinate = xCoordinate - calculateYVector(10,angle);
    this.yCoordinate = yCoordinate + calculateXVector(10,angle); 
  }
  if((angle >= -360 && angle <= -270) || (angle >= 0 && angle <= 90)) {
    this.xCoordinate = xCoordinate + calculateYVector(10,angle);
    this.yCoordinate = yCoordinate + calculateXVector(10,angle);  
  }
  this.xVector = calculateXVector(bulletSpeed,angle);
  this.yVector = calculateYVector(bulletSpeed,angle);
  console.log(angle);
  console.log(this.xVector);
  console.log(this.yVector);
  this.angle = angle;
  this.offScreen = false;
}

var createBullet = function() {
  
  var playerData = player.data()[0];

  var bulletData = new Bullet(playerData.xCoordinate,playerData.yCoordinate,
    gameSettings.bulletSpeed,playerData.angle)

  var bulletUrl = chrome.extension.getURL("images/bullet.png");
  var bulletObj = d3.select("body").append("img").data([bulletData])
    .attr("src", bulletUrl)
    .attr("class", "bullet")
    .style("z-index", "2147483647")
    .style("position", "absolute")
    .style("left", function(d) {
      return d.xCoordinate + "px"
    })
    .style("top", function(d) {
      return d.yCoordinate + "px"
    })
    .style("transform", function(d) {
      return "rotate(" + d.angle + "deg)"
    })
} 
  
//helper functions
var calculateSpeed = function(xVector,yVector) {
  return Math.sqrt(Math.pow(xVector,2) + Math.pow(yVector,2));
}

var degreesToRadians = function(degrees) {
  return (degrees * Math.PI) / 180;
}

var calculateXVector = function(vector,angle) {
  var radians = degreesToRadians(angle);
  return Math.sin(radians) * vector;
}

var calculateYVector = function(vector,angle) {
  var radians = degreesToRadians(angle);
  return Math.cos(radians) * vector;
}

var calculateXYVectors = function(vector,angle) {
  var radians = (angle * Math.PI) / 180;
  var xyVectors = {
    xVector: calculateXVector(vector,angle),
    yVector: calculateYVector(vector,angle)
  }
}

//disables scrolling if page fits in viewport
// $(document).ready({
//   if (gameSettings.pageHeight <= gameSettings.screenHeight || gameSettings.pageWidth <= gameSettings.screenWidth) {
//     $("body").css("overflow", "hidden");
//   }
// })

var playerData = {
  xCoordinate: 0,
  yCoordinate: 0,
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
  .attr("width", gameSettings.playerRadius)
  .attr("height",gameSettings.playerRadius)
  .attr("id", "player")

//player rotation
// player.rotate = function(keyCode) {
//   //data on the d3 player object is stored as an object inside an array
//   var playerData = player.data()[0];
//   if (keyCode === 37) {
//     playerData.angle -= gameSettings.playerRotationSpeed;
//   }
//   if (keyCode === 39) {
//     playerData.angle += gameSettings.playerRotationSpeed;
//   }

//   console.log("the rotation in rotate function is", playerData.angle);
//   if (playerData.angle > 360) {
//     playerData.angle -= 360;
//   }
//   if (playerData.angle < -360) {
//     playerData.angle += 360;
//   }
//   console.log("its now", playerData.angle);

//   //this should probably be moved to the drawPlayer function
//   var transformation = "rotate(" + playerData.angle + "deg)";
//   player.style("transform", transformation);
// }

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
  if (d3.event.keyCode === 32) {
    d3.event.preventDefault();
    createBullet();
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
  if (playerData.accelerating && calculateSpeed(playerData.xVector,playerData.yVector) < gameSettings.playerTopSpeed) {
    playerData.xVector += calculateXVector(gameSettings.playerAcelleration,playerData.angle);
    playerData.yVector += calculateYVector(gameSettings.playerAcelleration,playerData.angle);
  }
  //handles decelleration
  else {
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

  //resets angles after a full rotation
  if (playerData.angle > 360) {
    playerData.angle -= 360;
  }
  if(playerData.angle < -360) {
    playerData.angle += 360;
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
  playerData.yCoordinate -= playerData.yVector;
  var transformation = "rotate(" + playerData.angle + "deg)";

  var playerStyle = {
    left: playerData.xCoordinate + "px",
    top: playerData.yCoordinate + "px",
    transform: transformation
  }

  //updates css properties of ship to actually move it
  player.style(playerStyle);  

}

var drawBullets = function() {
  var allBullets = d3.selectAll(".bullet");

  allBullets.data().forEach(function(d) {
    d.xCoordinate += d.xVector;
    d.yCoordinate -= d.yVector;

    if (d.xCoordinate > gameSettings.screenWidth + gameSettings.bulletRadius || 
      d.xCoordinate < 0 - gameSettings.bulletRadius ||
      d.yCoordinate > gameSettings.screenHeight + gameSettings.bulletRadius || 
      d.yCoordinate < 0 - gameSettings.bulletRadius) 
      {
        d.offScreen = true;
      }
  })

  d3.selectAll(".bullet").filter(function(d) {
    return (d.offScreen === true);
  }).remove();

  allBullets
    .style("left", function(d) {
      return d.xCoordinate + "px";
    })
    .style("top", function(d) {
      return d.yCoordinate + "px";
    })
}

//redraw player every frame
d3.timer(drawPlayer);
d3.timer(gameLoop);
d3.timer(drawBullets);

