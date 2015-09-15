# browserMayhem

A simple chrome extension that allows users to fly a spaceship around any webpage using the arrow keys and shoot bullets using spacebar.

A network element was originally implemented with a node.js server, making it so that any users using the extension who were on the same page would see each other. However, this caused a lot of issues due to different in browser window size, display resolution, and zoom between different machines. As a result, I removed the networking elements and simply repackaged the extension as a stand-alone single player ship.

When I have the time, the networking element will be reintroduced usinge a mobile virtual controller and the ability to play a wikipedia minigame where friends can independently race through wikipedia, fighting enemies, and trying to get to "target" pages and competing for highscore.

## Installation Instructions

1. Clone this repo
2. Type chrome://extensions into the address bar
3. Click the "load unpacked extension" button and then navigate to the folder that contains the cloned repo
