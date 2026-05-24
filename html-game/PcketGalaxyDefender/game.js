const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const ui = {
  wave: document.querySelector("#wave"),
  score: document.querySelector("#score"),
  scrap: document.querySelector("#scrap"),
  hull: document.querySelector("#hull"),
  overlay: document.querySelector("#overlay"),
  action: document.querySelector("#primaryAction"),
  upgrades: document.querySelector("#upgrades"),
  soundToggle: document.querySelector("#soundToggle"),
  shipCards: document.querySelectorAll(".ship-card"),
};

const SHIPS = {
  rapid: {
    name: "Needlewing",
    speed: 340,
    fireDelay: 0.14,
    damage: 1,
    color: "#7ef29a",
    accent: "#ffd166",
  },
  dash: {
    name: "Comet Viper",
    speed: 540,
    fireDelay: 0.3,
    damage: 1,
    color: "#68d8ff",
    accent: "#f3f7f1",
  },
  heavy: {
    name: "Titan Moth",
    speed: 315,
    fireDelay: 0.34,
    damage: 2,
    color: "#ff7468",
    accent: "#d875ff",
  },
};

const state = {
  running: false,
  choosingUpgrade: false,
  over: false,
  wave: 1,
  score: 0,
  scrap: 0,
  time: 0,
  nextShot: 0,
  nextSpawn: 0,
  bossPending: false,
  bossQueue: 0,
  bossCount: 0,
  enemiesLeft: 0,
  keys: new Set(),
  pointer: null,
  selectedShip: "rapid",
  stars: [],
  bullets: [],
  enemyShots: [],
  enemies: [],
  particles: [],
  pickups: [],
  player: {
    x: 150,
    y: 270,
    r: 18,
    hull: 100,
    maxHull: 100,
    speed: 430,
    fireDelay: 0.22,
    baseDamage: 1,
    color: "#7ef29a",
    accent: "#ffd166",
    spread: 0,
    rapidLevel: 0,
    shieldLevel: 0,
    addons: {
      lances: 0,
      pods: 0,
      drones: 0,
    },
    invuln: 0,
  },
  perf: {
    avgDt: 0.016,
    simpleBullets: false,
  },
  audio: {
    enabled: true,
    unlocked: false,
    ctx: null,
    master: null,
    lastShoot: 0,
  },
};

function unlockAudio() {
  if (!state.audio.enabled) return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  if (!state.audio.ctx) {
    state.audio.ctx = new AudioCtor();
    state.audio.master = state.audio.ctx.createGain();
    state.audio.master.gain.value = 0.12;
    state.audio.master.connect(state.audio.ctx.destination);
  }
  if (state.audio.ctx.state === "suspended") state.audio.ctx.resume();
  state.audio.unlocked = true;
}

function playTone({ type = "sine", freq = 440, endFreq = freq, duration = 0.12, gain = 0.2, slide = true }) {
  const audio = state.audio;
  if (!audio.enabled || !audio.unlocked || !audio.ctx || !audio.master) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const amp = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(24, endFreq), now + duration);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp);
  amp.connect(audio.master);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

function playNoise(duration = 0.18, gain = 0.22, filterFreq = 700) {
  const audio = state.audio;
  if (!audio.enabled || !audio.unlocked || !audio.ctx || !audio.master) return;
  const now = audio.ctx.currentTime;
  const size = Math.max(1, Math.floor(audio.ctx.sampleRate * duration));
  const buffer = audio.ctx.createBuffer(1, size, audio.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / size);
  const source = audio.ctx.createBufferSource();
  const filter = audio.ctx.createBiquadFilter();
  const amp = audio.ctx.createGain();
  source.buffer = buffer;
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(filterFreq, now);
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter);
  filter.connect(amp);
  amp.connect(audio.master);
  source.start(now);
}

function sound(name) {
  if (name === "shoot") {
    const now = performance.now();
    if (now - state.audio.lastShoot < 45) return;
    state.audio.lastShoot = now;
    playTone({ type: "square", freq: 620, endFreq: 920, duration: 0.055, gain: 0.05 });
  }
  if (name === "hit") playTone({ type: "triangle", freq: 260, endFreq: 130, duration: 0.08, gain: 0.08 });
  if (name === "pickup") playTone({ type: "sine", freq: 720, endFreq: 1180, duration: 0.12, gain: 0.09 });
  if (name === "hurt") playTone({ type: "sawtooth", freq: 180, endFreq: 70, duration: 0.18, gain: 0.13 });
  if (name === "upgrade") {
    playTone({ type: "sine", freq: 520, endFreq: 780, duration: 0.13, gain: 0.1 });
    setTimeout(() => playTone({ type: "sine", freq: 780, endFreq: 1120, duration: 0.16, gain: 0.08 }), 80);
  }
  if (name === "boss") {
    playTone({ type: "sawtooth", freq: 90, endFreq: 48, duration: 0.45, gain: 0.14 });
    playNoise(0.22, 0.12, 360);
  }
  if (name === "boom") {
    playTone({ type: "triangle", freq: 120, endFreq: 45, duration: 0.22, gain: 0.13 });
    playNoise(0.24, 0.18, 540);
  }
}

function fitCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function world() {
  return canvas.getBoundingClientRect();
}

function resetGame() {
  unlockAudio();
  const ship = SHIPS[state.selectedShip];
  Object.assign(state, {
    running: true,
    choosingUpgrade: false,
    over: false,
    wave: 1,
    score: 0,
    scrap: 0,
    time: 0,
    nextShot: 0,
    nextSpawn: 0.4,
    bossPending: true,
    bossQueue: 1,
    bossCount: 0,
    enemiesLeft: 9,
    bullets: [],
    enemyShots: [],
    enemies: [],
    particles: [],
    pickups: [],
  });
  Object.assign(state.player, {
    x: 150,
    y: world().height / 2,
    hull: 100,
    maxHull: 100,
    speed: ship.speed,
    fireDelay: ship.fireDelay,
    baseDamage: ship.damage,
    color: ship.color,
    accent: ship.accent,
    spread: 0,
    rapidLevel: 0,
    shieldLevel: 0,
    addons: {
      lances: 0,
      pods: 0,
      drones: 0,
    },
    invuln: 1.2,
  });
  state.perf.avgDt = 0.016;
  state.perf.simpleBullets = false;
  ui.overlay.hidden = true;
  ui.upgrades.hidden = true;
  refreshUi();
}

function makeStars() {
  const rect = world();
  state.stars = Array.from({ length: 130 }, () => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    s: 0.7 + Math.random() * 2.1,
    v: 35 + Math.random() * 145,
    color: Math.random() > 0.65 ? "#68d8ff" : "#f3f7f1",
  }));
}

function spawnEnemy() {
  const rect = world();
  const roll = Math.random();
  let type = "skimmer";
  if (state.wave >= 4 && roll > 0.72) type = "dart";
  if (state.wave >= 7 && roll > 0.82) type = "carrier";
  if (state.wave >= 10 && roll > 0.9) type = "wraith";
  if (roll < Math.min(0.15 + state.wave * 0.025, 0.38)) type = "brute";
  const stats = enemyStats(type);
  state.enemies.push({
    type,
    x: rect.width + 40,
    y: 50 + Math.random() * (rect.height - 100),
    r: stats.r,
    hp: stats.hp,
    speed: stats.speed,
    phase: Math.random() * 10,
    value: stats.value,
    shotTimer: stats.shotTimer,
  });
  state.enemiesLeft -= 1;
}

function spawnBoss() {
  const rect = world();
  state.bossCount += 1;
  state.bossQueue = Math.max(0, state.bossQueue - 1);
  state.bossPending = state.bossQueue > 0;
  const fusion = bossFusionLevel();
  const form = (state.bossCount + fusion) % 6;
  const maxHp = Math.floor((28 + state.wave * 13 + state.bossCount * 9) * (1 + fusion * 0.68));
  state.enemies.push({
    type: "boss",
    form,
    fusion,
    x: rect.width + 95,
    y: rect.height * (0.35 + Math.random() * 0.3),
    r: 52 + state.wave * 1.7 + fusion * 18,
    hp: maxHp,
    maxHp,
    speed: 56 + state.wave * 3,
    phase: Math.random() * 10,
    value: 450 + state.wave * 120 + fusion * 380,
    shotTimer: Math.max(0.55, 1.2 - fusion * 0.18),
  });
  sound("boss");
}

function enemyStats(type) {
  const wave = state.wave;
  const table = {
    skimmer: { r: 16, hp: 2 + Math.floor(wave / 3), speed: 160 + wave * 13, value: 45, shotTimer: 0 },
    brute: { r: 24, hp: 4 + Math.floor(wave / 2), speed: 95 + wave * 9, value: 90, shotTimer: 0 },
    dart: { r: 13, hp: 2 + Math.floor(wave / 4), speed: 245 + wave * 15, value: 70, shotTimer: 0 },
    carrier: { r: 21, hp: 5 + Math.floor(wave / 2), speed: 120 + wave * 7, value: 120, shotTimer: 1.7 },
    wraith: { r: 18, hp: 4 + Math.floor(wave / 2), speed: 185 + wave * 10, value: 150, shotTimer: 1.25 },
  };
  return table[type] || table.skimmer;
}

