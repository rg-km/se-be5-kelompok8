const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

let MOVE_INTERVAL = 85;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
    }
}

let snake1 = initSnake("purple");


let level = 1;
let apple = [{
    position: initPosition(),
},
{
    position: initPosition(),
}]

let isPrime = true;

let hearts = {
    total: 3,
    position: initPosition(),
    toggle: false,
}


function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}


function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    } 
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawLevel() {
    let levelCanvas;
    levelCanvas = document.getElementById("levelBoard"); 
    let levelCtx = levelCanvas.getContext("2d");

    levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    levelCtx.font = "30px Arial";
    // levelCtx.fillStyle = snake.color
    levelCtx.fillText(level, 10, levelCanvas.scrollHeight / 2);
}

// function drawLine(ctx){
//     ctx.lineWidth = 4;
//     ctx.moveTo(300, 40);
//     ctx.lineTo(300, 560);
//     ctx.stroke();
// }

// function obstacle(width, height, x, y, ctx) {
//     this.width = width;
//     this.height = height; 
//     this.x = x;
//     this.y = y;
//     ctx.fillStyle = "black";    
//     ctx.fillRect(this.x, this.y, this.width, this.height);
//     this.newPos = function() {
//         this.x += this.speedX;
//         this.y += this.speedY;        
//     }    

//     this.crashWith = function(level_2) {
//         var myleft = this.x;
//         var myright = this.x + (this.width);
//         var mytop = this.y;
//         var mybottom = this.y + (this.height);
//         var otherleft = level_2.x;
//         var otherright = level_2.x + (level_2.width);
//         var othertop = level_2.y;
//         var otherbottom = level_2.y + (level_2.height);
//         var crash = true;
//         if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
//             crash = false;
//         }
//         return crash;
//     }
// }

function drawHeart(ctx){
    var heartImg = document.getElementById("heart");
    if (level >= 2){
        if (isPrime){
            ctx.drawImage(heartImg, hearts.position.x * CELL_SIZE, hearts.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            hearts.toggle = true;
        }
        else{
            drawCell(ctx, hearts.position.x, hearts.position.y, "white");
            //hearts.position = initPosition();
            hearts.toggle = false;
        }
    }
}

function checkLevel(score){
    if (score > 0){
        if (score % 5 == 0){
            level++;
            if (level >= 6){
                alert("Thanks For Playing!");
                snake1 = initSnake("purple");
                MOVE_INTERVAL = 85;
                level = 1;
                initGame();
            }
            MOVE_INTERVAL -= 15;        
        }
    }
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        var snakeHeadImg = document.getElementById("snake-head");
        ctx.drawImage(snakeHeadImg, snake1.head.x * CELL_SIZE, snake1.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        for (let i = 1; i < snake1.body.length; i++) {
            var snakeBodyImg = document.getElementById("snake-body");
            ctx.drawImage(snakeBodyImg, snake1.body[i].x * CELL_SIZE, snake1.body[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        
        var heartImg = document.getElementById("heart");
        for (let i = 0; i < hearts.total; i++) {
            ctx.drawImage(heartImg, CELL_SIZE * i, 1, CELL_SIZE, CELL_SIZE);
        }
        drawHeart(ctx);

        for (let i = 0; i < apple.length; i++) {
            let apples = apple[i];
            var img = document.getElementById("apple");
            ctx.drawImage(img, apples.position.x * CELL_SIZE, apples.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        drawScore(snake1);
        drawLevel();
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple) {
    for (let i = 0; i < apple.length; i++) {
        let apples = apple[i];
        if (snake.head.x == apples.position.x && snake.head.y == apples.position.y) {
            apples.position = initPosition();
            snake.score++;
            snake.body.push({x: snake.head.x, y: snake.head.y});
            checkLevel(snake.score);
            if (snake1.score >= 5){
               isPrime = checkPrime(snake1.score);
            }
        }
    }
}


function eatHeart(snake, hearts){
    if(hearts.toggle){
        if (snake.head.x == hearts.position.x && snake.head.y == hearts.position.y){
            hearts.position = initPosition();
            apple.position = initPosition();
            snake.score++;
            hearts.total++;
            checkLevel(snake.score);
            isPrime = checkPrime(snake.score);
        }
    }
}

function checkPrime(score){
    isPrime = true;
    if (score == 0 || score == 1){
        isPrime = false;
    }
    else if (score >= 2){
        for (let i = 2; i < score; i++) {
            if (score % i == 0) {
                isPrime = false;
                break;
            }
        }    
    }
    //console.log(isPrime);
    return isPrime;
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple);
    eatHeart(snake, hearts);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple);
    eatHeart(snake, hearts);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple);
    eatHeart(snake, hearts);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple);
    eatHeart(snake, hearts);
}

// function calcCollison(obstacle, snakes){
//     var otherleft = obstacle.x;
//     var otherright = obstacle.x + (obstacle.width);
//     var othertop = obstacle.y;
//     var otherbottom = obstacle.y + (obstacle.height);
//     var crash = true;

//     if ((snakes.head.y == othertop) || (snakes.head.y == otherbottom) || (snakes.head.x == otherleft) || (snakes.head.x == otherright)) {
//         crash = true;
//     }
//     return crash;
// }

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    // for (let k = 1; k < snakes.body.length; k++) {
    //     if (snakes.head.x == snakes.body.x && snakes.head.y == snakes.body.y) {
    //         isCollide = true;
    //     }
    // }

    // isCollide = calcCollison(level_2, snakes);

    if (isCollide) {
        if (hearts.total > 0){
            hearts.total--;
            var tempScore = snake1.score;
            snake1 = initSnake("purple");
            snake1.score = tempScore;
        }
        else{
            alert("Game over");
            snake1 = initSnake("purple");
            // snake2 = initSnake("blue");
            hearts.total = 3;
            level = 1;
        }
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }

}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }
})

function initGame() {
    move(snake1);
    // move(snake2);
}

initGame();