class angerNoodler {
  constructor() {
    this.name = "angerNoodle";
    this.highScore = 0;
    this.shouldReDrawGrid = true;
    this.wallsAreLava = false;
    this.tickRate = 100;
    this.snakeGrid = $(".snake");
    this.score = $(".score");
    this.gameOverScreen = $(".game-over-angerNoodle");
    this.angryMessages = [
      "the anger noodle is displeased with your success",
      "the anger noodle would prefer that you lose",
      "your pain pleases the anger noodle",
      "how dare you do this to the anger noodle",
      "stop talking smack about anger noodle",
      "angrrrrrrr",
      "y tho",
      "hmmmmmm",
      "send noodles",
      "anger noodle delights in your suffering",
      "aw man you suck so baaaaaaaad",
      "everyone sucks but not anger noodle",
      "everyone sucks except for anger noodle",
      "everyone sucks who's not anger noodle",
      "don't look at anger noodle",
      "anger noodle hopes you fail",
      "delicious tears for anger noodle",
      "whoa i just kind of blacked out there for a second",
      "yyyyyyes destroy other kitteh"
    ];
    this.messageCopies = [...this.angryMessages];
    this.startGame = this.startGame.bind(this);
    this.updateTickRate = this.updateTickRate.bind(this);
    this.playPause = this.playPause.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.setControls = this.setControls.bind(this);
    this.wallsAreLavaSwitcher = this.wallsAreLavaSwitcher.bind(this);
    this.backToMenu = this.backToMenu.bind(this);
  }
  backToMenu() {
    this.gameMessages.hide();
    this.controls.hide();
    this.snakeGrid.hide();
    this.gameOver();
    this.gameOverScreen.hide();
    this.score.hide();
    $('.message').hide();
    $('.controls-explainer').hide();
    $('.main-menu').show();
  }
  addDisplayElements() {
    $('.difficulty-controls').append(`
            <div class="anger-noodle-controls">
                <div>Sleepy Anger Noodle</div>
            <div class="slider" >
                <input id="speed-slider" type="range" value="100" min="50" max="150">
            </div>
            <div>Turbo Anger Noodle</div>
            </div>
            <div class="anger-noodle-controls">
            <button id="lava-button">
            💀 Walls are lava 💀
            </button>
            </div>
    `);
    $('.controls-explainer').append(`
    <div class="controls-explainer">Move (Arrow keys) Play/Pause (Spacebar) Main Menu (ESC)</div>  
    `);
    $('.message-box').append(`
    <div class="anger-noodle-message">
                <div><img src="assets/sydney-face.png" id="anger-noodle"></img></div>
                <div><h1 class="message"></h1></div>
            </div>
  `);
    this.message = $('.message');
    this.message.text('"must destroy other kitteh"');
    this.lavaButton = $("#lava-button");
    this.menuButton = $("#back-to-menu");
    this.controls = $('.anger-noodle-controls');
    this.gameMessages = $('.anger-noodle-message');
    this.speedSlider = $("#speed-slider");
  }
  wallsAreLavaSwitcher() {
    console.log(`{
      lava: ${this.wallsAreLava},
      snakeGrid: ${this.snakeGrid},
    }`);
    if (!this.wallsAreLava) {
      this.snakeGrid.addClass("lava");
      this.lavaButton.addClass("lava");
    } else {
      this.snakeGrid.removeClass("lava");
      this.lavaButton.removeClass("lava");
    }
    this.wallsAreLava = !this.wallsAreLava;
  }
  preloadImages() {
    const images = [
      "assets/up.png",
      "assets/down.png",
      "assets/left.png",
      "assets/right.png",
    ];
    images.forEach((imageUrl) => {
      let img = new Image();
      img.src = imageUrl;
    });
  }
  getAngryMessage() {
    const getRandomIndex = () => {
      return Math.floor(Math.random() * this.messageCopies.length);
    };
    let randomIndex = getRandomIndex();
    let splicedMessage = this.messageCopies.splice([randomIndex], 1);
    this.message.text(`"${splicedMessage}"`);
    if (this.messageCopies.length === 0) {
      this.messageCopies = [...this.angryMessages];
    }
  }
  setDefaultGameState() {
    return {
      snake: [
        [10, 2],
        [10, 3],
        [10, 4],
        [10, 5],
        [10, 6],
        [10, 7],
        [10, 8],
      ],
      direction: "right",
      gridSize: 15,
      tickRate: 100,
      currentScore: 0,
      shouldReDrawGrid: true,
      gameState: "active"
    };
  }
  updateScore() {
    $(".score").text(
      `Current score: ${this.gameState.currentScore} High score: ${this.highScore}`
    );
  }
  checkNextMove(nextHeadPosition) {
    const boundary = this.gameState.boundary;
    const direction = this.gameState.direction;
    const [nextHeadPositionY, nextHeadPositionX] = nextHeadPosition;
    const nextHeadCell = $(this.rows[nextHeadPositionY][nextHeadPositionX]);
    const aboutToHitTopWall =
      direction === "up" && nextHeadPositionY === boundary;
    const aboutToBottomWall = direction === "down" && nextHeadPositionY === 0;
    const aboutToHitLeftWall =
      direction === "left" && nextHeadPositionX === boundary;
    const aboutToHitRightWall =
      direction === "right" && nextHeadPositionX === 0;
    const bonk = (this.wallsAreLava &&
      (aboutToHitTopWall ||
        aboutToBottomWall ||
        aboutToHitLeftWall ||
        aboutToHitRightWall));

    if (nextHeadCell.hasClass("segment") || bonk) {
      this.gameOver();
    }
    if (nextHeadCell.hasClass("treat")) {
      nextHeadCell.addClass("segment");
      this.eatTreat();
    }
  }
  getRows() {
    let rows = [];
    let copy = [...this.cells];
    while (copy.length > 0) {
      let nextRow = copy.splice(0, this.gameState.gridSize);
      rows.push(nextRow);
    }
    return $(rows);
  }
  removeTail() {
    const [tailX, tailY] = this.gameState.tail;
    const currentTail = $(this.rows[tailX][tailY]);
    currentTail.attr("class", "cell");
    this.gameState.snake.splice(0, 1);
    this.gameState.tail = this.gameState.snake[0];
  }
  renderSnake() {
    for (let bodySegment of this.gameState.snake) {
      const [row, column] = bodySegment;
      const currentSegment = $(this.rows[row][column]);
      // currentSegment.addClass('segment');
      currentSegment.addClass(`segment ${this.gameState.direction}`);
    }
  }
  move() {
    if (this.gameState.shouldDeleteTail) {
      this.removeTail();
    } else {
      this.gameState.shouldDeleteTail = true;
    }
    const [headX, headY] = this.gameState.head;
    let newHeadPosition;
    let boundary = this.gameState.boundary;
    switch (this.gameState.direction) {
      case "up":
        newHeadPosition = headX != 0 ? [headX - 1, headY] : [boundary, headY];
        break;
      case "down":
        newHeadPosition = headX != boundary ? [headX + 1, headY] : [0, headY];
        break;
      case "left":
        newHeadPosition = headY != 0 ? [headX, headY - 1] : [headX, boundary];
        break;
      case "right":
        newHeadPosition = headY != boundary ? [headX, headY + 1] : [headX, 0];
        break;

      default:
        break;
    }
    // console.log(`head: ${head}, next: ${newHeadPosition}`);
    this.checkNextMove(newHeadPosition);
    this.gameState.snake.push(newHeadPosition);
    this.gameState.head = newHeadPosition;
    this.renderSnake();
  }
  setControls() {
    document.onkeydown = function (e) {
      const gameState = angerNoodle.gameState.gameState;
      switch (e.key) {
        case "ArrowUp": // up
          if (gameState === "active" || gameState === "paused") {
            angerNoodle.gameState.direction =
              angerNoodle.gameState.direction != "down" ? "up" : "down";
          }
          if (gameState === "gameOver") {
            angerNoodle.startGame()
          }

          break;

        case "ArrowDown": // down
          if (gameState === "active" || gameState === "paused") {
            angerNoodle.gameState.direction =
              angerNoodle.gameState.direction != "up" ? "down" : "up";
          }
          if (gameState === "gameOver") {
            angerNoodle.startGame()
          }
          break;

        case "ArrowLeft": // left
          if (gameState === "active" || gameState === "paused") {
            angerNoodle.gameState.direction =
              angerNoodle.gameState.direction != "right" ? "left" : "right";
          }
          if (gameState === "gameOver") {
            angerNoodle.startGame()
          }
          break;

        case "ArrowRight": // right
          if (gameState === "active" || gameState === "paused") {
            angerNoodle.gameState.direction =
              angerNoodle.gameState.direction != "left" ? "right" : "left";
          }
          if (gameState === "gameOver") {
            angerNoodle.startGame()
          }
          break;

        case " ": // spacebar
          if (gameState != "gameOver") {
            angerNoodle.playPause();
          }
          if (gameState === "gameOver") {
            angerNoodle.startGame();
          }
          break;

        case "F6": // F6
          console.log(angerNoodle);
          break;

        case "Escape": // Escape
          angerNoodle.backToMenu();
          break;
        case "F6": // F6
          console.log(angerNoodle);
          break;

        default:
          return; // exit this handler for other keys
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
    };
  }
  setInputs() {
    this.speedSlider.on("input", this.updateTickRate);
    this.lavaButton.click(this.wallsAreLavaSwitcher);
    this.menuButton.click(this.backToMenu);
  }
  gameOver() {
    $(".cell").attr("class", "cell");
    this.gameState.treat = null;
    this.updateScore();
    $(".snake").hide();
    this.gameOverScreen.show();
    clearInterval(this.refreshGame);
    this.gameState.gameState = "gameOver";
  }
  makeTreat() {
    const notSnakeCells = $(".cell:not(.segment)");
    const getRandomIndex = () => {
      return Math.floor(Math.random() * notSnakeCells.length);
    };
    let randomIndex = getRandomIndex();
    this.gameState.treat = $(notSnakeCells[randomIndex]);
    this.gameState.treat.addClass("treat");
  }
  eatTreat() {
    this.gameState.treat.removeClass("treat");
    this.gameState.shouldDeleteTail = false;
    this.gameState.currentScore++;
    if (this.gameState.currentScore > this.highScore) {
      this.highScore = this.gameState.currentScore;
    }
    if (!(this.gameState.currentScore % 25)) {
      this.message.text(
        `"the anger noodle appreciates how you've destroyed other kitteh ${this.gameState.currentScore} times"`
      );
    } else if (!(this.gameState.currentScore % 5)) {
      this.getAngryMessage();
    }
    this.updateScore();
    this.makeTreat();
  }
  playPause() {
    console.log(this.gameState.gameState);
    const [headX, headY] = this.gameState.head;
    const headSquare = this.rows[headX][headY];
    if (this.gameState.gameState === "active") {
      console.log(this);
      clearInterval(this.refreshGame);
      this.gameState.gameState = "paused";
      $(headSquare).addClass("pause-head");
      return;
    }
    if (this.gameState.gameState === "paused") {
      console.log(this);
      this.refreshGame = setInterval(() => {
        this.move(this.gameState.direction);
      }, this.tickRate);
      this.gameState.gameState = "active";
      $(headSquare).removeClass("pause-head");
      return;
    }
  }
  updateTickRate() {
    const convertedSpeed = 200 - $("#speed-slider").val();
    console.log(this);
    this.tickRate = convertedSpeed;
    if (this.gameState.gameState === "active") {
      clearInterval(this.refreshGame);
      this.refreshGame = setInterval(
        () => this.move(this.gameState.direction),
        this.tickRate
      );
    }
  }
  startGame() {
    $(".cell").attr("class", "cell");
    this.gameState = this.setDefaultGameState();
    if (this.shouldReDrawGrid) {
      for (
        let i = 0;
        i < this.gameState.gridSize * this.gameState.gridSize;
        i++
      ) {
        this.snakeGrid.append(`
            <div class="cell"></div>
            `);
      }
      this.preloadImages();
      this.addDisplayElements();
      this.setInputs();
    }
    this.setControls();
    this.shouldReDrawGrid = false;
    this.cells = $(".cell");
    this.rows = this.getRows();
    this.gameState.head = this.gameState.snake[this.gameState.snake.length - 1];
    this.gameState.tail = this.gameState.snake[0];
    this.gameState.boundary = this.gameState.gridSize - 1;
    this.updateScore();
    this.renderSnake();
    this.makeTreat();
    this.refreshGame = setInterval(
      () => this.move(this.gameState.direction),
      this.tickRate
    );
    this.gameState.gameState = "active";
    this.gameOverScreen.hide();
    this.score.show();
    this.snakeGrid.show();
    this.controls.show();
    this.gameMessages.show();
    $('.message').show();
    $('.controls-explainer').show();
  }
}
export const angerNoodle = new angerNoodler();
