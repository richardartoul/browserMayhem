var Bullet = function(xCoordinate,yCoordinate,bulletSpeed,angle) {
  this.xCoordinate = xCoordinate;
  this.yCoordinate = yCoordinate;
  this.xVector = utils.calculateXVector(bulletSpeed,angle);
  this.yVector = utils.calculateYVector(bulletSpeed,angle);
  this.angle = angle;
  this.offScreen = false;
  //refactor urls into prototype
  this.url = chrome.extension.getURL("images/bullet.png");
  this.svg;
  this.initialize();
}

Bullet.prototype.initialize = function() {
 this.svg = d3.select("body").append("img")
	.attr("src", this.url)
	.attr("class", "bullet")
	.style("z-index", "2147483647")
	.style("position", "absolute")
	.style("left", this.xCoordinate + "px")
	.style("bottom", this.yCoordinate + "px")
	.style("transform", "rotate(" + this.angle + "deg)");
}

Bullet.prototype.render = function() {
	this.xCoordinate += this.xVector;
	this.yCoordinate += this.yVector;

    if (this.xCoordinate > gameSettings.screenWidth + gameSettings.bulletRadius || 
      this.xCoordinate < 0 - gameSettings.bulletRadius ||
      this.yCoordinate > gameSettings.screenHeight + gameSettings.bulletRadius || 
      this.yCoordinate < 0 - gameSettings.bulletRadius) 
      {
        this.offScreen = true;
      }
    
    if (this.offScreen === true) {
    	this.svg.remove();
    	return;
    }

    this.svg
    	.style("left", this.xCoordinate + "px")
    	.style("bottom", this.yCoordinate + "px");
}