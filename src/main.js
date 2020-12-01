let context = document.getElementById("root").getContext("2d");
let btnPlay = document.getElementById('play');
let btnPause = document.getElementById('pause');
let blockSize = 16;
let score;
let record;
let direction;
let food;
let speed;
let game;
let limit;
let snake;

const initialBoard = () => {
    let img = document.getElementById("banner");
    context.drawImage(img, 0, 0);
}
initialBoard();

const resetFood = () => {
    food = {
        x: (Math.floor(Math.random()*15 + 1) * 2 * blockSize),
        y: (Math.floor(Math.random()*15 + 1) * 2 * blockSize)
    }
}
const resetGame = () => {
    play(false)
    limit = 1;
    score = 0;
    record = localStorage.getItem("@snake/record")
    speed = 200;
    direction ='';
    snake = [{
        x: (Math.floor(Math.random()*15 + 1) * 2 * blockSize),
        y: (Math.floor(Math.random()*15 + 1) * 2 * blockSize)
    }]

    document.getElementById("score").innerHTML = ` ${score}`;
    document.getElementById("record").innerHTML = ` ${record}`;
}

resetFood();
resetGame();

const drawBoard = () => {
    context.fillStyle = "#83E377";
    context.fillRect(0, 0, 512, 512);
}
const drawSnake = () => {
    for(i = 0; i < snake.length; i ++){
        context.fillStyle = "#54478C";
        context.fillRect(snake[i].x, snake[i].y, blockSize, blockSize);
    }
}
const drawFood = () => {
    context.fillStyle = "#D33E43";
    context.fillRect(food.x, food.y, blockSize, blockSize);
}

const controller = event => {
    if([37, 65, 100].includes(event.keyCode) && direction !== "right"){
        direction = "left"
    }else if([38, 87, 104].includes(event.keyCode) && direction !== "down"){
        direction = "up";
    }else if([39, 68, 102].includes(event.keyCode) && direction !== "left"){
        direction = "right";
    }else if([40, 83, 98].includes(event.keyCode) && direction !== "up"){
        direction = "down";
    }
}
document.addEventListener('keydown', controller);

const congratulation = (winner , score) => {
    document.getElementById("modal-wrapper").style.display = "flex";
    if(winner){
        document.getElementById("modal").innerHTML = `<img src='../src/image/winner.png' alt=''>
            <p>Parabéns, você já esta jogando a algum tempo, melhor fazer uma pausa.</p>
                <p>Você fez : ${score} pontos</p>`;
    }else{
        document.getElementById("modal").innerHTML = `<img src='../src/image/loser.png' alt=''>
                <p>Boa tentativa, mas não foi desta vez.</p>
                    <p>Você fez : ${score} pontos</p>`;
    }
    
}

function mainGame() {

    snake[0].x > 16 * (2*blockSize-1)
        ? snake[0].x = 0
        : snake[0].x < 0
            ? snake[0].x = 16 * blockSize * 2
            : null;
    
    snake[0].y > 16 * (2*blockSize-1)
        ? snake[0].y = 0
        : snake[0].y < 0
            ? snake[0].y = 16 * blockSize * 2
            : null;

    for(i = 1; i < snake.length; i++){
        if(snake[0].x === snake[i].x && snake[0].y === snake[i].y){
            play(false);
            congratulation(false, score)
        }
    }

    drawBoard();
    drawSnake();
    drawFood();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    switch (direction){
        case "":
            break;
        case "right":
            snakeX += blockSize;
            break;
        case "left":
            snakeX -= blockSize;
            break;
        case "up":
            snakeY -= blockSize;
            break;
        case "down":
            snakeY += blockSize;
            break;
        default:
            console.log('erro');
    };

    if(food.x !== snakeX || food.y !== snakeY){
        snake.pop();
    }else{
        resetFood();
        drawFood();

        score += snake.length;

        if(score > record){
            localStorage.setItem('@snake/record', score);
            record = localStorage.getItem('@snake/record');
        }

        document.getElementById("score").innerHTML = ` ${score}`;
        document.getElementById("record").innerHTML = ` ${record}`;

        if(snake.length > limit && speed > 50){

            play(false);
            
            limit < 10 ? speed-- : limit < 50 ? speed -= 5 : speed -=10;
            
            limit < 10 ? limit++ : limit < 20 ? limit += 2 : limit +=5;
            
            game = setInterval(mainGame, speed);
        }
        if(snake.length > 100 && speed <= 50){
            congratulation(true, score);
        }
    }

    snake.unshift({
        x: snakeX,
        y: snakeY
    });
}

function play(playGame, pause){ 
    if(playGame){
        !pause ? resetGame() : null;
        game = setInterval(mainGame, speed);
    }
    else{
        game = clearInterval(game);
    }
}

btnPlay.addEventListener('click', () => {
   if(btnPlay.innerHTML === "Iniciar"){
       play(true, false);
       btnPlay.innerHTML = "Reiniciar";
   }else {
       play(true, false);
   }
});

btnPause.addEventListener('click', () => {
    if(btnPause.innerHTML === "Pausar"){
        play(false);
        btnPause.innerHTML = "Continuar"
    }else{
        btnPause.innerHTML = "Pausar";
        play(true, true);
    }
});

let modal = document.getElementById("modal-smooth").addEventListener('click', () => {
    document.getElementById("modal-wrapper").style.display = "none";
    play(true, false);
    btnPlay.innerHTML = "Reiniciar";
});

let btnAbout = document.getElementById("btn-about").addEventListener('click', () => {
    document.getElementById("about").style.display = "flex";
});
let btnClose = document.getElementById("btn-close").addEventListener('click', () => {
    document.getElementById("about").style.display = "none";
});