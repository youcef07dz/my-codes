const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.querySelector('.current-score');
const speedElement = document.querySelector('.current-speed');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const finalBestElement = document.getElementById('finalBest');

// Audio Context
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'jump':
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'score':
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'crash':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
    }
}

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game constants
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const BASE_SPEED = 6;
const MAX_SPEED = 15;
const MOVE_SPEED = 5;
const MAX_DINO_X = 0.7; // Max position as percentage of screen width

// Game state
let dino = {
    x: 50,
    y: 0,
    width: 40,
    height: 44,
    velocityY: 0,
    velocityX: 0,
    jumping: false,
    ducking: false,
    frame: 0
};

let keys = {
    left: false,
    right: false
};

let obstacles = [];
let clouds = [];
let particles = [];
let score = 0;
let bestScore = localStorage.getItem('dinoBestScore') || 0;
let gameSpeed = BASE_SPEED;
let gameLoop;
let isGameRunning = false;
let frameCount = 0;
let groundY = 0;

function initClouds() {
    clouds = [];
    for (let i = 0; i < 6; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: 50 + Math.random() * 150,
            speed: 0.5 + Math.random() * 0.5,
            size: 20 + Math.random() * 30
        });
    }
}

const mobileControls = document.getElementById('mobileControls');

function startGame() {
    initAudio();
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    startScreen.style.display = 'none';
    
    // Show mobile controls if on touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
        mobileControls.style.display = 'grid';
    }
    isGameRunning = true;
    resetGameState();
    initClouds();
    gameLoop = requestAnimationFrame(gameUpdate);
}

function resetGameState() {
    dino.x = canvas.width * 0.15;
    groundY = canvas.height * 0.75;
    dino.y = groundY - dino.height;
    dino.velocityY = 0;
    dino.velocityX = 0;
    dino.jumping = false;
    keys.left = false;
    keys.right = false;
    obstacles = [];
    particles = [];
    score = 0;
    gameSpeed = BASE_SPEED;
    frameCount = 0;
    scoreElement.textContent = '0';
}

function gameUpdate() {
    if (!isGameRunning) return;
    
    update();
    draw();
    
    gameLoop = requestAnimationFrame(gameUpdate);
}

