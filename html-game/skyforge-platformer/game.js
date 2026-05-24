const $ = (s) => document.querySelector(s);
const log = $("#combatLog");

const CARDS = {
  strike: { name: "Strike", type: "attack", cost: 1, desc: "Deal 6 damage.", damage: 6 },
  strike_plus: { name: "Strike+", type: "attack", cost: 1, desc: "Deal 9 damage.", damage: 9 },
  defend: { name: "Defend", type: "defend", cost: 1, desc: "Gain 5 block.", block: 5 },
  defend_plus: { name: "Defend+", type: "defend", cost: 1, desc: "Gain 8 block.", block: 8 },
  bash: { name: "Bash", type: "attack", cost: 2, desc: "Deal 8 damage. Apply 2 Vulnerable.", damage: 8, vulnerable: 2 },
  cleave: { name: "Cleave", type: "attack", cost: 1, desc: "Deal 8 damage to ALL enemies.", damage: 8, all: true },
  ironWave: { name: "Iron Wave", type: "attack", cost: 1, desc: "Deal 5 damage. Gain 5 block.", damage: 5, block: 5 },
  thunderStrike: { name: "Thunder Strike", type: "attack", cost: 2, desc: "Deal 14 damage.", damage: 14 },
  suckerPunch: { name: "Sucker Punch", type: "attack", cost: 1, desc: "Deal 7 damage. Apply 1 Weak.", damage: 7, weak: 1 },
  twinStrike: { name: "Twin Strike", type: "attack", cost: 1, desc: "Deal 4 damage twice.", hits: 2, damage: 4 },
  bodySlam: { name: "Body Slam", type: "attack", cost: 1, desc: "Deal damage equal to your block.", blockDamage: true },
  whirlwind: { name: "Whirlwind", type: "attack", cost: 2, desc: "Deal 5 damage to ALL enemies. Apply 1 Weak.", damage: 5, all: true, weak: 1 },
  heavyBlade: { name: "Heavy Blade", type: "attack", cost: 2, desc: "Deal 12 damage. +4 per Strength.", damage: 12, scaling: 4 },
  piercingStrike: { name: "Piercing Strike", type: "attack", cost: 1, desc: "Deal 10 damage. Ignores block.", damage: 10, pierce: true },
  shockwave: { name: "Shockwave", type: "skill", cost: 2, desc: "Apply 2 Weak and 2 Vulnerable to ALL.", weak: 2, vulnerable: 2, all: true },
  flurry: { name: "Flurry", type: "skill", cost: 0, desc: "Deal 4 damage. Draw 1 card.", damage: 4, draw: 1 },
  headbutt: { name: "Headbutt", type: "skill", cost: 1, desc: "Deal 6 damage. Put a random card from discard into hand.", damage: 6, retrieve: true },
  trueGrit: { name: "True Grit", type: "skill", cost: 1, desc: "Gain 7 block. Draw 1 card.", block: 7, draw: 1 },
  bloodForBlood: { name: "Blood for Blood", type: "skill", cost: 1, desc: "Lose 3 HP. Gain 15 block and 2 Strength.", selfDamage: 3, block: 15, strength: 2 },
  secondWind: { name: "Second Wind", type: "skill", cost: 1, desc: "Gain 3 Strength. Gain 4 block.", strength: 3, block: 4 },
  concentrate: { name: "Concentrate", type: "power", cost: 1, desc: "Gain 1 Strength at start of each turn.", power: true, strengthPerTurn: 1 },
  armorForm: { name: "Armor Form", type: "power", cost: 2, desc: "Gain 2 block at start of each turn.", power: true, blockPerTurn: 2 },
  berserk: { name: "Berserk", type: "power", cost: 0, desc: "Lose 4 HP. Gain 3 Strength.", selfDamage: 4, strength: 3 },
  metalSkin: { name: "Metal Skin", type: "power", cost: 1, desc: "Gain 1 block at end of each enemy turn.", power: true, blockPerEnemyTurn: 1 },
  doubleTap: { name: "Double Tap", type: "skill", cost: 1, desc: "This turn, attacks cost 0.", zeroCost: true },
  offering: { name: "Offering", type: "skill", cost: 0, desc: "Lose 6 HP. Gain 2 energy. Draw 3 cards.", selfDamage: 6, energy: 2, draw: 3 },
  wellLaidPlans: { name: "Well-Laid Plans", type: "power", cost: 1, desc: "At end of turn, keep 1 extra card.", power: true, keepExtra: 1 },
  combustion: { name: "Combust", type: "power", cost: 1, desc: "At end of turn, deal 5 damage to ALL.", power: true, endTurnDamage: 5 },
};

