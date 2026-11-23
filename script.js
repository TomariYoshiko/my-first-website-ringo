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
let catchPower=0;

let chargeDir=1;
let catchChargeDir=1;

let charging=false;

let state="idle";

let stretchStartedAt=0;

let liftStartedAt=0;

let liftStartY=0;

const WORLD_SCALE=canvas.height/500;
const GRAVITY=0.13;
const STRETCH_DURATION=160;
const LIFT_DURATION=500;
const MIN_LIFT_DISTANCE=40*WORLD_SCALE;
const MAX_LIFT_DISTANCE=160*WORLD_SCALE;
let liftDistance=100*WORLD_SCALE;
const CATCH_ZONE_TOP=280*WORLD_SCALE;
const CATCH_ZONE_BOTTOM=380*WORLD_SCALE;
const CATCH_TARGET_Y=350*WORLD_SCALE;
const CATCH_APPROACH_DISTANCE=40*WORLD_SCALE;

/*
idle
charge
flying
falling
catchCharge
stretching
lifting
*/

let dough={

    x:450,
    y:350*WORLD_SCALE,

    radius:30,

    vy:0,

    stretch:0
};

function resetDough(){

    dough.x=450;
    dough.y=350*WORLD_SCALE;
    dough.vy=0;
    dough.stretch=0;
}

function completeCatch(chargeAmount){

    doughLevel++;

    liftDistance=calculateLiftDistance(chargeAmount);

    console.log("Catch lift", {
        chargePercent:chargeAmount,
        liftDistancePx:Number((liftDistance/WORLD_SCALE).toFixed(1)),
        scaledLiftDistancePx:Number(liftDistance.toFixed(1))
    });

    dough.vy=0;
    stretchStartedAt=performance.now();
    state="stretching";
    message.textContent=
    "キャッチ！";

    if(doughLevel>=3){

        pizzas++;

        pizzaEl.textContent=
        pizzas;

        doughLevel=0;

        message.textContent=
        "PIZZA COMPLETE!";
    }
}

function calculateLiftDistance(chargeAmount){

    const powerPercent=Math.max(0,Math.min(chargeAmount,100));

    return MIN_LIFT_DISTANCE+
        (MAX_LIFT_DISTANCE-MIN_LIFT_DISTANCE)*powerPercent/100;
}

function drawChef(){

    ctx.font="120px serif";

    ctx.fillText(
        "👨‍🍳",
        80,
        400*WORLD_SCALE
    );
}

function isCatchable(){

    return (
        dough.y>CATCH_ZONE_TOP &&
        dough.y<CATCH_ZONE_BOTTOM
    );
}

function drawCatchGuide(){

    const catchable=
        (state==="falling" || state==="catchCharge") &&
        isCatchable();

    const pulse=catchable
        ? (Math.sin(performance.now()/120)+1)/2
        : 0;

    ctx.save();

    ctx.fillStyle=catchable
        ? `rgba(46, 204, 113, ${0.18+pulse*0.18})`
        : "rgba(46, 204, 113, 0.10)";

    ctx.fillRect(
        0,
        CATCH_ZONE_TOP,
        canvas.width,
        CATCH_ZONE_BOTTOM-CATCH_ZONE_TOP
    );

    ctx.setLineDash([10,8]);
    ctx.strokeStyle="rgba(34, 139, 90, 0.65)";
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(0,CATCH_ZONE_TOP);
    ctx.lineTo(canvas.width,CATCH_ZONE_TOP);
    ctx.moveTo(0,CATCH_ZONE_BOTTOM);
    ctx.lineTo(canvas.width,CATCH_ZONE_BOTTOM);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle=catchable
        ? `rgba(20, 120, 75, ${0.65+pulse*0.35})`
        : "rgba(151, 105, 45, 0.85)";
    ctx.lineWidth=catchable ? 3+pulse*2 : 2;
    ctx.shadowColor=catchable
        ? "rgba(46, 204, 113, 0.95)"
        : "transparent";
    ctx.shadowBlur=catchable ? 8+pulse*12 : 0;
    ctx.beginPath();
    ctx.moveTo(220,CATCH_TARGET_Y);
    ctx.lineTo(canvas.width,CATCH_TARGET_Y);
    ctx.stroke();

    ctx.restore();
}

