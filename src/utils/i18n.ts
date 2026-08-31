export type Language = 'ja' | 'en';

export interface Translations {
  // Common & Navigation
  appTitle: string;
  appSubtitle: string;
  startQuest: string;
  continueQuest: string;
  worldMap: string;
  titleScreen: string;
  level: string;
  rank: string;
  exp: string;
  ecoPoints: string;
  streakDays: string;
  dailyQuests: string;
  soundOn: string;
  soundOff: string;
  backToMap: string;
  openRoom: string;
  claimReward: string;
  rewardClaimed: string;

  // Tabs / Areas
  tabMap: string;
  tabLibrary: string;
  tabGame: string;
  tabHabits: string;
  tabCalculator: string;
  tabResources: string;
  tabGuides: string;
  tabShatomin: string;

  // Start & Hub Screen
  welcomeHero: string;
  heroStory: string;
  startAdventure: string;
  chooseDestination: string;
  dailyBonusText: string;
  todayEcoTip: string;

  // Ranks
  rankNovice: string;
  rankGuardian: string;
  rankRanger: string;
  rankChampion: string;
  rankMaster: string;

  // Areas description
  areaMapTitle: string;
  areaLibraryTitle: string;
  areaLibraryDesc: string;
  areaGameTitle: string;
  areaGameDesc: string;
  areaHabitsTitle: string;
  areaHabitsDesc: string;
  areaCalcTitle: string;
  areaCalcDesc: string;
  areaResourcesTitle: string;
  areaResourcesDesc: string;
  areaShatominTitle: string;
  areaShatominDesc: string;
  areaGuidesTitle: string;
  areaGuidesDesc: string;

  // Quests
  quest1Title: string;
  quest1Desc: string;
  quest2Title: string;
  quest2Desc: string;
  quest3Title: string;
  quest3Desc: string;
}

