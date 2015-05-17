//keypress listener
d3.select("body").on("keydown", function() {
  if(d3.event.keyCode === 37) {
    d3.event.preventDefault();
    player.turning = -1;
  }
  if (d3.event.keyCode === 39) {
    d3.event.preventDefault();
    player.turning = 1;  
  }
  if (d3.event.keyCode === 38) {
    d3.event.preventDefault();
    player.accelerating = 1;
  }
  if (d3.event.keyCode === 32) {
    d3.event.preventDefault();
    player.fire();
  }
})

d3.select("body").on("keyup", function() {
  if(d3.event.keyCode === 37|| d3.event.keyCode === 39) {
    d3.event.preventDefault();
    player.turning = 0;
  }
  if (d3.event.keyCode === 38) {
    d3.event.preventDefault();
    player.accelerating = 0;
  }
})