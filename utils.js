var utils = {
  calculateSpeed: function(xVector,yVector) {
    return Math.sqrt(Math.pow(xVector,2) + Math.pow(yVector,2));
  },

  degreesToRadians: function(degrees) {
    return (degrees * Math.PI) / 180;
  },

  calculateXVector: function(vector,angle) {
    var radians = utils.degreesToRadians(angle);
    return Math.sin(radians) * vector;
  },

  calculateYVector: function(vector,angle) {
    var radians = utils.degreesToRadians(angle);
    return Math.cos(radians) * vector;
  },

  calculateXYVectors: function(vector,angle) {
    var radians = (angle * Math.PI) / 180;
    var xyVectors = {
      xVector: calculateXVector(vector,angle),
      yVector: calculateYVector(vector,angle)
    }
  }
}