function update() {
    frameCount++;
    
    // Horizontal movement
    dino.velocityX = 0;
    if (keys.left) {
        dino.velocityX = -MOVE_SPEED;
    }
    if (keys.right) {
        dino.velocityX = MOVE_SPEED;
    }
    
    dino.x += dino.velocityX;
    
    // Keep dino within bounds (can't go off left, can't go past 70% of screen)
    if (dino.x < 0) {
        dino.x = 0;
    }
    if (dino.x > canvas.width * MAX_DINO_X) {
        dino.x = canvas.width * MAX_DINO_X;
    }
    
    // Dino physics
    dino.velocityY += GRAVITY;
    dino.y += dino.velocityY;
    
    // Ground collision
    if (dino.y > groundY - dino.height) {
        dino.y = groundY - dino.height;
        dino.velocityY = 0;
        dino.jumping = false;
    }
    
    // Animation frame
    if (frameCount % 10 === 0 && !dino.jumping) {
        dino.frame = (dino.frame + 1) % 2;
    }
    
    // Progressive difficulty - speed and spawn rate increase with score
    const difficultyMultiplier = Math.floor(score / 50);
    
    // Increase speed more aggressively
    const targetSpeed = Math.min(BASE_SPEED + (score * 0.08), MAX_SPEED);
    if (gameSpeed < targetSpeed && frameCount % 60 === 0) {
        gameSpeed += 0.1;
    }
    
    // Calculate spawn rate - gets faster as score increases
    // Base spawn every 1200 frames, decreases as score goes up
    const baseSpawnRate = 1200;
    const spawnRate = Math.max(300, baseSpawnRate - (score * 8)); // Minimum 300 frames
    
    // Spawn obstacles - chance increases with score
    if (frameCount % Math.floor(spawnRate / (gameSpeed / BASE_SPEED)) === 0) {
        spawnObstacleGroup();
    }
    
    // Random extra spawns at higher scores for more chaos
    if (score > 150 && Math.random() < (score / 5000)) {
        if (frameCount % 40 === 0) {
            spawnSingleObstacle();
        }
    }
    
    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        // Birds can have individual speeds, cacti use gameSpeed
        const moveSpeed = obs.speed || gameSpeed;
        obs.x -= moveSpeed;
        
        // Bird wing animation
        if (obs.type === 'bird' && frameCount % 8 === 0) {
            obs.wingFrame = (obs.wingFrame + 1) % 2;
        }
        
        // Remove off-screen
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            continue;
        }
        
        // Collision detection
        const dinoHitbox = {
            x: dino.x + 5,
            y: dino.y + 5,
            width: dino.width - 10,
            height: dino.height - 10
        };
        
        const obsHitbox = {
            x: obs.x + 3,
            y: obs.y + 3,
            width: obs.width - 6,
            height: obs.height - 6
        };
        
        if (dinoHitbox.x < obsHitbox.x + obsHitbox.width &&
            dinoHitbox.x + dinoHitbox.width > obsHitbox.x &&
            dinoHitbox.y < obsHitbox.y + obsHitbox.height &&
            dinoHitbox.y + dinoHitbox.height > obsHitbox.y) {
            playSound('crash');
            createCrashParticles(dino.x + dino.width/2, dino.y + dino.height/2);
            gameOver();
            return;
        }
        
        // Score
        if (!obs.passed && obs.x + obs.width < dino.x) {
            obs.passed = true;
            score += 1;
            scoreElement.textContent = Math.floor(score);
            
            if (score % 100 === 0) {
                playSound('score');
                createScoreParticles(dino.x, dino.y - 30);
            }
        }
    }
    
    // Update speed display every 10 frames
    if (frameCount % 10 === 0) {
        const speedMultiplier = (gameSpeed / BASE_SPEED).toFixed(1);
        speedElement.textContent = speedMultiplier + 'x';
    }
    
    // Update clouds
    clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.size * 3 < 0) {
            cloud.x = canvas.width + cloud.size;
            cloud.y = 50 + Math.random() * 150;
        }
    });
    
    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].life--;
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].vy += 0.2;
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Spawn obstacle groups - more obstacles as score increases
function spawnObstacleGroup() {
    // Calculate number of obstacles based on score
    let obstacleCount = 1;
    if (score > 300) obstacleCount = Math.floor(Math.random() * 2) + 2; // 2-3 obstacles
    if (score > 600) obstacleCount = Math.floor(Math.random() * 2) + 3; // 3-4 obstacles
    if (score > 1000) obstacleCount = Math.floor(Math.random() * 3) + 3; // 3-5 obstacles
    
    const baseX = canvas.width;
    let currentX = baseX;
    
    for (let i = 0; i < obstacleCount; i++) {
        // Gap between obstacles gets smaller as score increases
        const minGap = Math.max(100, 250 - (score * 0.15));
        const maxGap = Math.max(180, 350 - (score * 0.15));
        const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
        
        // Bird chance increases with score
        const birdChance = Math.min(0.9, 0.3 + (score * 0.001));
        const type = Math.random() < birdChance ? 'bird' : 'cactus';
        
        spawnSingleObstacleAt(currentX, type);
        
        currentX += gap;
    }
}

function spawnSingleObstacle() {
    const birdChance = Math.min(0.85, 0.25 + (score * 0.0008));
    const type = Math.random() < birdChance ? 'bird' : 'cactus';
    spawnSingleObstacleAt(canvas.width, type);
}

function spawnSingleObstacleAt(x, type) {
    if (type === 'cactus') {
        // More cactus variety
        const cactusType = Math.min(4, Math.floor(Math.random() * (3 + Math.floor(score / 200))));
        let width = 20;
        let height = 40;
        
        // Bigger cacti as game progresses
        const sizeMultiplier = 1 + (score * 0.001);
        
        switch(cactusType) {
            case 0: // Small
                width = 20;
                height = 40;
                break;
            case 1: // Medium
                width = 30;
                height = 45;
                break;
            case 2: // Large
                width = 50;
                height = 55;
                break;
            case 3: // Extra large
                width = 65;
                height = 50;
                break;
            case 4: // Wide
                width = 80;
                height = 35;
                break;
        }
        
        // Apply size multiplier but cap it
        width = Math.min(100, width * Math.min(1.5, sizeMultiplier));
        height = Math.min(70, height * Math.min(1.5, sizeMultiplier));
        
        obstacles.push({
            type: 'cactus',
            x: x,
            y: groundY - height,
            width: width,
            height: height,
            passed: false
        });
    } else {
        // Birds with varying heights
        const heightVariation = Math.min(100, 40 + (score * 0.1));
        const minHeight = 40;
        const birdY = groundY - minHeight - Math.random() * heightVariation;
        
        obstacles.push({
            type: 'bird',
            x: x,
            y: birdY,
            width: 34,
            height: 30,
            wingFrame: 0,
            passed: false,
            speed: gameSpeed * (1 + Math.random() * 0.3) // Birds can be faster
        });
    }
}

