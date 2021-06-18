class connectFurr {
  constructor() {
    this.name = "connectFur";
    this.highScore = 0;
    this.score = $(".score");
    this.connectFurGrid = $(".connect-fur");
    this.gameOverScreen = $(".game-over-connectFur");
    this.menuButton = $("#back-to-menu");
    this.controls = $('.connect-fur-controls');
    this.gameMessages = $('.connect-fur-message');
    this.message = $('.message');
    this.shouldReDrawGrid = true;
    this.startGame = this.startGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.setControls = this.setControls.bind(this);
    this.backToMenu = this.backToMenu.bind(this);
    this.gameState = {
      currentPlayer: 'uno'
    };
  }
  startGame() {
    this.connectFurGrid.show();
    this.gameOverScreen.hide();
    // this.score.show();
    // this.controls.show();
    // this.gameMessages.show();
    // $(".cell").attr("class", "cell");
    // this.gameState = this.setDefaultGameState();
    if (this.shouldReDrawGrid) {
      for (
        let i = 0;
        i < 49;
        i++
      ) {
        this.connectFurGrid.append(`
                <div class="empty-slot"></div>
                `);
      }
      this.preloadImages();
      this.setControls();
    }
    this.gameState.columnValues = this.setDefaultBoard();
    this.shouldReDrawGrid = false;
    this.tokenSlots = $(".empty-slot");
    this.rows = this.getRows();
    this.toggleCat = this.toggleCat.bind(this);
  }
  addToken() {
    const currentColumn = Number($(this).val());
    const currentColumnData = connectFur.gameState.columnValues[currentColumn];
    const currentNumTokens = currentColumnData.length;
    const inverted = 6 - currentNumTokens;
    const rowToAdd = connectFur.rows[inverted];
    const tokenToAdd = rowToAdd[currentColumn];
    const coords = [inverted, currentColumn];
    const catClassToAdd = connectFur.gameState.currentPlayer === 'uno' ? 'uno-token' : 'sydney-token';
    if (currentNumTokens < 6) {
    currentColumnData.push(connectFur.gameState.currentPlayer);
    $(tokenToAdd).addClass(catClassToAdd);
    }
    connectFur.checkMove(coords);
    connectFur.gameState.currentPlayer = connectFur.gameState.currentPlayer === 'uno' ? 'sydney' : 'uno';
    
  }
  checkMove(currentMove) {
    const [moveY, moveX] = currentMove;
    console.log(`Y: ${moveY}, X: ${moveX}`);
    
    this.checkHorizontal(moveY);
    this.checkVertical(moveX);
  }
  checkHorizontal(yCoord) {
    let rowData = [];
    let consecutive = 0;
    this.gameState.columnValues.forEach(column => {
      let yIndex = 6 - yCoord;
      if (column[yIndex]) {
        rowData.push(column[yIndex]);
      } else {
        rowData.push("");
      }
    })
    rowData.forEach(token => {
      if (token === this.gameState.currentPlayer){
        consecutive ++
      } else {
        consecutive = 0;
      }
      if (consecutive === 4) {
        console.log(`${this.gameState.currentPlayer} wins!`);
      }
    })
  }
  checkVertical(xCoord) {
    let currentColumn = this.gameState.columnValues[xCoord];
    let consecutive = 0;
    currentColumn.forEach(token => {
      if (token === this.gameState.currentPlayer){
        consecutive ++
      } else {
        consecutive = 0;
      }
      if (consecutive === 4) {
        console.log(`${this.gameState.currentPlayer} wins!`);
      }
    })
  }
    // checkHorizontal(moveX, moveY) {
  //   let left = this.createLeftHorizontal(moveX, moveY);
  //   let right = this.createRightHorizontal(moveX, moveY);
  //   const totalhorizontal = [...left];
  //   totalhorizontal.push(this.gameState.currentPlayer);
  //   totalhorizontal.push(...right);
  //   console.log(totalhorizontal)
  //   let consecutive = 0;
  //   totalhorizontal.forEach(token => {
  //     if (token === this.gameState.currentPlayer){
  //       consecutive ++
  //     } else {
  //       consecutive = 0;
  //     }
  //     if (consecutive === 4) {
  //       console.log(`${this.gameState.currentPlayer} wins!`);
  //     }
  //   })
  // }
  // createLeftHorizontal(xCoord, yCoord) {
  //   let horizontal = [];
  //   const yIndex = 6 - yCoord;
  //   let i = xCoord > 3 ? 3 : xCoord;
  //   for (i; i > 0; i--) {
  //     let tokenToAdd = connectFur.gameState.columnValues[xCoord - i][yIndex];
  //     if (tokenToAdd) {
  //       horizontal.push(tokenToAdd);
  //     } else {
  //       horizontal.push("");
  //     }
  //   }
  //   return horizontal;
  // }
  // createRightHorizontal(xCoord, yCoord) {
  //   let horizontal = [];
  //   const yIndex = 6 - yCoord;
  //   let i = xCoord < 4 ? 3 : 6 - xCoord;
  //   for (i; i > 0; i--) {
  //     let tokenToAdd = connectFur.gameState.columnValues[xCoord + i][yIndex];
  //     if (tokenToAdd) {
  //       horizontal.push(tokenToAdd);
  //     } else {
  //       horizontal.push("");
  //     }
  //   }
  //   return horizontal.reverse();
  // }
  backToMenu() {
    this.gameMessages.hide();
    this.controls.hide();
    this.snakeGrid.hide();
    this.gameOverScreen.hide();
    this.score.hide();
    $('.main-menu').show();
  }
  setDefaultBoard() {
    const emptyBoard = [];
    for (let i = 0; i < 7; i++) {
      emptyBoard.push([])
    }
    return emptyBoard;
  }
  toggleCat() {
    if (!$(this).hasClass('top-row')) {
      if ($(this).hasClass('uno-token')) {
        $(this).removeClass('uno-token');
        $(this).addClass('sydney-token');
      } else {
        $(this).addClass('uno-token');
        $(this).removeClass('sydney-token');
      }
    }
  }
  preloadImages() {
    const images = [
    ];
    images.forEach((imageUrl) => {
      let img = new Image();
      img.src = imageUrl;
    });
  }
  updateScore() {
    $(".score").text(
      `Current score: ${this.gameState.currentScore} High score: ${this.highScore}`
    );
  }
  getRows() {
    let rows = [];
    let counter = 0;
    console.log(this);
    let copy = [...this.tokenSlots];
    while (copy.length > 0) {
      let nextRow = copy.splice(0, 7);
      rows.push(nextRow);
    }
    rows[0].forEach(slot => {
      $(slot)
        .addClass(`top-row`)
        .val(counter)
        .click(this.addToken)
        .removeClass("empty-slot");
      counter++;
    })
    return $(rows);
  }
  setControls() {
    document.onkeydown = function (e) {
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
          console.log(connectFur);
          break;

        default:
          return; // exit this handler for other keys
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
    };
    this.menuButton.click(this.backToMenu);
    $('.empty-slot').click(connectFur.toggleCat);
  }
  gameOver() {
    $(".token-slot").attr("class", "token-slot");
    this.gameState.treat = null;
    this.updateScore();
    $(".snake").hide();
    this.gameOverScreen.show();
    clearInterval(this.refreshGame);
    this.gameState.gameState = "gameOver";
  }
}
export const connectFur = new connectFurr();
