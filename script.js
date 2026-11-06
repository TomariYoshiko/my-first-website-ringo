const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const playAgainButton = document.getElementById("playAgainButton");

const timeValue = document.getElementById("timeValue");
const scoreValue = document.getElementById("scoreValue");

const bestScoreEl = document.getElementById("bestScore");

const coachMessage = document.getElementById("coachMessage");
const comboText = document.getElementById("comboText");

const resultSize = document.getElementById("resultSize");
const resultRoundness = document.getElementById("resultRoundness");
const resultSkill = document.getElementById("resultSkill");

const finalScoreEl = document.getElementById("finalScore");
const rankName = document.getElementById("rankName");
const rankStars = document.getElementById("rankStars");
const resultComment = document.getElementById("resultComment");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* =====================
   ハイスコア
===================== */

const best = Number(localStorage.getItem("pizzaBest") || 0);
bestScoreEl.textContent = best || "---";

/* =====================
   ゲーム状態
===================== */

let gameTimer;
let playing = false;

let radius;
let stretchX;
let stretchY;

let score;
let time;

let dragging = false;
let combo = 0;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

/* =====================
   メッセージ
===================== */

const messages = [
    "もっと丸く伸ばそう！",
    "その調子だ！",
    "焦らず丁寧に！",
    "職人魂を見せてくれ！",
    "きれいな円を目指そう！"
];

const combos = [
    "NICE!",
    "GOOD!",
    "GREAT!",
    "AWESOME!",
    "PERFECT!"
];

function randomMessage() {

    coachMessage.innerHTML =
        messages[
            Math.floor(Math.random() * messages.length)
        ];
}

/* =====================
   初期化
===================== */

function resetGame() {

    radius = 70;

    stretchX = 1;
    stretchY = 1;

    score = 0;
    combo = 0;

    time = 30;

    scoreValue.textContent = "0";
    timeValue.textContent = "30";
}

/* =====================
   画面切り替え
===================== */

function showScreen(screen) {

    titleScreen.classList.remove("active");
    gameScreen.classList.remove("active");
    resultScreen.classList.remove("active");

    screen.classList.add("active");
}

/* =====================
   開始
===================== */

startButton.addEventListener("click", startGame);

function startGame() {

    resetGame();

    showScreen(gameScreen);

    playing = true;

    gameTimer = setInterval(() => {

        time--;

        timeValue.textContent = time;

        if (time % 5 === 0) {
            randomMessage();
        }

        if (time <= 0) {
            endGame();
        }

    }, 1000);

    requestAnimationFrame(loop);
}

/* =====================
   入力
===================== */

function pointerPosition(e) {

    const rect =
        canvas.getBoundingClientRect();

    if (e.touches) {

        return {

            x:
                (e.touches[0].clientX - rect.left)
                * (canvas.width / rect.width),

            y:
                (e.touches[0].clientY - rect.top)
                * (canvas.height / rect.height)

        };
    }

    return {

        x:
            (e.clientX - rect.left)
            * (canvas.width / rect.width),

        y:
            (e.clientY - rect.top)
            * (canvas.height / rect.height)

    };
}

function stretchDough(e) {

    if (!dragging || !playing) {
        return;
    }

    const pos = pointerPosition(e);

    const dx = pos.x - centerX;
    const dy = pos.y - centerY;

    stretchX += dx * 0.00045;
    stretchY += dy * 0.00045;

    stretchX =
        Math.max(0.65,
            Math.min(2.0, stretchX));

    stretchY =
        Math.max(0.65,
            Math.min(2.0, stretchY));

    radius += 0.35;

    score += 1;

    combo++;

    scoreValue.textContent = score;

    if (combo % 20 === 0) {

        showCombo(
            combos[
                Math.min(
                    4,
                    Math.floor(combo / 20)
                )
            ]
        );
    }
}

canvas.addEventListener("mousedown",
    () => dragging = true);

canvas.addEventListener("mouseup",
    () => dragging = false);

