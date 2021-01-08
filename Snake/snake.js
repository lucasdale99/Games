var canvas = document.getElementById('canvas-main')
var context = canvas.getContext('2d');

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var keyup = 38;
var keydown = 40;
var keyleft = 37;
var keyright = 39;
var keyspace = 32;

canvas.width = windowWidth;
canvas.height = windowHeight;

var colors = [
    "#9400D3",
    "#4B0082",
    "#0000FF",
    "#00FF00",
    "#FFFF00",
    "#FF7F00",
    "#FF0000"
].reverse()

// { left, right, top, bottom }
var rectanglesOverlap = function(r1, r2) {
    return !(r1.right <= r2.left || r1.left >= r2.right || r1.bottom <= r2.top || r1.top >= r2.bottom)
};

var makeBlockRectangle = function(x, y) {
    return {
        left: x,
        right: x + blockSize,
        top: y,
        bottom: y + blockSize
    };
}

document.onkeydown = function(e) {
    if (!game.musicIsPlaying) {
        game.musicIsPlaying = true;
        game.music.loop = true;
        game.music.play();
    }
    switch (e.keyCode) {
        case keyup: {
            snake.direction = snake.direction.y !== 1 ? { y: -1, x: 0 } : snake.direction;
            break;
        }
        case keydown: {
            snake.direction = snake.direction.y !== -1 ?  { y: 1, x: 0} : snake.direction;
            break;
        }
        case keyleft: {
            snake.direction = snake.direction.x !== 1 ?  { y: 0, x: -1} : snake.direction;
            break;
        }
        case keyright: {
            snake.direction = snake.direction.x !== -1 ? { y: 0, x: 1} : snake.direction;
            break;
        }
        case keyspace: {
            if (game.isOver) {
                window.location.reload();
            } else {
                game.isPaused = !game.isPaused;
                game.message = game.isPaused ? "Paused" : "";
            }
            break;
        }
    }
}

var centeredRect = function(context, x, y, width, height) {
    context.lineWidth = 1;
    context.strokeRect(x - width / 2, y - height / 2, width, height);
}

game = {};
game.score = 0;
game.highScore = localStorage.highScore || 0;
game.isOver = false;
game.isPaused = true;
game.message = 'Press Space To Play';
game.music = new Audio("action.mp3");
game.musicIsPlaying = false;

var gameWindow = {
    x: windowWidth / 2 - 500 / 2,
    y: windowHeight / 2 - 800 / 2,
    width: 500,
    height: 800
};
gameWindow.render = function() {
    context.clearRect(gameWindow.x, 
        0, 
        gameWindow.width, 
        gameWindow.height + gameWindow.y);
    context.strokeRect(gameWindow.x, 
        gameWindow.y, 
        gameWindow.width, 
        gameWindow.height);
    
    context.font = "20px Helvetica";
    context.textAlign = "left";
    context.fillText(`Score: ${game.score} High Score: ${game.highScore}`, gameWindow.x, gameWindow.y - blockSize);

    if (game.message !== '') {
        context.font = "45px Helvetica";
        context.textAlign = "center";
        context.fillText(game.message, gameWindow.x + gameWindow.width / 2, gameWindow.y + gameWindow.height / 2);
    }
}

gameWindow.render();

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var blockSize = 10;

var food = {
    x: rand(gameWindow.x, gameWindow.x + gameWindow.width - blockSize),
    y: rand(gameWindow.y, gameWindow.y + gameWindow.height - blockSize)
};
food.render = function() {
    context.fillRect(food.x, food.y, blockSize, blockSize);
}

var snake = {};
var initialSize = 5;
snake.x = gameWindow.x + gameWindow.width / 2
snake.y = gameWindow.y + gameWindow.height - blockSize * initialSize;
snake.velocity = { x: blockSize, y: blockSize };
snake.direction = { x: 0, y: -1 }
snake.throttle = 10;

snake.body = [
]
for( var i = 0; i < initialSize; i++ ) {
    snake.body.push({ x: snake.x, y: snake.y + blockSize * i })
}
snake.render = function() {
    for (var i = 0; i < snake.body.length; i++) {
        var current = snake.body[i];
        context.fillStyle = colors[i % colors.length];
        context.fillRect(current.x, current.y, blockSize, blockSize);
        context.fillStyle = "#000000";
    }
};

snake.update = function(gameCounter) {
    if (gameCounter % snake.throttle !== 0) { return; }

    if (snake.y < gameWindow.y || 
            snake.y > gameWindow.y + gameWindow.height - blockSize) {
        game.isPaused = true;
        game.isOver = true;
        game.message = "You Dead! Score: " + game.score;
        if (game.score > game.highScore) {
            localStorage.highScore = game.score;
        }
    }
    
    if (snake.x < gameWindow.x ||
            snake.x > gameWindow.x + gameWindow.width - blockSize) {
        game.isPaused = true;
        game.isOver = true;
        game.message = "You Dead! Score: " + game.score;
        if (game.score > game.highScore) {
            localStorage.highScore = game.score;
        }
    }

    var newHead = snake.body.pop();
    snake.body.unshift({ ...newHead });
    snake.x += snake.direction.x * snake.velocity.x;
    snake.y += snake.direction.y * snake.velocity.y;
    snake.body[0] = { x: snake.x, y: snake.y }

    var snakeRectangle = makeBlockRectangle(snake.x, snake.y);
    var foodRectangle = makeBlockRectangle(food.x, food.y);

    for(var i = 1; i < snake.body.length; i++) {
        var bodyRectangle = makeBlockRectangle(snake.body[i].x, snake.body[i].y);
        if (rectanglesOverlap(snakeRectangle, bodyRectangle)) {
            game.isOver = true;
            game.message = "You Dead! Score: " + game.score;
            if (game.score > game.highScore) {
                localStorage.highScore = game.score;
            }
            return;
        }
    }
    
    if (rectanglesOverlap(snakeRectangle, foodRectangle)) {                         //Update to when food spawns in body it increments snake.
        food.x = rand(gameWindow.x, gameWindow.x + gameWindow.width - blockSize);
        food.y = rand(gameWindow.y, gameWindow.y + gameWindow.height - blockSize);
        snake.body.push(newHead);
        game.score++;
        if (game.score % 5 === 0 && snake.throttle > 2) {
            snake.throttle--;
        }
    }
};
snake.render();

var gameCounter = 0;
setInterval(function() {
    gameWindow.render();    
    if (game.isPaused || game.isOver) { return; }
    gameCounter++;
    food.render();

    snake.update(gameCounter);
    snake.render();
}, 1000 / 60)