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
            i < 42;
            i++
          ) {
            this.connectFurGrid.append(`
                <div class="empty-slot"></div>
                `);
          }
          this.preloadImages();
          this.setControls();
        }
        this.shouldReDrawGrid = false;
        this.tokenSlots = $(".token-slot");
        this.rows = this.getRows();
      }
    backToMenu () {
        this.gameMessages.hide();
        this.controls.hide();
        this.snakeGrid.hide();
        this.gameOverScreen.hide();
        this.score.hide();
        $('.main-menu').show();
    }
    toggleUno () {
        if ($(this).hasClass('uno-token')){
            $(this).removeClass('uno-token')
        } else {
            $(this).addClass('uno-token');
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
    checkNextMove() {
      
    }
    getRows() {
      let rows = [];
      let copy = [...this.tokenSlots];
      while (copy.length > 0) {
        let nextRow = copy.splice(0, 7);
        rows.push(nextRow);
      }
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
      $('.empty-slot').click(this.toggleUno);
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
  