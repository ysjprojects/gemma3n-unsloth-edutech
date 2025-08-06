export const seedData = {
    "heat energy": [
        {
            theme:"default",
            difficulty:"default",
    prompt: "Create an interactive, Duolingo-style educational quiz for grade school students that teaches the concept of heat energy and its uses. The quiz should be visually engaging with a playful design that keeps young learners with ADHD focused and excited.\n\n**General Instruction:** Implement a single-page web application that presents a series of questions about heat energy in a fun, game-like format. The program should use only HTML, CSS, and JavaScript, with no external files or storage.\n\n**Features:**\n- A vibrant color scheme using warm colors: bright orange (#FF6B35), sunny yellow (#FFD23F), and sky blue (#87CEEB) as accent colors against a soft white background (#FFF8F0).\n- Animated mascot character (a friendly flame character named \"Flicker\") that bounces and changes expressions based on user interactions.\n- Progress bar at the top showing quiz completion with flame icons that light up as students progress.\n- Each question appears on a card that flips with a 3D animation when transitioning between questions.\n- Answer choices appear as colorful buttons that grow slightly on hover and have a satisfying \"pop\" animation when clicked.\n- Immediate feedback with celebratory confetti animation for correct answers and gentle encouragement for incorrect ones.\n- Score counter with flame emojis that fill up as students answer correctly.\n- Background with subtle animated floating heat waves to maintain visual interest.\n- Sound effect visual indicators (speaker icons that animate) to show when feedback is given.\n- \"Energy meter\" on the side that fills up with each correct answer, showing how much \"heat power\" the student has collected.\n\n**User Actions:**\n1. **Click on an answer choice** - When the user clicks one of the multiple-choice answer buttons, the button should highlight with a glowing effect and the mascot character should react with anticipation (bouncing faster).\n2. **Click the \"Check Answer\" button** - After selecting an answer, clicking this button triggers the evaluation. Correct answers show green confetti and the mascot celebrates with a happy dance, while incorrect answers show gentle red pulses and the mascot looks concerned but encouraging.\n3. **Click the \"Next Question\" button** - After receiving feedback, clicking this button triggers a smooth card flip transition to the next question, updates the progress bar, and resets the mascot to an excited idle animation.\n\n**Quiz Content:**\nQuestion 1: \"What gives us heat from the sky?\"\n- A) The Moon\n- B) The Sun (correct)\n- C) A Cloud\n- D) A Star (distractor - technically correct but not the best answer)\n\nQuestion 2: \"Which of these is NOT a source of heat?\"\n- A) Fire\n- B) Ice (correct)\n- C) Stove\n- D) Lamp\n\nQuestion 3: \"What happens when you heat water?\"\n- A) It freezes\n- B) It turns into steam (correct)\n- C) It disappears\n- D) It becomes cold\n\nQuestion 4: \"Which animal uses heat from the sun to warm up?\"\n- A) Fish\n- B) Lizard (correct)\n- C) Bird\n- D) Bear\n\nQuestion 5: \"What do we use to measure temperature?\"\n- A) Ruler\n- B) Scale\n- C) Thermometer (correct)\n- D) Clock\nNote:\n- Your output should be implemented in JavaScript with HTML and CSS.\n- Ensure that the output has both index.js and index.html files\n",
    completion: `<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Heat Energy Quiz</title>
<link href="styles.css" rel="stylesheet"/>
<style>/* Base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
    background-color: #FFF8F0;
    overflow: hidden;
    position: relative;
    height: 100vh;
}

/* Background heat waves */
body::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 20% 30%, rgba(255, 210, 63, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 80% 70%, rgba(255, 107, 53, 0.1) 0%, transparent 20%);
    animation: heatWave 15s infinite linear;
    z-index: -1;
}

@keyframes heatWave {
    0% { transform: translate(0, 0); }
    25% { transform: translate(2px, 2px); }
    50% { transform: translate(0, 0); }
    75% { transform: translate(-2px, -2px); }
    100% { transform: translate(0, 0); }
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Progress bar */
.progress-container {
    margin-bottom: 20px;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #FF6B35, #FFD23F);
    border-radius: 10px;
    transition: width 0.5s ease;
}

.flame-icons {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
}

.flame-icon {
    opacity: 0.3;
    transition: opacity 0.5s ease;
}

.flame-icon.active {
    opacity: 1;
    animation: flamePulse 1s infinite alternate;
}

@keyframes flamePulse {
    from { transform: scale(1); }
    to { transform: scale(1.2); }
}

/* Score counter */
.score-container {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #FFD23F;
    padding: 10px 15px;
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 8px;
}

.score-label {
    font-weight: bold;
    color: #333;
}

.score-value {
    font-size: 24px;
    font-weight: bold;
    color: #FF6B35;
}

/* Energy meter */
.energy-meter {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 80px;
}

.energy-label {
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
    color: #333;
}

.energy-bar {
    width: 100%;
    height: 200px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.energy-fill {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0%;
    background: linear-gradient(to top, #FF6B35, #FFD23F);
    transition: height 0.5s ease;
}

/* Mascot */
.mascot-container {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
}

.mascot {
    position: relative;
    width: 80px;
    height: 80px;
    animation: bounce 2s infinite ease-in-out;
}

.mascot-body {
    width: 60px;
    height: 60px;
    background-color: #FF6B35;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 10px;
}

.mascot-eye {
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 25px;
}

.left-eye {
    left: 20px;
}

.right-eye {
    right: 20px;
}

.mascot-mouth {
    width: 25px;
    height: 10px;
    border-bottom: 3px solid white;
    border-radius: 0 0 50% 50%;
    position: absolute;
    top: 45px;
    left: 27px;
}

.mascot.happy {
    animation: happyDance 0.5s infinite;
}

.mascot.concerned {
    animation: concernShake 0.5s infinite;
}

.mascot.fast-bounce {
    animation: fastBounce 0.5s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes fastBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

@keyframes happyDance {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(10deg); }
    75% { transform: rotate(-10deg); }
    100% { transform: rotate(0deg); }
}

@keyframes concernShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Question card */
.card-container {
    perspective: 1000px;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    width: 90%;
    max-width: 500px;
    height: 350px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s;
    cursor: pointer;
}

.card.flipped {
    transform: rotateY(180deg);
}

.card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-front {
    background: linear-gradient(135deg, #FFD23F, #FF6B35);
}

.card-back {
    background: linear-gradient(135deg, #87CEEB, #4682B4);
    transform: rotateY(180deg);
}

.question {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex-grow: 1;
}

.option-btn {
    background-color: white;
    border: none;
    border-radius: 15px;
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    color: #333;
}

.option-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.option-btn.selected {
    background-color: #FFD23F;
    transform: scale(1.05);
    box-shadow: 0 0 15px #FFD23F;
}

.option-btn.correct {
    background-color: #4CAF50;
    color: white;
}

.option-btn.incorrect {
    background-color: #F44336;
    color: white;
}

.check-btn, .next-btn {
    background-color: #333;
    color: white;
    border: none;
    border-radius: 15px;
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.check-btn:hover, .next-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.check-btn:disabled, .next-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.feedback {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Sound indicator */
.sound-indicator {
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 24px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.sound-indicator.active {
    opacity: 1;
    animation: soundPulse 0.5s 3;
}

@keyframes soundPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

/* Confetti */
#confettiCanvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 100;
}

/* Responsive design */
@media (max-width: 600px) {
    .container {
        padding: 10px;
    }
    
    .question {
        font-size: 20px;
    }
    
    .option-btn {
        font-size: 16px;
        padding: 12px;
    }
    
    .check-btn, .next-btn {
        font-size: 16px;
        padding: 12px;
    }
    
    .score-container {
        top: 10px;
        right: 10px;
        padding: 8px 12px;
    }
    
    .energy-meter {
        top: 10px;
        left: 10px;
        width: 60px;
    }
    
    .energy-bar {
        height: 150px;
    }
}</style></head>
<body>
<div class="container">
<div class="progress-container">
<div class="progress-bar">
<div class="progress-fill" id="progressFill"></div>
</div>
<div class="flame-icons">
<div class="flame-icon" id="flame1">🔥</div>
<div class="flame-icon" id="flame2">🔥</div>
<div class="flame-icon" id="flame3">🔥</div>
<div class="flame-icon" id="flame4">🔥</div>
<div class="flame-icon" id="flame5">🔥</div>
</div>
</div>
<div class="score-container">
<div class="score-label">Score:</div>
<div class="score-value" id="scoreValue">0</div>
</div>
<div class="energy-meter">
<div class="energy-label">Heat Power</div>
<div class="energy-bar">
<div class="energy-fill" id="energyFill"></div>
</div>
</div>
<div class="mascot-container">
<div class="mascot" id="mascot">
<div class="mascot-body"></div>
<div class="mascot-eye left-eye"></div>
<div class="mascot-eye right-eye"></div>
<div class="mascot-mouth"></div>
</div>
</div>
<div class="card-container">
<div class="card" id="card">
<div class="card-front">
<div class="question" id="question">Loading question...</div>
<div class="options" id="options">
</div>
<button class="check-btn" id="checkBtn">Check Answer</button>
</div>
<div class="card-back">
<div class="feedback" id="feedback">Feedback will appear here</div>
<button class="next-btn" id="nextBtn">Next Question</button>
</div>
</div>
</div>
<div class="sound-indicator" id="soundIndicator">
<div class="speaker-icon">🔊</div>
</div>
<canvas id="confettiCanvas"></canvas>
</div>
<script src="index.js"></script>
<script>const quizData = [
    {
        question: "What gives us heat from the sky?",
        options: ["The Moon", "The Sun", "A Cloud", "A Star"],
        correct: 1
    },
    {
        question: "Which of these is NOT a source of heat?",
        options: ["Fire", "Ice", "Stove", "Lamp"],
        correct: 1
    },
    {
        question: "What happens when you heat water?",
        options: ["It freezes", "It turns into steam", "It disappears", "It becomes cold"],
        correct: 1
    },
    {
        question: "Which animal uses heat from the sun to warm up?",
        options: ["Fish", "Lizard", "Bird", "Bear"],
        correct: 1
    },
    {
        question: "What do we use to measure temperature?",
        options: ["Ruler", "Scale", "Thermometer", "Clock"],
        correct: 2
    }
];

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const card = document.getElementById('card');
const progressFill = document.getElementById('progressFill');
const scoreValue = document.getElementById('scoreValue');
const energyFill = document.getElementById('energyFill');
const mascot = document.getElementById('mascot');
const feedbackElement = document.getElementById('feedback');
const soundIndicator = document.getElementById('soundIndicator');
const confettiCanvas = document.getElementById('confettiCanvas');

let currentQuestion = 0;
let score = 0;
let selectedOption = null;

const ctx = confettiCanvas.getContext('2d');
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let particles = [];

function initQuiz() {
    showQuestion();
    updateProgress();
    updateScore();
    updateEnergyMeter();
}

function showQuestion() {
    const question = quizData[currentQuestion];
    questionElement.textContent = question.question;
    
    optionsElement.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option;
        button.addEventListener('click', () => selectOption(button, index));
        optionsElement.appendChild(button);
    });
    
    selectedOption = null;
    checkBtn.disabled = true;
    nextBtn.disabled = true;
    
    card.classList.remove('flipped');
    
    mascot.className = 'mascot';
}

function selectOption(button, index) {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    button.classList.add('selected');
    selectedOption = index;
    
    checkBtn.disabled = false;
    
    mascot.classList.add('fast-bounce');
    setTimeout(() => {
        mascot.classList.remove('fast-bounce');
    }, 500);
}

function checkAnswer() {
    if (selectedOption === null) return;
    
    const question = quizData[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => {
        btn.disabled = true;
    });
    
    if (selectedOption === question.correct) {
        buttons[selectedOption].classList.add('correct');
        score++;
        updateScore();
        updateEnergyMeter();
        showFeedback('Correct! Great job!', true);
        showConfetti();
    } else {
        buttons[selectedOption].classList.add('incorrect');
        buttons[question.correct].classList.add('correct');
        showFeedback('Not quite! Keep trying!', false);
    }
    
    checkBtn.disabled = true;
    
    nextBtn.disabled = false;
    
    showSoundIndicator();
}

// Show feedback
function showFeedback(message, isCorrect) {
    feedbackElement.textContent = message;
    
    // Animate mascot
    if (isCorrect) {
        mascot.classList.add('happy');
    } else {
        mascot.classList.add('concerned');
    }
    
    // Flip card
    card.classList.add('flipped');
}

// Show next question
function showNextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        showQuestion();
        updateProgress();
    } else {
        // Quiz completed
        showCompletion();
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestion) / quizData.length) * 100;
    progressFill.style.width = \`\${progress}%\`;
    
    // Update flame icons
    for (let i = 1; i <= quizData.length; i++) {
        const flame = document.getElementById(\`flame\${i}\`);
        if (i <= currentQuestion) {
            flame.classList.add('active');
        } else {
            flame.classList.remove('active');
        }
    }
}

// Update score
function updateScore() {
    scoreValue.textContent = score;
}

// Update energy meter
function updateEnergyMeter() {
    const energy = (score / quizData.length) * 100;
    energyFill.style.height = \`\${energy}%\`;
}

// Show sound indicator
function showSoundIndicator() {
    soundIndicator.classList.add('active');
    setTimeout(() => {
        soundIndicator.classList.remove('active');
    }, 1500);
}

// Show confetti
function showConfetti() {
    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: -10,
            size: Math.random() * 10 + 5,
            speed: Math.random() * 3 + 2,
            color: \`hsl(\${Math.random() * 360}, 100%, 50%)\`,
            angle: Math.random() * Math.PI * 2
        });
    }
    
    // Animate particles
    animateConfetti();
}

// Animate confetti
function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let activeParticles = 0;
    
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update position
        p.y += p.speed;
        p.x += Math.sin(p.angle) * 2;
        p.angle += 0.05;
        
        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Count active particles
        if (p.y < confettiCanvas.height) {
            activeParticles++;
        }
    }
    
    // Remove particles that are off screen
    particles = particles.filter(p => p.y < confettiCanvas.height + 50);
    
    // Continue animation if there are active particles
    if (activeParticles > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

function showCompletion() {
    const percentage = (score / quizData.length) * 100;
    const passed = percentage >= 60;
    
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'quizComplete',
            passed: passed,
            score: score,
            total: quizData.length,
            percentage: percentage
        }, '*');
    }
    
    const container = document.querySelector('.container');
    container.innerHTML = \`
        <div style="text-align: center; padding: 40px; color: #333;">
            <div style="font-size: 3em; color: #FFA500; margin-bottom: 25px;">🎉 Quiz Complete! 🎉</div>
            <div style="font-size: 2em; color: #333; margin-bottom: 35px;">
                You scored \${score} out of \${quizData.length}! (\${percentage.toFixed(0)}%)
            </div>
            <div style="font-size: 1.8em; color: \${passed ? '#4CAF50' : '#F44336'}; margin-bottom: 30px;">
                \${passed ? '🌟 Congratulations! You passed!' : '💪 Keep practicing! You can do better!'}
            </div>
            <button onclick="location.reload()" style="background: #FFD23F; color: #333; border: none; border-radius: 20px; padding: 20px 40px; font-size: 24px; cursor: pointer; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
                Try Again 🚀
            </button>
        </div>
    \`;
}

checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', showNextQuestion);

window.addEventListener('load', initQuiz);

window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});
</script></body>
</html>`
},
        {
            theme:"default",
            difficulty:"easier",
            prompt: "Create an interactive, Duolingo-style educational quiz for grade school students that teaches the concept of heat energy and its uses. This is an EASIER version with simpler questions.",
            completion: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Heat Energy Quiz - Easy Mode</title>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Comic Sans MS', cursive, sans-serif;
    background: linear-gradient(135deg, #FFE4B5, #FFDAB9);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.quiz-container {
    background: white;
    border-radius: 25px;
    padding: 40px;
    max-width: 600px;
    width: 100%;
    text-align: center;
    box-shadow: 0 10px 30px rgba(255, 165, 0, 0.3);
    border: 5px solid #FFD700;
}

.progress-bar {
    width: 100%;
    height: 15px;
    background: #E0E0E0;
    border-radius: 10px;
    margin-bottom: 30px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF6B35, #FFD23F);
    width: 0%;
    transition: width 0.5s ease;
}

.mascot {
    font-size: 4em;
    margin: 20px 0;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

.question {
    font-size: 2em;
    color: #FF6B35;
    margin: 30px 0;
    font-weight: bold;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 30px 0;
}

.option {
    background: #FFE4B5;
    border: 3px solid #FFD700;
    border-radius: 20px;
    padding: 20px;
    font-size: 1.5em;
    cursor: pointer;
    transition: all 0.3s ease;
}

.option:hover {
    background: #FFDAB9;
    transform: scale(1.05);
}

.option.selected {
    background: #FFD700;
    border-color: #FF6B35;
}

.option.correct {
    background: #90EE90;
    border-color: #228B22;
}

.option.incorrect {
    background: #FFB6C1;
    border-color: #FF69B4;
}

.check-btn, .next-btn {
    background: #FF6B35;
    color: white;
    border: none;
    border-radius: 15px;
    padding: 15px 30px;
    font-size: 1.3em;
    cursor: pointer;
    margin: 20px 10px;
    transition: transform 0.2s;
}

.check-btn:hover, .next-btn:hover {
    transform: scale(1.1);
}

.check-btn:disabled, .next-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.feedback {
    font-size: 1.5em;
    margin: 20px 0;
    font-weight: bold;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.feedback.correct {
    color: #228B22;
}

.feedback.incorrect {
    color: #DC143C;
}

.completion {
    font-size: 2.5em;
    color: #FF6B35;
    margin: 30px 0;
}
</style>
</head>
<body>
<div class="quiz-container">
    <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
    </div>
    
    <div class="mascot" id="mascot">🔥</div>
    
    <div class="question" id="question">Loading question...</div>
    
    <div class="options" id="options"></div>
    
    <div class="feedback" id="feedback"></div>
    
    <div>
        <button class="check-btn" id="checkBtn" onclick="checkAnswer()">Check Answer</button>
        <button class="next-btn" id="nextBtn" onclick="nextQuestion()" style="display: none;">Next Question</button>
    </div>
</div>

<script>
const questions = [
    {
        question: "Is the sun hot? ☀️",
        options: ["Yes, very hot! 🔥", "No, it's cold ❄️", "Maybe warm 🤔"],
        correct: 0
    },
    {
        question: "What makes you feel warm?",
        options: ["Ice cubes 🧊", "Fire 🔥", "Snow ⛄"],
        correct: 1
    },
    {
        question: "Which one is hot?",
        options: ["Cold water 💧", "Hot soup 🍲", "Ice cream 🍦"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

function showQuestion() {
    const q = questions[currentQuestion];
    const progressFill = document.getElementById('progressFill');
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = progress + '%';
    
    document.getElementById('question').textContent = q.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = option;
        div.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(div);
    });
    
    selectedAnswer = null;
    document.getElementById('checkBtn').disabled = true;
    document.getElementById('checkBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('feedback').textContent = '';
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
    selectedAnswer = index;
    document.getElementById('checkBtn').disabled = false;
}

function checkAnswer() {
    if (selectedAnswer === null) return;
    
    const q = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    const feedback = document.getElementById('feedback');
    
    document.getElementById('checkBtn').disabled = true;
    
    if (selectedAnswer === q.correct) {
        options[selectedAnswer].classList.add('correct');
        feedback.textContent = "🎉 Amazing! You got it right! 🎉";
        feedback.className = 'feedback correct';
        score++;
        document.getElementById('mascot').textContent = '🔥😊';
    } else {
        options[selectedAnswer].classList.add('incorrect');
        options[q.correct].classList.add('correct');
        feedback.textContent = "That's okay! You're learning! 😊";
        feedback.className = 'feedback incorrect';
        document.getElementById('mascot').textContent = '🔥🤔';
    }
    
    if (currentQuestion === questions.length - 1) {
        setTimeout(showCompletion, 1500);
    } else {
        document.getElementById('nextBtn').style.display = 'inline-block';
    }
}

function nextQuestion() {
    currentQuestion++;
    document.getElementById('mascot').textContent = '🔥';
    showQuestion();
}

function showCompletion() {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 50;
    
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'quizComplete',
            passed: passed,
            score: score,
            total: questions.length,
            percentage: percentage
        }, '*');
    }
    
    document.querySelector('.quiz-container').innerHTML = \`
        <div class="completion">🎉 Quiz Complete! 🎉</div>
        <div style="font-size: 2em; margin: 20px 0;">
            You scored \${score} out of \${questions.length}! (\${percentage.toFixed(0)}%)
        </div>
        <div style="font-size: 1.5em; color: \${passed ? '#228B22' : '#FF6B35'}; margin: 20px 0;">
            \${passed ? '🌟 Fantastic job! You\\'re doing great!' : '💪 You\\'re learning! Keep going!'}
        </div>
        <button onclick="location.reload()" style="background: #FFD23F; color: #333; border: none; border-radius: 15px; padding: 15px 30px; font-size: 1.3em; cursor: pointer;">
            Try Again 🚀
        </button>
    \`;
}

showQuestion();
</script>
</body>
</html>`
},
        {
            theme:"default",
            difficulty:"harder",
            prompt: "Create an interactive, Duolingo-style educational quiz for grade school students that teaches the concept of heat energy and its uses. This is a HARDER version with more challenging questions.",
            completion: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Heat Energy Quiz - Advanced Challenge</title>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #2C1810, #8B4513, #CD853F);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    color: #FFF;
}

.quiz-container {
    background: rgba(0, 0, 0, 0.8);
    border-radius: 15px;
    padding: 30px;
    max-width: 800px;
    width: 100%;
    text-align: center;
    box-shadow: 0 10px 30px rgba(255, 69, 0, 0.3);
    border: 2px solid #FF4500;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: #333;
    border-radius: 5px;
    margin-bottom: 20px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF4500, #FFD700);
    width: 0%;
    transition: width 0.5s ease;
}

.difficulty-badge {
    background: #FF4500;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    display: inline-block;
}

.mascot {
    font-size: 3em;
    margin: 15px 0;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
}

.question {
    font-size: 1.4em;
    color: #FFD700;
    margin: 25px 0;
    font-weight: bold;
    line-height: 1.4;
    text-align: left;
    background: rgba(255, 215, 0, 0.1);
    padding: 20px;
    border-radius: 10px;
    border-left: 5px solid #FFD700;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 25px 0;
    text-align: left;
}

.option {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid #666;
    border-radius: 10px;
    padding: 15px;
    font-size: 1em;
    cursor: pointer;
    transition: all 0.3s ease;
    line-height: 1.3;
}

.option:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #FFD700;
}

.option.selected {
    background: rgba(255, 69, 0, 0.3);
    border-color: #FF4500;
}

.option.correct {
    background: rgba(0, 255, 0, 0.3);
    border-color: #00FF00;
}

.option.incorrect {
    background: rgba(255, 0, 0, 0.3);
    border-color: #FF0000;
}

.check-btn, .next-btn {
    background: #FF4500;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 25px;
    font-size: 1.1em;
    cursor: pointer;
    margin: 15px 8px;
    transition: background 0.3s;
    font-weight: bold;
}

.check-btn:hover, .next-btn:hover {
    background: #FF6500;
}

.check-btn:disabled, .next-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.feedback {
    font-size: 1.2em;
    margin: 20px 0;
    font-weight: bold;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border-radius: 8px;
}

.feedback.correct {
    background: rgba(0, 255, 0, 0.2);
    color: #00FF00;
    border: 1px solid #00FF00;
}

.feedback.incorrect {
    background: rgba(255, 0, 0, 0.2);
    color: #FF6666;
    border: 1px solid #FF0000;
}

.completion {
    font-size: 2em;
    color: #FFD700;
    margin: 25px 0;
}

.score-display {
    font-size: 1.5em;
    margin: 20px 0;
}
</style>
</head>
<body>
<div class="quiz-container">
    <div class="difficulty-badge">🔥 ADVANCED CHALLENGE 🔥</div>
    
    <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
    </div>
    
    <div class="mascot" id="mascot">🌡️</div>
    
    <div class="question" id="question">Loading advanced question...</div>
    
    <div class="options" id="options"></div>
    
    <div class="feedback" id="feedback"></div>
    
    <div>
        <button class="check-btn" id="checkBtn" onclick="checkAnswer()">Analyze Answer</button>
        <button class="next-btn" id="nextBtn" onclick="nextQuestion()" style="display: none;">Next Challenge</button>
    </div>
</div>

<script>
const questions = [
    {
        question: "Which process transfers heat through electromagnetic waves without needing matter?",
        options: [
            "Conduction - heat transfer through direct contact", 
            "Convection - heat transfer through moving fluids", 
            "Radiation - heat transfer through electromagnetic waves", 
            "Insulation - preventing heat transfer"
        ],
        correct: 2
    },
    {
        question: "At what temperature does water reach its boiling point at standard atmospheric pressure?",
        options: [
            "90°C (194°F) - below the actual boiling point", 
            "100°C (212°F) - the correct boiling point", 
            "110°C (230°F) - above the actual boiling point", 
            "80°C (176°F) - well below boiling point"
        ],
        correct: 1
    },
    {
        question: "Which material has the highest thermal conductivity?",
        options: [
            "Wood - a thermal insulator with low conductivity", 
            "Plastic - another thermal insulator", 
            "Silver - the metal with highest thermal conductivity", 
            "Glass - a material with very low thermal conductivity"
        ],
        correct: 2
    },
    {
        question: "What happens to molecular kinetic energy when temperature increases?",
        options: [
            "Molecules move slower and have less kinetic energy", 
            "Molecules move faster and have more kinetic energy", 
            "Molecular movement stays the same", 
            "Molecules stop moving at high temperatures"
        ],
        correct: 1
    },
    {
        question: "Which example shows heat energy converting to mechanical energy?",
        options: [
            "A refrigerator cooling food using electricity", 
            "A steam engine using heated water vapor to move pistons", 
            "An electric heater warming a room", 
            "Solar panels converting sunlight to electricity"
        ],
        correct: 1
    },
    {
        question: "Why do metals feel colder than wood at room temperature?",
        options: [
            "Metals are actually at a lower temperature", 
            "Metals have higher thermal conductivity and transfer heat away faster", 
            "Wood generates its own heat", 
            "Your skin can't detect metal temperatures accurately"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

function showQuestion() {
    const q = questions[currentQuestion];
    const progressFill = document.getElementById('progressFill');
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = progress + '%';
    
    document.getElementById('question').textContent = q.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = option;
        div.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(div);
    });
    
    selectedAnswer = null;
    document.getElementById('checkBtn').disabled = true;
    document.getElementById('checkBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
    selectedAnswer = index;
    document.getElementById('checkBtn').disabled = false;
}

function checkAnswer() {
    if (selectedAnswer === null) return;
    
    const q = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    const feedback = document.getElementById('feedback');
    
    document.getElementById('checkBtn').disabled = true;
    
    if (selectedAnswer === q.correct) {
        options[selectedAnswer].classList.add('correct');
        feedback.textContent = "🎯 Excellent! That's the correct scientific answer!";
        feedback.className = 'feedback correct';
        score++;
        document.getElementById('mascot').textContent = '🌡️✅';
    } else {
        options[selectedAnswer].classList.add('incorrect');
        options[q.correct].classList.add('correct');
        feedback.textContent = "❌ Not quite. Study the correct answer above!";
        feedback.className = 'feedback incorrect';
        document.getElementById('mascot').textContent = '🌡️❓';
    }
    
    if (currentQuestion === questions.length - 1) {
        setTimeout(showCompletion, 2000);
    } else {
        document.getElementById('nextBtn').style.display = 'inline-block';
    }
}

function nextQuestion() {
    currentQuestion++;
    document.getElementById('mascot').textContent = '🌡️';
    showQuestion();
}

function showCompletion() {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;
    
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'quizComplete',
            passed: passed,
            score: score,
            total: questions.length,
            percentage: percentage
        }, '*');
    }
    
    let gradeMessage = '';
    if (percentage >= 90) gradeMessage = '🎓 Scientific Mastery Achieved!';
    else if (percentage >= 70) gradeMessage = '🔬 Advanced Understanding Demonstrated!';
    else if (percentage >= 50) gradeMessage = '📚 Good Foundation - Keep Studying!';
    else gradeMessage = '💪 This is Challenging - Review and Try Again!';
    
    document.querySelector('.quiz-container').innerHTML = \`
        <div class="completion">🎯 Advanced Challenge Complete! 🎯</div>
        <div class="score-display">
            Final Score: \${score}/\${questions.length} (\${percentage.toFixed(0)}%)
        </div>
        <div style="font-size: 1.3em; color: \${passed ? '#00FF00' : '#FFD700'}; margin: 20px 0; padding: 15px; border-radius: 8px; background: rgba(0,0,0,0.5);">
            \${gradeMessage}
        </div>
        <button onclick="location.reload()" style="background: #FF4500; color: white; border: none; border-radius: 8px; padding: 15px 30px; font-size: 1.2em; cursor: pointer; font-weight: bold;">
            Retry Challenge 🚀
        </button>
    \`;
}

showQuestion();
</script>
</body>
</html>`
}],
    
    
    "basic electrical systems": [
      {
        theme: "default",
        prompt: "Implement an interactive, Duolingo-style educational quiz for grade school students focused on basic electrical systems. The quiz should be self-contained within a single HTML file, using only JavaScript, HTML, and CSS. The visual design should be bright and engaging, using a color scheme of `#FFD700` (gold), `#FF6347` (tomato), `#4682B4` (steel blue), and `#90EE90` (light green) to represent different electrical components and states.",
        completion: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Electrical Systems Quiz</title>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: "Comic Sans MS", cursive, sans-serif;
            background: #F0F8FF;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }
        .quiz-container {
            width: 90%;
            max-width: 500px;
            background: #fff;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            text-align: center;
        }
        .question {
            font-size: 1.4em;
            margin-bottom: 25px;
            color: #4682B4;
        }
        .options {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 25px;
        }
        .option {
            background: #FFD700;
            border: none;
            border-radius: 12px;
            padding: 15px;
            font-size: 1.1em;
            cursor: pointer;
            transition: background 0.3s, transform 0.2s;
        }
        .option:hover {
            background: #FFE44D;
            transform: scale(1.02);
        }
        .option.selected {
            background: #4682B4;
            color: #fff;
        }
        .option.correct {
            background: #90EE90;
        }
        .option.incorrect {
            background: #FF6347;
        }
        .feedback {
            margin: 15px 0;
            font-size: 1.2em;
            font-weight: bold;
            min-height: 1.5em;
        }
        .feedback.correct {
            color: #2E8B57;
        }
        .feedback.incorrect {
            color: #B22222;
        }
        .action-btn {
            background: #4682B4;
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 15px 30px;
            font-size: 1.2em;
            cursor: pointer;
            transition: background 0.3s;
        }
        .action-btn:disabled {
            background: #B0C4DE;
            cursor: not-allowed;
        }
        .action-btn:hover:not(:disabled) {
            background: #5F9EA0;
        }
        .quiz-complete {
            font-size: 1.8em;
            color: #4682B4;
            margin-top: 20px;
        }
    </style>
</head>
<body>
<div class="quiz-container">
<div class="question" id="question"></div>
<div class="options" id="options"></div>
<div class="feedback" id="feedback"></div>
<button class="action-btn" disabled="" id="actionBtn">Check</button>
</div>
<script>const quizData = [
    {
        question: "What do we call the path that electricity flows through?",
        options: ["A) River", "B) Circuit", "C) Road", "D) Wire"],
        correct: 1
    },
    {
        question: "Which of these is a good conductor of electricity?",
        options: ["A) Rubber", "B) Wood", "C) Copper", "D) Plastic"],
        correct: 2
    },
    {
        question: "What makes a light bulb glow?",
        options: ["A) Water", "B) Heat", "C) Electricity", "D) Air"],
        correct: 2
    },
    {
        question: "What is used to turn an electrical device on or off?",
        options: ["A) Button", "B) Switch", "C) Knob", "D) Lever"],
        correct: 1
    },
    {
        question: "Which of these is NOT safe to put into an electrical outlet?",
        options: ["A) A plug", "B) A fork", "C) A charger", "D) A lamp cord"],
        correct: 1
    }
];

let currentQuestion = 0;
let selectedOption = null;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const actionBtn = document.getElementById('actionBtn');

function loadQuestion() {
    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    selectedOption = null;
    actionBtn.textContent = 'Check';
    actionBtn.disabled = true;

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.addEventListener('click', () => selectOption(btn, index));
        optionsEl.appendChild(btn);
    });
}

function selectOption(btn, index) {
    document.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedOption = index;
    actionBtn.disabled = false;
}

function checkAnswer() {
    const q = quizData[currentQuestion];
    const options = document.querySelectorAll('.option');
    if (selectedOption === q.correct) {
        options[selectedOption].classList.add('correct');
        feedbackEl.textContent = 'Correct! Great job!';
        feedbackEl.className = 'feedback correct';
        actionBtn.textContent = 'Next';
    } else {
        options[selectedOption].classList.add('incorrect');
        options[q.correct].classList.add('correct');
        feedbackEl.textContent = 'Oops! Try again.';
        feedbackEl.className = 'feedback incorrect';
    }
    actionBtn.disabled = false;
    document.querySelectorAll('.option').forEach(b => b.style.pointerEvents = 'none');
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        questionEl.textContent = '';
        optionsEl.innerHTML = '';
        feedbackEl.textContent = '';
        actionBtn.style.display = 'none';
        const complete = document.createElement('div');
        complete.className = 'quiz-complete';
        complete.textContent = 'Quiz Complete!';
        document.querySelector('.quiz-container').appendChild(complete);
    }
}

