const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let radius = 60;
let score = 0;
let time = 30;

let playing = true;

let dragging = false;

let stretchX = 1;
let stretchY = 1;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

/* ---------- タイマー ---------- */

const gameTimer = setInterval(() => {

    if (!playing) return;

    time--;
    timeEl.textContent = time;

    if (time <= 0) {
        endGame();
    }

}, 1000);

/* ---------- マウス操作 ---------- */

canvas.addEventListener("mousedown", () => {
    dragging = true;
});

canvas.addEventListener("mouseup", () => {
    dragging = false;
});

canvas.addEventListener("mouseleave", () => {
    dragging = false;
});

canvas.addEventListener("mousemove", (e) => {

    if (!dragging || !playing) return;

    const rect = canvas.getBoundingClientRect();

    const x =
        (e.clientX - rect.left) *
        (canvas.width / rect.width);

    const y =
        (e.clientY - rect.top) *
        (canvas.height / rect.height);

    const dx = x - centerX;
    const dy = y - centerY;

    stretchX += dx * 0.0004;
    stretchY += dy * 0.0004;

    stretchX = Math.max(0.7, Math.min(1.8, stretchX));
    stretchY = Math.max(0.7, Math.min(1.8, stretchY));

    radius += 0.35;

    score += 1;
});

/* ---------- 描画 ---------- */

function drawDough() {

    ctx.save();

    ctx.translate(centerX, centerY);

    ctx.scale(stretchX, stretchY);

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#f4d37d";
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#c78f3b";
    ctx.stroke();

    ctx.restore();

    stretchX *= 0.992;
    stretchY *= 0.992;
}

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawDough();

    if (playing) {
        requestAnimationFrame(draw);
    }
}

draw();

/* ---------- 結果 ---------- */

function endGame() {

    playing = false;

    let shapePenalty =
        Math.abs(stretchX - 1) * 80 +
        Math.abs(stretchY - 1) * 80;

    let finalScore =
        Math.max(
            0,
            Math.round(radius * 2 - shapePenalty)
        );

    scoreEl.textContent = finalScore;

    let rank = "";

    if (finalScore >= 260) {
        rank = "🏆 Pizza Legend";
    }
    else if (finalScore >= 220) {
        rank = "⭐ Pizza Master";
    }
    else if (finalScore >= 180) {
        rank = "👍 Skilled Chef";
    }
    else {
        rank = "🙂 Beginner";
    }

    messageEl.innerHTML =
        `RESULT<br><br>${rank}<br><br>SCORE ${finalScore}`;

    restartBtn.hidden = false;
}

/* ---------- リスタート ---------- */

restartBtn.addEventListener("click", () => {
    location.reload();
});