function draw() {
    // Sky color intensifies based on difficulty
    const difficulty = Math.min(1, score / 1000);
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.75);
    
    // Start blue, transition to orange/red at high difficulty
    const r1 = Math.floor(135 + (255 - 135) * difficulty);
    const g1 = Math.floor(206 + (140 - 206) * difficulty);
    const b1 = Math.floor(235 + (0 - 235) * difficulty);
    
    const r2 = Math.floor(224 + (255 - 224) * difficulty);
    const g2 = Math.floor(246 + (200 - 246) * difficulty);
    const b2 = Math.floor(255 + (150 - 255) * difficulty);
    
    skyGrad.addColorStop(0, `rgb(${r1}, ${g1}, ${b1})`);
    skyGrad.addColorStop(1, `rgb(${r2}, ${g2}, ${b2})`);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.75);
    
    // Ground
    const groundGrad = ctx.createLinearGradient(0, canvas.height * 0.75, 0, canvas.height);
    groundGrad.addColorStop(0, '#f7f7f7');
    groundGrad.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);
    
    // Ground line
    ctx.strokeStyle = '#535353';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.75);
    ctx.lineTo(canvas.width, canvas.height * 0.75);
    ctx.stroke();
    
    // Ground dots
    ctx.fillStyle = '#d0d0d0';
    for (let i = 0; i < canvas.width; i += 20) {
        const offset = (frameCount * gameSpeed) % 20;
        ctx.fillRect(i - offset, canvas.height * 0.75 + 10, 3, 3);
        ctx.fillRect(i + 10 - offset, canvas.height * 0.75 + 25, 3, 3);
    }
    
    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.8, cloud.y - cloud.size * 0.2, cloud.size * 0.9, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 1.5, cloud.y, cloud.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Particles
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
    
    // Obstacles
    obstacles.forEach(obs => {
        if (obs.type === 'cactus') {
            drawCactus(obs);
        } else {
            drawBird(obs);
        }
    });
    
    // Dino
    drawDino();
}