const ENEMY_DEFS = [
  {
    id: "slime",
    name: "Slime",
    emoji: "🟢",
    bg: "#1a3a1a",
    hp: 28,
    pattern: [
      { type: "attack", value: 6 },
      { type: "attack", value: 6 },
      { type: "defend", value: 6 },
    ],
  },
  {
    id: "goblin",
    name: "Goblin",
    emoji: "👺",
    bg: "#3a1a1a",
    hp: 34,
    pattern: [
      { type: "attack", value: 7 },
      { type: "debuff", value: 1, debuffType: "weak" },
      { type: "attack", value: 9 },
      { type: "defend", value: 8 },
    ],
  },
  {
    id: "skeleton",
    name: "Skeleton",
    emoji: "💀",
    bg: "#2a2a2a",
    hp: 40,
    pattern: [
      { type: "attack", value: 8 },
      { type: "attack", value: 5 },
      { type: "attack", value: 5 },
      { type: "defend", value: 10 },
      { type: "attack", value: 12 },
    ],
  },
  {
    id: "mushroom",
    name: "Fungus",
    emoji: "🍄",
    bg: "#2a1a3a",
    hp: 22,
    pattern: [
      { type: "buff", value: 2, buffType: "strength" },
      { type: "buff", value: 2, buffType: "strength" },
      { type: "attack", value: 10 },
      { type: "attack", value: 14 },
    ],
  },
  {
    id: "shieldknight",
    name: "Shield Knight",
    emoji: "🛡️",
    bg: "#1a2a3a",
    hp: 52,
    pattern: [
      { type: "defend", value: 10 },
      { type: "attack", value: 8 },
      { type: "defend", value: 14 },
      { type: "attack", value: 6 },
      { type: "debuff", value: 2, debuffType: "vulnerable" },
    ],
  },
  {
    id: "orc",
    name: "Orc Warrior",
    emoji: "👹",
    bg: "#3a2a1a",
    hp: 58,
    pattern: [
      { type: "attack", value: 10 },
      { type: "attack", value: 10 },
      { type: "buff", value: 3, buffType: "strength" },
      { type: "attack", value: 14 },
      { type: "attack", value: 14 },
    ],
  },
];

const BOSS_DEFS = [
  {
    id: "dragon",
    name: "Flame Drake",
    emoji: "🐉",
    bg: "#3a0a0a",
    hp: 120,
    pattern: [
      { type: "attack", value: 14 },
      { type: "attack", value: 8 },
      { type: "attack", value: 8 },
      { type: "debuff", value: 2, debuffType: "vulnerable" },
      { type: "buff", value: 2, buffType: "strength" },
      { type: "attack", value: 18 },
      { type: "defend", value: 16 },
      { type: "attack", value: 12 },
    ],
  },
  {
    id: "lich",
    name: "The Lich",
    emoji: "🧙",
    bg: "#1a0a2a",
    hp: 100,
    pattern: [
      { type: "attack", value: 12 },
      { type: "debuff", value: 2, debuffType: "weak" },
      { type: "debuff", value: 2, debuffType: "vulnerable" },
      { type: "attack", value: 16 },
      { type: "buff", value: 3, buffType: "strength" },
      { type: "attack", value: 20 },
      { type: "defend", value: 20 },
      { type: "attack", value: 14 },
    ],
  },
];

const STATE = {
  screen: "title",
  floor: 1,
  room: 0,
  roomsTotal: 6,
  gold: 0,
  player: null,
  enemies: [],
  hand: [],
  drawPile: [],
  discardPile: [],
  exhaustPile: [],
  turnNumber: 0,
  zeroCostTurn: false,
  keepExtra: 0,
  endTurnDamage: 0,
};

function cloneCard(id) {
  const def = CARDS[id];
  return { id, ...def, uid: Math.random().toString(36).slice(2) };
}

