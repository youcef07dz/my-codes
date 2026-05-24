// Emoji Memory Quest - Enhanced Version with All Features
// Features: Text Size Slider, Daily Challenges, Hard Mode, Zen Mode, Boss Levels, 
// Background Themes, Emoji Glow, Particle Customization, Level Stats, Tournament System
(function(){
  'use strict';
  
  // ============================================
  // DOM ELEMENTS
  // ============================================
  const board = document.getElementById('board');
  const levelEl = document.getElementById('level');
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('time');
  const coinsEl = document.getElementById('coins');
  const skinsEl = document.getElementById('skins');
  const mainMenuScreen = document.getElementById('mainMenuScreen');
  const gameScreen = document.getElementById('gameScreen');
  const storeScreen = document.getElementById('storeScreen');
  const worldSelectScreen = document.getElementById('worldSelectScreen');
  const cheatScreen = document.getElementById('cheatScreen');
  const levelMapScreen = document.getElementById('levelMapScreen');
  const achievementsScreen = document.getElementById('achievementsScreen');
  const statisticsScreen = document.getElementById('statisticsScreen');
  const settingsScreen = document.getElementById('settingsScreen');
  const gameModesScreen = document.getElementById('gameModesScreen');
  const dailyChallengesScreen = document.getElementById('dailyChallengesScreen');
  const tournamentScreen = document.getElementById('tournamentScreen');
  const worldGrid = document.getElementById('worldGrid');
  const levelGrid = document.getElementById('levelGrid');
  const worldCompletedLevelsEl = document.getElementById('worldCompletedLevels');
  const worldTotalLevelsEl = document.getElementById('worldTotalLevels');
  const completedLevelsEl = document.getElementById('completedLevels');
  const totalLevelsEl = document.getElementById('totalLevels');
  const currentWorldNumEl = document.getElementById('currentWorldNum');
  const bestLevelDisplay = document.getElementById('bestLevelDisplay');
  const totalCoinsDisplay = document.getElementById('totalCoinsDisplay');
  const achievementsDisplay = document.getElementById('achievementsDisplay');
  const mainSoundIcon = document.getElementById('mainSoundIcon');
  const mainLangText = document.getElementById('mainLangText');
  const particlesContainer = document.getElementById('particlesContainer');
  const confettiContainer = document.getElementById('confettiContainer');
  const floatingCoinsContainer = document.getElementById('floatingCoinsContainer');
  const comboNotice = document.getElementById('comboNotice');
  const comboCountEl = document.getElementById('comboCount');
  const dailyRewardSection = document.getElementById('dailyRewardSection');
  const dailyRewardBadge = document.getElementById('dailyRewardBadge');
  const dailyRewardTimer = document.getElementById('dailyRewardTimer');
  const dailyRewardModal = document.getElementById('dailyRewardModal');
  const gameModeIndicator = document.getElementById('gameModeIndicator');
  const backgroundTheme = document.getElementById('backgroundTheme');
  
  // Dialog Elements
  const dialogOverlay = document.getElementById('dialogOverlay');
  const dialogBox = document.getElementById('dialogBox');
  const dialogIcon = document.getElementById('dialogIcon');
  const dialogTitle = document.getElementById('dialogTitle');
  const dialogMessage = document.getElementById('dialogMessage');
  const dialogBtnPrimary = document.getElementById('dialogBtnPrimary');
  const dialogBtnSecondary = document.getElementById('dialogBtnSecondary');
  
  // Level Stats Modal
  const levelStatsModal = document.getElementById('levelStatsModal');
  
  // About Page
  const aboutScreen = document.getElementById('aboutScreen');
  const mainMenuAboutBtn = document.getElementById('mainMenuAboutBtn');
  const aboutBackBtn = document.getElementById('aboutBackBtn');

// Show About Page
mainMenuAboutBtn?.addEventListener('click', () => {
  mainMenuScreen.classList.remove('active');
  mainMenuScreen.style.display = 'none';
  aboutScreen.classList.add('active');
  aboutScreen.style.display = 'block';
});

// Back to Menu
aboutBackBtn?.addEventListener('click', () => {
  aboutScreen.classList.remove('active');
  aboutScreen.style.display = 'none';
  mainMenuScreen.classList.add('active');
  mainMenuScreen.style.display = 'block';
});

  // ============================================
  // GAME MODES & STATE
  // ============================================
  const GAME_MODES = {
    NORMAL: 'normal',
    HARD: 'hard',
    ZEN: 'zen'
  };
  
  let currentGameMode = GAME_MODES.NORMAL;
  let isBossLevel = false;
  
  // ============================================
  // THEME & VISUAL SETTINGS
  // ============================================
  const THEMES = {
    default: { name: 'Default (Space)', class: 'theme-space' },
    forest: { name: 'Enchanted Forest', class: 'theme-forest' },
    ocean: { name: 'Deep Ocean', class: 'theme-ocean' },
    city: { name: 'Cyber City', class: 'theme-city' }
  };
  
  const PARTICLE_STYLES = {
    default: 'default',
    minimal: 'minimal',
    sparkles: 'sparkles',
    bubbles: 'bubbles'
  };
  
  // ============================================
  // TRANSLATION SYSTEM
  // ============================================
  const translations = {
    en: {
      title: 'Emoji Memory Quest',
      tagline: 'Test your memory, match the emojis!',
      play: 'Play Game',
      menu: 'Menu',
      game: 'Game',
      store: 'Store',
      achievements: 'Achievements',
      statistics: 'Statistics',
      settings: 'Settings',
      levelMap: '🗺️ Level Map',
      restart: '🔄 Restart',
      restartLevel: '🔄 Restart Level',
      soundOn: '🔊 Sound On',
      soundOff: '🔇 Sound Off',
      sound: 'Sound',
      bestLevel: 'Best Level',
      totalCoins: 'Total Coins',
      level: 'Level',
      score: 'Score',
      time: 'Time',
      coins: 'Coins',
      combo: 'Combo',
      skinsStore: '🛍️ Store',
      storeDesc: 'Spend coins to unlock skins and power-ups!',
      achievementsDesc: 'Complete challenges to earn badges!',
      statisticsDesc: 'Track your game performance!',
      settingsDesc: 'Customize your game experience!',
      audioSettings: '🔊 Audio Settings',
      visualSettings: '🎨 Visual Settings',
      gameSettings: '🎮 Game Settings',
      resetOptions: '🔄 Reset Options',
      soundEffects: 'Sound Effects',
      backgroundMusic: 'Background Music',
      musicVolume: 'Music Volume',
      sfxVolume: 'SFX Volume',
      musicStyle: '🎵 Music Style',
      particleEffects: 'Particle Effects',
      confettiEffects: 'Confetti Effects',
      resetProgress: 'Reset Progress',
      resetStats: 'Reset Statistics',
      resetAll: 'Reset Everything',
      unlocked: 'Unlocked',
      gamesPlayed: 'Games Played',
      levelsCompleted: 'Levels Completed',
      totalMatches: 'Total Matches',
      bestCombo: 'Best Combo',
      bestTime: 'Best Time',
      totalCoinsEarned: 'Total Coins Earned',
      currentStreak: 'Current Streak',
      bestStreak: 'Best Streak',
      levelMapDesc: 'Select a level to play! Complete levels to unlock more.',
      completed: 'Completed',
      world: 'World',
      worlds: 'Worlds',
      selectWorld: '🌍 Select World',
      worldDesc: 'Choose a world to explore 1000 levels!',
      totalProgress: 'Total Progress',
      backToWorlds: '← Back to Worlds',
      backToGame: '← Back to Game',
      cheatCodes: 'Cheat Codes',
      cheatDesc: 'Enter secret codes to unlock special features!',
      unlockAll: 'Unlock All Levels',
      unlockAllDesc: 'Instantly unlock all 1000 levels across all worlds',
      millionCoins: '1 Million Coins',
      millionCoinsDesc: 'Get 1,000,000 coins to buy all skins',
      unlimitedTime: 'Unlimited Time',
      unlimitedTimeDesc: 'Remove timer - play without time limit',
      enterCode: 'Enter Cheat Code:',
      submit: 'Submit',
      invalidCode: '❌ Invalid code! Try: UNLOCKALL, MILLION, or NOTIME',
      alreadyActivated: '⚠️ Cheat already activated!',
      activate: 'Activate',
      activated: '✓ Activated',
      allLevelsUnlocked: '✅ All 1000 levels unlocked!',
      millionCoinsAdded: '✅ 1,000,000 coins added!',
      unlimitedTimeEnabled: '✅ Unlimited time enabled!',
      worldLevels: '🗺️ World Levels',
      home: 'Home',
      ok: 'OK',
      cancel: 'Cancel',
      levelComplete: 'Level Complete! 🎉',
      levelCompleteMsg: 'Level {prevLevel} Complete!\nStarting Level {newLevel}',
      gameOver: 'Game Over',
      skinUnlocked: 'Skin Unlocked! 🎉',
      skinUnlockedMsg: 'You\'ve unlocked the {skinName} skin!',
      notEnoughCoins: 'Not Enough Coins',
      needMoreCoins: 'You need {diff} more coins to unlock this skin.\n\nKeep playing to earn more coins!',
      finalScore: 'Final Score: {score}',
      coinsEarned: 'Coins Earned: {coins}',
      levelReached: 'Level Reached: {level}',
      unlockedSkin: '✓ Selected',
      select: 'Select',
      classic: 'Classic',
      neon: 'Neon',
      gold: 'Golden',
      fire: 'Inferno',
      ice: 'Frost',
      forest: 'Forest',
      cosmic: 'Cosmic',
      dark: 'Shadow',
      ocean: 'Ocean Blue',
      desert: 'Desert Sand',
      mountain: 'Mountain Peak',
      volcano: 'Volcano',
      meadow: 'Green Meadow',
      steel: 'Steel',
      circuit: 'Circuit Board',
      chrome: 'Chrome',
      copper: 'Copper',
      titanium: 'Titanium',
      starry: 'Starry Night',
      aurora: 'Aurora',
      nebula: 'Nebula',
      mars: 'Mars Red',
      moon: 'Moon',
      galaxy: 'Galaxy Spinner',
      goldshimmer: 'Gold Shimmer',
      neonpulse: 'Neon Pulse',
      crystal: 'Crystal Sparkle',
      supernova: 'Supernova',
      dailyReward: 'Daily Reward',
      claimReward: 'Claim Reward',
      powerupsStore: '⚡ Power-ups',
      skinsSection: '🎨 Card Skins',
      powerupHint: '💡 Hint',
      powerupExtraTime: '⏰ Extra Time',
      powerupFreeze: '❄️ Freeze',
      powerupReveal: '👁️ Reveal All',
      // New features
      gameModes: 'Game Modes',
      selectGameMode: '🎮 Select Game Mode',
      gameModeDesc: 'Choose your challenge level!',
      normalMode: 'Normal Mode',
      normalModeDesc: 'Standard gameplay with balanced difficulty',
      hardMode: 'Hard Mode',
      hardModeDesc: 'More cards, less time, bigger rewards!',
      zenMode: 'Zen Mode',
      zenModeDesc: 'No timer, relax and enjoy the game',
      textSize: 'Text Size',
      backgroundTheme: 'Background Theme',
      themeDefault: 'Default (Space)',
      themeForest: 'Enchanted Forest',
      themeOcean: 'Deep Ocean',
      themeCity: 'Cyber City',
      particleStyle: 'Particle Style',
      particlesDefault: 'Default',
      particlesMinimal: 'Minimal',
      particlesSparkles: 'Sparkles',
      particlesBubbles: 'Bubbles',
      emojiGlow: 'Emoji Glow on Match',
      dailyChallenges: 'Daily Challenges',
      dailyChallengesTitle: '📅 Daily Challenges',
      dailyChallengesDesc: 'Complete special challenges every day!',
      todaysChallenge: "Today's Challenge",
      weeklyProgress: 'Weekly Progress',
      weeklyTournament: '🏆 Weekly Tournament',
      tournamentDesc: 'Compete with players worldwide!',
      yourRank: 'Your Rank',
      leaderboard: 'Leaderboard',
      tournamentRewards: 'Tournament Rewards',
      levelStats: 'Level Stats',
      close: 'Close',
      dailyChallenge: 'Daily Challenge',
      bossLevel: '👑 BOSS LEVEL! 👑'
    },
    ar: {
      title: 'مغامرة ذاكرة الإيموجي',
      tagline: 'اختبر ذاكرتك، طابق الإيموجيات!',
      play: 'العب الآن',
      menu: 'القائمة',
      game: 'اللعبة',
      store: 'المتجر',
      achievements: 'الإنجازات',
      statistics: 'الإحصائيات',
      settings: 'الإعدادات',
      restart: '🔄 إعادة البدء',
      restartLevel: '🔄 إعادة المستوى',
      soundOn: '🔊 الصوت مفعّل',
      soundOff: '🔇 الصوت معطّل',
      sound: 'الصوت',
      bestLevel: 'أفضل مستوى',
      totalCoins: 'إجمالي العملات',
      level: 'المستوى',
      score: 'النقاط',
      time: 'الوقت',
      coins: 'العملات',
      combo: 'الضربة المتتالية',
      skinsStore: '🛍️ Store',
      storeDesc: 'أنفق العملات لشراء سكنات و power-ups!',
      achievementsDesc: 'أكمل التحديات لكسب الشارات!',
      statisticsDesc: 'تتبع أداء لعبك!',
      settingsDesc: 'خصص تجربة لعبك!',
      powerupsStore: '⚡ Power-ups',
      skinsSection: '🎨 Card Skins',
      audioSettings: '🔊 إعدادات الصوت',
      visualSettings: '🎨 إعدادات المرئية',
      gameSettings: '🎮 إعدادات اللعبة',
      resetOptions: '🔄 خيارات إعادة الضبط',
      soundEffects: 'المؤثرات الصوتية',
      backgroundMusic: 'الموسيقى الخلفية',
      musicVolume: 'مستوى الموسيقى',
      sfxVolume: 'مستوى المؤثرات',
      musicStyle: '🎵 نمط الموسيقى',
      particleEffects: 'تأثيرات الجسيمات',
      confettiEffects: 'تأثيرات الكونفيتي',
      resetProgress: 'إعادة ضبط التقدم',
      resetStats: 'إعادة ضبط الإحصائيات',
      resetAll: 'إعادة ضبط كل شيء',
      unlocked: 'مفتوح',
      gamesPlayed: 'الألعاب الملعوبة',
      levelsCompleted: 'المستويات المكتملة',
      totalMatches: 'إجمالي التطابقات',
      bestCombo: 'أفضل ضربة متتالية',
      bestTime: 'أفضل وقت',
      totalCoinsEarned: 'إجمالي العملات المكتسبة',
      currentStreak: 'السلسلة الحالية',
      bestStreak: 'أفضل سلسلة',
      completed: 'مكتمل',
      world: 'العالم',
      worlds: 'العوالم',
      selectWorld: '🌍 اختر العالم',
      worldDesc: 'اختر عالمًا لاستكشاف 1000 مستوى!',
      totalProgress: 'التقدم الإجمالي',
      backToWorlds: '→ العودة للعوالم',
      backToGame: '→ العودة للعبة',
      cheatCodes: 'رموز الغش',
      cheatDesc: 'أدخل الرموز السرية لفتح ميزات خاصة!',
      unlockAll: 'فتح كل المستويات',
      unlockAllDesc: 'افتح جميع 1000 مستوى في جميع العوالم فوراً',
      millionCoins: 'مليون عملة',
      millionCoinsDesc: 'احصل على 1,000,000 عملة لشراء كل السكنات',
      unlimitedTime: 'وقت غير محدود',
      unlimitedTimeDesc: 'إزالة المؤقت - العب بدون حد زمني',
      enterCode: 'أدخل رمز الغش:',
      submit: 'إرسال',
      invalidCode: '❌ رمز غير صالح! جرب: UNLOCKALL أو MILLION أو NOTIME',
      alreadyActivated: '⚠️ الغش مفعل بالفعل!',
      activate: 'تفعيل',
      activated: '✓ تم التفعيل',
      allLevelsUnlocked: '✅ تم فتح جميع 1000 مستوى!',
      millionCoinsAdded: '✅ تم إضافة 1,000,000 عملة!',
      unlimitedTimeEnabled: '✅ تم تفعيل الوقت غير المحدود!',
      worldLevels: '🗺️ مستويات العالم',
      home: 'القائمة الرئيسية',
      ok: 'موافق',
      cancel: 'إلغاء',
      levelComplete: 'اكتمل المستوى! 🎉',
      levelCompleteMsg: 'اكتمل المستوى {prevLevel}!\nبدء المستوى {newLevel}',
      gameOver: 'انتهت اللعبة',
      skinUnlocked: 'تم فتح السكن! 🎉',
      skinUnlockedMsg: 'لقد فتحت سكن {skinName}!',
      notEnoughCoins: 'عملات غير كافية',
      needMoreCoins: 'تحتاج إلى {diff} عملات إضافية لشراء هذا السكن.\n\nاستمر في اللعب لكسب المزيد!',
      finalScore: 'النقاط النهائية: {score}',
      coinsEarned: 'العملات المكتسبة: {coins}',
      levelReached: 'المستوى المحقق: {level}',
      unlockedSkin: '✓ تم الاختيار',
      select: 'اختيار',
      classic: 'كلاسيكي',
      neon: 'نيون',
      gold: 'ذهبي',
      fire: 'لافح',
      ice: 'جليدي',
      forest: 'غابة',
      cosmic: 'كوني',
      dark: 'ظلال',
      ocean: 'أزرق محيط',
      desert: 'صحراوي',
      mountain: 'جبلي',
      volcano: 'بركاني',
      meadow: 'مرعى أخضر',
      steel: 'فولاذي',
      circuit: 'دائرة إلكترونية',
      chrome: 'كروم',
      copper: 'نحاسي',
      titanium: 'تيتانيوم',
      starry: 'نجوم الليل',
      aurora: 'شفق قطبي',
      nebula: 'سديم',
      mars: 'المريخ',
      moon: 'قمر',
      galaxy: 'دوار المجرة',
      goldshimmer: 'ذهبي متألق',
      neonpulse: 'نيون نابض',
      crystal: 'بلوري متلألئ',
      supernova: 'مستعر أعظم',
      dailyReward: 'المكافأة اليومية',
      claimReward: 'استلام المكافأة',
      powerupsStore: '⚡ Power-ups',
      skinsSection: '🎨 Card Skins',
      powerupHint: '💡 تلميح',
      powerupExtraTime: '⏰ وقت إضافي',
      powerupFreeze: '❄️ تجميد',
      powerupReveal: '👁️ كشف الكل',
      // New features Arabic
      gameModes: 'أوضاع اللعب',
      selectGameMode: '🎮 اختر وضع اللعب',
      gameModeDesc: 'اختر مستوى التحدي!',
      normalMode: 'الوضع العادي',
      normalModeDesc: 'لعب قياسي بصعوبة متوازنة',
      hardMode: 'الوضع الصعب',
      hardModeDesc: 'المزيد من البطاقات، وقت أقل، مكافآت أكبر!',
      zenMode: 'وضع زين',
      zenModeDesc: 'بدون مؤقت، استرخ واستمتع باللعبة',
      textSize: 'حجم النص',
      backgroundTheme: 'سمة الخلفية',
      themeDefault: 'افتراضي (الفضاء)',
      themeForest: 'غابة ساحرة',
      themeOcean: 'أعماق المحيط',
      themeCity: 'مدينة المستقبل',
      particleStyle: 'نمط الجسيمات',
      particlesDefault: 'افتراضي',
      particlesMinimal: 'بسيط',
      particlesSparkles: 'ومضات',
      particlesBubbles: 'فقاعات',
      emojiGlow: 'توهج الإيموجي عند التطابق',
      dailyChallenges: 'التحديات اليومية',
      dailyChallengesTitle: '📅 التحديات اليومية',
      dailyChallengesDesc: 'أكمل تحديات خاصة كل يوم!',
      todaysChallenge: 'تحدي اليوم',
      weeklyProgress: 'التقدم الأسبوعي',
      weeklyTournament: '🏆 البطولة الأسبوعية',
      tournamentDesc: 'تنافس مع اللاعبين حول العالم!',
      yourRank: 'ترتيبك',
      leaderboard: 'لوحة المتصدرين',
      tournamentRewards: 'مكافآت البطولة',
      levelStats: 'إحصائيات المستوى',
      close: 'إغلاق',
      dailyChallenge: 'التحدي اليومي',
      bossLevel: '👑 مستوى الزعيم! 👑'
    }
  };
  
  // Language Manager
  const i18n = {
    currentLang: 'en',
    
    init: function() {
      const savedLang = localStorage.getItem('emoji_language');
      if (savedLang && translations[savedLang]) {
        this.currentLang = savedLang;
      }
      this.apply();
    },
    
    setLanguage: function(lang) {
      if (translations[lang]) {
        this.currentLang = lang;
        localStorage.setItem('emoji_language', lang);
        this.apply();
        return true;
      }
      return false;
    },
    
    toggle: function() {
      const newLang = this.currentLang === 'en' ? 'ar' : 'en';
      this.setLanguage(newLang);
    },
    
    get: function(key, replacements = {}) {
      const text = translations[this.currentLang][key] || translations['en'][key] || key;
      return text.replace(/\{(\w+)\}/g, (match, key) => replacements[key] !== undefined ? replacements[key] : match);
    },
    
    apply: function() {
      document.documentElement.lang = this.currentLang;
      document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      
      document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[this.currentLang][key]) {
          el.textContent = translations[this.currentLang][key];
        }
      });
      
      document.title = this.get('title');
      renderSkinsUI();
      renderAchievementsUI();
    }
  };
  
  // ============================================
  // CUSTOM DIALOG MANAGER
  // ============================================
  const dialogManager = {
    currentResolve: null,
    
    show: function(options) {
      return new Promise((resolve) => {
        this.currentResolve = resolve;
        
        dialogIcon.textContent = options.icon || '🎮';
        dialogTitle.textContent = options.titleKey ? i18n.get(options.titleKey, options.replacements) : options.title;
        dialogMessage.textContent = options.messageKey ? i18n.get(options.messageKey, options.replacements) : options.message;
        
        dialogBtnPrimary.textContent = options.primaryText || i18n.get('ok');
        dialogBtnSecondary.textContent = options.secondaryText || i18n.get('cancel');
        
        dialogBtnSecondary.style.display = options.showSecondary ? 'inline-block' : 'none';
        
        dialogBox.className = 'dialog-box ' + (options.type || '');
        
        dialogOverlay.classList.add('active');
        
        dialogBtnPrimary.onclick = () => {
          this.hide();
          resolve(true);
        };
        
        dialogBtnSecondary.onclick = () => {
          this.hide();
          resolve(false);
        };
        
        dialogOverlay.onclick = (e) => {
          if (e.target === dialogOverlay) {
            this.hide();
            resolve(false);
          }
        };
      });
    },
    
    hide: function() {
      dialogOverlay.classList.remove('active');
    },
    
    alert: function(message, title = 'Notification', icon = '🎮') {
      return this.show({ message, title, icon, type: '', showSecondary: false });
    },
    
    confirm: function(message, title = 'Confirm', icon = '❓') {
      return this.show({ message, title, icon, type: 'warning', showSecondary: true, primaryText: 'Yes', secondaryText: 'No' });
    },
    
    success: function(message, title = 'Success!', icon = '🎉') {
      return this.show({ message, title, icon, type: 'success', showSecondary: false });
    },
    
    error: function(message, title = 'Game Over', icon = '💀') {
      return this.show({ message, title, icon, type: 'error', showSecondary: false });
    }
  };
  
  // ============================================
  // AUDIO SYSTEM (Web Audio API)
  // ============================================
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  const audioManager = {
    soundEnabled: true,
    musicEnabled: false,
    musicVolume: 0.5,
    sfxVolume: 0.7,
    currentMusic: null,
    musicOscillator: null,
    musicGainNode: null,
    
    playTone: function(frequency, duration, type = 'sine', volume = 0.3) {
      if (!this.soundEnabled || !audioCtx) return;
      
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      const actualVolume = volume * this.sfxVolume;
      gainNode.gain.setValueAtTime(actualVolume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + duration);
    },
    
    playMelody: function(notes, volume = 0.3) {
      if (!this.soundEnabled || !audioCtx) return;
      let time = 0;
      notes.forEach(note => {
        setTimeout(() => {
          this.playTone(note.freq, note.dur, note.type || 'sine', volume);
        }, time * 1000);
        time += note.dur;
      });
    },
    
    flip: function() {
      this.playTone(400, 0.1, 'sine', 0.2);
    },
    
    match: function() {
      this.playMelody([
        { freq: 523, dur: 0.1 },
        { freq: 659, dur: 0.1 },
        { freq: 784, dur: 0.2 }
      ], 0.3);
    },
    
    levelUp: function() {
      this.playMelody([
        { freq: 523, dur: 0.1 },
        { freq: 659, dur: 0.1 },
        { freq: 784, dur: 0.1 },
        { freq: 1047, dur: 0.3 }
      ], 0.4);
    },
    
    gameOver: function() {
      this.playMelody([
        { freq: 784, dur: 0.2 },
        { freq: 659, dur: 0.2 },
        { freq: 523, dur: 0.3 }
      ], 0.3);
    },
    
    win: function() {
      this.playMelody([
        { freq: 523, dur: 0.1 },
        { freq: 659, dur: 0.1 },
        { freq: 784, dur: 0.1 },
        { freq: 1047, dur: 0.2 },
        { freq: 1319, dur: 0.3 }
      ], 0.4);
    },
    
    coin: function() {
      this.playTone(1200, 0.1, 'sine', 0.2);
      setTimeout(() => this.playTone(1500, 0.1, 'sine', 0.2), 50);
    },
    
    powerup: function() {
      this.playMelody([
        { freq: 600, dur: 0.1 },
        { freq: 800, dur: 0.1 },
        { freq: 1000, dur: 0.2 }
      ], 0.3);
    },

    playIntro: function() {
      if (!this.soundEnabled) return;
      this.playMelody([
        { freq: 523, dur: 0.15 },
        { freq: 659, dur: 0.15 },
        { freq: 784, dur: 0.2 },
        { freq: 1047, dur: 0.3 }
      ], 0.3);
    },

    setSfxVolume: function(volume) {
      this.sfxVolume = volume / 100;
    }
  };
  
  // ============================================
  // VISUAL EFFECTS SYSTEM
  // ============================================
  const effectsManager = {
    particlesEnabled: true,
    confettiEnabled: true,
    particleStyle: 'default',
    emojiGlowEnabled: true,
    
    // Particle Effects with styles
    createParticles: function(x, y, color = '#7df9ff', count = 8) {
      if (!this.particlesEnabled) return;
      
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = `particle ${this.particleStyle}`;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = color;
        
        const angle = (Math.PI * 2 * i) / count;
        const distance = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
      }
    },
    
    // Confetti Effect
    createConfetti: function() {
      if (!this.confettiEnabled) return;
      
      const colors = ['#ff6b6b', '#4ade80', '#7df9ff', '#ffd700', '#ff8c00', '#a855f7'];
      
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }
    },
    
    // Floating Coins
    createFloatingCoin: function(x, y, amount = 5) {
      const coin = document.createElement('div');
      coin.className = 'floating-coin';
      coin.textContent = `💰 +${amount}`;
      coin.style.left = x + 'px';
      coin.style.top = y + 'px';
      
      floatingCoinsContainer.appendChild(coin);
      
      setTimeout(() => coin.remove(), 1500);
    },
    
    // Card Match Effect
    onCardMatch: function(cardElement, x, y) {
      const rect = cardElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      this.createParticles(centerX, centerY, '#4ade80', 12);
    },
    
    // Level Complete Effect
    onLevelComplete: function() {
      this.createConfetti();
      audioManager.win();
    },
    
    // Boss Level Effect
    showBossEffect: function() {
      const bossIndicator = document.createElement('div');
      bossIndicator.className = 'boss-level-indicator';
      bossIndicator.textContent = i18n.get('bossLevel');
      document.body.appendChild(bossIndicator);
      
      setTimeout(() => bossIndicator.remove(), 3000);
    }
  };
  
  // ============================================
  // THEME MANAGER
  // ============================================
  const themeManager = {
    currentTheme: 'default',
    
    init: function() {
      const savedTheme = localStorage.getItem('emoji_theme') || 'default';
      this.setTheme(savedTheme);
    },
    
    setTheme: function(themeId) {
      if (THEMES[themeId]) {
        this.currentTheme = themeId;
        backgroundTheme.className = 'background-theme ' + THEMES[themeId].class;
        localStorage.setItem('emoji_theme', themeId);
        
        // Update select element
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) themeSelect.value = themeId;
      }
    }
  };
  
  // ============================================
  // TEXT SIZE MANAGER
  // ============================================
  const textSizeManager = {
    currentSize: 100,
    
    init: function() {
      const savedSize = localStorage.getItem('emoji_text_size');
      if (savedSize) {
        this.currentSize = parseInt(savedSize);
        this.applySize(this.currentSize);
      }
    },
    
    setSize: function(size) {
      this.currentSize = size;
      this.applySize(size);
      localStorage.setItem('emoji_text_size', size);
      
      // Update slider
      const slider = document.getElementById('textSizeSlider');
      const value = document.getElementById('textSizeValue');
      if (slider) slider.value = size;
      if (value) value.textContent = size + '%';
    },
    
    applySize: function(size) {
      document.documentElement.style.setProperty('--text-size', size + '%');
    }
  };
  
  // ============================================
  // GAME STATE
  // ============================================
  let level = 1;
  let score = 0;
  let time = 60;
  let pausedTime = 0; // Track remaining time when paused
  let isTimerPaused = false; // Track if timer is currently paused
  let coins = 0;
  let locked = false;
  let timerId = null;
  let deck = [];
  let opened = [];
  let matches = 0;
  let levelCards = 4;
  let cardElements = [];
  
  // Combo System
  let combo = 0;
  let comboTimer = null;
  
  // Power-ups
  let powerups = {
    hint: 3,
    extraTime: 2,
    freeze: 1,
    reveal: 1
  };
  
  // Statistics
  let statistics = {
    gamesPlayed: 0,
    levelsCompleted: 0,
    totalMatches: 0,
    bestCombo: 0,
    bestTime: null,
    totalCoinsEarned: 0,
    currentStreak: 0,
    bestStreak: 0,
    playTime: 0
  };
  
  // Settings
  let gameSettings = {
    soundEnabled: true,
    musicEnabled: false,
    musicVolume: 50,
    sfxVolume: 70,
    particlesEnabled: true,
    confettiEnabled: true,
    textSize: 100,
    theme: 'default',
    particleStyle: 'default',
    emojiGlow: true,
    graphicQuality: 'high'
  };
  
  // Level Stats with Stars
  let levelStats = {};
  
  // Audio state
  let introPlayed = false;
  
  // ============================================
  // SKINS STORE
  // ============================================
  const skins = [
    { id: 'default', name: 'Classic', price: 0, unlocked: true, css: 'skin-theme-default', emoji: '🎴' },
    { id: 'neon', name: 'Neon', price: 100, unlocked: false, css: 'skin-theme-neon', emoji: '💎' },
    { id: 'gold', name: 'Golden', price: 250, unlocked: false, css: 'skin-theme-gold', emoji: '👑' },
    { id: 'fire', name: 'Inferno', price: 350, unlocked: false, css: 'skin-theme-fire', emoji: '🔥' },
    { id: 'ice', name: 'Frost', price: 350, unlocked: false, css: 'skin-theme-ice', emoji: '❄️' },
    { id: 'forest', name: 'Forest', price: 450, unlocked: false, css: 'skin-theme-forest', emoji: '🌲' },
    { id: 'cosmic', name: 'Cosmic', price: 600, unlocked: false, css: 'skin-theme-cosmic', emoji: '🌌' },
    { id: 'ocean', name: 'Ocean Blue', price: 200, unlocked: false, css: 'skin-theme-ocean', emoji: '🌊' },
    { id: 'desert', name: 'Desert Sand', price: 250, unlocked: false, css: 'skin-theme-desert', emoji: '🏜️' },
    { id: 'mountain', name: 'Mountain Peak', price: 300, unlocked: false, css: 'skin-theme-mountain', emoji: '⛰️' },
    { id: 'volcano', name: 'Volcano', price: 350, unlocked: false, css: 'skin-theme-volcano', emoji: '🌋' },
    { id: 'meadow', name: 'Green Meadow', price: 400, unlocked: false, css: 'skin-theme-meadow', emoji: '🌿' },
    { id: 'steel', name: 'Steel', price: 450, unlocked: false, css: 'skin-theme-steel', emoji: '⚙️' },
    { id: 'circuit', name: 'Circuit Board', price: 500, unlocked: false, css: 'skin-theme-circuit', emoji: '🔌' },
    { id: 'chrome', name: 'Chrome', price: 550, unlocked: false, css: 'skin-theme-chrome', emoji: '🔩' },
    { id: 'copper', name: 'Copper', price: 600, unlocked: false, css: 'skin-theme-copper', emoji: '⚡' },
    { id: 'titanium', name: 'Titanium', price: 650, unlocked: false, css: 'skin-theme-titanium', emoji: '🔧' },
    { id: 'starry', name: 'Starry Night', price: 700, unlocked: false, css: 'skin-theme-starry', emoji: '🌙' },
    { id: 'aurora', name: 'Aurora', price: 800, unlocked: false, css: 'skin-theme-aurora', emoji: '🌠' },
    { id: 'nebula', name: 'Nebula', price: 900, unlocked: false, css: 'skin-theme-nebula', emoji: '🌌' },
    { id: 'mars', name: 'Mars Red', price: 950, unlocked: false, css: 'skin-theme-mars', emoji: '🪐' },
    { id: 'moon', name: 'Moon', price: 1100, unlocked: false, css: 'skin-theme-moon', emoji: '🌙' },
    { id: 'dark', name: 'Shadow', price: 1500, unlocked: false, css: 'skin-theme-dark', emoji: '🌑' },
    { id: 'galaxy', name: 'Galaxy Spinner', price: 2000, unlocked: false, css: 'skin-theme-galaxy', emoji: '🌌', animated: true },
    { id: 'goldshimmer', name: 'Gold Shimmer', price: 2500, unlocked: false, css: 'skin-theme-gold-shimmer', emoji: '✨', animated: true },
    { id: 'neonpulse', name: 'Neon Pulse', price: 3000, unlocked: false, css: 'skin-theme-neon-pulse', emoji: '💫', animated: true },
    { id: 'crystal', name: 'Crystal Sparkle', price: 4000, unlocked: false, css: 'skin-theme-crystal', emoji: '💎', animated: true },
    { id: 'supernova', name: 'Supernova', price: 5000, unlocked: false, css: 'skin-theme-supernova', emoji: '☄️', animated: true },
    { id: 'phoenix', name: 'Phoenix Rebirth', price: 6000, unlocked: false, css: 'skin-theme-phoenix', emoji: '🔥', animated: true },
    { id: 'dragon', name: 'Ancient Dragon', price: 7500, unlocked: false, css: 'skin-theme-dragon', emoji: '🐉', animated: true },
    { id: 'thunder', name: 'Thunder God', price: 8000, unlocked: false, css: 'skin-theme-thunder', emoji: '⚡', animated: true },
    { id: 'void', name: 'Void Walker', price: 9000, unlocked: false, css: 'skin-theme-void', emoji: '🌑', animated: true },
    { id: 'angel', name: 'Fallen Angel', price: 10000, unlocked: false, css: 'skin-theme-angel', emoji: '👼', animated: true },
    { id: 'demon', name: 'Demon Lord', price: 11000, unlocked: false, css: 'skin-theme-demon', emoji: '👿', animated: true },
    { id: 'time', name: 'Time Lord', price: 12000, unlocked: false, css: 'skin-theme-time', emoji: '⏳', animated: true },
    { id: 'infinity', name: 'Infinity Stones', price: 15000, unlocked: false, css: 'skin-theme-infinity', emoji: '💠', animated: true },
    { id: 'god', name: 'God Mode', price: 20000, unlocked: false, css: 'skin-theme-god', emoji: '👑', animated: true }
  ];
  let currentSkin = skins[0].id;
  
  // Emoji Pool
  const emojiSets = {
    animals: ['🐶', '🐱', '🐼', '🐨', '🦊', '🐰', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🦋', '🐝', '🐞', '🐢'],
    food: ['🍎', '🍌', '🍊', '🍉', '🍓', '🍇', '🍑', '🍍', '🥝', '🥑', '🥕', '🌽', '🌶️', '🍄', '🥦', '🍆'],
    objects: ['🎈', '🎲', '🧁', '🪄', '🎁', '🎨', '🎭', '🎪', '📚', '🏆', '🎸', '🎺', '📷', '🔑', '💡', '🕰️'],
    nature: ['🌻', '🌺', '🌹', '🌵', '🌲', '🌴', '🍁', '🍄', '🌰', '🌼', '🌷', '🌿', '☘️', '🍀', '💐', '🌸'],
    places: ['🏰', '🌃', '🗽', '🗼', '🏯', '🏝️', '🏔️', '🌋', '🏛️', '⛩️', '🕍', '🕌', '⛪', '🏟️', '🎡', '🎢']
  };
  
  // ============================================
  // LEVEL & WORLD SYSTEM
  // ============================================
  const TOTAL_LEVELS = 1000;
  const LEVELS_PER_WORLD = 100;
  const TOTAL_WORLDS = 10;
  let levelProgress = {};
  let currentWorld = 1;
  let cheats = { unlockAll: false, millionCoins: false, unlimitedTime: false };
  
  const worlds = [
    { id: 1, name: 'Starter Valley', nameAr: 'وادي البداية', icon: '🌱', color: '#4ade80' },
    { id: 2, name: 'Sunset Beach', nameAr: 'شاطئ الغروب', icon: '🏖️', color: '#fb923c' },
    { id: 3, name: 'Crystal Cave', nameAr: 'كهف الكريستال', icon: '💎', color: '#a5b4fc' },
    { id: 4, name: 'Mystic Forest', nameAr: 'الغابة الغامضة', icon: '🌲', color: '#22c55e' },
    { id: 5, name: 'Golden Desert', nameAr: 'الصحراء الذهبية', icon: '🏜️', color: '#fbbf24' },
    { id: 6, name: 'Frozen Peaks', nameAr: 'قمم الجليد', icon: '🏔️', color: '#67e8f9' },
    { id: 7, name: 'Volcano Core', nameAr: 'قلب البركان', icon: '🌋', color: '#f87171' },
    { id: 8, name: 'Sky Temple', nameAr: 'معبد السماء', icon: '🏛️', color: '#c084fc' },
    { id: 9, name: 'Cosmic Void', nameAr: 'الفضاء الكوني', icon: '🌌', color: '#818cf8' },
    { id: 10, name: 'Master Realm', nameAr: 'عالم الأساتذة', icon: '👑', color: '#fbbf24' }
  ];
  
  // ============================================
  // ACHIEVEMENTS SYSTEM
  // ============================================
  const achievements = [
    { id: 'first_match', name: 'First Match', nameAr: 'أول تطابق', desc: 'Make your first match', descAr: 'قم بأول تطابق', icon: '🎯', unlocked: false, reward: 50 },
    { id: 'level_5', name: 'Getting Started', nameAr: 'بداية جيدة', desc: 'Complete level 5', descAr: 'أكمل المستوى 5', icon: '🚀', unlocked: false, reward: 100 },
    { id: 'level_10', name: 'Double Digits', nameAr: 'أرقام مزدوجة', desc: 'Complete level 10', descAr: 'أكمل المستوى 10', icon: '🔟', unlocked: false, reward: 150 },
    { id: 'level_25', name: 'Quarter Century', nameAr: 'ربع قرن', desc: 'Complete level 25', descAr: 'أكمل المستوى 25', icon: '💪', unlocked: false, reward: 250 },
    { id: 'level_50', name: 'Halfway Hero', nameAr: 'بطل منتصف الطريق', desc: 'Complete level 50', descAr: 'أكمل المستوى 50', icon: '🏆', unlocked: false, reward: 500 },
    { id: 'level_100', name: 'Centurion', nameAr: 'المئوي', desc: 'Complete level 100', descAr: 'أكمل المستوى 100', icon: '👑', unlocked: false, reward: 1000 },
    { id: 'skin_collector', name: 'Skin Collector', nameAr: 'جامع السكنات', desc: 'Unlock 5 skins', descAr: 'افتح 5 سكنات', icon: '🎨', unlocked: false, reward: 300 },
    { id: 'skin_master', name: 'Skin Master', nameAr: 'سيد السكنات', desc: 'Unlock all skins', descAr: 'افتح كل السكنات', icon: '💎', unlocked: false, reward: 1000 },
    { id: 'combo_5', name: 'Combo Starter', nameAr: 'مبتدئ الضربات', desc: 'Reach a 5x combo', descAr: 'وصل إلى ضربة متتالية 5x', icon: '⚡', unlocked: false, reward: 100 },
    { id: 'combo_10', name: 'Combo Master', nameAr: 'سيد الضربات', desc: 'Reach a 10x combo', descAr: 'وصل إلى ضربة متتالية 10x', icon: '🔥', unlocked: false, reward: 300 },
    { id: 'speed_demon', name: 'Speed Demon', nameAr: 'شيطان السرعة', desc: 'Complete a level in under 15 seconds', descAr: 'أكمل مستوى في أقل من 15 ثانية', icon: '⚡', unlocked: false, reward: 200 },
    { id: 'perfect_game', name: 'Perfect Game', nameAr: 'لعبة مثالية', desc: 'Complete a level without mistakes', descAr: 'أكمل مستوى بدون أخطاء', icon: '✨', unlocked: false, reward: 250 },
    { id: 'coin_collector', name: 'Coin Collector', nameAr: 'جامع العملات', desc: 'Collect 1000 coins', descAr: 'اجمع 1000 عملة', icon: '💰', unlocked: false, reward: 200 },
    { id: 'coin_hoarder', name: 'Coin Hoarder', nameAr: 'مكدس العملات', desc: 'Collect 5000 coins', descAr: 'اجمع 5000 عملة', icon: '🪙', unlocked: false, reward: 500 },
    { id: 'world_traveler', name: 'World Traveler', nameAr: 'مسافر العالم', desc: 'Unlock 3 worlds', descAr: 'افتح 3 عوالم', icon: '🌍', unlocked: false, reward: 300 },
    { id: 'world_conqueror', name: 'World Conqueror', nameAr: 'غازي العالم', desc: 'Unlock all worlds', descAr: 'افتح كل العوالم', icon: '🌎', unlocked: false, reward: 800 },
    { id: 'daily_player', name: 'Daily Player', nameAr: 'لاعب يومي', desc: 'Claim 3 daily rewards', descAr: 'استلم 3 مكافآت يومية', icon: '📅', unlocked: false, reward: 150 },
    { id: 'streak_3', name: 'On Fire', nameAr: 'مشتعل', desc: 'Win 3 levels in a row', descAr: 'اربح 3 مستويات متتالية', icon: '🔥', unlocked: false, reward: 200 },
    { id: 'streak_10', name: 'Unstoppable', nameAr: 'لا يقهر', desc: 'Win 10 levels in a row', descAr: 'اربح 10 مستويات متتالية', icon: '🚀', unlocked: false, reward: 500 },
    { id: 'hint_master', name: 'Hint Master', nameAr: 'سيد التلميحات', desc: 'Use hints 20 times', descAr: 'استخدم التلميحات 20 مرة', icon: '💡', unlocked: false, reward: 100 },
    // New mode achievements
    { id: 'hard_mode_hero', name: 'Hard Mode Hero', nameAr: 'بطل الوضع الصعب', desc: 'Complete 10 levels in Hard Mode', descAr: 'أكمل 10 مستويات في الوضع الصعب', icon: '🔥', unlocked: false, reward: 500 },
    { id: 'zen_master', name: 'Zen Master', nameAr: 'سيد زين', desc: 'Complete 20 levels in Zen Mode', descAr: 'أكمل 20 مستوى في وضع زين', icon: '🧘', unlocked: false, reward: 400 },
    { id: 'boss_slayer', name: 'Boss Slayer', nameAr: 'قاتل الزعماء', desc: 'Complete 5 Boss levels', descAr: 'أكمل 5 مستويات زعماء', icon: '👑', unlocked: false, reward: 1000 }
  ];
  
  // ============================================
  // DAILY CHALLENGES SYSTEM
  // ============================================
  const dailyChallenges = {
    lastUpdated: null,
    currentChallenge: null,
    progress: 0,
    completed: [],
    weeklyStreak: 0,
    
    challengeTypes: [
      { type: 'speedRun', name: 'Speed Run', desc: 'Complete {target} levels in under 3 minutes', reward: 500 },
      { type: 'comboMaster', name: 'Combo Master', desc: 'Get a {target}x combo', reward: 300 },
      { type: 'perfectLevels', name: 'Perfect Play', desc: 'Complete {target} levels without mistakes', reward: 400 },
      { type: 'collectCoins', name: 'Coin Collector', desc: 'Collect {target} coins in one session', reward: 350 },
      { type: 'hardModeLevels', name: 'Hard Mode Warrior', desc: 'Complete {target} levels in Hard Mode', reward: 600 }
    ],
    
    init: function() {
      const saved = localStorage.getItem('emoji_daily_challenges');
      if (saved) {
        const data = JSON.parse(saved);
        this.lastUpdated = data.lastUpdated;
        this.completed = data.completed || [];
        this.weeklyStreak = data.weeklyStreak || 0;
      }
      this.checkAndUpdateChallenge();
    },
    
    checkAndUpdateChallenge: function() {
      const today = new Date().toDateString();
      if (this.lastUpdated !== today) {
        this.generateNewChallenge();
        this.lastUpdated = today;
        this.save();
      }
    },
    
    generateNewChallenge: function() {
      const type = this.challengeTypes[Math.floor(Math.random() * this.challengeTypes.length)];
      const targets = { speedRun: 5, comboMaster: 8, perfectLevels: 3, collectCoins: 100, hardModeLevels: 3 };
      
      this.currentChallenge = {
        ...type,
        target: targets[type.type],
        progress: 0
      };
      this.progress = 0;
    },
    
    updateProgress: function(type, amount = 1) {
      if (!this.currentChallenge || this.currentChallenge.type !== type) return;
      
      this.currentChallenge.progress += amount;
      
      if (this.currentChallenge.progress >= this.currentChallenge.target) {
        this.completeChallenge();
      }
      this.save();
    },
    
    completeChallenge: function() {
      if (!this.completed.includes(this.lastUpdated)) {
        this.completed.push(this.lastUpdated);
        coins += this.currentChallenge.reward;
        statistics.totalCoinsEarned += this.currentChallenge.reward;
        
        // Update weekly streak
        this.updateWeeklyStreak();
        
        dialogManager.success(
          `🎉 ${this.currentChallenge.name} Complete!\n💰 +${this.currentChallenge.reward} coins`,
          'Challenge Complete!',
          '🏆'
        );
        
        checkAchievement('daily_player', this.completed.length >= 3);
        saveAll();
      }
    },
    
    updateWeeklyStreak: function() {
      const today = new Date();
      const lastComplete = this.completed.length > 0 ? new Date(this.completed[this.completed.length - 1]) : null;
      
      if (lastComplete) {
        const diffDays = Math.floor((today - lastComplete) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          this.weeklyStreak++;
        } else if (diffDays > 1) {
          this.weeklyStreak = 1;
        }
      } else {
        this.weeklyStreak = 1;
      }
      
      // Weekly bonus
      if (this.weeklyStreak >= 7) {
        coins += 2000;
        statistics.totalCoinsEarned += 2000;
        dialogManager.success(
          '🔥 Weekly Streak Complete!\n💰 +2000 bonus coins!',
          'Weekly Bonus!',
          '🎁'
        );
        this.weeklyStreak = 0;
      }
    },
    
    save: function() {
      localStorage.setItem('emoji_daily_challenges', JSON.stringify({
        lastUpdated: this.lastUpdated,
        currentChallenge: this.currentChallenge,
        completed: this.completed,
        weeklyStreak: this.weeklyStreak
      }));
    },
    
    getTodayProgress: function() {
      if (!this.currentChallenge) return 0;
      return Math.min(100, (this.currentChallenge.progress / this.currentChallenge.target) * 100);
    },
    
    isCompletedToday: function() {
      const today = new Date().toDateString();
      return this.completed.includes(today);
    }
  };
  
  // ============================================
  // TOURNAMENT / LEADERBOARD SYSTEM
  // ============================================
  const tournamentManager = {
    currentWeek: null,
    playerScore: 0,
    playerRank: 0,
    endDate: null,
    
    init: function() {
      this.generateNewTournament();
    },
    
    generateNewTournament: function() {
      const now = new Date();
      this.currentWeek = this.getWeekNumber(now);
      this.endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      this.playerScore = 0;
      this.playerRank = Math.floor(Math.random() * 50) + 50; // Start at rank 50-100
    },
    
    getWeekNumber: function(d) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      return weekNo;
    },
    
    addScore: function(points) {
      this.playerScore += points;
      // Simulate rank improvement
      if (this.playerRank > 1 && Math.random() > 0.7) {
        this.playerRank--;
      }
    },
    
    getTimeRemaining: function() {
      const now = new Date();
      const diff = this.endDate - now;
      
      if (diff <= 0) {
        this.generateNewTournament();
        return this.getTimeRemaining();
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${days}d ${hours}h ${minutes}m`;
    },
    
    getLeaderboard: function() {
      // Generate fake leaderboard data
      const names = ['🎮 ProGamer', '🏆 Champion', '⚡ Speedy', '🎯 Accurate', 
                     '🔥 FireMaster', '❄️ IceQueen', '🎪 Circus', '🚀 Rocket', '🌙 MoonPlayer', '💎 Diamond'];
      const leaderboard = [];
      
      for (let i = 1; i <= 10; i++) {
        const baseScore = 10000 - (i * 800);
        leaderboard.push({
          rank: i,
          name: names[i - 1] || `Player ${i}`,
          score: baseScore + Math.floor(Math.random() * 500),
          isPlayer: false
        });
      }
      
      // Insert player at their rank
      if (this.playerRank <= 10) {
        leaderboard.splice(this.playerRank - 1, 0, {
          rank: this.playerRank,
          name: '👤 You',
          score: this.playerScore,
          isPlayer: true
        });
        leaderboard.length = 10;
      }
      
      return leaderboard;
    }
  };
  
  // ============================================
  // DAILY REWARDS SYSTEM
  // ============================================
  const dailyRewards = {
    lastClaimed: null,
    streak: 0,
    
    init: function() {
      const saved = localStorage.getItem('emoji_daily_rewards');
      if (saved) {
        const data = JSON.parse(saved);
        this.lastClaimed = data.lastClaimed ? new Date(data.lastClaimed) : null;
        this.streak = data.streak || 0;
      }
      this.updateUI();
    },
    
    canClaim: function() {
      if (!this.lastClaimed) return true;
      const now = new Date();
      const last = new Date(this.lastClaimed);
      const hoursDiff = (now - last) / (1000 * 60 * 60);
      return hoursDiff >= 24;
    },
    
    getRewardAmount: function() {
      const baseAmount = 30;
      const streakBonus = Math.min(this.streak * 5, 30);
      return baseAmount + streakBonus;
    },
    
    claim: function() {
      if (!this.canClaim()) return false;
      
      const now = new Date();
      const last = this.lastClaimed ? new Date(this.lastClaimed) : null;
      
      if (last) {
        const hoursDiff = (now - last) / (1000 * 60 * 60);
        if (hoursDiff < 48) {
          this.streak = Math.min(this.streak + 1, 7);
        } else {
          this.streak = 1;
        }
      } else {
        this.streak = 1;
      }
      
      this.lastClaimed = now.toISOString();
      this.save();
      
      const amount = this.getRewardAmount();
      coins += amount;
      statistics.totalCoinsEarned += amount;
      saveAll();
      
      checkAchievement('daily_player', this.streak >= 3);
      
      return amount;
    },
    
    getTimeUntilNext: function() {
      if (!this.lastClaimed) return 0;
      const now = new Date();
      const last = new Date(this.lastClaimed);
      const nextClaim = new Date(last.getTime() + 24 * 60 * 60 * 1000);
      const diff = nextClaim - now;
      return Math.max(0, diff);
    },
    
    formatTime: function(ms) {
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    updateUI: function() {
      if (dailyRewardBadge && dailyRewardTimer) {
        if (this.canClaim()) {
          dailyRewardBadge.classList.remove('claimed');
          dailyRewardTimer.textContent = '';
        } else {
          dailyRewardBadge.classList.add('claimed');
          const timeLeft = this.getTimeUntilNext();
          dailyRewardTimer.textContent = this.formatTime(timeLeft);
        }
      }
    },
    
    save: function() {
      localStorage.setItem('emoji_daily_rewards', JSON.stringify({
        lastClaimed: this.lastClaimed,
        streak: this.streak
      }));
    }
  };
  
  // ============================================
  // CORE GAME FUNCTIONS
  // ============================================
  function getRandomEmojis(count) {
    const allEmojis = Object.values(emojiSets).flat();
    const pool = [];
    while (pool.length < count) {
      const pick = allEmojis[Math.floor(Math.random() * allEmojis.length)];
      if (!pool.includes(pick)) pool.push(pick);
    }
    return pool;
  }
  
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  function buildDeck(n) {
    const pairs = n / 2;
    const pool = getRandomEmojis(pairs);
    let d = [];
    pool.forEach((e) => {
      d.push({ emoji: e, id: e + Math.random(), flipped: false, matched: false });
      d.push({ emoji: e, id: e + Math.random(), flipped: false, matched: false });
    });
    return shuffle(d);
  }
  
  // ============================================
  // GAME MODE FUNCTIONS
  // ============================================
  function setGameMode(mode) {
    currentGameMode = mode;
    
    // Update indicator
    if (gameModeIndicator) {
      gameModeIndicator.className = 'game-mode-indicator mode-' + mode;
      gameModeIndicator.textContent = i18n.get(mode + 'Mode');
    }
    
    // Save preference
    localStorage.setItem('emoji_game_mode', mode);
    
    // Initialize level based on mode
    if (mode === GAME_MODES.HARD) {
      levelCards = 20;
    } else {
      levelCards = 4;
    }
  }
  
  function checkBossLevel() {
    isBossLevel = level % 100 === 0;
    if (isBossLevel) {
      effectsManager.showBossEffect();
      // Boss levels have special rewards
      return true;
    }
    return false;
  }
  
  // ============================================
  // NAVIGATION FUNCTIONS
  // ============================================
  function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const screens = {
      mainMenu: mainMenuScreen,
      game: gameScreen,
      store: storeScreen,
      worldSelect: worldSelectScreen,
      levelMap: levelMapScreen,
      cheat: cheatScreen,
      achievements: achievementsScreen,
      statistics: statisticsScreen,
      settings: settingsScreen,
      gameModes: gameModesScreen,
      dailyChallenges: dailyChallengesScreen,
      tournament: tournamentScreen
    };
    
    // Handle timer pause/resume when navigating
    const currentScreen = document.querySelector('.screen.active');
    const wasGameScreen = currentScreen && currentScreen.id === 'gameScreen';
    const isGoingToGame = screenName === 'game';
    
    if (wasGameScreen && !isGoingToGame) {
      // Leaving game screen - pause timer
      pauseTimer();
    }
    
    if (screens[screenName]) {
      screens[screenName].classList.add('active');
    }
    
    if (screenName === 'game') {
      document.getElementById('navGame')?.classList.add('active');
      // Entering game screen - resume timer if it was paused
      if (isTimerPaused && pausedTime > 0) {
        resumeTimer();
      }
    } else if (screenName === 'store') {
      document.getElementById('navStore')?.classList.add('active');
    }
    
    if (screenName === 'mainMenu') {
      updateMainMenuStats();
      dailyRewards.updateUI();
      if (!introPlayed) {
        introPlayed = true;
        setTimeout(() => {
          audioManager.playIntro();
        }, 300);
      }
    } else if (screenName === 'store') {
      renderSkinsUI();
      updatePowerupStoreUI();
    } else if (screenName === 'worldSelect') {
      renderWorldSelect();
    } else if (screenName === 'levelMap') {
      renderLevelMap();
    } else if (screenName === 'achievements') {
      renderAchievementsUI();
    } else if (screenName === 'statistics') {
      updateStatisticsUI();
    } else if (screenName === 'settings') {
      updateSettingsUI();
    } else if (screenName === 'gameModes') {
      renderGameModesUI();
    } else if (screenName === 'dailyChallenges') {
      renderDailyChallengesUI();
    } else if (screenName === 'tournament') {
      renderTournamentUI();
    }
  }
  
  function updateMainMenuStats() {
    if (bestLevelDisplay) {
      const bestLevel = Math.max(1, ...Object.keys(levelProgress).map(Number));
      bestLevelDisplay.textContent = bestLevel;
    }
    if (totalCoinsDisplay) {
      totalCoinsDisplay.textContent = coins;
    }
    if (achievementsDisplay) {
      const unlockedCount = achievements.filter(a => a.unlocked).length;
      achievementsDisplay.textContent = `${unlockedCount}/${achievements.length}`;
    }
    if (mainSoundIcon) {
      mainSoundIcon.textContent = audioManager.soundEnabled ? '🔊' : '🔇';
    }
    if (mainLangText) {
      mainLangText.textContent = i18n.currentLang.toUpperCase();
    }
  }
  
  // ============================================
  // CARD CREATION & BOARD RENDERING
  // ============================================
  function createCardElement(c, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardBack = document.createElement('div');
    const currentSkinObj = skins.find(s => s.id === currentSkin);
    const skinClass = currentSkinObj ? currentSkinObj.css : 'skin-theme-default';
    cardBack.className = `card-face card-back ${skinClass}`;
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';
    cardFront.textContent = c.emoji;
    
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    card.appendChild(cardInner);
    
    card.addEventListener('click', onCardClick);
    return card;
  }
  
  function updateCardVisuals(index) {
    const cardEl = cardElements[index];
    const cardData = deck[index];
    
    if (cardData.flipped) {
      cardEl.classList.add('flipped');
    } else {
      cardEl.classList.remove('flipped');
    }
    
    if (cardData.matched) {
      cardEl.classList.add('matched');
    } else {
      cardEl.classList.remove('matched');
    }
  }
  
  function renderBoard() {
    board.innerHTML = '';
    cardElements = [];
    
    board.setAttribute('data-cards', deck.length);
    
    for (let i = 0; i < deck.length; i++) {
      const cardEl = createCardElement(deck[i], i);
      cardElements.push(cardEl);
      board.appendChild(cardEl);
    }
    
    updateHUD();
    updatePowerupUI();
  }
  
  function updateHUD() {
    levelEl.textContent = level;
    scoreEl.textContent = score;
    
    // Handle time display based on mode
    if (currentGameMode === GAME_MODES.ZEN) {
      timeEl.textContent = '∞';
    } else if (cheats.unlimitedTime) {
      timeEl.textContent = '∞';
    } else {
      timeEl.textContent = time;
    }
    
    coinsEl.textContent = coins;
    
  }
  
  function showFloatingCombo(comboCount) {
    if (!comboNotice || comboCount < 2) return;
    
    comboCountEl.textContent = comboCount;
    
    comboNotice.classList.remove('active');
    void comboNotice.offsetWidth;
    
    comboNotice.classList.add('active');
    
    setTimeout(() => {
      comboNotice.classList.remove('active');
    }, 2000);
  }
  
  function updatePowerupUI() {
    document.getElementById('hintCount').textContent = powerups.hint;
    document.getElementById('extraTimeCount').textContent = powerups.extraTime;
    document.getElementById('freezeCount').textContent = powerups.freeze;
    document.getElementById('revealCount').textContent = powerups.reveal;
    
    document.getElementById('hintBtn').disabled = powerups.hint <= 0;
    document.getElementById('extraTimeBtn').disabled = powerups.extraTime <= 0 || cheats.unlimitedTime || currentGameMode === GAME_MODES.ZEN;
    document.getElementById('freezeBtn').disabled = powerups.freeze <= 0 || cheats.unlimitedTime || currentGameMode === GAME_MODES.ZEN;
    document.getElementById('revealBtn').disabled = powerups.reveal <= 0;
  }
  
  // ============================================
  // GAMEPLAY LOGIC
  // ============================================
  let levelStartTime = 0;
  let mistakes = 0;
  
  function onCardClick(e) {
    if (locked) return;
    
    const cardEl = e.currentTarget;
    const idx = +cardEl.dataset.index;
    const card = deck[idx];
    
    if (card.flipped || card.matched) return;
    
    card.flipped = true;
    cardEl.classList.add('flipped');
    audioManager.flip();
    
    opened.push(card);
    updateHUD();
    checkMatch();
  }
  
  function checkMatch() {
    if (opened.length === 2) {
      locked = true;
      const [a, b] = opened;
      const idxA = deck.indexOf(a);
      const idxB = deck.indexOf(b);
      
      if (a.emoji === b.emoji) {
        handleMatch(a, b, idxA, idxB);
      } else {
        handleMismatch(a, b, idxA, idxB);
      }
    }
  }
  
  function handleMatch(a, b, idxA, idxB) {
    audioManager.match();
    
    combo++;
    showFloatingCombo(combo);
    
    if (combo > statistics.bestCombo) {
      statistics.bestCombo = combo;
    }
    
    // Update daily challenge progress for combo
    dailyChallenges.updateProgress('comboMaster', combo);
    
    setTimeout(() => {
      a.matched = b.matched = true;
      
      // Calculate score with combo and mode bonuses
      let comboBonus = combo > 1 ? (combo - 1) * 5 : 0;
      let modeMultiplier = currentGameMode === GAME_MODES.HARD ? 2 : 1;
      let bossBonus = isBossLevel ? 50 : 0;
      
      score += (10 + (level * 2) + comboBonus + bossBonus) * modeMultiplier;
      
      // Coins with bonuses
      let coinAmount = (2 + (combo > 1 ? Math.floor(combo / 2) : 0)) * modeMultiplier;
      if (isBossLevel) coinAmount *= 3;
      
      coins += coinAmount;
      statistics.totalCoinsEarned += coinAmount;
      statistics.totalMatches++;
      
      // Save progress after earning coins/score
      saveAll();
      
      matches++;
      opened = [];
      locked = false;
      
      updateCardVisuals(idxA);
      updateCardVisuals(idxB);
      updateHUD();
      
      const cardA = cardElements[idxA];
      effectsManager.onCardMatch(cardA);
      effectsManager.createFloatingCoin(
        cardA.getBoundingClientRect().left + 30,
        cardA.getBoundingClientRect().top,
        coinAmount
      );
      
      checkAchievement('first_match', true);
      checkAchievement('combo_5', combo >= 5);
      checkAchievement('combo_10', combo >= 10);
      
      if (matches * 2 === deck.length) {
        setTimeout(levelUp, 500);
      }
    }, 300);
  }
  
  function handleMismatch(a, b, idxA, idxB) {
    combo = 0;
    mistakes++;
    
    setTimeout(() => {
      a.flipped = false;
      b.flipped = false;
      opened = [];
      locked = false;
      
      updateCardVisuals(idxA);
      updateCardVisuals(idxB);
      updateHUD();
    }, 1000);
  }
  
  function levelUp() {
    audioManager.levelUp();
    effectsManager.onLevelComplete();
    
    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - levelStartTime) / 1000);
    
    // Save level stats
    if (!levelStats[level]) {
      levelStats[level] = {
        bestTime: timeTaken,
        bestScore: score,
        attempts: (levelStats[level]?.attempts || 0) + 1
      };
    }
    
    markLevelComplete(level);
    statistics.levelsCompleted++;
    statistics.currentStreak++;
    
    if (statistics.currentStreak > statistics.bestStreak) {
      statistics.bestStreak = statistics.currentStreak;
    }
    
    // Update tournament score
    tournamentManager.addScore(score);
    
    // Update daily challenges
    dailyChallenges.updateProgress('speedRun');
    if (mistakes === 0) dailyChallenges.updateProgress('perfectLevels');
    if (currentGameMode === GAME_MODES.HARD) dailyChallenges.updateProgress('hardModeLevels');
    if (isBossLevel) checkAchievement('boss_slayer', true);
    
    // Check achievements
    checkAchievement('level_5', level >= 5);
    checkAchievement('level_10', level >= 10);
    checkAchievement('level_25', level >= 25);
    checkAchievement('level_50', level >= 50);
    checkAchievement('level_100', level >= 100);
    checkAchievement('streak_3', statistics.currentStreak >= 3);
    checkAchievement('streak_10', statistics.currentStreak >= 10);
    checkAchievement('hard_mode_hero', currentGameMode === GAME_MODES.HARD && level >= 10);
    checkAchievement('zen_master', currentGameMode === GAME_MODES.ZEN && level >= 20);
    
    level++;
    
    // Save progress after level up
    saveAll();
    
    // Set card count based on mode
    if (currentGameMode === GAME_MODES.HARD) {
      levelCards += 2;
      if (levelCards > 24) levelCards = 24;
    } else {
      levelCards += 2;
      if (levelCards > 16) levelCards = 16;
    }
    
    clearInterval(timerId);
    
    dialogManager.success(
      i18n.get('levelCompleteMsg', { prevLevel: level - 1, newLevel: level }),
      i18n.get('levelComplete'),
      '🏆'
    ).then(() => {
      deck = buildDeck(levelCards);
      matches = 0;
      opened = [];
      combo = 0;
      mistakes = 0;
      
      // Set time based on mode
      if (currentGameMode === GAME_MODES.HARD) {
        time = Math.max(20, 60 - (levelCards * 2));
      } else if (currentGameMode === GAME_MODES.ZEN) {
        time = Infinity;
      } else {
        time = Math.max(30, 90 - (levelCards * 3));
      }
      
      locked = false;
      levelStartTime = Date.now();
      
      checkBossLevel();
      renderBoard();
      startTimer();
    });
  }
  
  // ============================================
  // TIMER & GAME OVER
  // ============================================
  function startTimer() {
    if (timerId) clearInterval(timerId);
    
    // Zen mode or unlimited time
    if (currentGameMode === GAME_MODES.ZEN || cheats.unlimitedTime) {
      timeEl.textContent = '∞';
      return;
    }
    
    // If resuming from pause, use the paused time
    if (pausedTime > 0 && isTimerPaused) {
      time = pausedTime;
      pausedTime = 0;
      isTimerPaused = false;
    } else if (!isTimerPaused) {
      // Starting fresh
      levelStartTime = Date.now();
    }
    
    timerId = setInterval(() => {
      if (!isTimerPaused && time > 0) {
        time--;
        timeEl.textContent = time;
        if (time <= 0) {
          endGame('Time Up!');
        }
      }
    }, 1000);
  }
  
  function pauseTimer() {
    if (currentGameMode === GAME_MODES.ZEN || cheats.unlimitedTime) return;
    
    isTimerPaused = true;
    pausedTime = time;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
  
  function resumeTimer() {
    if (currentGameMode === GAME_MODES.ZEN || cheats.unlimitedTime) return;
    
    isTimerPaused = false;
    startTimer();
  }
  
  function endGame(msg) {
    audioManager.gameOver();
    clearInterval(timerId);
    
    statistics.gamesPlayed++;
    statistics.currentStreak = 0;
    saveAll();
    
    const finalMsg = `${msg}\n\n${i18n.get('finalScore', {score: score})}\n${i18n.get('coinsEarned', {coins: coins})}\n${i18n.get('levelReached', {level: level})}`;
    
    dialogManager.error(finalMsg, i18n.get('gameOver'), '💀').then(() => {
      resetGame();
    });
  }
  
  function resetGame() {
    level = 1;
    score = 0;
    mistakes = 0;
    
    if (currentGameMode === GAME_MODES.HARD) {
      levelCards = 20;
      time = 40;
    } else if (currentGameMode === GAME_MODES.ZEN) {
      levelCards = 4;
      time = Infinity;
    } else {
      levelCards = 4;
      time = 60;
    }
    
    deck = buildDeck(levelCards);
    matches = 0;
    opened = [];
    combo = 0;
    locked = false;
    statistics.currentStreak = 0;
    isBossLevel = false;
    levelStartTime = Date.now();
    
    renderBoard();
    startTimer();
  }
  
  // ============================================
  // POWER-UPS
  // ============================================
  function useHint() {
    if (powerups.hint <= 0 || locked) return;
    
    const unmatched = deck.filter(c => !c.matched && !c.flipped);
    if (unmatched.length < 2) return;
    
    const groups = {};
    unmatched.forEach(c => {
      if (!groups[c.emoji]) groups[c.emoji] = [];
      groups[c.emoji].push(c);
    });
    
    let pair = null;
    for (const emoji in groups) {
      if (groups[emoji].length >= 2) {
        pair = groups[emoji].slice(0, 2);
        break;
      }
    }
    
    if (pair) {
      powerups.hint--;
      audioManager.powerup();
      
      const idx1 = deck.indexOf(pair[0]);
      const idx2 = deck.indexOf(pair[1]);
      
      cardElements[idx1].classList.add('hint-highlight');
      cardElements[idx2].classList.add('hint-highlight');
      
      setTimeout(() => {
        cardElements[idx1].classList.remove('hint-highlight');
        cardElements[idx2].classList.remove('hint-highlight');
      }, 2000);
      
      updatePowerupUI();
      checkAchievement('hint_master', powerups.hint <= 17);
    }
  }
  
  function useExtraTime() {
    if (powerups.extraTime <= 0 || currentGameMode === GAME_MODES.ZEN || cheats.unlimitedTime) return;
    
    powerups.extraTime--;
    time += 30;
    audioManager.powerup();
    effectsManager.createParticles(window.innerWidth / 2, 100, '#7df9ff', 15);
    updateHUD();
    updatePowerupUI();
  }
  
  function useFreeze() {
    if (powerups.freeze <= 0 || currentGameMode === GAME_MODES.ZEN || cheats.unlimitedTime || !timerId) return;
    
    powerups.freeze--;
    audioManager.powerup();
    
    clearInterval(timerId);
    
    const freezeOverlay = document.createElement('div');
    freezeOverlay.className = 'freeze-overlay active';
    document.body.appendChild(freezeOverlay);
    
    const freezeIndicator = document.createElement('div');
    freezeIndicator.className = 'freeze-indicator active';
    freezeIndicator.textContent = '❄️';
    document.body.appendChild(freezeIndicator);
    
    setTimeout(() => {
      freezeOverlay.remove();
      freezeIndicator.remove();
      startTimer();
    }, 10000);
    
    updatePowerupUI();
  }
  
  function useReveal() {
    if (powerups.reveal <= 0 || locked) return;
    
    powerups.reveal--;
    audioManager.powerup();
    
    locked = true;
    const unmatched = deck.filter(c => !c.matched && !c.flipped);
    
    unmatched.forEach(c => {
      c.flipped = true;
    });
    
    unmatched.forEach(c => {
      const idx = deck.indexOf(c);
      updateCardVisuals(idx);
    });
    
    setTimeout(() => {
      unmatched.forEach(c => {
        c.flipped = false;
        const idx = deck.indexOf(c);
        updateCardVisuals(idx);
      });
      locked = false;
    }, 2000);
    
    updatePowerupUI();
  }
  
  // ============================================
  // ACHIEVEMENTS FUNCTIONS
  // ============================================
  function checkAchievement(id, condition) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked && condition) {
      achievement.unlocked = true;
      coins += achievement.reward;
      statistics.totalCoinsEarned += achievement.reward;
      
      saveAll();
      
      dialogManager.success(
        `🏆 ${i18n.currentLang === 'ar' ? achievement.nameAr : achievement.name}\n${i18n.currentLang === 'ar' ? achievement.descAr : achievement.desc}\n💰 +${achievement.reward} coins`,
        'Achievement Unlocked!',
        achievement.icon
      );
      
      checkAchievement('skin_collector', achievements.filter(a => a.unlocked).length >= 5);
      checkAchievement('skin_master', achievements.filter(a => a.unlocked).length === achievements.length);
    }
  }
  
  function renderAchievementsUI() {
    const grid = document.getElementById('achievementsGrid');
    const unlockedEl = document.getElementById('achievementsUnlocked');
    const totalEl = document.getElementById('achievementsTotal');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    
    if (unlockedEl) unlockedEl.textContent = unlockedCount;
    if (totalEl) totalEl.textContent = achievements.length;
    
    achievements.forEach(achievement => {
      const card = document.createElement('div');
      card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
      
      const name = i18n.currentLang === 'ar' ? achievement.nameAr : achievement.name;
      const desc = i18n.currentLang === 'ar' ? achievement.descAr : achievement.desc;
      
      card.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${name}</div>
          <div class="achievement-desc">${desc}</div>
          <div class="achievement-reward">💰 ${achievement.reward}</div>
        </div>
        <div class="achievement-status">${achievement.unlocked ? '✅' : '🔒'}</div>
      `;
      
      grid.appendChild(card);
    });
  }
  
  // ============================================
  // STATISTICS FUNCTIONS
  // ============================================
  function updateStatisticsUI() {
    document.getElementById('statGamesPlayed').textContent = statistics.gamesPlayed;
    document.getElementById('statLevelsCompleted').textContent = statistics.levelsCompleted;
    document.getElementById('statTotalMatches').textContent = statistics.totalMatches;
    document.getElementById('statBestCombo').textContent = `x${statistics.bestCombo}`;
    document.getElementById('statBestTime').textContent = statistics.bestTime ? `${statistics.bestTime}s` : '--';
    document.getElementById('statTotalCoinsEarned').textContent = statistics.totalCoinsEarned;
    document.getElementById('statCurrentStreak').textContent = statistics.currentStreak;
    document.getElementById('statBestStreak').textContent = statistics.bestStreak;
  }
  
  // ============================================
  // SETTINGS FUNCTIONS
  // ============================================
  function updateSettingsUI() {
    const soundSlider = document.getElementById('soundEffectsSlider');
    const particlesSlider = document.getElementById('particlesSlider');
    const confettiSlider = document.getElementById('confettiSlider');
    const emojiGlowSlider = document.getElementById('emojiGlowSlider');
    const soundToggle = document.getElementById('soundEffectsToggle');
    const particlesToggle = document.getElementById('particlesToggle');
    const confettiToggle = document.getElementById('confettiToggle');
    const emojiGlowToggle = document.getElementById('emojiGlowToggle');

    if (soundSlider) soundSlider.classList.toggle('active', gameSettings.soundEnabled);
    if (soundToggle) soundToggle.classList.toggle('active', gameSettings.soundEnabled);
    if (particlesSlider) particlesSlider.classList.toggle('active', gameSettings.particlesEnabled);
    if (particlesToggle) particlesToggle.classList.toggle('active', gameSettings.particlesEnabled);
    if (confettiSlider) confettiSlider.classList.toggle('active', gameSettings.confettiEnabled);
    if (confettiToggle) confettiToggle.classList.toggle('active', gameSettings.confettiEnabled);
    if (emojiGlowSlider) emojiGlowSlider.classList.toggle('active', gameSettings.emojiGlow);
    if (emojiGlowToggle) emojiGlowToggle.classList.toggle('active', gameSettings.emojiGlow);

    const sfxVolumeSlider = document.getElementById('sfxVolumeSlider');
    const sfxVolumeValue = document.getElementById('sfxVolumeValue');

    if (sfxVolumeSlider) sfxVolumeSlider.value = gameSettings.sfxVolume;
    if (sfxVolumeValue) sfxVolumeValue.textContent = `${gameSettings.sfxVolume}%`;
    
    // Text size
    const textSizeSlider = document.getElementById('textSizeSlider');
    const textSizeValue = document.getElementById('textSizeValue');
    if (textSizeSlider) textSizeSlider.value = gameSettings.textSize;
    if (textSizeValue) textSizeValue.textContent = `${gameSettings.textSize}%`;
    
    // Theme select
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = gameSettings.theme;
    
    // Particle style
    const particleStyleSelect = document.getElementById('particleStyleSelect');
    if (particleStyleSelect) particleStyleSelect.value = gameSettings.particleStyle;
    
    // Graphic quality
    const graphicQualitySelect = document.getElementById('graphicQualitySelect');
    if (graphicQualitySelect) graphicQualitySelect.value = gameSettings.graphicQuality;
  }
  
  function toggleSetting(setting) {
    gameSettings[setting] = !gameSettings[setting];

    if (setting === 'soundEnabled') {
      audioManager.soundEnabled = gameSettings.soundEnabled;
    } else if (setting === 'particlesEnabled') {
      effectsManager.particlesEnabled = gameSettings.particlesEnabled;
    } else if (setting === 'confettiEnabled') {
      effectsManager.confettiEnabled = gameSettings.confettiEnabled;
    } else if (setting === 'emojiGlow') {
      effectsManager.emojiGlowEnabled = gameSettings.emojiGlow;
      document.body.classList.toggle('emoji-glow-disabled', !gameSettings.emojiGlow);
    }

    saveAll();
    updateSettingsUI();
  }
  
  function updateVolume(type, value) {
    gameSettings[type] = parseInt(value);

    if (type === 'sfxVolume') {
      audioManager.setSfxVolume(gameSettings.sfxVolume);
    } else if (type === 'textSize') {
      textSizeManager.setSize(value);
    }

    saveAll();
    updateSettingsUI();
  }
  
  function updateParticleStyle(style) {
    gameSettings.particleStyle = style;
    effectsManager.particleStyle = style;
    saveAll();
  }
  
  function updateGraphicQuality(quality) {
    gameSettings.graphicQuality = quality;
    
    // Apply quality settings
    if (quality === 'low') {
      // Reduce particle effects
      effectsManager.particlesEnabled = false;
      effectsManager.confettiEnabled = false;
      effectsManager.emojiGlowEnabled = false;
      
      // Add low quality class to body for CSS
      document.body.classList.add('low-quality-mode');
    } else {
      // Restore settings from gameSettings
      effectsManager.particlesEnabled = gameSettings.particlesEnabled;
      effectsManager.confettiEnabled = gameSettings.confettiEnabled;
      effectsManager.emojiGlowEnabled = gameSettings.emojiGlow;
      
      // Remove low quality class
      document.body.classList.remove('low-quality-mode');
    }
    
    saveAll();
  }
  
  // ============================================
  // LEVEL & WORLD FUNCTIONS
  // ============================================
  function loadLevelProgress() {
    const saved = localStorage.getItem('emoji_level_progress');
    if (saved) {
      try {
        levelProgress = JSON.parse(saved);
      } catch (e) {
        levelProgress = {};
      }
    }
    
    // Load level stats
    const savedStats = localStorage.getItem('emoji_level_stats');
    if (savedStats) {
      try {
        levelStats = JSON.parse(savedStats);
      } catch (e) {
        levelStats = {};
      }
    }
  }
  
  function saveLevelProgress() {
    localStorage.setItem('emoji_level_progress', JSON.stringify(levelProgress));
    localStorage.setItem('emoji_level_stats', JSON.stringify(levelStats));
  }
  
  function markLevelComplete(levelNum) {
    if (!levelProgress[levelNum]) {
      levelProgress[levelNum] = { completed: true };
      saveLevelProgress();
    }
  }
  
  function isLevelUnlocked(levelNum) {
    if (levelNum === 1) return true;
    return levelProgress[levelNum - 1] && levelProgress[levelNum - 1].completed;
  }
  
  function getCompletedCount() {
    return Object.keys(levelProgress).length;
  }
  
  function getWorldCompletedCount(worldNum) {
    let count = 0;
    const startLevel = (worldNum - 1) * LEVELS_PER_WORLD + 1;
    const endLevel = worldNum * LEVELS_PER_WORLD;
    for (let i = startLevel; i <= endLevel; i++) {
      if (levelProgress[i] && levelProgress[i].completed) count++;
    }
    return count;
  }
  
  function isWorldUnlocked(worldNum) {
    if (worldNum === 1) return true;
    const prevWorld = worldNum - 1;
    const prevWorldCompleted = getWorldCompletedCount(prevWorld);
    return prevWorldCompleted >= 50;
  }
  
  function renderWorldSelect() {
    if (!worldGrid) return;
    
    worldGrid.innerHTML = '';
    const totalCompleted = getCompletedCount();
    
    if (worldCompletedLevelsEl) worldCompletedLevelsEl.textContent = totalCompleted;
    if (worldTotalLevelsEl) worldTotalLevelsEl.textContent = TOTAL_LEVELS;
    
    worlds.forEach(world => {
      const worldCard = document.createElement('div');
      worldCard.className = 'world-card';
      
      const isUnlocked = isWorldUnlocked(world.id);
      const isCurrent = currentWorld === world.id;
      const completedInWorld = getWorldCompletedCount(world.id);
      const worldName = i18n.currentLang === 'ar' ? world.nameAr : world.name;
      
      if (isCurrent) worldCard.classList.add('current');
      
      if (!isUnlocked) {
        worldCard.classList.add('locked');
        worldCard.innerHTML = `
          <div class="world-lock">🔒</div>
          <div class="world-number">${i18n.get('world')} ${world.id}</div>
          <div class="world-name">${worldName}</div>
          <div class="world-stats">${completedInWorld}/100 ${i18n.get('completed')}</div>
        `;
      } else {
        worldCard.innerHTML = `
          <div class="world-icon">${world.icon}</div>
          <div class="world-number">${i18n.get('world')} ${world.id}</div>
          <div class="world-name">${worldName}</div>
          <div class="world-stats">${completedInWorld}/100 ${i18n.get('completed')}</div>
        `;
        
        worldCard.addEventListener('click', () => {
          currentWorld = world.id;
          saveAll();
          showScreen('levelMap');
        });
      }
      
      worldGrid.appendChild(worldCard);
    });
    
    checkAchievement('world_traveler', worlds.filter(w => isWorldUnlocked(w.id)).length >= 3);
    checkAchievement('world_conqueror', worlds.filter(w => isWorldUnlocked(w.id)).length === worlds.length);
  }
  
  function renderLevelMap() {
    if (!levelGrid) return;
    
    levelGrid.innerHTML = '';
    const completed = getWorldCompletedCount(currentWorld);
    
    if (completedLevelsEl) completedLevelsEl.textContent = completed;
    if (totalLevelsEl) totalLevelsEl.textContent = LEVELS_PER_WORLD;
    if (currentWorldNumEl) currentWorldNumEl.textContent = currentWorld;
    
    const startLevel = (currentWorld - 1) * LEVELS_PER_WORLD + 1;
    const endLevel = currentWorld * LEVELS_PER_WORLD;
    
    for (let i = startLevel; i <= endLevel; i++) {
      const levelNode = document.createElement('div');
      levelNode.className = 'level-node';
      
      const isCompleted = levelProgress[i] && levelProgress[i].completed;
      const isCurrent = i === level;
      const isUnlocked = isLevelUnlocked(i);
      const displayNum = i - startLevel + 1;
      const isBoss = i % 100 === 0;
      
      if (isBoss && isUnlocked) {
        levelNode.style.borderColor = '#ffd700';
        levelNode.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
      }
      
      if (isCompleted) {
        levelNode.classList.add('completed');
        levelNode.innerHTML = `
          <div class="level-number">${isBoss ? '👑' : displayNum}</div>
        `;
      } else if (isCurrent) {
        levelNode.classList.add('current');
        levelNode.innerHTML = `<div class="level-number">${isBoss ? '👑' : displayNum}</div>`;
      } else if (isUnlocked) {
        levelNode.innerHTML = `<div class="level-number">${isBoss ? '👑' : displayNum}</div>`;
      } else {
        levelNode.classList.add('locked');
        levelNode.innerHTML = `<div class="level-lock-icon">🔒</div>`;
      }
      
      if (isUnlocked || isCompleted) {
        levelNode.addEventListener('click', () => selectLevel(i));
      }
      
      levelGrid.appendChild(levelNode);
    }
  }
  
  function selectLevel(levelNum) {
    if (!isLevelUnlocked(levelNum)) return;
    
    level = levelNum;
    
    // Set card count based on mode
    if (currentGameMode === GAME_MODES.HARD) {
      levelCards = Math.min(20 + Math.floor((level - 1) / 10) * 2, 24);
    } else {
      levelCards = Math.min(4 + (level - 1) * 2, 16);
    }
    
    deck = buildDeck(levelCards);
    matches = 0;
    opened = [];
    combo = 0;
    mistakes = 0;
    
    // Set time based on mode
    if (currentGameMode === GAME_MODES.HARD) {
      time = Math.max(20, 60 - (levelCards * 2));
    } else if (currentGameMode === GAME_MODES.ZEN) {
      time = Infinity;
    } else {
      time = Math.max(30, 90 - (levelCards * 3));
    }
    
    locked = false;
    levelStartTime = Date.now();
    
    // Reset pause state when selecting a new level
    pausedTime = 0;
    isTimerPaused = false;
    
    // Save current progress
    saveAll();
    
    checkBossLevel();
    renderBoard();
    showScreen('game');
    startTimer();
  }
  
  // ============================================
  // SKINS FUNCTIONS
  // ============================================
  function saveSkins() {
    localStorage.setItem('emoji_skins', JSON.stringify(skins));
    localStorage.setItem('emoji_coins', coins);
  }
  
  function loadSkins() {
    const saved = localStorage.getItem('emoji_skins');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.forEach((s, i) => {
          if (skins[i]) skins[i].unlocked = s.unlocked;
        });
      } catch (e) {
        console.log('Error loading skins');
      }
    }
    const savedCurrentSkin = localStorage.getItem('emoji_current_skin');
    if (savedCurrentSkin) currentSkin = savedCurrentSkin;
    const savedCoins = localStorage.getItem('emoji_coins');
    if (savedCoins) coins = parseInt(savedCoins);
  }
  
  function saveCurrentSkin() {
    localStorage.setItem('emoji_current_skin', currentSkin);
  }
  
  function purchaseSkin(id) {
    const s = skins.find(x => x.id === id);
    if (!s) return;
    
    if (!s.unlocked) {
      if (coins >= s.price) {
        coins -= s.price;
        s.unlocked = true;
        currentSkin = id;
        saveSkins();
        saveCurrentSkin();
        renderSkinsUI();
        renderBoard();
        
        checkAchievement('skin_collector', skins.filter(s => s.unlocked).length >= 5);
        checkAchievement('skin_master', skins.filter(s => s.unlocked).length === skins.length);
        
        dialogManager.success(
          i18n.get('skinUnlockedMsg', {skinName: i18n.get(s.id)}),
          i18n.get('skinUnlocked'),
          s.emoji
        );
      } else {
        dialogManager.alert(
          i18n.get('needMoreCoins', {diff: s.price - coins}),
          i18n.get('notEnoughCoins'),
          '💰'
        );
      }
    } else {
      currentSkin = id;
      saveCurrentSkin();
      renderSkinsUI();
      renderBoard();
    }
  }
  
  function renderSkinsUI() {
    skinsEl.innerHTML = '';
    skins.forEach(s => {
      const el = document.createElement('div');
      el.className = `skin ${s.unlocked ? 'unlocked' : ''} ${currentSkin === s.id ? 'active' : ''} ${s.animated ? 'animated-skin' : ''}`;
      
      const skinName = i18n.get(s.id);
      const statusText = s.unlocked ? (currentSkin === s.id ? i18n.get('unlockedSkin') : i18n.get('select')) : `${s.price} coins`;
      const animatedBadge = s.animated ? '<span class="animated-badge">✨</span>' : '';
      
      el.innerHTML = `
        <div class="skin-preview ${s.css}">${s.emoji}${animatedBadge}</div>
        <div class="skin-name">${skinName}</div>
        <div class="skin-price">${statusText}</div>
      `;
      
      el.addEventListener('click', () => purchaseSkin(s.id));
      skinsEl.appendChild(el);
    });
  }
  
  // ============================================
  // POWERUPS STORE
  // ============================================
  const powerupPrices = {
    hint: 50,
    extraTime: 75,
    freeze: 100,
    reveal: 150
  };
  
  function purchasePowerup(powerupType) {
    const price = powerupPrices[powerupType];
    if (!price) return;
    
    if (coins >= price) {
      coins -= price;
      powerups[powerupType]++;
      saveAll();
      updatePowerupUI();
      updateMainMenuStats();
      
      audioManager.coin();
      effectsManager.createFloatingCoin(window.innerWidth / 2, window.innerHeight / 2, powerupType);
      
      dialogManager.success(
        `+1 ${i18n.get('powerup' + powerupType.charAt(0).toUpperCase() + powerupType.slice(1))}\n💰 -${price} coins`,
        'Power-up Purchased!',
        '⚡'
      );
    } else {
      dialogManager.alert(
        `You need ${price - coins} more coins to buy this power-up.\n\nKeep playing to earn more coins!`,
        'Not Enough Coins',
        '💰'
      );
    }
  }
  
  function updatePowerupStoreUI() {
    document.querySelectorAll('.powerup-buy-btn').forEach(btn => {
      const price = parseInt(btn.dataset.price);
      btn.disabled = coins < price;
    });
  }
  
  // ============================================
  // GAME MODES UI
  // ============================================
  function renderGameModesUI() {
    // Just refresh the UI
  }
  
  // ============================================
  // DAILY CHALLENGES UI
  // ============================================
  function renderDailyChallengesUI() {
    const calendar = document.getElementById('challengeCalendar');
    const todayCard = document.getElementById('todayChallengeCard');
    const weeklyStreakEl = document.getElementById('weeklyStreak');
    
    if (calendar) {
      calendar.innerHTML = '';
      const today = new Date();
      const currentDay = today.getDay();
      
      for (let i = 0; i < 7; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        
        if (i === currentDay) day.classList.add('today');
        
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() - currentDay + i);
        const dateStr = dayDate.toDateString();
        
        if (dailyChallenges.completed.includes(dateStr)) {
          day.classList.add('completed');
        }
        
        day.innerHTML = `
          <span class="day-num">${dayDate.getDate()}</span>
          <span class="day-status">${dailyChallenges.completed.includes(dateStr) ? '✅' : (i === currentDay ? '🔥' : '○')}</span>
        `;
        
        calendar.appendChild(day);
      }
    }
    
    if (todayCard && dailyChallenges.currentChallenge) {
      const challenge = dailyChallenges.currentChallenge;
      todayCard.innerHTML = `
        <div class="challenge-type">${challenge.name}</div>
        <div class="challenge-desc">${challenge.desc.replace('{target}', challenge.target)}</div>
        <div class="challenge-reward">💰 ${challenge.reward} coins</div>
        <div class="challenge-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${dailyChallenges.getTodayProgress()}%"></div>
          </div>
          <span class="progress-text">${challenge.progress || 0}/${challenge.target} completed</span>
        </div>
      `;
    }
    
    if (weeklyStreakEl) {
      weeklyStreakEl.innerHTML = `<span>🔥 Streak: ${dailyChallenges.weeklyStreak}/7 days</span>`;
    }
  }
  
  // ============================================
  // TOURNAMENT UI
  // ============================================
  function renderTournamentUI() {
    const timerEl = document.getElementById('tournamentTimer');
    const rankEl = document.getElementById('yourRank');
    const leaderboardList = document.getElementById('leaderboardList');
    
    if (timerEl) {
      timerEl.innerHTML = `<span>⏱️ Ends in: ${tournamentManager.getTimeRemaining()}</span>`;
    }
    
    if (rankEl) {
      const rankNumber = rankEl.querySelector('.rank-number');
      const rankScore = rankEl.querySelector('.rank-score');
      if (rankNumber) rankNumber.textContent = `#${tournamentManager.playerRank}`;
      if (rankScore) rankScore.textContent = `${tournamentManager.playerScore} pts`;
    }
    
    if (leaderboardList) {
      leaderboardList.innerHTML = '';
      const leaderboard = tournamentManager.getLeaderboard();
      
      leaderboard.forEach(entry => {
        const row = document.createElement('div');
        row.className = `leaderboard-entry ${entry.rank <= 3 ? 'top-3' : ''} ${entry.isPlayer ? 'you' : ''}`;
        row.innerHTML = `
          <span class="entry-rank">${entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : '#' + entry.rank}</span>
          <span class="entry-avatar">${entry.isPlayer ? '👤' : '👾'}</span>
          <span class="entry-name">${entry.name}</span>
          <span class="entry-score">${entry.score} pts</span>
        `;
        leaderboardList.appendChild(row);
      });
    }
  }
  
  // ============================================
  // CHEAT CODE SYSTEM
  // ============================================
  function validateCheatCode(code) {
    const normalizedCode = code.toUpperCase().trim();
    
    switch(normalizedCode) {
      case 'UNLOCKALL':
        if (!cheats.unlockAll) {
          activateCheat('unlockAll');
          return { success: true, message: i18n.get('allLevelsUnlocked') };
        } else {
          return { success: false, message: i18n.get('alreadyActivated') };
        }
        
      case 'MILLION':
        if (!cheats.millionCoins) {
          activateCheat('millionCoins');
          return { success: true, message: i18n.get('millionCoinsAdded') };
        } else {
          return { success: false, message: i18n.get('alreadyActivated') };
        }
        
      case 'NOTIME':
        if (!cheats.unlimitedTime) {
          activateCheat('unlimitedTime');
          return { success: true, message: i18n.get('unlimitedTimeEnabled') };
        } else {
          return { success: false, message: i18n.get('alreadyActivated') };
        }
        
      default:
        return { success: false, message: i18n.get('invalidCode') };
    }
  }
  
  function activateCheat(cheatName) {
    switch(cheatName) {
      case 'unlockAll':
        for (let i = 1; i <= TOTAL_LEVELS; i++) {
          if (!levelProgress[i]) {
            levelProgress[i] = { completed: true };
          }
        }
        saveLevelProgress();
        cheats.unlockAll = true;
        const unlockAllIcon = document.getElementById('statusUnlockAll');
        if (unlockAllIcon) {
          unlockAllIcon.textContent = '✅';
          unlockAllIcon.classList.add('active');
        }
        break;
        
      case 'millionCoins':
        coins += 1000000;
        statistics.totalCoinsEarned += 1000000;
        saveSkins();
        cheats.millionCoins = true;
        const millionIcon = document.getElementById('statusMillionCoins');
        if (millionIcon) {
          millionIcon.textContent = '✅';
          millionIcon.classList.add('active');
        }
        break;
        
      case 'unlimitedTime':
        cheats.unlimitedTime = true;
        const timeIcon = document.getElementById('statusUnlimitedTime');
        if (timeIcon) {
          timeIcon.textContent = '✅';
          timeIcon.classList.add('active');
        }
        break;
    }
    saveAll();
  }
  
  function showCheatStatus(message) {
    const cheatStatus = document.getElementById('cheatStatus');
    if (cheatStatus) {
      cheatStatus.textContent = message;
      setTimeout(() => {
        cheatStatus.textContent = '';
      }, 3000);
    }
  }
  
  // ============================================
  // LEVEL STATS MODAL
  // ============================================
  function showLevelStats(levelNum) {
    if (!levelStats[levelNum]) return;
    
    const stats = levelStats[levelNum];
    
    document.getElementById('statsLevelNum').textContent = `Level ${levelNum}`;
    
    document.getElementById('statsBestTime').textContent = stats.bestTime ? `${stats.bestTime}s` : '--';
    document.getElementById('statsBestScore').textContent = stats.bestScore || '--';
    document.getElementById('statsAttempts').textContent = stats.attempts || 0;
    
    levelStatsModal.classList.add('active');
  }
  
  // ============================================
  // SAVE/LOAD ALL DATA
  // ============================================
  function saveAll() {
    localStorage.setItem('emoji_level_progress', JSON.stringify(levelProgress));
    localStorage.setItem('emoji_level_stats', JSON.stringify(levelStats));
    localStorage.setItem('emoji_skins', JSON.stringify(skins));
    localStorage.setItem('emoji_coins', coins);
    localStorage.setItem('emoji_current_skin', currentSkin);
    localStorage.setItem('emoji_statistics', JSON.stringify(statistics));
    localStorage.setItem('emoji_settings', JSON.stringify(gameSettings));
    localStorage.setItem('emoji_cheats', JSON.stringify(cheats));
    localStorage.setItem('emoji_game_mode', currentGameMode);
    localStorage.setItem('emoji_current_level', level);
    localStorage.setItem('emoji_current_score', score);
    localStorage.setItem('emoji_current_world', currentWorld);
    dailyRewards.save();
    dailyChallenges.save();
    localStorage.setItem('emoji_achievements', JSON.stringify(achievements.map(a => ({ id: a.id, unlocked: a.unlocked }))));
  }
  
  function loadAll() {
    loadLevelProgress();
    loadSkins();
    dailyRewards.init();
    dailyChallenges.init();
    tournamentManager.init();
    themeManager.init();
    textSizeManager.init();
    
    const savedStats = localStorage.getItem('emoji_statistics');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        statistics = { ...statistics, ...parsed };
      } catch (e) {}
    }
    
    const savedSettings = localStorage.getItem('emoji_settings');
    if (savedSettings) {
      try {
        gameSettings = { ...gameSettings, ...JSON.parse(savedSettings) };
        audioManager.soundEnabled = gameSettings.soundEnabled;
        audioManager.setSfxVolume(gameSettings.sfxVolume);
        effectsManager.particlesEnabled = gameSettings.particlesEnabled;
        effectsManager.confettiEnabled = gameSettings.confettiEnabled;
        effectsManager.particleStyle = gameSettings.particleStyle || 'default';
        effectsManager.emojiGlowEnabled = gameSettings.emojiGlow !== false;
        
        // Apply graphic quality setting
        if (gameSettings.graphicQuality === 'low') {
          document.body.classList.add('low-quality-mode');
        }
      } catch (e) {}
    }
    
    const savedCheats = localStorage.getItem('emoji_cheats');
    if (savedCheats) {
      try {
        cheats = { ...cheats, ...JSON.parse(savedCheats) };
      } catch (e) {}
    }
    
    const savedAchievements = localStorage.getItem('emoji_achievements');
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        parsed.forEach(saved => {
          const achievement = achievements.find(a => a.id === saved.id);
          if (achievement) achievement.unlocked = saved.unlocked;
        });
      } catch (e) {}
    }
    
    // Load saved game mode
    const savedMode = localStorage.getItem('emoji_game_mode');
    if (savedMode && GAME_MODES[savedMode.toUpperCase()]) {
      setGameMode(savedMode);
    }
    
    // Load current level, score, and world
    const savedLevel = localStorage.getItem('emoji_current_level');
    if (savedLevel) {
      level = parseInt(savedLevel);
    }
    
    const savedScore = localStorage.getItem('emoji_current_score');
    if (savedScore) {
      score = parseInt(savedScore);
    }
    
    const savedWorld = localStorage.getItem('emoji_current_world');
    if (savedWorld) {
      currentWorld = parseInt(savedWorld);
    }
  }
  
  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    i18n.init();
    loadAll();
    
    // Calculate levelCards based on saved level
    if (currentGameMode === GAME_MODES.HARD) {
      levelCards = Math.min(20 + Math.floor((level - 1) / 10) * 2, 24);
    } else {
      levelCards = Math.min(4 + (level - 1) * 2, 16);
    }
    
    deck = buildDeck(levelCards);
    renderBoard();
    renderSkinsUI();
    updateMainMenuStats();
    
    // Game controls
    document.getElementById('restartBtn')?.addEventListener('click', resetGame);
    document.getElementById('openStoreBtn')?.addEventListener('click', () => showScreen('store'));
    
    // Power-ups
    document.getElementById('hintBtn')?.addEventListener('click', useHint);
    document.getElementById('extraTimeBtn')?.addEventListener('click', useExtraTime);
    document.getElementById('freezeBtn')?.addEventListener('click', useFreeze);
    document.getElementById('revealBtn')?.addEventListener('click', useReveal);
    
    // Navigation buttons
    document.getElementById('backToGame')?.addEventListener('click', () => showScreen('game'));
    document.getElementById('backToGameFromMap')?.addEventListener('click', () => showScreen('game'));
    document.getElementById('backToWorldsBtn')?.addEventListener('click', () => showScreen('worldSelect'));
    document.getElementById('gameHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('mapHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('storeHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('worldHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('cheatHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('achievementsHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('statisticsHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('settingsHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('gameModesHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('dailyChallengesHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('tournamentHomeBtn')?.addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('navGame')?.addEventListener('click', () => showScreen('game'));
    document.getElementById('navStore')?.addEventListener('click', () => showScreen('store'));
    document.getElementById('navRestart')?.addEventListener('click', () => { showScreen('mainMenu'); });
    
    // Main Menu buttons
    document.getElementById('playGameBtn')?.addEventListener('click', () => { showScreen('worldSelect'); });
    document.getElementById('mainMenuWorlds')?.addEventListener('click', () => { showScreen('worldSelect'); });
    document.getElementById('mainMenuStore')?.addEventListener('click', () => { showScreen('store'); });
    document.getElementById('mainMenuCheats')?.addEventListener('click', () => { showScreen('cheat'); });
    document.getElementById('mainMenuAchievements')?.addEventListener('click', () => { showScreen('achievements'); });
    document.getElementById('mainMenuStats')?.addEventListener('click', () => { showScreen('statistics'); });
    document.getElementById('mainMenuSettings')?.addEventListener('click', () => { showScreen('settings'); });
    document.getElementById('mainMenuGameModes')?.addEventListener('click', () => { showScreen('gameModes'); });
    document.getElementById('mainMenuDailyChallenges')?.addEventListener('click', () => { showScreen('dailyChallenges'); });
    document.getElementById('mainMenuTournament')?.addEventListener('click', () => { showScreen('tournament'); });
    
    document.getElementById('mainMenuSound')?.addEventListener('click', () => {
      gameSettings.soundEnabled = !gameSettings.soundEnabled;
      audioManager.soundEnabled = gameSettings.soundEnabled;
      saveAll();
      if (mainSoundIcon) {
        mainSoundIcon.textContent = audioManager.soundEnabled ? '🔊' : '🔇';
      }
    });
    
    document.getElementById('mainMenuLanguage')?.addEventListener('click', () => {
      i18n.toggle();
      if (mainLangText) {
        mainLangText.textContent = i18n.currentLang.toUpperCase();
      }
    });
    
    // Game Mode selection
    document.querySelectorAll('.game-mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        setGameMode(mode);
        showScreen('game');
      });
    });
    
    // Daily Reward
    dailyRewardBadge?.addEventListener('click', () => {
      if (dailyRewards.canClaim()) {
        const amount = dailyRewards.claim();
        if (amount) {
          document.getElementById('rewardAmount').textContent = `💰 ${amount} Coins`;
          document.getElementById('rewardDayIndicator').textContent = `Day ${dailyRewards.streak}`;
          document.getElementById('rewardStreak').textContent = `🔥 Streak: ${dailyRewards.streak} day${dailyRewards.streak > 1 ? 's' : ''}`;
          dailyRewardModal.classList.add('active');
          audioManager.coin();
          effectsManager.createConfetti();
        }
      }
    });
    
    document.getElementById('claimRewardBtn')?.addEventListener('click', () => {
      dailyRewardModal.classList.remove('active');
      updateMainMenuStats();
    });
    
    // Settings toggles
    document.getElementById('soundEffectsToggle')?.addEventListener('click', () => toggleSetting('soundEnabled'));
    document.getElementById('particlesToggle')?.addEventListener('click', () => toggleSetting('particlesEnabled'));
    document.getElementById('confettiToggle')?.addEventListener('click', () => toggleSetting('confettiEnabled'));
    document.getElementById('emojiGlowToggle')?.addEventListener('click', () => toggleSetting('emojiGlow'));

    // Sliders
    document.getElementById('sfxVolumeSlider')?.addEventListener('input', (e) => updateVolume('sfxVolume', e.target.value));
    document.getElementById('textSizeSlider')?.addEventListener('input', (e) => updateVolume('textSize', e.target.value));
    
    // Select dropdowns
    document.getElementById('themeSelect')?.addEventListener('change', (e) => {
      gameSettings.theme = e.target.value;
      themeManager.setTheme(e.target.value);
      saveAll();
    });
    
    document.getElementById('particleStyleSelect')?.addEventListener('change', (e) => {
      updateParticleStyle(e.target.value);
    });
    
    document.getElementById('graphicQualitySelect')?.addEventListener('change', (e) => {
      updateGraphicQuality(e.target.value);
    });
    
    // Reset buttons
    document.getElementById('resetProgressBtn')?.addEventListener('click', () => {
      dialogManager.confirm('Are you sure you want to reset all level progress?', 'Reset Progress', '⚠️').then((confirmed) => {
        if (confirmed) {
          levelProgress = {};
          levelStats = {};
          saveLevelProgress();
          dialogManager.success('Progress has been reset!', 'Reset Complete');
        }
      });
    });
    
    document.getElementById('resetStatsBtn')?.addEventListener('click', () => {
      dialogManager.confirm('Are you sure you want to reset all statistics?', 'Reset Statistics', '⚠️').then((confirmed) => {
        if (confirmed) {
          statistics = {
            gamesPlayed: 0,
            levelsCompleted: 0,
            totalMatches: 0,
            bestCombo: 0,
            bestTime: null,
            totalCoinsEarned: 0,
            currentStreak: 0,
            bestStreak: 0,
            playTime: 0
          };
          saveAll();
          dialogManager.success('Statistics have been reset!', 'Reset Complete');
        }
      });
    });
    
    document.getElementById('resetAllBtn')?.addEventListener('click', () => {
      dialogManager.confirm('Are you sure you want to reset EVERYTHING? This cannot be undone!', 'Reset Everything', '⚠️').then((confirmed) => {
        if (confirmed) {
          localStorage.clear();
          location.reload();
        }
      });
    });
    
    // Cheat code input
    const cheatInput = document.getElementById('cheatInput');
    const submitCheatBtn = document.getElementById('submitCheatBtn');
    
    if (submitCheatBtn && cheatInput) {
      submitCheatBtn.addEventListener('click', () => {
        const code = cheatInput.value;
        const result = validateCheatCode(code);
        showCheatStatus(result.message);
        if (result.success) {
          cheatInput.value = '';
          updateMainMenuStats();
        }
      });
      
      cheatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          submitCheatBtn.click();
        }
      });
    }
    
    // Powerup store event listeners
    document.querySelectorAll('.powerup-buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const powerupType = e.target.dataset.powerup;
        purchasePowerup(powerupType);
      });
    });
    
    // Level stats modal close
    document.getElementById('closeLevelStats')?.addEventListener('click', () => {
      levelStatsModal.classList.remove('active');
    });
    
    // Update timers
    setInterval(() => {
      dailyRewards.updateUI();
      dailyChallenges.checkAndUpdateChallenge();
    }, 1000);
    
    // Check for first launch
    const isFirstLaunch = !localStorage.getItem('emoji_first_launch_completed');
    
    if (isFirstLaunch) {
      // Show setup screen for first launch
      initSetupScreen();
    } else {
      // Show main menu for returning users
      showScreen('mainMenu');
    }
    
    // Check for claimable daily reward
    if (dailyRewards.canClaim()) {
      dailyRewardBadge?.classList.remove('claimed');
    }
  }
  
  // Setup screen initialization
  function initSetupScreen() {
    const setupScreen = document.getElementById('setupScreen');
    const setupStartBtn = document.getElementById('setupStartBtn');
    
    if (!setupScreen) return;
    
    // Setup state
    let selectedLang = 'en';
    let selectedQuality = 'high';
    
    // Language buttons
    document.querySelectorAll('.setup-btn[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.setup-btn[data-lang]').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedLang = btn.dataset.lang;
        
        // Apply language immediately for preview
        if (selectedLang === 'ar') {
          i18n.setLanguage('ar');
        } else {
          i18n.setLanguage('en');
        }
      });
    });
    
    // Quality buttons
    document.querySelectorAll('.setup-btn[data-quality]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.setup-btn[data-quality]').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedQuality = btn.dataset.quality;
        
        // Apply quality immediately for preview
        updateGraphicQuality(selectedQuality);
      });
    });
    
    // Select defaults
    document.querySelector('.setup-btn[data-lang="en"]').classList.add('selected');
    document.querySelector('.setup-btn[data-quality="high"]').classList.add('selected');
    
    // Start button
    setupStartBtn?.addEventListener('click', () => {
      // Save preferences
      gameSettings.graphicQuality = selectedQuality;
      updateGraphicQuality(selectedQuality);
      
      // Mark first launch as completed
      localStorage.setItem('emoji_first_launch_completed', 'true');
      
      // Hide setup and show main menu
      setupScreen.classList.remove('active');
      showScreen('mainMenu');
      
      saveAll();
    });
  }
  
  // Start the game when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