export const translations: Record<Language, Translations> = {
  ja: {
    appTitle: 'シャトミンと地球のエコ大冒険',
    appSubtitle: 'Shatomin’s Eco Quest: Sustainable Adventure',
    startQuest: '冒険をはじめる！',
    continueQuest: 'つづきから (マップを開く)',
    worldMap: '冒険マップ',
    titleScreen: 'タイトルへ戻る',
    level: 'Lv.',
    rank: '称号',
    exp: 'EXP',
    ecoPoints: 'エコポイント',
    streakDays: '日連続',
    dailyQuests: '本日のデイリークエスト',
    soundOn: '効果音 ON',
    soundOff: '効果音 OFF',
    backToMap: '🗺️ ワールドマップへ戻る',
    openRoom: 'シャトミンの部屋へ',
    claimReward: 'クエスト達成報酬を受け取る',
    rewardClaimed: '報酬獲得済み！',

    tabMap: '冒険マップ',
    tabLibrary: '図書室',
    tabGame: '脱出ゲーム',
    tabHabits: '習慣クエスト',
    tabCalculator: 'CO₂診断の塔',
    tabResources: '森の資源台帳',
    tabGuides: '知恵の巻物',
    tabShatomin: 'シャトミンの部屋',

    welcomeHero: '地球をめぐる緑の冒険が今始まる！',
    heroStory: 'バドミントンの妖精「シャトミン」と一緒に、毎日の小さなエコ行動で地球を元気にしよう。知識を学び、ゲームを駆け抜け、エコ習慣をマスターしてマスターエコロジストを目指そう！',
    startAdventure: 'クエストスタート ➔',
    chooseDestination: '冒険するエリアを選んでね！',
    dailyBonusText: '毎日のログインでエコ運勢とお小遣いEXPをゲット！',
    todayEcoTip: 'シャトミンの本日の知恵',

    rankNovice: '見習いエコ戦士',
    rankGuardian: '森のグリーンキーパー',
    rankRanger: '清流のエコレンジャー',
    rankChampion: '大地のチャンピオン',
    rankMaster: '地球のマスターエコロジスト',

    areaMapTitle: 'エコアイランド全図',
    areaLibraryTitle: '太陽と風の図書室',
    areaLibraryDesc: '再エネやゼロウェイストの図解絵本を読んでクイズに挑戦！',
    areaGameTitle: 'シャトミンの脱出大作戦',
    areaGameDesc: '障害物をジャンプで回避して、クリーンエネルギーを集めるアクション！',
    areaHabitsTitle: '毎日のエコ習慣クエスト',
    areaHabitsDesc: 'マイボトル持参や節電など日々の行動を記録してEXPを獲得！',
    areaCalcTitle: 'CO₂フットプリント診断の塔',
    areaCalcDesc: 'あなたの生活の温室効果ガス排出量をシミュレーション！',
    areaResourcesTitle: '森のリソースモニター',
    areaResourcesDesc: '電気・水・ガス・太陽光の使用量を記録してグラフで確認！',
    areaShatominTitle: 'シャトミンの秘密のお部屋',
    areaShatominDesc: 'シャトミンと触れ合って着せ替えやおみくじを楽しもう！',
    areaGuidesTitle: 'エコマスターの知恵の巻物',
    areaGuidesDesc: '省エネや生ごみコンポストの実践ガイド集！',

    quest1Title: '図書室で知識を深める',
    quest1Desc: '図書室の本を1冊読んでクイズに挑戦してみよう (+40 EXP)',
    quest2Title: '脱出ゲームでエネルギー回収',
    quest2Desc: '脱出ゲームで走ってクリーンアイテムを集めよう (+50 EXP)',
    quest3Title: '今日の習慣を1つ達成',
    quest3Desc: 'マイボトル持参や消灯などエコアクションを記録しよう (+30 EXP)',
  },
  en: {
    appTitle: "Shatomin's Eco Quest",
    appSubtitle: 'Interactive Green Adventure & Sustainability Hub',
    startQuest: 'Start Adventure!',
    continueQuest: 'Continue (Open World Map)',
    worldMap: 'World Map',
    titleScreen: 'Title Screen',
    level: 'Lv.',
    rank: 'Rank',
    exp: 'EXP',
    ecoPoints: 'Eco Points',
    streakDays: 'Day Streak',
    dailyQuests: 'Daily Adventure Quests',
    soundOn: 'Audio ON',
    soundOff: 'Audio OFF',
    backToMap: '🗺️ Back to World Map',
    openRoom: "Shatomin's Room",
    claimReward: 'Claim Quest Reward',
    rewardClaimed: 'Reward Claimed!',

    tabMap: 'World Map',
    tabLibrary: 'Eco Library',
    tabGame: 'Runaway Game',
    tabHabits: 'Habit Quests',
    tabCalculator: 'Footprint Tower',
    tabResources: 'Resource Log',
    tabGuides: 'Wisdom Scrolls',
    tabShatomin: "Shatomin's Room",

    welcomeHero: 'The Green Adventure Begins!',
    heroStory: 'Join Shatomin, the eco-friendly badminton fairy mascot, on a rewarding quest to restore harmony to our planet through simple daily actions, fun arcade runs, and interactive illustrated books!',
    startAdventure: 'Start Quest ➔',
    chooseDestination: 'Select an area to explore:',
    dailyBonusText: 'Log in daily to check your eco fortune and claim bonus EXP!',
    todayEcoTip: "Shatomin's Daily Insight",

    rankNovice: 'Eco Apprentice',
    rankGuardian: 'Forest Greenkeeper',
    rankRanger: 'Eco Ranger',
    rankChampion: 'Earth Champion',
    rankMaster: 'Master Ecologist',

    areaMapTitle: 'Eco Island World Map',
    areaLibraryTitle: 'Sun & Wind Eco Library',
    areaLibraryDesc: 'Read illustrated books on clean power and test your knowledge with quizzes!',
    areaGameTitle: "Shatomin's Eco Runaway",
    areaGameDesc: 'Jump over pollution hazards and collect renewable power orbs in dynamic arcade action!',
    areaHabitsTitle: 'Daily Habit Quests',
    areaHabitsDesc: 'Log reusables, bike rides, and energy savings to boost your streak and EXP!',
    areaCalcTitle: 'Carbon Footprint Tower',
    areaCalcDesc: 'Simulate and calculate your annual household carbon footprint!',
    areaResourcesTitle: 'Resource & Energy Monitor',
    areaResourcesDesc: 'Track electricity, water, and gas logs with visual charts!',
    areaShatominTitle: "Shatomin's Secret Haven",
    areaShatominDesc: 'Interact with Shatomin, change costumes, and draw daily eco fortunes!',
    areaGuidesTitle: 'Eco Wisdom Scrolls',
    areaGuidesDesc: 'Comprehensive practical action guides for low-carbon living!',

    quest1Title: 'Explore the Eco Library',
    quest1Desc: 'Read a book and complete the quiz in the library (+40 EXP)',
    quest2Title: 'Arcade Energy Run',
    quest2Desc: 'Play the runaway game and collect clean power (+50 EXP)',
    quest3Title: 'Log a Daily Habit',
    quest3Desc: 'Check off at least one eco-friendly action today (+30 EXP)',
  }
};