function createPlayer() {
  return {
    hp: 72,
    maxHp: 72,
    block: 0,
    energy: 3,
    maxEnergy: 3,
    strength: 0,
    weak: 0,
    vulnerable: 0,
    armorPerTurn: 0,
    blockPerEnemyTurn: 0,
    strengthPerTurn: 0,
    deckIds: [
      "strike", "strike", "strike", "strike", "strike",
      "defend", "defend", "defend", "defend",
      "bash",
    ],
  };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDrawPile() {
  STATE.drawPile = STATE.player.deckIds.map((id) => cloneCard(id));
  shuffle(STATE.drawPile);
}

function drawCards(count) {
  const drawn = [];
  for (let i = 0; i < count; i++) {
    if (STATE.drawPile.length === 0) {
      if (STATE.discardPile.length === 0) break;
      STATE.drawPile = shuffle([...STATE.discardPile]);
      STATE.discardPile = [];
    }
    if (STATE.drawPile.length > 0) drawn.push(STATE.drawPile.pop());
  }
  return drawn;
}

function startCombat() {
  const roomType = getRoomType();
  if (roomType === "rest") {
    showRestScreen();
    return;
  }
  if (roomType === "elite") {
    spawnEnemies(2, true);
  } else if (roomType === "boss") {
    spawnBoss();
  } else {
    spawnEnemies(1 + (STATE.floor >= 2 && Math.random() > 0.5 ? 1 : 0), false);
  }
  beginPlayerTurn();
}

function getRoomType() {
  const r = STATE.room;
  const total = STATE.roomsTotal;
  if (r === total - 1 && STATE.floor % 3 === 0) return "boss";
  if (r === 2 || r === 4) return "elite";
  if (r === 3) return "rest";
  return "combat";
}

function spawnEnemies(count, elite) {
  const pool = ENEMY_DEFS.filter((e) => {
    if (elite) return ["skeleton", "shieldknight", "orc"].includes(e.id);
    return true;
  });
  STATE.enemies = [];
  for (let i = 0; i < count; i++) {
    const def = pool[Math.floor(Math.random() * pool.length)];
    const hpMult = 1 + (STATE.floor - 1) * 0.25;
    STATE.enemies.push({
      ...def,
      hp: Math.floor(def.hp * hpMult),
      maxHp: Math.floor(def.hp * hpMult),
      block: 0,
      weak: 0,
      vulnerable: 0,
      strength: 0,
      patternIndex: 0,
      alive: true,
      intent: null,
    });
  }
  assignIntents();
}

function spawnBoss() {
  const def = BOSS_DEFS[Math.floor(Math.random() * BOSS_DEFS.length)];
  const hpMult = 1 + (STATE.floor - 1) * 0.3;
  STATE.enemies = [{
    ...def,
    hp: Math.floor(def.hp * hpMult),
    maxHp: Math.floor(def.hp * hpMult),
    block: 0,
    weak: 0,
    vulnerable: 0,
    strength: 0,
    patternIndex: 0,
    alive: true,
    intent: null,
  }];
  assignIntents();
}

function assignIntents() {
  for (const e of STATE.enemies) {
    if (!e.alive) continue;
    const move = e.pattern[e.patternIndex % e.pattern.length];
    e.intent = { ...move };
  }
}

function beginPlayerTurn() {
  const p = STATE.player;
  STATE.turnNumber++;
  STATE.hand = [];
  STATE.discardPile = [];
  STATE.zeroCostTurn = false;

  p.block = 0;
  p.energy = p.maxEnergy;
  p.strength += p.strengthPerTurn;
  p.weak = Math.max(0, p.weak - 1);
  p.vulnerable = Math.max(0, p.vulnerable - 1);

  STATE.endTurnDamage = 0;

  const keepCount = STATE.keepExtra;
  if (keepCount > 0) {
    const kept = STATE.hand.splice(0, Math.min(keepCount, STATE.hand.length));
    STATE.hand = drawCards(5 - kept.length);
    STATE.hand.unshift(...kept);
  } else {
    STATE.hand = drawCards(5);
  }

  render();
}

function playCard(index) {
  if (STATE.screen !== "combat") return;
  const card = STATE.hand[index];
  const p = STATE.player;
  const cost = STATE.zeroCostTurn ? 0 : card.cost;
  if (p.energy < cost) return;

  p.energy -= cost;
  STATE.hand.splice(index, 1);

  if (card.damage !== undefined) {
    const dmg = calcDamage(card);
    if (card.all) {
      for (const e of STATE.enemies) {
        if (e.alive) dealDamageToEnemy(e, dmg, card);
      }
    } else {
      const target = pickTarget();
      if (target) dealDamageToEnemy(target, dmg, card);
    }
  }

  if (card.block) {
    p.block += card.block;
    logMsg(`+${card.block} block`, "defend");
  }

  if (card.weak) {
    applyToEnemies("weak", card.weak, card.all);
  }
  if (card.vulnerable) {
    applyToEnemies("vulnerable", card.vulnerable, card.all);
  }
  if (card.strength) {
    p.strength += card.strength;
    logMsg(`+${card.strength} strength`, "info");
  }
  if (card.selfDamage) {
    p.hp -= card.selfDamage;
    logMsg(`-${card.selfDamage} HP`, "damage");
  }
  if (card.draw) {
    const drawn = drawCards(card.draw);
    STATE.hand.push(...drawn);
  }
  if (card.energy) {
    p.energy += card.energy;
    logMsg(`+${card.energy} energy`, "info");
  }
  if (card.retrieve) {
    const fromDiscard = STATE.discardPile.find((c) => c.type === "attack");
    if (fromDiscard) {
      const idx = STATE.discardPile.indexOf(fromDiscard);
      STATE.discardPile.splice(idx, 1);
      STATE.hand.push(fromDiscard);
      logMsg(`Retrieved ${fromDiscard.name}`, "info");
    }
  }
  if (card.power) {
    if (card.strengthPerTurn) p.strengthPerTurn += card.strengthPerTurn;
    if (card.blockPerTurn) p.armorPerTurn += card.blockPerTurn;
    if (card.blockPerEnemyTurn) p.blockPerEnemyTurn += card.blockPerEnemyTurn;
    if (card.keepExtra) STATE.keepExtra += card.keepExtra;
    if (card.endTurnDamage) STATE.endTurnDamage += card.endTurnDamage;
    logMsg(`${card.name} activated!`, "info");
  }

  STATE.discardPile.push(card);
  checkDeaths();
  render();
}

function calcDamage(card) {
  const p = STATE.player;
  let base = card.blockDamage ? p.block : card.damage;
  if (card.scaling) base += p.strength * card.scaling;
  else if (card.damage !== undefined && !card.blockDamage) base += p.strength;
  if (p.weak > 0) base = Math.floor(base * 0.75);
  return Math.max(0, base);
}

function dealDamageToEnemy(enemy, amount, card) {
  let dmg = amount;
  if (p().vulnerable > 0) dmg = Math.floor(dmg * 1.5);
  if (!card || !card.pierce) {
    if (enemy.block > 0) {
      const absorbed = Math.min(enemy.block, dmg);
      enemy.block -= absorbed;
      dmg -= absorbed;
    }
  }
  enemy.hp -= dmg;
  logMsg(`${enemy.name} takes ${dmg} damage`, "damage");
  animateEnemyHit(enemy);
}

function p() { return STATE.player; }

function applyToEnemies(stat, amount, all) {
  for (const e of STATE.enemies) {
    if (!e.alive) continue;
    e[stat] = (e[stat] || 0) + amount;
  }
}

function pickTarget() {
  const alive = STATE.enemies.filter((e) => e.alive);
  return alive.length > 0 ? alive[Math.floor(Math.random() * alive.length)] : null;
}

function checkDeaths() {
  for (const e of STATE.enemies) {
    if (e.alive && e.hp <= 0) {
      e.alive = false;
      STATE.gold += 10 + STATE.floor * 3;
      logMsg(`${e.name} defeated! +${10 + STATE.floor * 3} gold`, "info");
    }
  }
  if (STATE.enemies.every((e) => !e.alive)) {
    setTimeout(() => victory(), 600);
  }
}

function victory() {
  STATE.room++;
  if (STATE.room >= STATE.roomsTotal) {
    STATE.floor++;
    STATE.room = 0;
    STATE.roomsTotal = 6 + STATE.floor;
    healPlayer(Math.floor(p().maxHp * 0.3));
  }

  if (p().hp <= 0) {
    showGameOver();
    return;
  }

  showRewardScreen();
}

function showRewardScreen() {
  STATE.screen = "reward";
  const options = generateRewards();
  const panel = $("#panel");
  panel.innerHTML = `
    <h1>Victory</h1>
    <h2>Choose a card to add to your deck</h2>
    <div class="card-rewards" id="rewardCards"></div>
    <button class="btn secondary" id="skipReward">Skip</button>
  `;
  $("#overlay").classList.remove("hidden");

  const container = $("#rewardCards");
  for (const cardId of options) {
    const el = createCardEl(cloneCard(cardId));
    el.addEventListener("click", () => {
      p().deckIds.push(cardId);
      closeOverlay();
      startCombat();
    });
    container.appendChild(el);
  }

  $("#skipReward").addEventListener("click", () => {
    closeOverlay();
    startCombat();
  });
}

function generateRewards() {
  const pool = Object.keys(CARDS).filter((id) => {
    if (["strike", "defend"].includes(id)) return true;
    return !["strike_plus", "defend_plus"].includes(id);
  });
  const result = [];
  while (result.length < 3) {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!result.includes(pick)) result.push(pick);
  }
  return result;
}

