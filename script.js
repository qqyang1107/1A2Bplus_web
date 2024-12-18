// 初始化全局变量
let riddle = [];
let guesses = 0;
let digits = 4;
const symbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, 32);
let theme = "auto"; // 默认主题
let balls = []; // 存储动态背景球

// 动态生成数字选择
function populateDigitSelect() {
    const digitSelect = document.getElementById("digitSelect");
    digitSelect.innerHTML = ""; // 清空现有选项

    for (let i = 1; i <= 32; i++) {
        const option = document.createElement("option");
        option.value = i; // 设置选项值
        option.textContent = i; // 设置选项文本
        if (i === 4) {
            option.selected = true; // 默认选中 4
        }
        digitSelect.appendChild(option);
    }
}

// 切换主题
function switchTheme() {
    const select = document.getElementById("themeSelect");
    theme = select.value;

    if (theme === "auto") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    } else {
        document.documentElement.setAttribute("data-theme", theme);
    }
}

// 初始化新游戏
function startNewGame() {
    riddle = generateRiddle(); // 生成新的谜底
    guesses = 0; // 重置猜测次数

    document.getElementById("digitLength").innerText = digits; // 更新数字长度提示
    document.getElementById("log").innerHTML = ""; // 清空日志区域
    document.getElementById("guessInput").value = ""; // 清空输入框
    document.getElementById("winMessage").style.display = "none"; // 隐藏胜利信息

    console.log("Riddle:", riddle); // Debug: 显示谜底
    alert(`A new game has started! Guess the ${digits}-character number.`);
}

// 生成谜底
function generateRiddle() {
    const riddleSet = new Set();
    while (riddleSet.size < digits) {
        const randomChar = symbols[Math.floor(Math.random() * 32)];
        riddleSet.add(randomChar);
    }
    return Array.from(riddleSet);
}

// 提交猜测
function submitGuess() {
    const input = document.getElementById("guessInput");
    const guess = input.value.toUpperCase().trim();

    if (!validateGuess(guess)) {
        input.value = ""; // 清空输入框
        return;
    }

    const [a, b] = calculateAB(guess);
    guesses++;

    const logDiv = document.getElementById("log");
    const resultMessage = `${guess}: ${a}A${b}B (Guess #${guesses})`;
    logDiv.innerHTML += `<p>${resultMessage}</p>`;

    input.value = ""; // 清空输入框

    if (a === digits) {
        displayWinMessage();
        createBouncingBalls(a, b);
    }
}

// 校验用户输入
function validateGuess(guess) {
    if (guess.length !== digits) {
        alert(`Input must be exactly ${digits} characters long.`);
        return false;
    }

    if (!/^[0-9A-V]+$/.test(guess)) {
        alert("Invalid characters! Use only 0-9 and A-V.");
        return false;
    }

    if (new Set(guess).size !== guess.length) {
        alert("Characters cannot be repeated.");
        return false;
    }

    return true;
}

// 计算 A 和 B
function calculateAB(guess) {
    let a = 0, b = 0;
    for (let i = 0; i < digits; i++) {
        if (guess[i] === riddle[i]) {
            a++;
        } else if (riddle.includes(guess[i])) {
            b++;
        }
    }
    return [a, b];
}

// 显示胜利信息
function displayWinMessage() {
    const winMessageDiv = document.getElementById("winMessage");
    winMessageDiv.innerText = `Congratulations! You guessed it in ${guesses} tries!`;
    winMessageDiv.style.display = "block";
}

// 切换全屏
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// 页面加载时初始化
window.onload = function () {
    populateDigitSelect(); // 初始化数字选择
    startNewGame(); // 开始新游戏
    switchTheme(); // 初始化主题
     // 绑定 Enter 键提交功能
     const guessInput = document.getElementById("guessInput");
     guessInput.addEventListener("keydown", function (event) {
         if (event.key === "Enter") {
             submitGuess(); // 调用提交函数
         }
     });
};