actionBtn.addEventListener('click', () => {
    if (actionBtn.textContent === 'Check') {
        checkAnswer();
    } else {
        nextQuestion();
    }
});

loadQuestion();</script></body>
</html>`
      },
      {
        theme: "pastel",
        prompt: "Implement an interactive, Duolingo-style educational quiz for grade school students focused on basic electrical systems. The quiz should be self-contained within a single HTML file, using only JavaScript, HTML, and CSS. The visual design should be soft and pastel, using a color scheme of gentle pastels.",
        completion: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Electrical Systems Quiz - Pastel Theme</title>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: "Arial", sans-serif;
            background: linear-gradient(135deg, #F8E8F8 0%, #E8F4FD 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #555;
        }
        .quiz-container {
            width: 90%;
            max-width: 500px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 25px;
            padding: 35px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            border: 2px solid #E6E6FA;
        }
        .question {
            font-size: 1.3em;
            margin-bottom: 25px;
            color: #8A2BE2;
            font-weight: 300;
        }
        .options {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 25px;
        }
        .option {
            background: #FFE4E1;
            border: 2px solid #DDA0DD;
            border-radius: 15px;
            padding: 18px;
            font-size: 1.1em;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #696969;
        }
        .option:hover {
            background: #FFF0F5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(221, 160, 221, 0.3);
        }
        .option.selected {
            background: #DDA0DD;
            color: #fff;
            border-color: #BA55D3;
        }
        .option.correct {
            background: #98FB98;
            border-color: #90EE90;
            color: #2E8B57;
        }
        .option.incorrect {
            background: #FFB6C1;
            border-color: #FF69B4;
            color: #8B1538;
        }
        .feedback {
            margin: 15px 0;
            font-size: 1.2em;
            font-weight: 300;
            min-height: 1.5em;
        }
        .feedback.correct {
            color: #32CD32;
        }
        .feedback.incorrect {
            color: #FF1493;
        }
        .action-btn {
            background: linear-gradient(45deg, #DDA0DD, #DA70D6);
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 15px 35px;
            font-size: 1.1em;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(221, 160, 221, 0.3);
        }
        .action-btn:disabled {
            background: #E6E6FA;
            color: #C0C0C0;
            cursor: not-allowed;
            box-shadow: none;
        }
        .action-btn:hover:not(:disabled) {
            background: linear-gradient(45deg, #DA70D6, #FF69B4);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(221, 160, 221, 0.4);
        }
        .quiz-complete {
            font-size: 1.6em;
            color: #8A2BE2;
            margin-top: 20px;
            font-weight: 300;
        }
    </style>
</head>
<body>
<div class="quiz-container">
<div class="question" id="question"></div>
<div class="options" id="options"></div>
<div class="feedback" id="feedback"></div>
<button class="action-btn" disabled="" id="actionBtn">Check</button>
</div>
<script>const quizData = [
    {
        question: "What do we call the path that electricity flows through?",
        options: ["A) River", "B) Circuit", "C) Road", "D) Wire"],
        correct: 1
    },
    {
        question: "Which of these is a good conductor of electricity?",
        options: ["A) Rubber", "B) Wood", "C) Copper", "D) Plastic"],
        correct: 2
    },
    {
        question: "What makes a light bulb glow?",
        options: ["A) Water", "B) Heat", "C) Electricity", "D) Air"],
        correct: 2
    },
    {
        question: "What is used to turn an electrical device on or off?",
        options: ["A) Button", "B) Switch", "C) Knob", "D) Lever"],
        correct: 1
    },
    {
        question: "Which of these is NOT safe to put into an electrical outlet?",
        options: ["A) A plug", "B) A fork", "C) A charger", "D) A lamp cord"],
        correct: 1
    }
];

let currentQuestion = 0;
let selectedOption = null;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const actionBtn = document.getElementById('actionBtn');

function loadQuestion() {
    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    selectedOption = null;
    actionBtn.textContent = 'Check';
    actionBtn.disabled = true;

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.addEventListener('click', () => selectOption(btn, index));
        optionsEl.appendChild(btn);
    });
}

function selectOption(btn, index) {
    document.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedOption = index;
    actionBtn.disabled = false;
}

function checkAnswer() {
    const q = quizData[currentQuestion];
    const options = document.querySelectorAll('.option');
    if (selectedOption === q.correct) {
        options[selectedOption].classList.add('correct');
        feedbackEl.textContent = 'Wonderful! You got it right!';
        feedbackEl.className = 'feedback correct';
        actionBtn.textContent = 'Next';
    } else {
        options[selectedOption].classList.add('incorrect');
        options[q.correct].classList.add('correct');
        feedbackEl.textContent = 'Not quite, but keep trying!';
        feedbackEl.className = 'feedback incorrect';
    }
    actionBtn.disabled = false;
    document.querySelectorAll('.option').forEach(b => b.style.pointerEvents = 'none');
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        questionEl.textContent = '';
        optionsEl.innerHTML = '';
        feedbackEl.textContent = '';
        actionBtn.style.display = 'none';
        const complete = document.createElement('div');
        complete.className = 'quiz-complete';
        complete.textContent = 'Quiz Complete! You did beautifully!';
        document.querySelector('.quiz-container').appendChild(complete);
    }
}

actionBtn.addEventListener('click', () => {
    if (actionBtn.textContent === 'Check') {
        checkAnswer();
    } else {
        nextQuestion();
    }
});

loadQuestion();</script></body>
</html>`
      }
    ],
    
    "light energy": [{theme:"default",
    prompt: "Implement an interactive, Duolingo-style educational quiz for grade school students focused on light energy. The quiz should be self-contained within a single HTML file, using only JavaScript, HTML, and CSS. The visual design should be bright and engaging, using a color scheme of `#FFD700` (gold), `#FF6347` (tomato), `#4682B4` (steel blue), and `#90EE90` (light green) to represent different states.\n\nFeatures:\n- The quiz will present one question at a time, centered on the screen. Each question will have a clear, concise statement about forces.\n- Below each question, a set of multiple-choice answer options will be displayed as distinct, clickable buttons. There will always be four options.\n- A prominent 'Check' button will be present below the answer options. This button will initially be disabled until an answer is selected.\n- Upon clicking 'Check', immediate visual feedback will be provided. If the answer is correct, the selected answer button will turn `#90EE90` (light green), and a positive feedback message (e.g., 'Correct! Great job!') will appear. If incorrect, the selected answer button will turn `#FF6347` (tomato), and a negative feedback message (e.g., 'Oops! Try again.') will appear. The correct answer button will also be highlighted in `#90EE90` (light green) if the user chose incorrectly.\n- After a correct answer is submitted, the 'Check' button will be replaced by a 'Next' button, allowing the user to proceed to the next question.\n- The quiz will consist of the following questions, answers, and correct options:\n    1. Question: What is light?\n       Options: A) A type of sound, B) A form of energy, C) A kind of food, D) A heavy object\n       Correct: B) A form of energy\n    2. Question: Which of these is a natural source of light?\n       Options: A) A flashlight, B) A light bulb, C) The Sun, D) A candle\n       Correct: C) The Sun\n    3. Question: What do we use light for?\n       Options: A) To hear sounds, B) To feel warmth, C) To see things, D) To smell flowers\n       Correct: C) To see things\n    4. Question: Which color of light is part of a rainbow?\n       Options: A) Black, B) Brown, C) Red, D) Gray\n       Correct: C) Red\n    5. Question: Can light travel through solid objects like a brick wall?\n       Options: A) Yes, always, B) No, usually not, C) Only if the wall is thin, D) Only at night\n       Correct: A) Yes, always\n- The quiz should maintain a consistent layout and styling throughout.\n- The background of the entire page should be a soft, inviting color, such as `#F0F8FF` (AliceBlue).\n\nUser Actions:\n- **Select Answer:** The user can click on any of the four answer option buttons. Clicking an option will highlight it (e.g., with a border or a slight background change to `#4682B4` (steel blue)) and enable the 'Check' button.\n- **Check Answer:** After selecting an answer, the user can click the 'Check' button. This action will evaluate the selected answer, provide visual feedback, and update the UI accordingly (e.g., replacing 'Check' with 'Next' on correct answers).\n- **Next Question:** After a correct answer has been submitted and the 'Next' button appears, the user can click it to advance to the subsequent question. If it's the last question, a 'Quiz Complete!' message should be displayed instead of a new question.\nNote:\n- Your output should be implemented in JavaScript with HTML and CSS.\n- Ensure that the output has both index.js and index.html files",
    completion: `<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Light Energy Explorer!</title>
<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Comic Sans MS', cursive, sans-serif;
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #ADD8E6 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .quiz-container {
            background: #FFFFFF;
            border-radius: 25px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 40px;
            max-width: 600px;
            width: 100%;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .quiz-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
            animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        h1 {
            color: #FFA500;
            font-size: 2.5em;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 1;
        }

        .question {
            font-size: 1.5em;
            color: #333;
            margin-bottom: 30px;
            line-height: 1.4;
            position: relative;
            z-index: 1;
        }

        .options {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
        }

        .option {
            background: #FFF8DC;
            border: 3px solid #FFD700;
            border-radius: 15px;
            padding: 20px;
            font-size: 1.2em;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .option:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }

        .option.selected {
            border-color: #FFA500;
            background: #FFFACD;
            transform: scale(1.02);
        }

        .option.correct {
            background: #90EE90;
            border-color: #228B22;
            animation: pulse 0.5s ease-in-out;
        }

        .option.incorrect {
            background: #FF6347;
            border-color: #DC143C;
            animation: shake 0.5s ease-in-out;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .feedback {
            font-size: 1.3em;
            margin: 20px 0;
            padding: 15px;
            border-radius: 10px;
            position: relative;
            z-index: 1;
        }

        .feedback.correct {
            background: #90EE90;
            color: #006400;
        }

        .feedback.incorrect {
            background: #FF6347;
            color: #8B0000;
        }

        .buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            position: relative;
            z-index: 1;
        }

        button {
            background: #FFA500;
            color: white;
            border: none;
            border-radius: 25px;
            padding: 15px 30px;
            font-size: 1.2em;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
        }

        button:hover:not(:disabled) {
            background: #FF8C00;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 165, 0, 0.4);
        }

        button:disabled {
            background: #D3D3D3;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .celebration {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        }

        .star {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #FFD700;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            animation: fall 3s linear forwards;
        }

        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }

        .progress-bar {
            width: 100%;
            height: 10px;
            background: #E0E0E0;
            border-radius: 5px;
            margin-bottom: 20px;
            overflow: hidden;
            position: relative;
            z-index: 1;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #FFD700, #FFA500);
            border-radius: 5px;
            transition: width 0.5s ease;
        }

        @media (max-width: 600px) {
            .quiz-container {
                padding: 20px;
                margin: 10px;
            }
            
            h1 {
                font-size: 2em;
            }
            
            .question {
                font-size: 1.3em;
            }
            
            .option {
                font-size: 1.1em;
                padding: 15px;
            }
        }
    </style>
</head>
<body>
<div class="quiz-container">
<h1>Light Energy Explorer!</h1>
<div class="progress-bar">
<div class="progress-fill" id="progress"></div>
</div>
<div id="quiz-content">
<div class="question" id="question"></div>
<div class="options" id="options"></div>
<div class="feedback" id="feedback" style="display: none;"></div>
<div class="buttons">
<button id="check-btn" onclick="checkAnswer()">Check Answer</button>
<button id="next-btn" onclick="nextQuestion()" style="display: none;">Next Question</button>
</div>
</div>
<div class="celebration" id="celebration"></div>
</div>
<script src="index.js"></script>
<script>const questions = [
    {
        question: "What is light?",
        options: ["A. A type of sound", "B. A form of energy", "C. A kind of food", "D. A heavy object"],
        correct: 1
    },
    {
        question: "Which of these is a natural source of light?",
        options: ["A. A flashlight", "B. A light bulb", "C. The Sun", "D. A candle"],
        correct: 2
    },
    {
        question: "What do we use light for?",
        options: ["A. To hear sounds", "B. To feel warmth", "C. To see things", "D. To smell flowers"],
        correct: 2
    },
    {
        question: "Which color of light is part of a rainbow?",
        options: ["A. Black", "B. Brown", "C. Red", "D. Gray"],
        correct: 2
    },
    {
        question: "Can light travel through solid objects like a brick wall?",
        options: ["A. Yes, always", "B. No, usually not", "C. Only if the wall is thin", "D. Only at night"],
        correct: 1
    }
];

let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;

function loadQuestion() {
    const questionData = questions[currentQuestion];
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const progressElement = document.getElementById('progress');
    
    questionElement.textContent = questionData.question;
    optionsElement.innerHTML = '';
    
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressElement.style.width = progress + '%';
    
    questionData.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectAnswer(index);
        optionsElement.appendChild(optionDiv);
    });
    
    selectedAnswer = null;
    document.getElementById('check-btn').disabled = false;
    document.getElementById('check-btn').style.display = 'inline-block';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('feedback').className = 'feedback';
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    
    options[index].classList.add('selected');
    selectedAnswer = index;
}

function checkAnswer() {
    if (selectedAnswer === null) return;
    
    const questionData = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    const feedback = document.getElementById('feedback');
    
    document.getElementById('check-btn').disabled = true;
    
    if (selectedAnswer === questionData.correct) {
        options[selectedAnswer].classList.add('correct');
        feedback.textContent = "Great job! That's correct!";
        feedback.className = 'feedback correct';
        score++;
    } else {
        options[selectedAnswer].classList.add('incorrect');
        options[questionData.correct].classList.add('correct');
        feedback.textContent = \`Oops! Not quite. The correct answer was \${questionData.options[questionData.correct]}\`;
        feedback.className = 'feedback incorrect';
    }
    
    feedback.style.display = 'block';
    
    if (currentQuestion === questions.length - 1) {
        setTimeout(() => {
            showCompletion();
        }, 1500);
    } else {
        document.getElementById('next-btn').style.display = 'inline-block';
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    }
}

function showCompletion() {
    const quizContent = document.getElementById('quiz-content');
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 60; // 60% passing threshold
    
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'quizComplete',
            passed: passed,
            score: score,
            total: questions.length,
            percentage: percentage
        }, '*');
    }
    
    quizContent.innerHTML = \`
        <div style="font-size: 2em; color: #FFA500; margin-bottom: 20px;">Quiz Complete!</div>
        <div style="font-size: 1.5em; color: #333; margin-bottom: 30px;">
            You scored \${score} out of \${questions.length}! (\${percentage.toFixed(0)}%)
        </div>
        <div style="font-size: 1.2em; color: \${passed ? '#4CAF50' : '#F44336'}; margin-bottom: 20px;">
            \${passed ? '🎉 Congratulations! You passed!' : '💪 Keep practicing! You can do better!'}
        </div>
        <button onclick="restartQuiz()" style="background: #FFD700; color: #333;">Try Again</button>
    \`;
    
    createCelebration();
}

function createCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (Math.random() * 3 + 2) + 's';
            celebration.appendChild(star);
        }, i * 100);
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
    document.getElementById('celebration').innerHTML = '';
}

// Initialize the quiz
loadQuestion();
</script></body>
</html>`
},
{
    theme: "futuristic",
    prompt: "Implement an interactive, Duolingo-style educational quiz for grade school students focused on light energy. The quiz should be self-contained within a single HTML file, using only JavaScript, HTML, and CSS. The visual design should be futuristic, using a color scheme of `#FFD700` (gold), `#FF6347` (tomato), `#4682B4` (steel blue), and `#90EE90` (light green) to represent different states.\n\nFeatures:\n- The quiz will present one question at a time, centered on the screen. Each question will have a clear, concise statement about forces.\n- Below each question, a set of multiple-choice answer options will be displayed as distinct, clickable buttons. There will always be four options.\n- A prominent 'Check' button will be present below the answer options. This button will initially be disabled until an answer is selected.\n- Upon clicking 'Check', immediate visual feedback will be provided. If the answer is correct, the selected answer button will turn `#90EE90` (light green), and a positive feedback message (e.g., 'Correct! Great job!') will appear. If incorrect, the selected answer button will turn `#FF6347` (tomato), and a negative feedback message (e.g., 'Oops! Try again.') will appear. The correct answer button will also be highlighted in `#90EE90` (light green) if the user chose incorrectly.\n- After a correct answer is submitted, the 'Check' button will be replaced by a 'Next' button, allowing the user to proceed to the next question.\n- The quiz will consist of the following questions, answers, and correct options:\n    1. Question: What is light?\n       Options: A) A type of sound, B) A form of energy, C) A kind of food, D) A heavy object\n       Correct: B) A form of energy\n    2. Question: Which of these is a natural source of light?\n       Options: A) A flashlight, B) A light bulb, C) The Sun, D) A candle\n       Correct: C) The Sun\n    3. Question: What do we use light for?\n       Options: A) To hear sounds, B) To feel warmth, C) To see things, D) To smell flowers\n       Correct: C) To see things\n    4. Question: Which color of light is part of a rainbow?\n       Options: A) Black, B) Brown, C) Red, D) Gray\n       Correct: C) Red\n    5. Question: Can light travel through solid objects like a brick wall?\n       Options: A) Yes, always, B) No, usually not, C) Only if the wall is thin, D) Only at night\n       Correct: A) Yes, always\n- The quiz should maintain a consistent layout and styling throughout.\n- The background of the entire page should be a soft, inviting color, such as `#F0F8FF` (AliceBlue).\n\nUser Actions:\n- **Select Answer:** The user can click on any of the four answer option buttons. Clicking an option will highlight it (e.g., with a border or a slight background change to `#4682B4` (steel blue)) and enable the 'Check' button.\n- **Check Answer:** After selecting an answer, the user can click the 'Check' button. This action will evaluate the selected answer, provide visual feedback, and update the UI accordingly (e.g., replacing 'Check' with 'Next' on correct answers).\n- **Next Question:** After a correct answer has been submitted and the 'Next' button appears, the user can click it to advance to the subsequent question. If it's the last question, a 'Quiz Complete!' message should be displayed instead of a new question.\nNote:\n- Your output should be implemented in JavaScript with HTML and CSS.\n- Ensure that the output has both index.js and index.html files",
    completion: `<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Light Energy Explorer!</title>
<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Impact', sans-serif;
            background: linear-gradient(135deg, #8B008B 0%, #4B0082 50%, #191970 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .quiz-container {
            background: #2F4F4F;
            border-radius: 0;
            box-shadow: 0 0 50px rgba(255, 0, 255, 0.5);
            padding: 40px;
            max-width: 600px;
            width: 100%;
            text-align: center;
            position: relative;
            overflow: hidden;
            border: 5px solid #FF00FF;
        }

        h1 {
            color: #00FFFF;
            font-size: 3em;
            margin-bottom: 30px;
            text-shadow: 3px 3px 0 #FF00FF, 6px 6px 0 #8A2BE2;
            letter-spacing: 3px;
        }

        .question {
            font-size: 1.8em;
            color: #00FF00;
            margin-bottom: 30px;
            line-height: 1.2;
            text-transform: uppercase;
        }

        .options {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
        }

        .option {
            background: #800080;
            border: 3px solid #00FFFF;
            border-radius: 0;
            padding: 20px;
            font-size: 1.4em;
            cursor: pointer;
            transition: all 0.1s ease;
            color: #FFFF00;
            text-transform: uppercase;
            position: relative;
            overflow: hidden;
        }

        .option:hover {
            transform: scale(1.05) rotate(-1deg);
            background: #9932CC;
            box-shadow: 0 0 20px #FF00FF;
        }

        .option.selected {
            border-color: #FF1493;
            background: #FF69B4;
            color: #000;
            transform: scale(1.1);
        }

        .option.correct {
            background: #00FF00;
            border-color: #32CD32;
            color: #000;
            animation: flash 0.3s ease-in-out 3;
        }

        .option.incorrect {
            background: #FF0000;
            border-color: #DC143C;
            color: #FFF;
            animation: wobble 0.5s ease-in-out;
        }

        @keyframes flash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        @keyframes wobble {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px) rotate(-5deg); }
            75% { transform: translateX(10px) rotate(5deg); }
        }

        .feedback {
            font-size: 1.5em;
            margin: 20px 0;
            padding: 15px;
            border-radius: 0;
            border: 2px solid;
            text-transform: uppercase;
        }

        .feedback.correct {
            background: #000;
            color: #00FF00;
            border-color: #00FF00;
        }

        .feedback.incorrect {
            background: #000;
            color: #FF0000;
            border-color: #FF0000;
        }

        .buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
        }

        button {
            background: #FF1493;
            color: #FFF;
            border: 3px solid #00FFFF;
            border-radius: 0;
            padding: 15px 30px;
            font-size: 1.4em;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'Impact', sans-serif;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        button:hover:not(:disabled) {
            background: #FF69B4;
            transform: skew(-10deg);
            box-shadow: 0 0 30px #FF00FF;
        }

        button:disabled {
            background: #696969;
            border-color: #A9A9A9;
            cursor: not-allowed;
            opacity: 0.5;
        }

        .celebration {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        }

        .neon {
            position: absolute;
            width: 20px;
            height: 20px;
            background: #00FFFF;
            box-shadow: 0 0 20px #00FFFF, 0 0 40px #00FFFF, 0 0 60px #00FFFF;
            animation: explode 2s ease-out forwards;
        }

        @keyframes explode {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: scale(3) rotate(720deg);
                opacity: 0;
            }
        }

        .progress-bar {
            width: 100%;
            height: 15px;
            background: #000;
            border: 2px solid #FF00FF;
            margin-bottom: 20px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: repeating-linear-gradient(
                90deg,
                #00FFFF,
                #00FFFF 10px,
                #FF00FF 10px,
                #FF00FF 20px
            );
            transition: width 0.3s ease;
        }

        .rage-meter {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 100px;
            height: 20px;
            background: #000;
            border: 2px solid #FF0000;
        }

        .rage-fill {
            height: 100%;
            background: linear-gradient(90deg, #FF0000, #FF4500, #FFD700);
            width: 0%;
            transition: width 0.1s ease;
        }

        @media (max-width: 600px) {
            .quiz-container {
                padding: 20px;
                margin: 10px;
            }
            
            h1 {
                font-size: 2.2em;
            }
            
            .question {
                font-size: 1.5em;
            }
            
            .option {
                font-size: 1.2em;
                padding: 15px;
            }
        }
    </style>
</head>
<body>
<div class="quiz-container">
<div class="rage-meter">
<div class="rage-fill" id="rage"></div>
</div>
<h1>Light Energy Explorer!</h1>
<div class="progress-bar">
<div class="progress-fill" id="progress"></div>
</div>
<div id="quiz-content">
<div class="question" id="question"></div>
<div class="options" id="options"></div>
<div class="feedback" id="feedback" style="display: none;"></div>
<div class="buttons">
<button id="rage-btn" onclick="increaseRage()">RAGE MODE</button>
<button id="check-btn" onclick="checkAnswer()">Check Answer</button>
<button id="next-btn" onclick="nextQuestion()" style="display: none;">Next Question</button>
</div>
</div>
<div class="celebration" id="celebration"></div>
</div>
<script src="index.js"></script>
<script>const questions = [
    {
        question: "What is light?",
        options: ["A. A type of sound", "B. A form of energy", "C. A kind of food", "D. A heavy object"],
        correct: 1
    },
    {
        question: "Which of these is a natural source of light?",
        options: ["A. A flashlight", "B. A light bulb", "C. The Sun", "D. A candle"],
        correct: 2
    },
    {
        question: "What do we use light for?",
        options: ["A. To hear sounds", "B. To feel warmth", "C. To see things", "D. To smell flowers"],
        correct: 2
    },
    {
        question: "Which color of light is part of a rainbow?",
        options: ["A. Black", "B. Brown", "C. Red", "D. Gray"],
        correct: 2
    },
    {
        question: "Can light travel through solid objects like a brick wall?",
        options: ["A. Yes, always", "B. No, usually not", "C. Only if the wall is thin", "D. Only at night"],
        correct: 1
    }
];

let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;
let rageLevel = 0;

function loadQuestion() {
    const questionData = questions[currentQuestion];
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const progressElement = document.getElementById('progress');
    
    questionElement.textContent = questionData.question;
    optionsElement.innerHTML = '';
    
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressElement.style.width = progress + '%';
    
    questionData.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectAnswer(index);
        optionsElement.appendChild(optionDiv);
    });
    
    selectedAnswer = null;
    document.getElementById('check-btn').disabled = false;
    document.getElementById('check-btn').style.display = 'inline-block';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('feedback').className = 'feedback';
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    
    options[index].classList.add('selected');
    selectedAnswer = index;
}

function increaseRage() {
    rageLevel = Math.min(rageLevel + 20, 100);
    const rageFill = document.getElementById('rage');
    rageFill.style.width = rageLevel + '%';
    
    if (rageLevel >= 100) {
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
            rageLevel = 0;
            rageFill.style.width = '0%';
        }, 500);
    }
}

function checkAnswer() {
    if (selectedAnswer === null) return;
    
    const questionData = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    const feedback = document.getElementById('feedback');
    
    document.getElementById('check-btn').disabled = true;
    
    if (selectedAnswer === questionData.correct) {
        options[selectedAnswer].classList.add('correct');
        feedback.textContent = "EXTREME VICTORY!";
        feedback.className = 'feedback correct';
        score++;
    } else {
        options[selectedAnswer].classList.add('incorrect');
        options[questionData.correct].classList.add('correct');
        feedback.textContent = \`TOTAL FAILURE! Correct: \${questionData.options[questionData.correct]}\`;
        feedback.className = 'feedback incorrect';
    }
    
    feedback.style.display = 'block';
    
    if (currentQuestion === questions.length - 1) {
        setTimeout(() => {
            showCompletion();
        }, 1500);
    } else {
        document.getElementById('next-btn').style.display = 'inline-block';
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    }
}

function showCompletion() {
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = \`
        <div style="font-size: 2.5em; color: #00FFFF; margin-bottom: 20px;">DOMINATION COMPLETE!</div>
        <div style="font-size: 2em; color: #FF00FF; margin-bottom: 30px;">
            FINAL SCORE: \${score}/\${questions.length}
        </div>
        <button onclick="restartQuiz()" style="background: #00FFFF; color: #000; border: 3px solid #FF00FF;">RESTART WAR</button>
    \`;
    
    createCelebration();
}

function createCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.innerHTML = '';
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const neon = document.createElement('div');
            neon.className = 'neon';
            neon.style.left = Math.random() * 100 + '%';
            neon.style.top = Math.random() * 100 + '%';
            neon.style.animationDelay = Math.random() * 2 + 's';
            celebration.appendChild(neon);
        }, i * 50);
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    rageLevel = 0;
    document.getElementById('rage').style.width = '0%';
    loadQuestion();
    document.getElementById('celebration').innerHTML = '';
}

loadQuestion();</script></body>
</html>`
},
]
};