function showRestScreen() {
  STATE.screen = "rest";
  const panel = $("#panel");
  const healAmt = Math.floor(p().maxHp * 0.4);
  panel.innerHTML = `
    <h1>Rest Site</h1>
    <h2>Take a breather</h2>
    <div class="rest-choices">
      <div class="rest-choice" id="restHeal">
        <h3>Rest</h3>
        <p>Heal ${healAmt} HP</p>
      </div>
      <div class="rest-choice" id="restUpgrade">
        <h3>Upgrade</h3>
        <p>Remove a card from deck</p>
      </div>
    </div>
  `;
  $("#overlay").classList.remove("hidden");

  $("#restHeal").addEventListener("click", () => {
    healPlayer(healAmt);
    closeOverlay();
    STATE.room++;
    if (STATE.room >= STATE.roomsTotal) {
      STATE.floor++;
      STATE.room = 0;
      STATE.roomsTotal = 6 + STATE.floor;
    }
    startCombat();
  });

  $("#restUpgrade").addEventListener("click", () => {
    showRemoveCardScreen();
  });
}

function showRemoveCardScreen() {
  const panel = $("#panel");
  const removable = [...new Set(p().deckIds)];
  panel.innerHTML = `
    <h1>Remove a Card</h1>
    <h2>Select a card to remove from your deck</h2>
    <div class="card-rewards" id="removeCards"></div>
    <button class="btn secondary" id="cancelRemove">Cancel</button>
  `;
  const container = $("#removeCards");
  for (const id of removable) {
    const el = createCardEl(cloneCard(id));
    el.addEventListener("click", () => {
      const idx = p().deckIds.indexOf(id);
      p().deckIds.splice(idx, 1);
      closeOverlay();
      STATE.room++;
      if (STATE.room >= STATE.roomsTotal) {
        STATE.floor++;
        STATE.room = 0;
        STATE.roomsTotal = 6 + STATE.floor;
      }
      startCombat();
    });
    container.appendChild(el);
  }
  $("#cancelRemove").addEventListener("click", () => {
    showRestScreen();
  });
}

