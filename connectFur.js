class connectFurr {
  constructor() {
    this.name = "connectFur";
    this.highScore = 0;
    this.score = $(".score");
    this.arcade = $('.arcade-display');
    this.menuButton = $("#back-to-menu");
    this.controls = $('.connect-fur-controls');
    this.message = $('.message');
    this.shouldReDrawGrid = true;
    this.startGame = this.startGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.setControls = this.setControls.bind(this);
    this.backToMenu = this.backToMenu.bind(this);
    this.gameState = {
      currentPlayer: 'uno',
      scores: {
        uno: 0,
        sydney: 0
      }
    };
    this.sillyMessages = [
      "get rekt other kitteh",
      "the anger noodle would prefer that you lose",
      "your pain pleases the anger noodle",
      "how dare you do this to the anger noodle",
      "i hope we stay friends after this",
      "dinner later?",
      "you hear about them new kibbles",
      "why aren't not cats just cats already",
      "anger noodle delights in your suffering",
      "boom roasted",
      "take that",
      "checkmate, other kitteh",
      "hmmmm",
      "delicious tears for anger noodle",
      "yyyyyyes destroy other kitteh",
      "wow. just wow.",
      "how's that supposed to make me feel",
      "okay then",
      "heh",
      "hoookay",
      "gReAt MoVe",
      "you would",
      "interesting",
      "you ever think about how we're all just stardust or whatever",
      "amazing move from kitteh",
      "indeed",
    ];
    this.messageCopies = [...this.sillyMessages];
  }
  startGame() {
    $('.main-menu').hide();
    if (this.shouldReDrawGrid) {
      this.addDisplayElements();
      for (
        let i = 0;
        i < 49;
        i++
      ) {
        this.connectFurGrid.append(`
                <div class="empty-slot"></div>
                `);
      }
      this.connectFurGrid.show();
      this.winScreen.hide();
      this.setControls();
      this.gameMessages = $('.connectFur-message');
      this.preloadImages();
      this.tokenSlots = $(".empty-slot");
      this.rows = this.getRows();
    }
    $('#message-connectFur h1').text("CONNECT FUR");
    $('#sydney').removeClass('current-player');
    $('#uno').addClass('current-player');
    this.gameMessages.show();
    this.connectFurGrid.show();
    this.updateScore();
    this.rebindEscAndF6();
    this.gameState.gameState = null;
    this.gameState.columnValues = this.setDefaultBoard();
    this.shouldReDrawGrid = false;
    // this.toggleCat = this.toggleCat.bind(this);
  }
  addDisplayElements() {
    $('.message-box').append(`
    <div class="connectFur-message">
                <div id="sydney-connectFur"><img src="assets/sydney-face.png" id="sydney"></img></div>
                <div id="message-connectFur"><h1>CONNECT FUR</h1></div>
                <div id="uno-connectFur"><img src="assets/uno.png" id="uno" class="current-player"></img></div>
            </div>
  `);
    this.arcade.prepend(`
    <div class="connect-fur">
    </div>
    <div class="connectFur-winner">
    </div>
    `);
    this.connectFurGrid = $(".connect-fur");
    this.winScreen = $('.connectFur-winner');
    this.winScreen.append(`
    <div id="win-message">Play again (Enter) Back to main menu (ESC)</div>
    `)
  }
  changeActiveCat(currentCat) {
    const uno = $('#uno');
    const sydney = $('#sydney');
    if (currentCat === "uno") {
      uno.removeClass('current-player');
      sydney.addClass('current-player');
    } else {
      sydney.removeClass('current-player');
      uno.addClass('current-player');
    }
  }
  getSillyMessage() {
    const getRandomIndex = () => {
      return Math.floor(Math.random() * this.messageCopies.length);
    };
    let randomIndex = getRandomIndex();
    let splicedMessage = this.messageCopies.splice([randomIndex], 1);
    $('#message-connectFur h1').text(`"${splicedMessage}"`);
    if (this.messageCopies.length === 0) {
      this.messageCopies = [...this.sillyMessages];
    }
  }
  addToken() {
    $('.top-row').text('');
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

    if (connectFur.gameState.gameState != "winner") {
      connectFur.changeActiveCat(connectFur.gameState.currentPlayer);
      connectFur.getSillyMessage();
      connectFur.gameState.currentPlayer = connectFur.gameState.currentPlayer === 'uno' ? 'sydney' : 'uno';
    }
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
      if (token === this.gameState.currentPlayer) {
        consecutive++
      } else {
        consecutive = 0;
      }
      if (consecutive === 4) {
        this.setWinState();
      }
    })
  }
  setWinState() {
    console.log(this.gameState.currentPlayer);
    $('#message-connectFur h1').text(`${this.gameState.currentPlayer} wins!`);
    this.gameState.gameState = "winner";
    this.gameState.scores[this.gameState.currentPlayer]++;
    this.gameState.currentPlayer = "uno";
    $('.sydney-token, .uno-token')
      .removeClass()
      .addClass('empty-slot');
    this.connectFurGrid.hide();
    this.updateScore();
    this.winScreen.show();
  }
  checkTopLeftToBottomRightDiag(xCoord, yCoord) {
    const upperLeftDiag = this.createUpperLeftDiagonal(xCoord, yCoord);
    const bottomRightDiag = this.createBottomRightDiagonal(xCoord, yCoord);
    let completeDiag = upperLeftDiag.concat(this.gameState.currentPlayer, bottomRightDiag);
    // console.log('tlbr:', completeDiag);
    this.checkDataForWin(completeDiag);
  }
  checkBottomLeftToTopRightDiag(xCoord, yCoord) {
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
    this.score.hide();
    $('.connect-fur').hide();
    this.winScreen.hide();
    this.score.hide();
    this.gameState.columnValues = this.setDefaultBoard();
    $('.sydney-token, .uno-token')
      .removeClass()
      .addClass('empty-slot');
    $('.main-menu').show();
  }
  rebindEscAndF6() {
    document.onkeydown = function (e) {
      switch (e.key) {
        case "Escape": // Escape
          connectFur.backToMenu();
          break;
        case "F6": // F6
          console.log(connectFur);
          break;
        case "Enter": // Enter
          console.log("haii");
          if (connectFur.gameState.gameState === "winner") {
            connectFur.startGame();
          }
          break;
        default:
          return; // exit this handler for other keys
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
    };
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
    this.score.show();
    this.score.text(
      `${this.gameState.scores.sydney} | ${this.gameState.scores.uno}`
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

        default:
          return; // exit this handler for other keys
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
    };
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
