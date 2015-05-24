//refactor this to be a subclass of OtherShip or vice versa
var OtherShip = function(networkObj) {
  this.shipId = networkObj.player;
  this.xCoordinate = networkObj.xCoordinate,
  this.yCoordinate = networkObj.yCoordinate,
  this.xVector = networkObj.xVector,
  this.yVector = networkObj.yVector,
  this.angle = networkObj.angle,
  // this.turning = 0,
  // this.accelerating = 0
  this.url = chrome.extension.getURL("images/ship.png");
  this.svg;
  //bullets array maybe temporary
  this.bullets = [];
  this.initialize();
}

OtherShip.prototype.initialize = function() {
   this.svg = d3.select("body").append("img")
	  .attr("src", this.url)
	  .attr("class", "otherShip")
    .attr("id", this.shipId)
	  //puts OtherShip above all other elements on page
	  .style("z-index", "2147483647")
	  .style("position", "absolute");

  this.svg = d3.selectAll("#" + this.shipId)
	  .attr("width", gameSettings.playerRadius)
	  .attr("height",gameSettings.playerRadius)	
	  .attr("id", "player")
}

OtherShip.prototype.fire = function() {
  //10s here need to be replace with a variable
  this.bullets.push(new Bullet(this.xCoordinate+10, this.yCoordinate+10, gameSettings.bulletSpeed, this.angle));
}

OtherShip.prototype.physics = function() {
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

OtherShip.prototype.render = function() {
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

  //updates css properties of OtherShip to actually move it
  this.svg.style(playerStyle);
}

OtherShip.prototype.update = function(networkObj) {
  this.xCoordinate = networkObj.xCoordinate,
  this.yCoordinate = networkObj.yCoordinate,
  this.xVector = networkObj.xVector,
  this.yVector = networkObj.yVector,
  this.angle = networkObj.angle
}

OtherShip.prototype.renderBullets = function() {
	for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].render();
  	}
}

//probably dont need this
OtherShip.prototype.networkObj = function() {
	return {
		player: this.shipId,
		xCoordinate: this.xCoordinate,
		yCoordinate: this.yCoordinate,
		xVector: this.xVector,
		yVector: this.yVector,
		angle: this.angle
	};
}	