function updateCatchMessage(){

    if(isCatchable()){

        message.textContent=
        "今だ！クリック！";

    }else if(
        dough.y>=CATCH_ZONE_TOP-CATCH_APPROACH_DISTANCE &&
        dough.y<CATCH_ZONE_TOP
    ){

        message.textContent=
        "もうすぐ！";

    }else{

        message.textContent="";
    }
}

function drawDough(){

    ctx.save();
    ctx.translate(dough.x,dough.y);
    ctx.scale(
        1+dough.stretch*1.1,
        1-dough.stretch*0.55
    );

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        dough.radius,
        0,
        Math.PI*2
    );

    ctx.fillStyle="#f4d48a";
    ctx.fill();

    ctx.strokeStyle="#c98d35";
    ctx.stroke();

    ctx.restore();
}

function loop(){

    if(state==="stretching"){

        const now=performance.now();
        const progress=Math.min(
            (now-stretchStartedAt)/STRETCH_DURATION,
            1
        );
        const eased=1-Math.pow(1-progress,3);

        dough.stretch=eased;

        if(progress>=1){

            state="lifting";
            liftStartedAt=now;
            liftStartY=dough.y;
        }
    }

    if(state==="lifting"){

        const progress=Math.min(
            (performance.now()-liftStartedAt)/LIFT_DURATION,
            1
        );
        const eased=1-Math.pow(1-progress,3);

        dough.y=liftStartY-liftDistance*eased;
        dough.stretch=1-eased;

        if(progress>=1){

            state="idle";

            if(!message.textContent.startsWith("PIZZA COMPLETE!")){
                message.textContent=
                "マウスを長押し！";
            }
        }
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawCatchGuide();
    drawChef();
    drawDough();

    if(state==="flying"){

        dough.y += dough.vy;

        dough.vy += GRAVITY;

        if(dough.y < 0){

            message.textContent=
            "TOO STRONG!";

            state="idle";

            resetDough();
        }

        if(
            dough.vy > 0 &&
            dough.y > 120*WORLD_SCALE
        ){

            state="falling";
        }
    }

    if(state==="falling"){

        dough.y += dough.vy;

        dough.vy += GRAVITY;

        if(dough.y>430*WORLD_SCALE){

            message.textContent=
            "MISS!";

            doughLevel=0;

            state="idle";

            resetDough();

        }else{

            updateCatchMessage();
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

        if(!running || charging){
            return;
        }

        if(state==="idle"){

            power=0;
            powerFill.style.width="0%";
            charging=true;
            state="charge";
            return;
        }

        if(state==="falling" && isCatchable()){

            catchPower=0;
            catchChargeDir=1;
            powerFill.style.width="0%";
            charging=true;
            state="catchCharge";
            message.textContent=
            "押してチャージ、離してキャッチ！";
        }
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

        if(state==="catchCharge"){

            const releasedPower=catchPower;
            catchPower=0;
            powerFill.style.width="0%";

            if(isCatchable()){

                completeCatch(releasedPower);

            }else{

                doughLevel=0;
                message.textContent=
                "MISS!";
                state="idle";
                resetDough();
            }

            return;
        }

        if(state!=="charge"){
            return;
        }

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
        powerFill.style.width="0%";
    }
);

canvas.addEventListener(
    "click",
    ()=>{

        if(state==="falling" && !isCatchable()){

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

    if(state==="catchCharge"){

        catchPower += catchChargeDir*4;

        if(catchPower>=100){
            catchChargeDir=-1;
        }

        if(catchPower<=0){
            catchChargeDir=1;
        }

        powerFill.style.width=
        catchPower+"%";

        return;
    }

    if(state!=="charge"){
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