function bossFusionLevel() {
  if (state.wave % 15 === 0) return 3;
  if (state.wave % 10 === 0) return 2;
  if (state.wave % 5 === 0) return 1;
  return 0;
}

function bossesForWave() {
  const fusion = bossFusionLevel();
  if (fusion === 3) return 3;
  if (fusion === 2) return 2;
  return 1;
}

function shoot() {
  const p = state.player;
  sound("shoot");
  const angles = [0];
  if (p.spread >= 1) angles.push(-0.16, 0.16);
  if (p.spread >= 2) angles.push(-0.32, 0.32);
  for (const angle of angles) {
    state.bullets.push({
      x: p.x + 24,
      y: p.y,
      vx: 650,
      vy: Math.sin(angle) * 380,
      r: 4,
      life: 1.1,
      damage: p.baseDamage,
      kind: "bolt",
    });
  }
  for (let i = 0; i < p.addons.lances; i += 1) {
    state.bullets.push({
      x: p.x + 28,
      y: p.y + (i % 2 === 0 ? -13 : 13),
      vx: 760,
      vy: 0,
      r: 5,
      life: 0.9,
      damage: p.baseDamage + 1,
      kind: "lance",
    });
  }
  for (let i = 0; i < p.addons.pods; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    state.bullets.push({
      x: p.x + 12,
      y: p.y + side * 25,
      vx: 560,
      vy: side * 115,
      r: 3,
      life: 1.2,
      damage: p.baseDamage,
      kind: "pod",
    });
  }
}

function burst(x, y, color, count = 12) {
  if (state.perf.simpleBullets) count = Math.ceil(count * 0.45);
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const v = 40 + Math.random() * 210;
    state.particles.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      life: 0.35 + Math.random() * 0.35,
      color,
    });
  }
}

function dropScrap(x, y) {
  if (Math.random() < 0.78) {
    state.pickups.push({ x, y, r: 8, vx: -120, value: 1 + Math.floor(Math.random() * 3) });
  }
}

function update(dt) {
  if (!state.running || state.choosingUpgrade) return;
  const rect = world();
  state.time += dt;
  state.player.invuln = Math.max(0, state.player.invuln - dt);

  for (const star of state.stars) {
    star.x -= star.v * dt;
    if (star.x < -8) {
      star.x = rect.width + 8;
      star.y = Math.random() * rect.height;
    }
  }

  movePlayer(dt, rect);

  state.nextShot -= dt;
  if (state.nextShot <= 0) {
    shoot();
    state.nextShot = state.player.fireDelay;
  }

  state.nextSpawn -= dt;
  if (state.enemiesLeft > 0 && state.nextSpawn <= 0) {
    spawnEnemy();
    state.nextSpawn = Math.max(0.42, 1.05 - state.wave * 0.055);
  }

  for (const bullet of state.bullets) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;
  }

  for (const shot of state.enemyShots) {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
  }

  for (const enemy of state.enemies) {
    enemy.phase += dt * (enemy.type === "boss" ? 1.7 : 3);
    if (enemy.type === "boss") {
      const anchor = rect.width - enemy.r - 70;
      enemy.x += (anchor - enemy.x) * Math.min(1, dt * 1.5);
      enemy.y += Math.sin(enemy.phase) * (34 + state.wave * 1.5) * dt;
      enemy.y = clamp(enemy.y, enemy.r + 24, rect.height - enemy.r - 24);
      enemy.shotTimer -= dt;
      if (enemy.shotTimer <= 0) {
        bossShoot(enemy);
        enemy.shotTimer = Math.max(0.45, 1.25 - state.wave * 0.045);
      }
    } else {
      enemy.x -= enemy.speed * dt;
      if (enemy.type === "dart") {
        enemy.y += Math.sin(enemy.phase * 1.7) * 82 * dt;
      } else if (enemy.type === "carrier") {
        enemy.y += Math.sin(enemy.phase * 0.75) * 28 * dt;
        enemy.shotTimer -= dt;
        if (enemy.shotTimer <= 0) {
          enemyShoot(enemy, 1);
          enemy.shotTimer = Math.max(0.85, 1.9 - state.wave * 0.04);
        }
      } else if (enemy.type === "wraith") {
        enemy.y += Math.sin(enemy.phase * 1.2) * 54 * dt;
        enemy.shotTimer -= dt;
        if (enemy.shotTimer <= 0) {
          enemyShoot(enemy, 2);
          enemy.shotTimer = Math.max(0.7, 1.45 - state.wave * 0.035);
        }
      } else {
        enemy.y += Math.sin(enemy.phase) * (enemy.type === "brute" ? 22 : 44) * dt;
      }
      enemy.y = clamp(enemy.y, enemy.r + 12, rect.height - enemy.r - 12);
    }
  }

  for (const pickup of state.pickups) {
    pickup.x += pickup.vx * dt;
    const dx = state.player.x - pickup.x;
    const dy = state.player.y - pickup.y;
    if (Math.hypot(dx, dy) < 105) {
      pickup.x += dx * dt * 3.5;
      pickup.y += dy * dt * 3.5;
    }
  }

  for (const particle of state.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  }

  collide(rect);
  cleanup(rect);
  checkWaveEnd();
  refreshUi();
}

