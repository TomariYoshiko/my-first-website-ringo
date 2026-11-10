const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const startBtn =
    document.getElementById("startBtn");

const scoreEl =
    document.getElementById("score");

const timeEl =
    document.getElementById("time");

const msgEl =
    document.getElementById("message");

const bestScoreEl =
    document.getElementById("bestScore");

let running = false;

let radius = 70;
let score = 0;
let time = 30;

let timer = null;

let dragging = false;

const cx = canvas.width / 2;
const cy = canvas.height / 2;

const messages = [
    "もっと大きく！",
    "その調子だ！",
    "いい仕事だ！",
    "丸く伸ばそう！",
    "あと少し！"
];

function loadBestScore(){

    const best =
        localStorage.getItem(
            "pizzaBest"
        );

    if(best){
        bestScoreEl.textContent =
            best;
    }else{
        bestScoreEl.textContent =
            "---";
    }
}

loadBestScore();

function drawDough(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle="#f4d37d";
    ctx.fill();

    ctx.strokeStyle="#ba8336";
    ctx.lineWidth=6;
    ctx.stroke();

    if(running){
        requestAnimationFrame(
            drawDough
        );
    }
}

function randomMessage(){

    msgEl.textContent =
        messages[
            Math.floor(
                Math.random() *
                messages.length
            )
        ];
}

startBtn.addEventListener(
    "click",
    startGame
);

function startGame(){

    if(running){
        return;
    }

    radius = 70;
    score = 0;
    time = 30;

    running = true;

    startBtn.disabled = true;

    startBtn.textContent =
        "PLAYING...";

    scoreEl.textContent = 0;
    timeEl.textContent = 30;

    msgEl.textContent =
        "ドラッグで生地を伸ばそう！";

    drawDough();

    timer = setInterval(()=>{

        time--;

        timeEl.textContent =
            time;

        if(time % 5 === 0){
            randomMessage();
        }

        if(time <= 0){
            endGame();
        }

    },1000);
}

function endGame(){

    running = false;

    clearInterval(timer);

    const finalScore =
        Math.round(radius * 2);

    let rank = "";

    if(finalScore >= 340){

        rank =
            "PIZZA LEGEND";

    }else if(finalScore >= 280){

        rank =
            "MASTER CHEF";

    }else if(finalScore >= 220){

        rank =
            "EXPERT";

    }else{

        rank =
            "BEGINNER";
    }

    msgEl.innerHTML =
        `
        SCORE : ${finalScore}
        <br>
        <span class="rank">
        ${rank}
        </span>
        `;

    scoreEl.textContent =
        finalScore;

    const best =
        Number(
            localStorage.getItem(
                "pizzaBest"
            ) || 0
        );

    if(finalScore > best){

        localStorage.setItem(
            "pizzaBest",
            finalScore
        );

        loadBestScore();
    }

    startBtn.disabled = false;
    startBtn.textContent =
        "PLAY AGAIN";
}

canvas.addEventListener(
    "pointerdown",
    ()=>{
        dragging = true;
    }
);

canvas.addEventListener(
    "pointerup",
    ()=>{
        dragging = false;
    }
);

canvas.addEventListener(
    "pointerleave",
    ()=>{
        dragging = false;
    }
);

canvas.addEventListener(
    "pointermove",
    ()=>{

        if(
            !running ||
            !dragging
        ){
            return;
        }

        radius += 0.45;

        if(radius > 170){
            radius = 170;
        }

        score++;

        scoreEl.textContent =
            score;
    }
);