canvas.addEventListener("mouseleave",
    () => dragging = false);

canvas.addEventListener(
    "mousemove",
    stretchDough
);

canvas.addEventListener(
    "touchstart",
    () => dragging = true,
    { passive: true }
);

canvas.addEventListener(
    "touchend",
    () => dragging = false
);

canvas.addEventListener(
    "touchmove",
    stretchDough,
    { passive: true }
);

/* =====================
   コンボ表示
===================== */

function showCombo(text) {

    comboText.textContent = text;

    comboText.style.opacity = 1;

    comboText.animate(
        [
            {
                transform:
                    "translateX(-50%) scale(0.8)",
                opacity: 0
            },
            {
                transform:
                    "translateX(-50%) scale(1.3)",
                opacity: 1
            },
            {
                transform:
                    "translateX(-50%) scale(1)",
                opacity: 0
            }
        ],
        {
            duration: 1000
        }
    );

    setTimeout(() => {
        comboText.style.opacity = 0;
    }, 1000);
}

/* =====================
   描画
===================== */

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

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#c58a2d";
    ctx.stroke();

    ctx.restore();

    stretchX *= 0.995;
    stretchY *= 0.995;
}

function drawShadow() {

    ctx.beginPath();

    ctx.ellipse(
        centerX,
        centerY + radius + 15,
        radius * 0.9,
        radius * 0.2,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(0,0,0,.08)";

    ctx.fill();
}

function loop() {

    if (!playing) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawShadow();
    drawDough();

    requestAnimationFrame(loop);
}

/* =====================
   終了
===================== */

function endGame() {

    clearInterval(gameTimer);

    playing = false;

    const sizeScore =
        Math.round(radius * 2);

    const roundness =
        Math.max(
            0,
            Math.round(
                100 -
                Math.abs(
                    stretchX -
                    stretchY
                ) * 100
            )
        );

    const skillScore =
        Math.round(
            (sizeScore + roundness) / 2
        );

    const finalScore =
        Math.max(
            0,
            Math.round(
                sizeScore +
                roundness +
                skillScore
            )
        );

    resultSize.textContent =
        sizeScore;

    resultRoundness.textContent =
        roundness + "%";

    resultSkill.textContent =
        skillScore;

    finalScoreEl.textContent =
        finalScore;

    setRank(finalScore);

    const currentBest =
        Number(
            localStorage.getItem("pizzaBest") || 0
        );

    if (finalScore > currentBest) {

        localStorage.setItem(
            "pizzaBest",
            finalScore
        );

        bestScoreEl.textContent =
            finalScore;
    }

    showScreen(resultScreen);
}

/* =====================
   ランク
===================== */

function setRank(score) {

    if (score >= 420) {

        rankName.textContent =
            "PIZZA LEGEND";

        rankStars.textContent =
            "★★★★★";

        resultComment.innerHTML =
            "伝説級だ！生地が歓声を上げている！";

    } else if (score >= 360) {

        rankName.textContent =
            "MASTER CHEF";

        rankStars.textContent =
            "★★★★★";

        resultComment.innerHTML =
            "素晴らしい仕事だ！";

    } else if (score >= 300) {

        rankName.textContent =
            "EXPERT";

        rankStars.textContent =
            "★★★★☆";

        resultComment.innerHTML =
            "かなり腕がいいぞ！";

    } else if (score >= 230) {

        rankName.textContent =
            "APPRENTICE";

        rankStars.textContent =
            "★★★☆☆";

        resultComment.innerHTML =
            "もう少しで一人前だ！";

    } else {

        rankName.textContent =
            "KEEP PRACTICING";

        rankStars.textContent =
            "★★☆☆☆";

        resultComment.innerHTML =
            "焦らず練習しよう！";
    }
}

/* =====================
   リプレイ
===================== */

playAgainButton.addEventListener(
    "click",
    () => {

        showScreen(titleScreen);

        bestScoreEl.textContent =
            localStorage.getItem(
                "pizzaBest"
            ) || "---";
    }
);