function bossShoot(enemy) {
  const p = state.player;
  const base = Math.atan2(p.y - enemy.y, p.x - enemy.x);
  let spread = enemy.form === 1 ? [-0.28, 0, 0.28] : enemy.form === 2 ? [-0.46, -0.18, 0.18, 0.46] : [-0.18, 0.18];
  if (enemy.form === 3) spread = [-0.6, -0.3, 0, 0.3, 0.6];
  if (enemy.form === 4) spread = [-0.42, -0.14, 0.14, 0.42];
  if (enemy.form === 5) spread = [-0.72, -0.36, 0, 0.36, 0.72];
  if (enemy.fusion >= 2) spread = spread.concat([-0.9, 0.9]);
  for (const offset of spread) {
    const angle = base + offset;
    const speed = 190 + state.wave * 9 + enemy.fusion * 22;
    state.enemyShots.push({
      x: enemy.x - enemy.r * 0.65,
      y: enemy.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 6 + enemy.fusion,
      life: 3.2,
      damage: 9 + Math.floor(state.wave * 0.9) + enemy.fusion * 3,
    });
  }
  if (enemy.fusion >= 1) enemyShoot({ x: enemy.x - enemy.r * 0.2, y: enemy.y - enemy.r * 0.35 }, 2 + enemy.fusion);
  if (enemy.fusion >= 3) enemyShoot({ x: enemy.x - enemy.r * 0.2, y: enemy.y + enemy.r * 0.35 }, 4);
}

function enemyShoot(enemy, count) {
  const p = state.player;
  const base = Math.atan2(p.y - enemy.y, p.x - enemy.x);
  const offsets = count === 1 ? [0] : count === 2 ? [-0.18, 0.18] : [-0.56, -0.28, 0, 0.28, 0.56].slice(0, count);
  for (const offset of offsets) {
    const angle = base + offset;
    const speed = 175 + state.wave * 5;
    state.enemyShots.push({
      x: enemy.x - 12,
      y: enemy.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 4,
      life: 2.8,
      damage: 7 + Math.floor(state.wave * 0.45),
    });
  }
}

function movePlayer(dt, rect) {
  const p = state.player;
  if (state.pointer) {
    p.x += (state.pointer.x - p.x) * Math.min(1, dt * 12);
    p.y += (state.pointer.y - p.y) * Math.min(1, dt * 12);
  } else {
    let dx = 0;
    let dy = 0;
    if (state.keys.has("ArrowLeft") || state.keys.has("a")) dx -= 1;
    if (state.keys.has("ArrowRight") || state.keys.has("d")) dx += 1;
    if (state.keys.has("ArrowUp") || state.keys.has("w")) dy -= 1;
    if (state.keys.has("ArrowDown") || state.keys.has("s")) dy += 1;
    const len = Math.hypot(dx, dy) || 1;
    p.x += (dx / len) * p.speed * dt;
    p.y += (dy / len) * p.speed * dt;
  }
  p.x = clamp(p.x, 34, rect.width * 0.62);
  p.y = clamp(p.y, 34, rect.height - 34);
}

