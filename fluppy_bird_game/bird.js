let board;
let boardWidth = 350;
let boardHeight = 540;
let context;

// bird
let birdWidth = 44;
let birdHeight = 34;
let birdx = boardWidth/8;
let birdy = boardHeight/2;
let birdImg;

let bird = {
    x : birdx,
    y : birdy,
    width : birdWidth,
    height : birdHeight
}

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipex = boardWidth;
let pipey = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -1; //pipes moving speed
let velocityY = 0; //bird jump
let gravity = 0.2;
let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "images/bird.png";

    topPipeImg = new Image();
    topPipeImg.src = 'images/top.jpeg';
    bottomPipeImg = new Image();
    bottomPipeImg.src = 'images/bottom.jpeg';

    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener('keydown', moveBird);
    document.addEventListener('touchstart', moveBird);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) gameOver = true;

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x + pipeWidth < 0) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER!", 45, 300);
    }
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipey - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 3;

    let topPipe = {
        img: topPipeImg,
        x: pipex,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipex,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);

    console.log(placePipes)
}


function moveBird(event){
    if(event.code == "Space" || event.code == "ArrowUp" || event.type === "touchstart"){
        // jump
        velocityY = -4.6; 

    }
    // reset game
    if(gameOver){
        bird.y = birdy;
        velocityY = 0.25;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

