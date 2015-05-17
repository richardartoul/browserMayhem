//code will be need to be updated to distinguish between users ship and online players ship - subclass?
var Ship = function() {
  this.xCoordinate = gameSettings.screenWidth/2,
  this.yCoordinate = gameSettings.screenHeight/2,
  this.xVector = 0,
  this.yVector = 0,
  this.angle = 0,
  this.turning = 0,
  this.accelerating = 0
  this.url = chrome.extension.getURL("images/ship.png");
  this.svg;
  //bullets array maybe temporary
  this.bullets = [];
  this.initialize();
}

Ship.prototype.initialize = function() {
   this.svg = d3.select("body").append("img")
	  .attr("src", this.url)
	  .attr("class", "playerShip")
	  //puts ship above all other elements on page
	  .style("z-index", "2147483647")
	  .style("position", "absolute");

  this.svg = d3.selectAll(".playerShip")
	  .attr("width", gameSettings.playerRadius)
	  .attr("height",gameSettings.playerRadius)	
	  .attr("id", "player")
}

//will need to be modified so can handle online players
Ship.prototype.rotate = function() {
  if (keyCode === 37) {
    this.angle -= gameSettings.playerRotationSpeed;
  }
  if (keyCode === 39) {
    this.angle += gameSettings.playerRotationSpeed;
  }

  //this should probably be moved to the drawPlayer function
  var transformation = "rotate(" + playerData.angle + "deg)";
  player.style("transform", transformation);
}

Ship.prototype.fire = function() {
  //10s here need to be replace with a variable
  this.bullets.push(new Bullet(this.xCoordinate+10, this.yCoordinate+10, gameSettings.bulletSpeed, this.angle));
}

Ship.prototype.physics = function() {
  //handles acceleration
  if (this.accelerating && utils.calculateSpeed(this.xVector,this.yVector) < gameSettings.playerTopSpeed) {
    this.xVector += utils.calculateXVector(gameSettings.playerAcelleration,this.angle);
    this.yVector += utils.calculateYVector(gameSettings.playerAcelleration,this.angle);
  }
  //handles decelleration
  else {
    if (this.xVector > 0) { 
      this.xVector -= this.xVector * gameSettings.playerDecelleration;
    }
    if (this.yVector > 0) {
      this.yVector -= this.yVector * gameSettings.playerDecelleration;
    }
    if (this.xVector < 0) { 
      this.xVector += -this.xVector * gameSettings.playerDecelleration;
    }
    if (this.yVector < 0) {
      this.yVector += -this.yVector * gameSettings.playerDecelleration;
    }
  }

  //handles rotation
  if (this.turning === -1) {
    this.angle -= gameSettings.playerRotationSpeed;
  }
  if (this.turning === 1) {
    this.angle += gameSettings.playerRotationSpeed;
  }
}

Ship.prototype.render = function() {
  //handles going offscreen
  if (this.xCoordinate > gameSettings.screenWidth + gameSettings.playerRadius) {
    this.xCoordinate = 0 - gameSettings.playerRadius;
  }
  else if (this.xCoordinate < 0 - gameSettings.playerRadius) {
    this.xCoordinate = gameSettings.screenWidth + gameSettings.playerRadius;
  }
  if(this.yCoordinate < 0 - gameSettings.playerRadius) {
    this.yCoordinate = gameSettings.screenHeight + gameSettings.playerRadius;
  }
  else if (this.yCoordinate > gameSettings.screenHeight + gameSettings.playerRadius) {
    this.yCoordinate = 0 - gameSettings.playerRadius;
  }

  this.xCoordinate += this.xVector;
  this.yCoordinate += this.yVector;
  var transformation = "rotate(" + this.angle + "deg)";

  var playerStyle = {
    left: this.xCoordinate + "px",
    bottom: this.yCoordinate + "px",
    transform: transformation
  }

  //updates css properties of ship to actually move it
  this.svg.style(playerStyle);
}

Ship.prototype.renderBullets = function() {
	for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].render();
  	}
}	