function drawDino() {
    ctx.save();
    ctx.translate(dino.x, dino.y);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(20, dino.height - 5, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Body color
    ctx.fillStyle = '#535353';
    
    // Body
    ctx.fillRect(5, 15, 30, 25);
    
    // Head
    ctx.fillRect(20, 0, 18, 20);
    
    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(30, 5, 4, 4);
    ctx.fillStyle = '#535353';
    ctx.fillRect(32, 6, 2, 2);
    
    // Legs (animated)
    ctx.fillStyle = '#535353';
    if (dino.jumping) {
        // Jump pose
        ctx.fillRect(8, 35, 6, 8);
        ctx.fillRect(25, 35, 6, 8);
    } else {
        // Run animation
        if (dino.frame === 0) {
            ctx.fillRect(8, 35, 6, 9);
            ctx.fillRect(26, 35, 6, 6);
        } else {
            ctx.fillRect(8, 35, 6, 6);
            ctx.fillRect(26, 35, 6, 9);
        }
    }
    
    // Tail
    ctx.fillStyle = '#535353';
    ctx.beginPath();
    ctx.moveTo(5, 25);
    ctx.lineTo(0, 30);
    ctx.lineTo(5, 30);
    ctx.fill();
    
    ctx.restore();
}

function drawCactus(cactus) {
    ctx.fillStyle = '#2e8b57';
    ctx.strokeStyle = '#1a5c3a';
    ctx.lineWidth = 2;
    
    // Main body
    ctx.fillRect(cactus.x + 5, cactus.y, cactus.width - 10, cactus.height);
    ctx.strokeRect(cactus.x + 5, cactus.y, cactus.width - 10, cactus.height);
    
    // Arms based on size
    if (cactus.width > 25) {
        // Left arm
        ctx.fillRect(cactus.x, cactus.y + 15, 10, 8);
        ctx.fillRect(cactus.x, cactus.y + 5, 8, 15);
        ctx.strokeRect(cactus.x, cactus.y + 15, 10, 8);
        ctx.strokeRect(cactus.x, cactus.y + 5, 8, 15);
        
        // Right arm
        ctx.fillRect(cactus.x + cactus.width - 10, cactus.y + 20, 10, 8);
        ctx.fillRect(cactus.x + cactus.width - 8, cactus.y + 10, 8, 15);
        ctx.strokeRect(cactus.x + cactus.width - 10, cactus.y + 20, 10, 8);
        ctx.strokeRect(cactus.x + cactus.width - 8, cactus.y + 10, 8, 15);
    }
}

function drawBird(bird) {
    ctx.fillStyle = '#8B4513';
    ctx.strokeStyle = '#5D3A1A';
    ctx.lineWidth = 2;
    
    // Body
    ctx.beginPath();
    ctx.ellipse(bird.x + 17, bird.y + 15, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Head
    ctx.beginPath();
    ctx.arc(bird.x + 28, bird.y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Beak
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(bird.x + 34, bird.y + 8);
    ctx.lineTo(bird.x + 42, bird.y + 10);
    ctx.lineTo(bird.x + 34, bird.y + 12);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bird.x + 30, bird.y + 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.x + 31, bird.y + 8, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Wings (animated)
    ctx.fillStyle = '#A0522D';
    ctx.strokeStyle = '#5D3A1A';
    
    if (bird.wingFrame === 0) {
        ctx.beginPath();
        ctx.moveTo(bird.x + 10, bird.y + 10);
        ctx.lineTo(bird.x - 5, bird.y + 5);
        ctx.lineTo(bird.x + 5, bird.y + 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(bird.x + 10, bird.y + 18);
        ctx.lineTo(bird.x - 5, bird.y + 22);
        ctx.lineTo(bird.x + 5, bird.y + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

function createScoreParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            size: Math.random() * 4 + 2,
            color: '#FFD700'
        });
    }
}

function createCrashParticles(x, y) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 40,
            size: Math.random() * 6 + 3,
            color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`
        });
    }
}

function jump() {
    if (!isGameRunning) return;
    if (!dino.jumping) {
        dino.velocityY = JUMP_FORCE;
        dino.jumping = true;
        playSound('jump');
        createDustParticles(dino.x + dino.width/2, dino.y + dino.height);
    }
}

function createDustParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: -Math.random() * 3,
            life: 25,
            size: Math.random() * 4 + 2,
            color: 'rgba(200,200,200,0.6)'
        });
    }
}

function gameOver() {
    isGameRunning = false;
    cancelAnimationFrame(gameLoop);
    keys.left = false;
    keys.right = false;
    
    finalScoreElement.textContent = Math.floor(score);
    
    if (score > bestScore) {
        bestScore = Math.floor(score);
        localStorage.setItem('dinoBestScore', bestScore);
    }
    
    finalBestElement.textContent = bestScore;
    
    gameOverScreen.style.display = 'flex';
    mobileControls.style.display = 'none';
}

function resetGame() {
    resetGameState();
    gameOverScreen.style.display = 'none';
    isGameRunning = true;
    gameLoop = requestAnimationFrame(gameUpdate);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        jump();
    }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        keys.left = true;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        keys.right = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.left = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.right = false;
    }
});

// Mobile button controls
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const jumpBtn = document.getElementById('jumpBtn');

function setupMobileControls() {
    // Left button
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys.left = true;
        leftBtn.style.transform = 'scale(0.9)';
    }, {passive: false});
    
    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys.left = false;
        leftBtn.style.transform = 'scale(1)';
    }, {passive: false});
    
    // Right button
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys.right = true;
        rightBtn.style.transform = 'scale(0.9)';
    }, {passive: false});
    
    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys.right = false;
        rightBtn.style.transform = 'scale(1)';
    }, {passive: false});
    
    // Jump button
    jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        jump();
        jumpBtn.style.transform = 'scale(0.9)';
    }, {passive: false});
    
    jumpBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        jumpBtn.style.transform = 'scale(1)';
    }, {passive: false});
}

setupMobileControls();

// Prevent scrolling
document.body.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, {passive: false});

// Fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Initial setup
resizeCanvas();
initClouds();
draw();