# DouShouQi

Game of [DouShouQi](https://en.wikipedia.org/wiki/Jungle_(board_game)) created using [boardgame.io]()

## Quick start

To play locally, clone the repository and install boardgame.io using `npm install boardgame.io`. Then use `npm start` to start a dev build.
Open http://localhost:3000 to view it in the browser. You can either choose Single Player to play against AI or Multiplayer -> Local pass and play to play locally.

To play online, [play](https://dou-shou-qi-d2d0b623ebb4.herokuapp.com/) it here. (Currently only support two people joining at the same time, lobby to be added later.)

## Rule
There are 8 types of pieces, elephant, lion, tiger, panther, wolf, dog, cat, mouse.

![elephant](/src/images/elephant0.png) ![lion](/src/images/lion0.png) ![tiger](/src/images/tiger0.png) ![panther](/src/images/panther0.png) ![wolf](/src/images/wolf0.png) ![dog](/src/images/dog0.png) ![cat](/src/images/cat0.png) ![mouse](/src/images/rat0.png)

The prior piece can capture everything come after it in the list, including itself. (so friendly tiger and capture enemy tiger, panther, wolf, dog, cat and mouse) with the exception that the elephant cannot capture mouse and the mouse can capture the elephant.

In your turn, you can select one friendly piece and move it to an adjacent empty square or capture an enemy piece that can be captured. In the game, yellow background indicates squares that the current piece can go to.

The aim of the game is having a friendly piece in the enemy den (the square with a flag).

### Special rules
- The blue squares on the board are rivers.
- Only mouse can enter river, and can capture from the river.
- Lion and tiger can jump across the river, both horizontally and vertically, but cannot jump if any mouse is in the way.
- The squares surrounding the den are traps. When an enemy piece is in the trap, **any** friendly piece can capture it.