function collide(rect) {
  const p = state.player;
  for (const bullet of state.bullets) {
    for (const enemy of state.enemies) {
      if (enemy.hp > 0 && Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < bullet.r + enemy.r) {
        bullet.life = 0;
        enemy.hp -= bullet.damage || 1;
        burst(bullet.x, bullet.y, "#ffd166", 4);
        sound("hit");
        if (enemy.hp <= 0) {
          state.score += enemy.value;
          burst(enemy.x, enemy.y, enemy.type === "boss" ? "#d875ff" : enemy.type === "brute" ? "#ff7468" : enemy.type === "wraith" ? "#d875ff" : "#68d8ff", enemy.type === "boss" ? 34 + enemy.fusion * 12 : 18);
          sound(enemy.type === "boss" ? "boom" : "hit");
          if (enemy.type === "boss") {
            for (let i = 0; i < 5 + enemy.fusion * 3; i += 1) dropScrap(enemy.x - 20 + Math.random() * 40, enemy.y - 20 + Math.random() * 40);
          } else {
            dropScrap(enemy.x, enemy.y);
          }
        }
      }
    }
  }

  for (const enemy of state.enemies) {
    if (enemy.hp > 0 && Math.hypot(p.x - enemy.x, p.y - enemy.y) < p.r + enemy.r) {
      if (enemy.type !== "boss") enemy.hp = 0;
      burst(enemy.x, enemy.y, "#ff7468", 16);
      hurt(enemy.type === "boss" ? 28 + enemy.fusion * 8 : enemy.type === "brute" ? 24 : enemy.type === "dart" ? 18 : 15);
    } else if (enemy.x < -40 && enemy.hp > 0) {
      enemy.hp = 0;
      hurt(10);
    }
  }

  for (const shot of state.enemyShots) {
    if (Math.hypot(p.x - shot.x, p.y - shot.y) < p.r + shot.r) {
      shot.life = 0;
      hurt(shot.damage);
      burst(shot.x, shot.y, "#d875ff", 8);
    }
  }

  for (const pickup of state.pickups) {
    if (Math.hypot(p.x - pickup.x, p.y - pickup.y) < p.r + pickup.r) {
      pickup.collected = true;
      state.scrap += pickup.value;
      state.score += pickup.value * 12;
      burst(pickup.x, pickup.y, "#7ef29a", 7);
      sound("pickup");
    }
  }

  if (p.hull <= 0) endGame();
}

function hurt(amount) {
  if (state.player.invuln > 0) return;
  const blocked = state.player.addons.drones * 2;
  state.player.hull = Math.max(0, state.player.hull - Math.max(4, amount - blocked));
  state.player.invuln = 0.75;
  burst(state.player.x, state.player.y, "#ff7468", 18);
  sound("hurt");
}

function cleanup(rect) {
  state.bullets = state.bullets.filter((b) => b.life > 0 && b.x < rect.width + 60 && b.y > -50 && b.y < rect.height + 50);
  state.enemyShots = state.enemyShots.filter((s) => s.life > 0 && s.x > -60 && s.x < rect.width + 80 && s.y > -80 && s.y < rect.height + 80);
  state.enemies = state.enemies.filter((e) => e.hp > 0 && e.x > -70);
  state.pickups = state.pickups.filter((p) => !p.collected && p.x > -40);
  state.particles = state.particles.filter((p) => p.life > 0);
}

function checkWaveEnd() {
  if (state.enemiesLeft <= 0 && state.enemies.length === 0 && state.bossPending) {
    spawnBoss();
    return;
  }
  if (state.enemiesLeft <= 0 && state.enemies.length === 0 && !state.bossPending && !state.choosingUpgrade) {
    state.choosingUpgrade = true;
    state.running = false;
    ui.upgrades.hidden = false;
    updateUpgradeButtons();
  }
}

function chooseUpgrade(type) {
  unlockAudio();
  const p = state.player;
  if (type === "fireRate") {
    if (p.rapidLevel < 5) {
      p.rapidLevel += 1;
      p.fireDelay = Math.max(SHIPS[state.selectedShip].fireDelay * 0.45, p.fireDelay - 0.028);
    } else {
      p.addons.lances = Math.min(4, p.addons.lances + 1);
    }
  }
  if (type === "spread") {
    if (p.spread < 2) {
      p.spread += 1;
    } else {
      p.addons.pods = Math.min(4, p.addons.pods + 1);
    }
  }
  if (type === "shield") {
    if (p.shieldLevel < 4) {
      p.shieldLevel += 1;
      p.maxHull += 10;
      p.hull = Math.min(p.maxHull, p.hull + 42);
    } else {
      p.addons.drones = Math.min(3, p.addons.drones + 1);
      p.hull = Math.min(p.maxHull + p.addons.drones * 12, p.hull + 26);
    }
  }
  state.wave += 1;
  state.enemiesLeft = 8 + state.wave * 3 + Math.floor(state.wave / 4);
  state.nextSpawn = 0.55;
  state.bossPending = true;
  state.bossQueue = bossesForWave();
  state.enemyShots = [];
  state.running = true;
  state.choosingUpgrade = false;
  ui.upgrades.hidden = true;
  sound("upgrade");
  refreshUi();
}

