const DATA = {
    ar: ['أ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','هـ','و','ي'],
    num: ['١','٢','٣','٤','٥','٦','٧','٨','٩','٠'],
    animals: ['🦁','🐯','🦒','🐘','🦊','🐱','🐶','🐰','🐼','🐸','🦄','🐥','🐝','🐙'],
    objects: ['🚀','🎈','🎁','🚗','🚲','🍎','⚽','🎸','🍦','🍕','⏰','💎','🎨','🌈']
};

let currentLevel = 1, gameTimer, timeLeft, totalTime, flipped = [], matches = 0, moves = 0;
let isPaused = false, lockBoard = false, selectedCat = 'animals';
let coins = parseInt(localStorage.getItem('mem_coins')) || 0;
let unlockedLevel = parseInt(localStorage.getItem('mem_unlocked')) || 1;
let currentTheme = localStorage.getItem('mem_theme') || 'theme-classic';
let ownedThemes = JSON.parse(localStorage.getItem('mem_owned')) || ['classic'];

function updateUI() {
    document.getElementById('total-coins').innerText = coins;
    if(document.getElementById('shop-coins')) document.getElementById('shop-coins').innerText = coins;
    if(document.getElementById('game-coins')) document.getElementById('game-coins').innerText = coins;
}

function nav(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    clearInterval(gameTimer);
    updateUI();
    if(id === 'scr-levels') renderMap();
}

function setCat(cat) { selectedCat = cat; nav('scr-levels'); }

function renderMap() {
    const track = document.getElementById('map-path');
    track.innerHTML = '';
    for(let i = 1; i <= 10; i++) {
        const island = document.createElement('div');
        island.className = `island ${i > unlockedLevel ? 'locked' : ''} ${i === unlockedLevel ? 'current' : ''}`;
        island.innerHTML = i > unlockedLevel ? '🔒' : (i < unlockedLevel ? '✅' : i);
        if(i <= unlockedLevel) island.onclick = () => startGame(i);
        track.appendChild(island);
    }
}

function startGame(lvl) {
    currentLevel = lvl; matches = 0; moves = 0; flipped = []; lockBoard = false;
    nav('scr-game');
    document.getElementById('txt-lvl').innerText = lvl;
    
    let pool = DATA[selectedCat];
    let cardCount = lvl > 5 ? 12 : 8;
    let selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, cardCount/2);
    let deck = [...selected, ...selected].sort(() => 0.5 - Math.random());

    const board = document.getElementById('game-board');
    board.innerHTML = '';
    deck.forEach(s => {
        const c = document.createElement('div');
        c.className = 'card';
        c.dataset.symbol = s;
        c.innerHTML = `<div class="card-face card-back ${currentTheme}">❓</div><div class="card-face card-front">${s}</div>`;
        c.onclick = () => flipCard(c);
        board.appendChild(c);
    });

    totalTime = Math.max(10, 40 - (lvl * 2));
    timeLeft = totalTime;
    runTimer();
}

function runTimer() {
    const bar = document.getElementById('timer-bar');
    gameTimer = setInterval(() => {
        if(!isPaused) {
            timeLeft -= 0.1;
            bar.style.width = (timeLeft/totalTime * 100) + "%";
            if(timeLeft <= 0) { clearInterval(gameTimer); alert("انتهى الوقت!"); startGame(currentLevel); }
        }
    }, 100);
}

function flipCard(card) {
    if(lockBoard || isPaused || card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    flipped.push(card);
    if(flipped.length === 2) {
        lockBoard = true;
        moves++;
        const [c1, c2] = flipped;
        if(c1.dataset.symbol === c2.dataset.symbol) {
            matches += 2; coins += 5; updateUI();
            flipped = []; lockBoard = false;
            if(matches === document.querySelectorAll('.card').length) handleWin();
        } else {
            setTimeout(() => { c1.classList.remove('flipped'); c2.classList.remove('flipped'); flipped = []; lockBoard = false; }, 800);
        }
    }
}

function handleWin() {
    clearInterval(gameTimer);
    if(currentLevel === unlockedLevel) unlockedLevel++;
    save();
    document.getElementById('win-stats').innerText = `جمعت ${matches * 2.5} نجمة إضافية!`;
    setTimeout(() => nav('scr-win'), 500);
}

function buyTheme(t, cost) {
    if(ownedThemes.includes(t)) { currentTheme = `theme-${t}`; save(); alert("تم التفعيل!"); }
    else if(coins >= cost) { coins -= cost; ownedThemes.push(t); currentTheme = `theme-${t}`; save(); alert("تم الشراء!"); }
    else { alert("تحتاج نجوم أكثر!"); }
    updateUI();
}

function save() {
    localStorage.setItem('mem_coins', coins);
    localStorage.setItem('mem_unlocked', unlockedLevel);
    localStorage.setItem('mem_theme', currentTheme);
    localStorage.setItem('mem_owned', JSON.stringify(ownedThemes));
}

function pauseGame() { isPaused = true; document.getElementById('pause-overlay').classList.add('active'); }
function resumeGame() { isPaused = false; document.getElementById('pause-overlay').classList.remove('active'); }
function resetProgress() { if(confirm("بدء مغامرة جديدة؟")) { localStorage.clear(); location.reload(); } }
updateUI();