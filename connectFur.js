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
      this.tokenSlots = $(".empty-slot");
      this.rows = this.getRows();
    }
    this.setControls();
    this.gameState.columnValues = this.setDefaultBoard();
    this.shouldReDrawGrid = false;
    // this.toggleCat = this.toggleCat.bind(this);
  }
  addToken() {
    $(this).text('');
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
    console.log(connectFur.gameState.currentPlayer);
  }
  checkMove(currentMove) {
    const [moveY, moveX] = currentMove;
    this.checkHorizontal(moveY);
    this.checkVertical(moveX);
    this.checkTopLeftToBottomRightDiag(moveX, moveY);
    this.checkBottomLeftToTopRightDiag(moveX, moveY);
  }
  checkHorizontal(yCoord) {
    let rowData = [];
    this.gameState.columnValues.forEach(column => {
      let yIndex = 6 - yCoord;
      if (column[yIndex]) {
        rowData.push(column[yIndex]);
      } else {
        rowData.push("");
      }
    })
    this.checkDataForWin(rowData);
  }
  checkVertical(xCoord) {
    let currentColumn = this.gameState.columnValues[xCoord];
    this.checkDataForWin(currentColumn);
  }
  checkDataForWin(dataArray) {
    let consecutive = 0;
    dataArray.forEach(token => {
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
  checkTopLeftToBottomRightDiag (xCoord, yCoord){
    const upperLeftDiag = this.createUpperLeftDiagonal(xCoord, yCoord);
    const bottomRightDiag = this.createBottomRightDiagonal(xCoord, yCoord);
    let completeDiag = upperLeftDiag.concat(this.gameState.currentPlayer, bottomRightDiag);
    // console.log('tlbr:', completeDiag);
    this.checkDataForWin(completeDiag);
  }
  checkBottomLeftToTopRightDiag (xCoord, yCoord){
    const bottomLeftDiag = this.createBottomLeftDiagonal(xCoord, yCoord);
    const topRightDiag = this.createUpperRightDiagonal(xCoord, yCoord);
    let completeDiag = bottomLeftDiag.concat(this.gameState.currentPlayer, topRightDiag);
    // console.log('bltr:', completeDiag);
    this.checkDataForWin(completeDiag);
  }
  createUpperLeftDiagonal(xCoord, yCoord) {
    let diagonal = [];
    const yIndex = 6 - yCoord;
    let x = xCoord > 3 ? 3 : xCoord;
    while (x > 0) {
      let tokenToAdd = connectFur.gameState.columnValues[xCoord - x][yIndex + x];
      if (tokenToAdd) {
        diagonal.push(tokenToAdd);
      } else {
        diagonal.push("");
      }
      // y--;
      x--;
    }
    return diagonal;
  }
  createBottomRightDiagonal(xCoord, yCoord) {
    let diagonal = [];
    const yIndex = 6 - yCoord;
    let x = xCoord < 4 ? 3 : 6 - xCoord;
    while (x > 0) {
      let tokenToAdd = connectFur.gameState.columnValues[xCoord + x][yIndex - x];
      if (tokenToAdd) {
        diagonal.push(tokenToAdd);
      } else {
        diagonal.push("");
      }
      // y--;
      x--;
    }
    return diagonal.reverse();
  }
  createUpperRightDiagonal(xCoord, yCoord) {
    let diagonal = [];
    const yIndex = 6 - yCoord;
    let x = xCoord < 4 ? 3 : 6 - xCoord;
    while (x > 0) {
      let tokenToAdd = connectFur.gameState.columnValues[xCoord + x][yIndex + x];
      if (tokenToAdd) {
        diagonal.push(tokenToAdd);
      } else {
        diagonal.push("");
      }
      // y--;
      x--;
    }
    return diagonal.reverse();
  }
  createBottomLeftDiagonal(xCoord, yCoord) {
    let diagonal = [];
    const yIndex = 6 - yCoord;
    let x = xCoord > 3 ? 3 : xCoord;
    while (x > 0) {
      let tokenToAdd = connectFur.gameState.columnValues[xCoord - x][yIndex - x];
      if (tokenToAdd) {
        diagonal.push(tokenToAdd);
      } else {
        diagonal.push("");
      }
      // y--;
      x--;
    }
    return diagonal;
  }
  backToMenu() {
    this.gameMessages.hide();
    this.controls.hide();
    $('.connect-fur').hide();
    this.gameOverScreen.hide();
    this.score.hide();
    this.gameState.columnValues = this.setDefaultBoard();
    $('.sydney-token, .uno-token')
      .removeClass()
      .addClass('empty-slot');
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
    rows[0].forEach((slot, index) => {
      let clickme = [
        "C",
        "L",
        "I",
        "C",
        "K",
        "M",
        "E"
      ];
      $(slot)
        .addClass(`top-row`)
        .val(counter)
        .click(this.addToken)
        .removeClass("empty-slot")
        .text(clickme[index]);
      counter++;
    })
    return $(rows);
  }
  setControls() {
    document.onkeydown = function (e) {
      switch (e.key) {
        // case "ArrowUp": // up
        //   if (gameState === "active" || gameState === "paused") {
        //     angerNoodle.gameState.direction =
        //       angerNoodle.gameState.direction != "down" ? "up" : "down";
        //   }
        //   if (gameState === "gameOver") {
        //     angerNoodle.startGame()
        //   }

        //   break;

        // case "ArrowDown": // down
        //   if (gameState === "active" || gameState === "paused") {
        //     angerNoodle.gameState.direction =
        //       angerNoodle.gameState.direction != "up" ? "down" : "up";
        //   }
        //   if (gameState === "gameOver") {
        //     angerNoodle.startGame()
        //   }
        //   break;

        // case "ArrowLeft": // left
        //   if (gameState === "active" || gameState === "paused") {
        //     angerNoodle.gameState.direction =
        //       angerNoodle.gameState.direction != "right" ? "left" : "right";
        //   }
        //   if (gameState === "gameOver") {
        //     angerNoodle.startGame()
        //   }
        //   break;

        // case "ArrowRight": // right
        //   if (gameState === "active" || gameState === "paused") {
        //     angerNoodle.gameState.direction =
        //       angerNoodle.gameState.direction != "left" ? "right" : "left";
        //   }
        //   if (gameState === "gameOver") {
        //     angerNoodle.startGame()
        //   }
        //   break;

        // case " ": // spacebar
        //   if (gameState != "gameOver") {
        //     angerNoodle.playPause();
        //   }
        //   if (gameState === "gameOver") {
        //     angerNoodle.startGame();
        //   }
        //   break;

        case "F6": // F6
          console.log(connectFur);
          break;

        case "Escape": // F6
          connectFur.backToMenu();
          break;

        default:
          return; // exit this handler for other keys
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
    };
    this.menuButton.click(this.backToMenu);
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