function endGame() {
  state.running = false;
  state.over = true;
  ui.overlay.hidden = false;
  ui.action.textContent = "Restart Run";
  ui.overlay.querySelector("h1").textContent = "Run complete.";
  ui.overlay.querySelector(".copy").textContent = `Score ${state.score}. Scrap ${state.scrap}. Wave ${state.wave}.`;
}

function draw() {
  const rect = world();
  ctx.clearRect(0, 0, rect.width, rect.height);
  drawBackground(rect);
  drawPickups();
  drawBullets();
  drawEnemyShots();
  drawEnemies();
  drawPlayer();
  drawParticles();
  requestAnimationFrame(loop);
}

function drawBackground(rect) {
  const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#071014");
  gradient.addColorStop(0.55, "#101827");
  gradient.addColorStop(1, "#11180f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);
  for (const star of state.stars) {
    ctx.globalAlpha = 0.4 + star.s / 4;
    ctx.fillStyle = star.color;
    ctx.fillRect(star.x, star.y, star.s * 2.6, star.s);
  }
  ctx.globalAlpha = 1;
}

function drawPlayer() {
  const p = state.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.invuln > 0 && Math.floor(state.time * 16) % 2 === 0) ctx.globalAlpha = 0.55;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  if (state.selectedShip === "dash") {
    ctx.moveTo(30, 0);
    ctx.lineTo(-16, -12);
    ctx.lineTo(-24, 0);
    ctx.lineTo(-16, 12);
  } else if (state.selectedShip === "heavy") {
    ctx.moveTo(24, 0);
    ctx.lineTo(-14, -22);
    ctx.lineTo(-24, -8);
    ctx.lineTo(-24, 8);
    ctx.lineTo(-14, 22);
  } else {
    ctx.moveTo(25, 0);
    ctx.lineTo(-18, -16);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-18, 16);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#68d8ff";
  ctx.fillRect(-18, -5, 13, 10);
  ctx.fillStyle = p.accent;
  ctx.fillRect(-28, -4, 12, 8);
  drawPlayerAddons(p);
  ctx.restore();
}

