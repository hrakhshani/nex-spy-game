export type Lang = 'fa' | 'en' | 'fr';

export const LANGUAGES: { code: Lang; label: string; nativeLabel: string }[] = [
  { code: 'fa', label: 'Persian', nativeLabel: 'فارسی' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
];

export const RTL_LANGS: Lang[] = ['fa'];

type Dict = {
  appTitle: string;
  setupSubtitle: string;
  language: string;
  totalPlayers: string;
  citizens: string;
  spies: string;
  durationMinutes: string;
  startGame: string;
  simulateButton: string;
  errMinPlayers: string;
  errMinSpies: string;
  errMinCitizens: string;
  errSumMismatch: string;
  errMinDuration: string;
  playerProgress: (current: string, total: string) => string;
  playerLabel: (n: string) => string;
  tapToReveal: string;
  youAreSpy: string;
  yourWord: string;
  tapToHide: string;
  rolesDistributed: string;
  gameDuration: (mins: string) => string;
  startTimer: string;
  pause: string;
  resume: string;
  newGame: string;
  timeUp: string;
  simResultsTitle: string;
  simResultsSubtitle: (iter: string, players: string, spies: string) => string;
  simExpected: (pct: string, count: string) => string;
  simPlayer: (n: string) => string;
  simEngineNote: string;
  simSampleNote: (sample: string) => string;
  close: string;
  percentSign: string;
  heroName: string;
  shadowName: string;
  championName: string;
  realmTagline: string;
};

export const TRANSLATIONS: Record<Lang, Dict> = {
  fa: {
    appTitle: 'بازی جاسوس',
    setupSubtitle: 'تنظیمات بازی',
    language: 'زبان',
    totalPlayers: 'تعداد بازیکن‌ها',
    citizens: 'تعداد شهروندها',
    spies: 'تعداد جاسوس‌ها',
    durationMinutes: 'زمان بازی (دقیقه)',
    startGame: 'شروع بازی',
    simulateButton: 'شبیه‌سازی (۵ بازیکن، ۱ جاسوس، ۱۰۰ بار)',
    errMinPlayers: 'حداقل ۳ بازیکن نیاز است.',
    errMinSpies: 'حداقل ۱ جاسوس باید وجود داشته باشد.',
    errMinCitizens: 'حداقل ۱ شهروند باید وجود داشته باشد.',
    errSumMismatch: 'مجموع شهروندان و جاسوس‌ها باید برابر تعداد بازیکن‌ها باشد.',
    errMinDuration: 'زمان بازی باید حداقل ۱ دقیقه باشد.',
    playerProgress: (c, t) => `بازیکن ${c} از ${t}`,
    playerLabel: (n) => `بازیکن ${n}`,
    tapToReveal: 'برای مشاهده نقش خود لمس کنید',
    youAreSpy: 'شما جاسوس هستید!',
    yourWord: 'کلمه شما:',
    tapToHide: 'برای مخفی کردن و تحویل به نفر بعد لمس کنید',
    rolesDistributed: 'همه نقش‌ها توزیع شد!',
    gameDuration: (m) => `زمان بازی: ${m} دقیقه`,
    startTimer: 'شروع تایمر بازی',
    pause: 'توقف',
    resume: 'ادامه',
    newGame: 'بازی جدید',
    timeUp: 'زمان بازی تمام شد!',
    simResultsTitle: 'نتایج شبیه‌سازی',
    simResultsSubtitle: (iter, p, s) =>
      `${iter} اجرا با ${p} بازیکن و ${s} جاسوس`,
    simExpected: (pct, c) =>
      `احتمال مورد انتظار برای هر موقعیت: ${pct}٪  (تقریبا ${c} بار)`,
    simPlayer: (n) => `بازیکن ${n}`,
    simEngineNote:
      'موتور رندوم: Math.random() (Hermes/JS — به صورت خودکار با زمان و آنتروپی سیستم در زمان شروع برنامه seed می‌شود).',
    simSampleNote: (s) => `نمونه تصادفی پس از شبیه‌سازی: ${s}`,
    close: 'بستن',
    percentSign: '٪',
    heroName: 'جنگل بان',
    shadowName: 'تیغه سایه',
    championName: 'قهرمان آسمان',
    realmTagline: 'ماجراجویی قلمرو پنهان',
  },
  en: {
    appTitle: 'Spy Game',
    setupSubtitle: 'Game Setup',
    language: 'Language',
    totalPlayers: 'Number of players',
    citizens: 'Number of citizens',
    spies: 'Number of spies',
    durationMinutes: 'Game time (minutes)',
    startGame: 'Start Game',
    simulateButton: 'Simulate (5 players, 1 spy, 100 runs)',
    errMinPlayers: 'At least 3 players are required.',
    errMinSpies: 'At least 1 spy is required.',
    errMinCitizens: 'At least 1 citizen is required.',
    errSumMismatch: 'Citizens and spies must sum to the number of players.',
    errMinDuration: 'Game time must be at least 1 minute.',
    playerProgress: (c, t) => `Player ${c} of ${t}`,
    playerLabel: (n) => `Player ${n}`,
    tapToReveal: 'Tap to reveal your role',
    youAreSpy: 'You are the spy!',
    yourWord: 'Your word:',
    tapToHide: 'Tap to hide and pass to the next player',
    rolesDistributed: 'All roles have been distributed!',
    gameDuration: (m) => `Game time: ${m} minutes`,
    startTimer: 'Start Game Timer',
    pause: 'Pause',
    resume: 'Resume',
    newGame: 'New Game',
    timeUp: "Time's up!",
    simResultsTitle: 'Simulation Results',
    simResultsSubtitle: (iter, p, s) =>
      `${iter} runs with ${p} players and ${s} spies`,
    simExpected: (pct, c) =>
      `Expected probability per position: ${pct}%  (≈ ${c} times)`,
    simPlayer: (n) => `Player ${n}`,
    simEngineNote:
      'Random engine: Math.random() (Hermes/JS — auto-seeded from system time and entropy at app start).',
    simSampleNote: (s) => `Random sample after simulation: ${s}`,
    close: 'Close',
    percentSign: '%',
    heroName: 'Wild Scout',
    shadowName: 'Veiled Blade',
    championName: 'Sky Champion',
    realmTagline: 'A hidden realm adventure',
  },
  fr: {
    appTitle: 'Jeu de l’espion',
    setupSubtitle: 'Configuration du jeu',
    language: 'Langue',
    totalPlayers: 'Nombre de joueurs',
    citizens: 'Nombre de citoyens',
    spies: 'Nombre d’espions',
    durationMinutes: 'Durée du jeu (minutes)',
    startGame: 'Démarrer la partie',
    simulateButton: 'Simuler (5 joueurs, 1 espion, 100 tirages)',
    errMinPlayers: 'Au moins 3 joueurs sont requis.',
    errMinSpies: 'Au moins 1 espion est requis.',
    errMinCitizens: 'Au moins 1 citoyen est requis.',
    errSumMismatch:
      'La somme des citoyens et des espions doit égaler le nombre de joueurs.',
    errMinDuration: 'La durée doit être d’au moins 1 minute.',
    playerProgress: (c, t) => `Joueur ${c} sur ${t}`,
    playerLabel: (n) => `Joueur ${n}`,
    tapToReveal: 'Touchez pour révéler votre rôle',
    youAreSpy: 'Vous êtes l’espion !',
    yourWord: 'Votre mot :',
    tapToHide: 'Touchez pour masquer et passer au joueur suivant',
    rolesDistributed: 'Tous les rôles ont été distribués !',
    gameDuration: (m) => `Durée du jeu : ${m} minutes`,
    startTimer: 'Démarrer le minuteur',
    pause: 'Pause',
    resume: 'Reprendre',
    newGame: 'Nouvelle partie',
    timeUp: 'Le temps est écoulé !',
    simResultsTitle: 'Résultats de la simulation',
    simResultsSubtitle: (iter, p, s) =>
      `${iter} tirages avec ${p} joueurs et ${s} espions`,
    simExpected: (pct, c) =>
      `Probabilité attendue par position : ${pct}%  (≈ ${c} fois)`,
    simPlayer: (n) => `Joueur ${n}`,
    simEngineNote:
      'Moteur aléatoire : Math.random() (Hermes/JS — initialisé automatiquement à partir de l’heure et de l’entropie système au démarrage).',
    simSampleNote: (s) => `Échantillon aléatoire après simulation : ${s}`,
    close: 'Fermer',
    percentSign: '%',
    heroName: 'Eclaireur sauvage',
    shadowName: 'Lame voilee',
    championName: 'Champion celeste',
    realmTagline: 'Une aventure de royaume secret',
  },
};
