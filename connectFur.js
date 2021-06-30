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
    this.gameState.currentPlayer = "uno";
    this.restart.hide();
    $('.sydney-token, .uno-token')
      .removeClass()
      .addClass('empty-slot');
    $('#sydney').removeClass('current-player');
    $('#uno').addClass('current-player');
    this.gameMessages.show();
    this.connectFurGrid.show();
    this.updateScore();
    this.rebindEscAndF6();
    this.gameState.gameState = "active";
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
    $('#message-connectFur').append(`<h4 id="restart">Play Again (Enter)</h4)`);
    this.restart = $('#restart');
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
    if (connectFur.gameState.gameState === "winner") {
      return;
    }
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
    const {wouldWin, winningArray} = connectFur.checkMove(coords);
    if (wouldWin) {
      connectFur.setWinState(winningArray);
    }

    if (connectFur.gameState.gameState != "winner") {
      connectFur.changeActiveCat(connectFur.gameState.currentPlayer);
      connectFur.getSillyMessage();
      connectFur.gameState.currentPlayer = connectFur.gameState.currentPlayer === 'uno' ? 'sydney' : 'uno';
    }
  }
  checkMove(currentMove) {
    let winningArray = [];
    let wouldWin = false;
    const [moveY, moveX] = currentMove;
    const checkHorizontal = yCoord => {
      let rowData = this.rows[yCoord];
      console.log(rowData);
      checkDataForWin(rowData);
    }
    const checkVertical = xCoord => {
      let currentColumn = [];
      console.log(this.rows);
      for (const row of this.rows) {
        currentColumn.push(row[xCoord])
      }
      console.log(currentColumn);
      checkDataForWin(currentColumn);
    }
    const checkTopLeftToBottomRightDiag = (xCoord, yCoord) => {
      const yIndex = 6 - yCoord;
      const currentMove = $(`#${yIndex}${xCoord}`);
      const upperLeftDiag = createUpperLeftDiagonal(xCoord, yCoord);
      const bottomRightDiag = createBottomRightDiagonal(xCoord, yCoord);
      let completeDiag = upperLeftDiag.concat(currentMove, bottomRightDiag);
      checkDataForWin(completeDiag);
    }
    const checkBottomLeftToTopRightDiag = (xCoord, yCoord) => {
      const yIndex = 6 - yCoord;
      const currentMove = $(`#${yIndex}${xCoord}`);
      const bottomLeftDiag = createBottomLeftDiagonal(xCoord, yCoord);
      const topRightDiag = createUpperRightDiagonal(xCoord, yCoord);
      let completeDiag = bottomLeftDiag.concat(currentMove, topRightDiag);
      checkDataForWin(completeDiag);
    }
    const createUpperLeftDiagonal = (xCoord, yCoord) => {
      let diagonal = [];
      const yIndex = 6 - yCoord;
      let x = xCoord > 3 ? 3 : xCoord;
      while (x > 0) {
        const tokenSelector = `#${yIndex + x}${xCoord - x}`;
        let tokenToAdd = $(tokenSelector);
        if (tokenToAdd) {
          diagonal.push(tokenToAdd);
        } else {
          diagonal.push("");
        }
        // y--;
        x--;
      }
      console.log(diagonal);
      return diagonal;
    }
    const createBottomRightDiagonal = (xCoord, yCoord) => {
      let diagonal = [];
      const yIndex = 6 - yCoord;
      let x = xCoord < 4 ? 3 : 6 - xCoord;
      while (x > 0) {
        const tokenSelector = `#${yIndex - x}${xCoord + x}`;
        let tokenToAdd = $(tokenSelector);
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
    const createUpperRightDiagonal = (xCoord, yCoord) => {
      let diagonal = [];
      const yIndex = 6 - yCoord;
      let x = xCoord < 4 ? 3 : 6 - xCoord;
      while (x > 0) {
        const tokenSelector = `#${yIndex + x}${xCoord + x}`;
        let tokenToAdd = $(tokenSelector);
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
    const createBottomLeftDiagonal = (xCoord, yCoord) => {
      let diagonal = [];
      const yIndex = 6 - yCoord;
      let x = xCoord > 3 ? 3 : xCoord;
      while (x > 0) {
        const tokenSelector = `#${yIndex - x}${xCoord - x}`;
        let tokenToAdd = $(tokenSelector);
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
    const checkDataForWin = (dataArray) => {
      let consecutive = 0;
      let consecutiveArray = [];
      dataArray.forEach(token => {
        let JQToken = $(token);
        console.log(JQToken.attr('class'));
        if (JQToken.hasClass(`${this.gameState.currentPlayer}-token`)) {
          consecutive++;
          consecutiveArray.push(JQToken);
        } else {
          consecutive = 0;
          consecutiveArray = [];
        }
        console.log("consecutive array: ", consecutiveArray);
        if (consecutive === 4) {
          winningArray.push(...consecutiveArray);
          wouldWin = true
        }
      })
    }
    checkHorizontal(moveY);
    checkVertical(moveX);
    checkTopLeftToBottomRightDiag(moveX, moveY);
    checkBottomLeftToTopRightDiag(moveX, moveY);
    console.log("would win: ", wouldWin);
    return {
      wouldWin: wouldWin,
      winningArray: winningArray
    }
  }
  setWinState(winningArray) {
    console.log(this.gameState.currentPlayer);
    winningArray.forEach(token => token.addClass('winning-token'));
    $('#message-connectFur h1').text(`${this.gameState.currentPlayer} wins!`)
    this.gameState.gameState = "winner";
    this.gameState.scores[this.gameState.currentPlayer]++;
    this.updateScore();
    this.restart.show();
    // this.connectFurGrid.hide();
    // this.winScreen.show();
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
    let columnCounter = 0;
    console.log(this);
    let copy = [...this.tokenSlots];
    while (copy.length > 0) {
      let nextRow = copy.splice(0, 7);
      nextRow.forEach((token, index) => {
        $(token).attr("id", `${6 - columnCounter}${index}`);
      })
      rows.push(nextRow);
      columnCounter++;
    }
    let counter = 0;
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
