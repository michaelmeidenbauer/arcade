class angerNoodler {
    constructor() {
        this.name = "angerNoodle";
        this.highScore = 0;
        this.snakeGrid = $('.snake');
        this.playAgainButton = $('#play-again');
        this.snakeGrid = $('.snake');
        this.playAgainButton = $('#play-again');
        this.gameOverScreen = $('.game-over');
        this.lavaButton = $('#lava-button')
        this.shouldReDrawGrid = true;
        this.wallsAreLava = false;
        this.tickRate = 100;
        this.angryMessages = [
            "the anger noodle is displeased with your success",
            "the anger noodle would prefer that you lose",
            "your pain pleases the anger noodle",
            "how dare you do this to the anger noodle",
            "stop talking shit about anger noodle",
            "angrrrrrrr",
            "y tho",
            "hmmmmmm",
            "send noodles",
            "anger noodle delights in your suffering",
            "asshole",
            "aw man you suck so baaaaaaaad",
            "everyone sucks but not anger noodle",
            "everyone sucks except for anger noodle",
            "everyone sucks who's not anger noodle",
            "don't look at anger noodle",
            "anger noodle hopes you fail",
            "delicious tears for anger noodle",
            "whoa i just kind of blacked out there for a second",
            "don't look at anger noodle"
        ];
        this.messageCopies = [...this.angryMessages];
        this.startGame = this.startGame.bind(this);
        this.updateTickRate = this.updateTickRate.bind(this);
        this.playPause = this.playPause.bind(this);
        this.gameOver = this.gameOver.bind(this);
        this.setControls = this.setControls.bind(this);
        this.wallsAreLavaSwitcher = this.wallsAreLavaSwitcher.bind(this);
    }
    wallsAreLavaSwitcher() {
        if (!this.wallsAreLava) {
            this.snakeGrid.addClass('lava');
            this.lavaButton.addClass('lava');
        } else {
            this.snakeGrid.removeClass('lava');
            this.lavaButton.removeClass('lava');
        }
        this.wallsAreLava = !this.wallsAreLava;
    }
    preloadImages() {
        const images = [
            "assets/up.png",
            "assets/down.png",
            "assets/left.png",
            "assets/right.png",
        ]
        images.forEach(imageUrl => {
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
        $('.message h1').text(`"${splicedMessage}"`);
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
                [10, 8]
            ],
            direction: "right",
            gridSize: 15,
            tickRate: 100,
            currentScore: 0,
            shouldReDrawGrid: true,
            gameState: "active",
            wallsAreLava: false
        }
    }
    updateScore() {
        $('.score').text(`Current score: ${this.gameState.currentScore} High score: ${this.highScore}`);
    }
    checkNextMove(nextHeadPosition) {
        const boundary = this.gameState.boundary;
        const [nextHeadPositionX, nextHeadPositionY] = nextHeadPosition;
        const nextHeadCell = $(this.rows[nextHeadPositionX][nextHeadPositionY]);
        const aboutToHitRightOrBottomWall = (this.gameState.direction === "right" || this.gameState.direction === "down") && (nextHeadPositionX === 0 || nextHeadPositionY === 0);
        const aboutToHitLeftOrTopWall = (this.gameState.direction === "left" || this.gameState.direction === "up") && (nextHeadPositionX === boundary || nextHeadPositionY === boundary);
        if (nextHeadCell.hasClass("segment") || this.wallsAreLava && (aboutToHitRightOrBottomWall || aboutToHitLeftOrTopWall)) {
            this.gameOver();
        }
        if (nextHeadCell.hasClass("treat")) {
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
        currentTail.attr('class', 'cell');
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
        document.onkeydown = function(e) {
            switch (e.key) {
                case "ArrowUp": // up
                    angerNoodle.gameState.direction = angerNoodle.gameState.direction != "down" ? "up" : "down";
                    break;

                case "ArrowDown": // down
                    angerNoodle.gameState.direction = angerNoodle.gameState.direction != "up" ? "down" : "up";
                    break;

                case "ArrowLeft": // left
                    angerNoodle.gameState.direction = angerNoodle.gameState.direction != "right" ? "left" : "right";
                    break;
 
                case "ArrowRight": // right
                    angerNoodle.gameState.direction = angerNoodle.gameState.direction != "left" ? "right" : "left";
                    break;

                case " ": // spacebar
                    if (angerNoodle.gameState.gameState != "gameOver") {
                        angerNoodle.playPause();
                    }
                    break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        };
        $('#speed-slider').on('input', angerNoodle.updateTickRate);
        $('#play-again').click(angerNoodle.startGame);
        this.lavaButton.click(this.wallsAreLavaSwitcher);
    }
    gameOver() {
        $('.cell').attr('class', 'cell');
        this.gameState.treat = null;
        this.gameState.currentScore = 0;
        this.updateScore();
        $('.snake').hide();
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
        this.gameState.treat.addClass('treat');
    }
    eatTreat() {
        this.gameState.treat.removeClass('treat');
        this.gameState.shouldDeleteTail = false;
        this.gameState.currentScore++;
        if (this.gameState.currentScore > this.highScore) {
            this.highScore = this.gameState.currentScore;
        }
        if (!(this.gameState.currentScore % 25)) {
            $('.message h1').text(`"the anger noodle appreciates how you've destroyed other kitteh ${this.gameState.currentScore} times"`);
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
            $(headSquare).addClass('pause-head');
            return;
        }
        if (this.gameState.gameState === "paused") {
            console.log(this);
            this.refreshGame = setInterval(() => {
                this.move(this.gameState.direction)
            }, this.tickRate);
            this.gameState.gameState = "active";
            $(headSquare).removeClass('pause-head');
            return;
        }
    }
    updateTickRate() {
        const convertedSpeed = 200 - $("#speed-slider").val();
        console.log(this);
        this.tickRate = convertedSpeed;
        if (this.gameState.gameState === "active") {
            clearInterval(this.refreshGame);
            this.refreshGame = setInterval(() => this.move(this.gameState.direction), this.tickRate);
        }
    }
    startGame() {
        // this = this;
        $('.game-over').hide();
        $('.snake').show();
        $('.cell').attr('class', 'cell');
        this.gameState = this.setDefaultGameState();
        if (this.shouldReDrawGrid) {
            for (let i = 0; i < this.gameState.gridSize * this.gameState.gridSize; i++) {
                this.snakeGrid.append(`
            <div class="cell"></div>
            `);
            };
            this.preloadImages();
            this.setControls();
        };
        this.shouldReDrawGrid = false;
        this.cells = $('.cell');
        this.rows = this.getRows();
        this.gameState.head = this.gameState.snake[this.gameState.snake.length - 1];
        this.gameState.tail = this.gameState.snake[0];
        this.gameState.boundary = this.gameState.gridSize - 1;
        this.updateScore();
        this.renderSnake();
        this.makeTreat();
        this.refreshGame = setInterval(() => this.move(this.gameState.direction), this.tickRate);
        this.gameState.gameState = "active";
    }
}
export const angerNoodle = new angerNoodler;