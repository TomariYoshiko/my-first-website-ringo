const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const msgEl = document.getElementById("message");

let running = false;
let timer;

let radius = 70;
let score = 0;
let time = 30;

let drag = false;

const cx = canvas.width/2;
const cy = canvas.height/2;

function draw(){

  ctx.clearRect(
    0,0,
    canvas.width,
    canvas.height
  );

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    radius,
    0,
    Math.PI*2
  );

  ctx.fillStyle="#f4d37d";
  ctx.fill();

  ctx.strokeStyle="#c98d35";
  ctx.lineWidth=5;
  ctx.stroke();

  if(running){
    requestAnimationFrame(draw);
  }
}

startBtn.addEventListener("click",()=>{

  if(running){
    return;
  }

  running=true;

  radius=70;
  score=0;
  time=30;

  scoreEl.textContent=0;
  timeEl.textContent=30;

  msgEl.textContent=
    "ドラッグして生地を伸ばそう！";

  draw();

  timer=setInterval(()=>{

    time--;

    timeEl.textContent=time;

    if(time<=0){

      clearInterval(timer);

      running=false;

      const finalScore =
        Math.round(radius*2);

      msgEl.textContent=
        "終了！ SCORE " +
        finalScore;

      scoreEl.textContent=
        finalScore;
    }

  },1000);

});

canvas.addEventListener(
  "mousedown",
  ()=>drag=true
);

canvas.addEventListener(
  "mouseup",
  ()=>drag=false
);

canvas.addEventListener(
  "mouseleave",
  ()=>drag=false
);

canvas.addEventListener(
  "mousemove",
  ()=>{

    if(!drag || !running){
      return;
    }

    radius += 0.5;
    score++;

    scoreEl.textContent=
      score;
  }
);