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
  bulletRadius: 40
}