function drawPlayerAddons(p) {
  ctx.fillStyle = "#ffd166";
  for (let i = 0; i < p.addons.lances; i += 1) {
    const y = i % 2 === 0 ? -22 - Math.floor(i / 2) * 6 : 22 + Math.floor(i / 2) * 6;
    ctx.fillRect(-2, y - 3, 24, 6);
  }
  ctx.fillStyle = "#68d8ff";
  for (let i = 0; i < p.addons.pods; i += 1) {
    const y = i % 2 === 0 ? -30 - Math.floor(i / 2) * 9 : 30 + Math.floor(i / 2) * 9;
    ctx.beginPath();
    ctx.arc(-2, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(126, 242, 154, 0.72)";
  ctx.lineWidth = 2;
  for (let i = 0; i < p.addons.drones; i += 1) {
    const angle = state.time * 2.4 + i * ((Math.PI * 2) / Math.max(1, p.addons.drones));
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * 32, Math.sin(angle) * 32, 5, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawBullets() {
  for (const b of state.bullets) {
    ctx.fillStyle = b.kind === "lance" ? "#f3f7f1" : b.kind === "pod" ? "#68d8ff" : "#ffd166";
    if (state.perf.simpleBullets) {
      ctx.fillRect(b.x, b.y - 2, b.kind === "lance" ? 18 : 10, 4);
    } else {
      ctx.beginPath();
      ctx.roundRect(b.x - 2, b.y - 3, b.kind === "lance" ? 28 : 18, b.kind === "pod" ? 5 : 6, 3);
      ctx.fill();
    }
  }
}

function drawEnemyShots() {
  ctx.fillStyle = "#d875ff";
  for (const s of state.enemyShots) {
    if (state.perf.simpleBullets) {
      ctx.fillRect(s.x - 3, s.y - 3, 6, 6);
    } else {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawEnemies() {
  for (const e of state.enemies) {
    ctx.save();
    ctx.translate(e.x, e.y);
    if (e.type === "boss") {
      drawBoss(e);
    } else {
      drawEnemyShip(e);
    }
    ctx.restore();
  }
}

function drawEnemyShip(e) {
  ctx.fillStyle = enemyColor(e.type);
  ctx.beginPath();
  if (e.type === "dart") {
    ctx.moveTo(-e.r * 1.2, 0);
    ctx.lineTo(e.r * 0.9, -e.r * 0.45);
    ctx.lineTo(e.r * 0.45, 0);
    ctx.lineTo(e.r * 0.9, e.r * 0.45);
  } else if (e.type === "carrier") {
    ctx.roundRect(-e.r, -e.r * 0.65, e.r * 1.8, e.r * 1.3, 6);
  } else if (e.type === "wraith") {
    ctx.moveTo(-e.r, -e.r * 0.65);
    ctx.quadraticCurveTo(e.r * 0.1, -e.r * 1.1, e.r, 0);
    ctx.quadraticCurveTo(e.r * 0.1, e.r * 1.1, -e.r, e.r * 0.65);
    ctx.quadraticCurveTo(-e.r * 0.45, 0, -e.r, -e.r * 0.65);
  } else {
    ctx.moveTo(-e.r, 0);
    ctx.lineTo(e.r * 0.5, -e.r * 0.82);
    ctx.lineTo(e.r, 0);
    ctx.lineTo(e.r * 0.5, e.r * 0.82);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#071014";
  if (e.type === "carrier") {
    ctx.fillRect(-e.r * 0.45, -4, e.r * 0.9, 8);
  } else {
    ctx.fillRect(-4, -4, 8, 8);
  }
}

function enemyColor(type) {
  if (type === "brute") return "#ff7468";
  if (type === "dart") return "#ffd166";
  if (type === "carrier") return "#7ef29a";
  if (type === "wraith") return "#d875ff";
  return "#68d8ff";
}

function drawBoss(e) {
  const colors = ["#d875ff", "#ff7468", "#68d8ff", "#7ef29a", "#ffd166", "#f3f7f1"];
  ctx.save();
  if (e.fusion > 0) {
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = e.fusion === 3 ? "#f3f7f1" : "#ffd166";
    ctx.lineWidth = 3 + e.fusion;
    for (let i = 0; i < e.fusion + 1; i += 1) {
      ctx.beginPath();
      ctx.arc(Math.cos(state.time + i * 2.1) * e.r * 0.18, Math.sin(state.time + i * 2.1) * e.r * 0.18, e.r * (0.95 + i * 0.08), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = colors[e.form] || "#d875ff";
  ctx.beginPath();
  if (e.form === 0) {
    ctx.moveTo(-e.r, 0);
    ctx.bezierCurveTo(-e.r * 0.5, -e.r, e.r * 0.45, -e.r * 0.8, e.r, 0);
    ctx.bezierCurveTo(e.r * 0.35, e.r * 0.85, -e.r * 0.55, e.r, -e.r, 0);
  } else if (e.form === 1) {
    for (let i = 0; i < 8; i += 1) {
      const a = i * Math.PI / 4 + state.time * 0.35;
      const radius = i % 2 === 0 ? e.r : e.r * 0.58;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  } else if (e.form === 2) {
    ctx.moveTo(-e.r, -e.r * 0.45);
    ctx.lineTo(-e.r * 0.15, -e.r);
    ctx.lineTo(e.r * 0.95, -e.r * 0.25);
    ctx.lineTo(e.r * 0.55, e.r * 0.25);
    ctx.lineTo(e.r * 0.95, e.r * 0.72);
    ctx.lineTo(-e.r * 0.25, e.r * 0.58);
  } else if (e.form === 3) {
    ctx.moveTo(-e.r, -e.r * 0.55);
    ctx.lineTo(-e.r * 0.15, -e.r * 0.92);
    ctx.lineTo(e.r * 0.95, -e.r * 0.2);
    ctx.lineTo(e.r * 0.55, 0);
    ctx.lineTo(e.r * 0.95, e.r * 0.2);
    ctx.lineTo(-e.r * 0.15, e.r * 0.92);
    ctx.lineTo(-e.r, e.r * 0.55);
  } else if (e.form === 4) {
    for (let i = 0; i < 10; i += 1) {
      const a = i * Math.PI / 5 - state.time * 0.22;
      const radius = i % 2 === 0 ? e.r : e.r * 0.42;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  } else {
    ctx.moveTo(-e.r, 0);
    ctx.bezierCurveTo(-e.r * 0.2, -e.r * 1.05, e.r * 0.75, -e.r * 0.75, e.r, 0);
    ctx.bezierCurveTo(e.r * 0.75, e.r * 0.75, -e.r * 0.2, e.r * 1.05, -e.r, 0);
    ctx.moveTo(-e.r * 0.25, -e.r * 0.75);
    ctx.lineTo(e.r * 0.25, e.r * 0.75);
  }
  ctx.closePath();
  ctx.fill();
  if (e.fusion >= 2) {
    ctx.fillStyle = "rgba(7, 16, 20, 0.42)";
    ctx.beginPath();
    ctx.arc(-e.r * 0.42, 0, e.r * 0.34, 0, Math.PI * 2);
    ctx.arc(e.r * 0.42, 0, e.r * 0.34, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#071014";
  ctx.beginPath();
  ctx.arc(-e.r * 0.18, -e.r * 0.08, e.r * 0.13, 0, Math.PI * 2);
  ctx.arc(e.r * 0.28, e.r * 0.12, e.r * 0.1, 0, Math.PI * 2);
  ctx.fill();
  if (e.fusion >= 3) {
    ctx.fillStyle = "#f3f7f1";
    ctx.beginPath();
    ctx.arc(0, 0, e.r * 0.08 + Math.sin(state.time * 8) * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  ctx.fillRect(-e.r, -e.r - 14, e.r * 2 * Math.max(0, e.hp / e.maxHp), 5);
  ctx.restore();
}

function drawPickups() {
  for (const pickup of state.pickups) {
    ctx.fillStyle = "#7ef29a";
    ctx.beginPath();
    ctx.arc(pickup.x, pickup.y, pickup.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#071014";
    ctx.fillRect(pickup.x - 3, pickup.y - 3, 6, 6);
  }
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, p.life * 1.8);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 3, 3);
  }
  ctx.globalAlpha = 1;
}

function refreshUi() {
  ui.wave.textContent = state.wave;
  ui.score.textContent = state.score;
  ui.scrap.textContent = state.scrap;
  ui.hull.textContent = Math.ceil(state.player.hull);
}

function updateUpgradeButtons() {
  const p = state.player;
  setUpgradeText("fireRate", p.rapidLevel < 5 ? "Rapid Core" : "Ion Lance", p.rapidLevel < 5 ? `Fire faster ${p.rapidLevel}/5` : `Add lance part ${p.addons.lances}/4`);
  setUpgradeText("spread", p.spread < 2 ? "Twin Splitter" : "Wing Pod", p.spread < 2 ? `Add side shots ${p.spread}/2` : `Add pod weapon ${p.addons.pods}/4`);
  setUpgradeText("shield", p.shieldLevel < 4 ? "Shield Patch" : "Guard Drone", p.shieldLevel < 4 ? `Repair and reinforce ${p.shieldLevel}/4` : `Add orbit guard ${p.addons.drones}/3`);
}

function setUpgradeText(type, title, text) {
  const button = ui.upgrades.querySelector(`[data-upgrade="${type}"]`);
  button.querySelector("span").textContent = title;
  button.querySelector("small").textContent = text;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pointerPos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

let last = performance.now();
function loop(now = performance.now()) {
  const rawDt = (now - last) / 1000;
  state.perf.avgDt = state.perf.avgDt * 0.94 + rawDt * 0.06;
  state.perf.simpleBullets = state.perf.avgDt > 0.028 || state.bullets.length + state.enemyShots.length > 90;
  const dt = Math.min(0.033, rawDt);
  last = now;
  update(dt);
  draw();
}

window.addEventListener("resize", () => {
  fitCanvas();
  makeStars();
});

window.addEventListener("keydown", (event) => {
  unlockAudio();
  state.keys.add(event.key);
  if (event.key === " " && (!state.running || state.over)) resetGame();
});

window.addEventListener("keyup", (event) => state.keys.delete(event.key));

canvas.addEventListener("pointerdown", (event) => {
  unlockAudio();
  canvas.setPointerCapture(event.pointerId);
  state.pointer = pointerPos(event);
});

canvas.addEventListener("pointermove", (event) => {
  if (event.buttons || event.pointerType === "touch") state.pointer = pointerPos(event);
});

canvas.addEventListener("pointerup", () => {
  state.pointer = null;
});

ui.action.addEventListener("click", resetGame);
ui.soundToggle.addEventListener("click", () => {
  state.audio.enabled = !state.audio.enabled;
  if (state.audio.enabled) unlockAudio();
  ui.soundToggle.setAttribute("aria-pressed", String(state.audio.enabled));
  ui.soundToggle.querySelector("strong").textContent = state.audio.enabled ? "On" : "Off";
});
for (const card of ui.shipCards) {
  card.addEventListener("click", () => {
    state.selectedShip = card.dataset.ship;
    for (const option of ui.shipCards) option.classList.toggle("is-selected", option === card);
    sound("pickup");
  });
}
ui.upgrades.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-upgrade]");
  if (button) chooseUpgrade(button.dataset.upgrade);
});

fitCanvas();
makeStars();
refreshUi();
loop();
