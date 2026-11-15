const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

const timeEl =
document.getElementById("time");

const countEl =
document.getElementById("count");

const startBtn =
document.getElementById("startBtn");

const retryBtn =
document.getElementById("retryBtn");

const resultScreen =
document.getElementById("resultScreen");

const finalCount =
document.getElementById("finalCount");

const message =
document.getElementById("message");

let running = false;

let time = 30;

let timer;

let completed = 0;

let stretches = 0;

let drag = false;

let pizzaX = 250;
let pizzaY = 250;

let radius = 60;

let tray = [];

let state = "idle";

function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawTray();

    if(state !== "fall"){

        ctx.beginPath();

        ctx.arc(
            pizzaX,
            pizzaY,
            radius,
            0,
            Math.PI*2
        );

        ctx.fillStyle =
        "#f6cf78";

        ctx.fill();

        ctx.strokeStyle =
        "#bb7b2b";

        ctx.lineWidth=5;

        ctx.stroke();
    }

    if(state === "fall"){

        pizzaY += 12;

        ctx.beginPath();

        ctx.arc(
            pizzaX,
            pizzaY,
            radius,
            0,
            Math.PI*2
        );

        ctx.fillStyle =
        "#f6cf78";

        ctx.fill();

        if(pizzaY > 650){

            resetPizza();

            state = "idle";
        }
    }

    requestAnimationFrame(draw);
}

function drawTray(){

    ctx.fillStyle =
    "#bdbdbd";

    ctx.fillRect(
        650,
        50,
        180,
        380
    );

    tray.forEach((p)=>{

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            28,
            0,
            Math.PI*2
        );

        ctx.fillStyle =
        "#ffcf67";

        ctx.fill();

    });

    ctx.fillStyle =
    "#222";

    ctx.font =
    "18px Arial";

    ctx.fillText(
        "Completed",
        690,
        80
    );
}

function resetPizza(){

    stretches = 0;

    pizzaX = 250;
    pizzaY = 250;

    radius = 60;
}

function startGame(){

    if(running){
        return;
    }

    running = true;

    completed = 0;
    time = 30;

    countEl.textContent =
    completed;

    timeEl.textContent =
    time;

    tray = [];

    resetPizza();

    timer =
    setInterval(()=>{

        time--;

        timeEl.textContent =
        time;

        if(time <= 10){

            document.body.classList.add(
                "warning"
            );

            message.textContent =
            "急げ！あと" + time + "秒";
        }

        if(time <= 0){

            endGame();
        }

    },1000);
}

function endGame(){

    running = false;

    clearInterval(timer);

    document.body.classList.remove(
        "warning"
    );

    finalCount.textContent =
    completed;

    document.getElementById(
        "gameArea"
    ).classList.add(
        "hidden"
    );

    resultScreen.classList.remove(
        "hidden"
    );
}

function judge(){

    const r = Math.random();

    if(r > 0.9){

        showJudge("PERFECT");

        completePizza();

        return;
    }

    if(r > 0.2){

        showJudge("GOOD");

        completePizza();

        return;
    }

    showJudge("MISS");

    state = "fall";
}

function completePizza(){

    completed++;

    countEl.textContent =
    completed;

    tray.push({

        x:700 +
        (tray.length % 4) * 35,

        y:130 +
        Math.floor(
            tray.length / 4
        ) * 35
    });

    resetPizza();

    message.textContent =
    "次の生地だ！";
}

function showJudge(text){

    const div =
    document.createElement("div");

    div.className =
    "judge";

    div.textContent =
    text;

    document.body.appendChild(
        div
    );

    setTimeout(()=>{

        div.remove();

    },800);
}

startBtn.addEventListener(
    "click",
    ()=>{

        startBtn.disabled = true;

        message.textContent =
        "生地を5回伸ばそう！";

        startGame();
    }
);

retryBtn.addEventListener(
    "click",
    ()=>{

        resultScreen.classList.add(
            "hidden"
        );

        document
        .getElementById("gameArea")
        .classList.remove(
            "hidden"
        );

        startBtn.disabled = false;

        startBtn.textContent =
        "START";

        message.textContent =
        "STARTを押してゲーム開始！";
    }
);

canvas.addEventListener(
    "pointerdown",
    ()=>{

        drag = true;
    }
);

canvas.addEventListener(
    "pointerup",
    ()=>{

        drag = false;
    }
);

canvas.addEventListener(
    "pointerleave",
    ()=>{

        drag = false;
    }
);

canvas.addEventListener(
    "pointermove",
    ()=>{

        if(
            !running ||
            !drag
        ){
            return;
        }

        radius += 6;

        stretches++;

        if(stretches >= 5){

            judge();
        }
    }
);

draw();