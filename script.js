const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");

const startBtn =
document.getElementById("startBtn");

const retryBtn =
document.getElementById("retryBtn");

const powerFill =
document.getElementById("powerFill");

const message =
document.getElementById("message");

const timeEl =
document.getElementById("time");

const pizzaEl =
document.getElementById("pizzas");

const resultScreen =
document.getElementById("resultScreen");

const resultCount =
document.getElementById("resultCount");

let running=false;

let time=60;

let pizzas=0;

let doughLevel=0;

let power=0;

let chargeDir=1;

let charging=false;

let state="idle";

/*
idle
charge
flying
falling
*/

let dough={

    x:450,
    y:350,

    radius:30,

    vy:0
};

function resetDough(){

    dough.x=450;
    dough.y=350;
    dough.vy=0;
}

function drawChef(){

    ctx.font="120px serif";

    ctx.fillText(
        "👨‍🍳",
        80,
        400
    );
}

function drawDough(){

    ctx.beginPath();

    ctx.arc(
        dough.x,
        dough.y,
        dough.radius,
        0,
        Math.PI*2
    );

    ctx.fillStyle="#f4d48a";
    ctx.fill();

    ctx.strokeStyle="#c98d35";
    ctx.stroke();
}

function loop(){

    ctx.clearRect(
        0,
        0,
        900,
        500
    );

    drawChef();

    drawDough();

    if(state==="flying"){

        dough.y += dough.vy;

        dough.vy += 0.25;

        if(dough.y < 40){

            message.textContent=
            "TOO STRONG!";

            state="idle";

            resetDough();
        }

        if(
            dough.vy > 0 &&
            dough.y > 120
        ){

            state="falling";

            message.textContent=
            "CLICK TO CATCH!";
        }
    }

    if(state==="falling"){

        dough.y += dough.vy;

        dough.vy += 0.25;

        if(dough.y>430){

            message.textContent=
            "MISS!";

            doughLevel=0;

            state="idle";

            resetDough();
        }
    }

    requestAnimationFrame(
        loop
    );
}

function startGame(){

    running=true;

    pizzas=0;

    doughLevel=0;

    time=60;

    pizzaEl.textContent=0;

    message.textContent=
    "マウスを長押し！";

    setInterval(()=>{

        if(!running){
            return;
        }

        time--;

        timeEl.textContent=time;

        if(time<=10){

            message.textContent=
            "あと"+time+"秒!";
        }

        if(time<=0){

            running=false;

            resultScreen.classList.remove(
                "hidden"
            );

            resultCount.textContent=
            pizzas;
        }

    },1000);
}

startBtn.addEventListener(
    "click",
    ()=>{

        startBtn.disabled=true;

        startGame();
    }
);

document.addEventListener(
    "mousedown",
    ()=>{

        if(
            !running ||
            state!=="idle"
        ){
            return;
        }

        charging=true;

        state="charge";
    }
);

document.addEventListener(
    "mouseup",
    ()=>{

        if(
            !charging ||
            !running
        ){
            return;
        }

        charging=false;

        if(power<25){

            message.textContent=
            "TOO WEAK";

            state="idle";

            power=0;

            return;
        }

        dough.vy=
        -(power/6);

        state="flying";

        power=0;
    }
);

canvas.addEventListener(
    "click",
    ()=>{

        if(state!=="falling"){
            return;
        }

        if(
            dough.y>180 &&
            dough.y<260
        ){

            doughLevel++;

            message.textContent=
            "GOOD!";

            resetDough();

            state="idle";

            if(doughLevel>=3){

                pizzas++;

                pizzaEl.textContent=
                pizzas;

                doughLevel=0;

                message.textContent=
                "PIZZA COMPLETE!";
            }

        }else{

            doughLevel=0;

            message.textContent=
            "MISS!";

            resetDough();

            state="idle";
        }
    }
);

setInterval(()=>{

    if(!charging){
        return;
    }

    power += chargeDir*4;

    if(power>=100){
        chargeDir=-1;
    }

    if(power<=0){
        chargeDir=1;
    }

    powerFill.style.width=
    power+"%";

},20);

retryBtn.addEventListener(
    "click",
    ()=>{

        location.reload();
    }
);

loop();