function healPlayer(amount) {
  p().hp = Math.min(p().maxHp, p().hp + amount);
  logMsg(`Healed ${amount} HP`, "heal");
}

function showGameOver() {
  STATE.screen = "gameover";
  const panel = $("#panel");
  panel.innerHTML = `
    <h1 style="color: var(--red);">Defeated</h1>
    <p>You reached Floor ${STATE.floor}, Room ${STATE.room + 1}</p>
    <p>Gold collected: ${STATE.gold}</p>
    <button class="btn" id="restartBtn">Try Again</button>
  `;
  $("#overlay").classList.remove("hidden");
  $("#restartBtn").addEventListener("click", () => {
    closeOverlay();
    initGame();
  });
}

function endTurn() {
  if (STATE.screen !== "combat") return;

  if (STATE.endTurnDamage > 0) {
    for (const e of STATE.enemies) {
      if (e.alive) {
        e.hp -= STATE.endTurnDamage;
        logMsg(`${e.name} burns for ${STATE.endTurnDamage}`, "damage");
      }
    }
  }

  STATE.discardPile.push(...STATE.hand);
  STATE.hand = [];

  enemyTurn();
}

function enemyTurn() {
  const p = STATE.player;
  for (const e of STATE.enemies) {
    if (!e.alive) continue;

    e.weak = Math.max(0, e.weak - 1);
    e.vulnerable = Math.max(0, e.vulnerable - 1);

    const move = e.intent;
    if (!move) continue;

    if (move.type === "attack") {
      let dmg = move.value + (e.strength || 0);
      if (e.weak > 0) dmg = Math.floor(dmg * 0.75);
      if (p.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
      if (p.block > 0) {
        const absorbed = Math.min(p.block, dmg);
        p.block -= absorbed;
        dmg -= absorbed;
      }
      p.hp -= dmg;
      logMsg(`${e.name} deals ${dmg} damage`, "damage");
    } else if (move.type === "defend") {
      e.block += move.value;
      logMsg(`${e.name} gains ${move.value} block`, "defend");
    } else if (move.type === "buff") {
      e[move.buffType] = (e[move.buffType] || 0) + move.value;
      logMsg(`${e.name} gains ${move.value} ${move.buffType}`, "info");
    } else if (move.type === "debuff") {
      p[move.debuffType] = (p[move.debuffType] || 0) + move.value;
      logMsg(`You gain ${move.value} ${move.debuffType}`, "damage");
    }

    if (p.blockPerEnemyTurn > 0) {
      p.block += p.blockPerEnemyTurn;
    }

    e.patternIndex++;
  }

  checkDeaths();
  if (p.hp <= 0) {
    showGameOver();
    return;
  }

  assignIntents();
  setTimeout(() => beginPlayerTurn(), 400);
}

function closeOverlay() {
  $("#overlay").classList.add("hidden");
}

function showTitleScreen() {
  STATE.screen = "title";
  const panel = $("#panel");
  panel.innerHTML = `
    <h1>Deep Run</h1>
    <p>A card-based roguelike. Battle through floors of enemies, build your deck, and survive.</p>
    <button class="btn" id="startBtn">Begin Run</button>
  `;
  $("#overlay").classList.remove("hidden");
  $("#startBtn").addEventListener("click", () => {
    closeOverlay();
    initGame();
  });
}

function initGame() {
  STATE.screen = "combat";
  STATE.floor = 1;
  STATE.room = 0;
  STATE.roomsTotal = 6;
  STATE.gold = 0;
  STATE.player = createPlayer();
  STATE.enemies = [];
  STATE.hand = [];
  STATE.drawPile = [];
  STATE.discardPile = [];
  STATE.exhaustPile = [];
  STATE.turnNumber = 0;
  STATE.keepExtra = 0;
  STATE.endTurnDamage = 0;
  buildDrawPile();
  startCombat();
}

function render() {
  const p = STATE.player;

  $("#floorLabel").textContent = `Floor ${STATE.floor}`;
  $("#roomLabel").textContent = `Room ${STATE.room + 1}/${STATE.roomsTotal}`;
  $("#goldDisplay").textContent = `✦ ${STATE.gold}`;

  const hpPct = Math.max(0, (p.hp / p.maxHp) * 100);
  $("#hpBar").style.width = `${hpPct}%`;
  $("#hpText").textContent = `${Math.max(0, p.hp)}/${p.maxHp}`;

  $("#energyDisplay").textContent = `⚡ ${p.energy}/${p.maxEnergy}`;

  const statusEl = $("#playerStatus");
  statusEl.innerHTML = "";
  if (p.weak > 0) statusEl.innerHTML += `<span class="status-badge weak">Weak ${p.weak}</span>`;
  if (p.vulnerable > 0) statusEl.innerHTML += `<span class="status-badge vulnerable">Vuln ${p.vulnerable}</span>`;
  if (p.strength > 0) statusEl.innerHTML += `<span class="status-badge strength">Str ${p.strength}</span>`;
  if (p.block > 0) statusEl.innerHTML += `<span class="status-badge block">🛡 ${p.block}</span>`;

  $("#deckInfo").textContent = `Deck: ${STATE.drawPile.length + STATE.discardPile.length + STATE.hand.length} | Draw: ${STATE.drawPile.length} | Discard: ${STATE.discardPile.length}`;

  renderEnemies();
  renderHand();

  $("#endTurnBtn").disabled = STATE.screen !== "combat";
}

function renderEnemies() {
  const area = $("#enemyArea");
  area.innerHTML = "";
  for (const e of STATE.enemies) {
    const slot = document.createElement("div");
    slot.className = `enemy-slot${e.alive ? "" : " dead"}`;

    const hpPct = Math.max(0, (e.hp / e.maxHp) * 100);
    slot.innerHTML = `
      <div class="enemy-name">${e.name}</div>
      <div class="enemy-sprite" style="background:${e.bg}" data-id="${e.id}">${e.emoji}</div>
      <div class="enemy-hp">
        <div class="bar-bg"><div class="bar-fill" style="width:${hpPct}%"></div></div>
        <span>${Math.max(0, e.hp)}/${e.maxHp}</span>
      </div>
      <div class="enemy-intent ${e.alive ? intentClass(e.intent) : ""}">${e.alive ? intentText(e.intent) : ""}</div>
      <div class="enemy-status">
        ${e.weak > 0 ? `<span class="status-badge weak">W${e.weak}</span>` : ""}
        ${e.vulnerable > 0 ? `<span class="status-badge vulnerable">V${e.vulnerable}</span>` : ""}
        ${e.strength > 0 ? `<span class="status-badge strength">S${e.strength}</span>` : ""}
        ${e.block > 0 ? `<span class="status-badge block">🛡${e.block}</span>` : ""}
      </div>
    `;
    area.appendChild(slot);
  }
}

function intentClass(intent) {
  if (!intent) return "";
  switch (intent.type) {
    case "attack": return "intent-attack";
    case "defend": return "intent-defend";
    case "buff": return "intent-buff";
    case "debuff": return "intent-debuff";
  }
  return "intent-mixed";
}

function intentText(intent) {
  if (!intent) return "";
  switch (intent.type) {
    case "attack": return `⚔ ${intent.value}`;
    case "defend": return `🛡 ${intent.value}`;
    case "buff": return `▲ +${intent.value} ${intent.buffType}`;
    case "debuff": return `▼ ${intent.value} ${intent.debuffType}`;
  }
  return "";
}

function renderHand() {
  const handEl = $("#hand");
  handEl.innerHTML = "";
  for (let i = 0; i < STATE.hand.length; i++) {
    const card = STATE.hand[i];
    const el = createCardEl(card);
    const canPlay = STATE.player.energy >= (STATE.zeroCostTurn ? 0 : card.cost);
    if (!canPlay) el.classList.add("unplayable");
    el.addEventListener("click", () => playCard(i));
    handEl.appendChild(el);
  }
}

function createCardEl(card) {
  const el = document.createElement("div");
  el.className = `card card-type-${card.type}`;
  el.innerHTML = `
    <div class="card-cost">${card.cost}</div>
    <div class="card-type-stripe"></div>
    <div class="card-name">${card.name}</div>
    <div class="card-desc">${card.desc}</div>
  `;
  return el;
}

function animateEnemyHit(enemy) {
  const sprite = document.querySelector(`.enemy-sprite[data-id="${enemy.id}"]`);
  if (!sprite) return;
  sprite.classList.add("hit");
  setTimeout(() => sprite.classList.remove("hit"), 350);
}

function logMsg(text, type = "info") {
  const el = document.createElement("div");
  el.className = `log-msg ${type}`;
  el.textContent = text;
  log.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

$("#endTurnBtn").addEventListener("click", endTurn);

document.addEventListener("keydown", (e) => {
  if (e.key === "e" || e.key === "Enter") endTurn();
  if (e.key === " " && STATE.screen === "title") {
    e.preventDefault();
    closeOverlay();
    initGame();
  }
  const num = parseInt(e.key);
  if (num >= 1 && num <= 9 && STATE.screen === "combat") {
    const idx = num - 1;
    if (idx < STATE.hand.length) playCard(idx);
  }
});

showTitleScreen();
