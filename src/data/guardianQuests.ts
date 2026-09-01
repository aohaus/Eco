import { Language } from '../utils/i18n';

export interface GuardianMission {
  id: string;
  level: number;
  order: number;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  targetTab: string; // Tab to navigate to
  rewardExp: number;
  rewardMaterials?: {
    wood?: number;
    leaf?: number;
    solar?: number;
    pebble?: number;
    plastic?: number;
    crystal?: number;
  };
  iconEmoji: string;
  completed: boolean;
  claimed: boolean;
}

export interface GuardianLevelTier {
  level: number;
  titleJa: string;
  titleEn: string;
  subtitleJa: string;
  subtitleEn: string;
  badgeNameJa: string;
  badgeNameEn: string;
  badgeEmoji: string;
  color: string;
  bgGradient: string;
  missions: GuardianMission[];
}

export const GUARDIAN_LEVEL_TIERS: GuardianLevelTier[] = [
  {
    level: 1,
    titleJa: 'Lv.1 ルーキーガーディアン',
    titleEn: 'Lv.1 Rookie Guardian',
    subtitleJa: 'シャトミンと出会い、地球を守る第一歩を踏み出そう！',
    subtitleEn: 'Meet Shatomin and take your first step to protect the Earth!',
    badgeNameJa: '見習いガーディアンの証',
    badgeNameEn: 'Rookie Guardian Badge',
    badgeEmoji: '🌱',
    color: 'text-emerald-700',
    bgGradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-300',
    missions: [
      {
        id: 'lv1-m1',
        level: 1,
        order: 1,
        titleJa: 'シャトミンにご挨拶＆なでなで',
        titleEn: 'Greet & Pet Shatomin',
        descJa: '「相棒シャトミン」のお部屋に行って、頭を優しくなでてあげよう！',
        descEn: 'Visit your buddy Shatomin room and give them a gentle pet on the head!',
        targetTab: 'buddy',
        rewardExp: 50,
        rewardMaterials: { leaf: 3, wood: 2 },
        iconEmoji: '❤️',
        completed: false,
        claimed: false,
      },
      {
        id: 'lv1-m2',
        level: 1,
        order: 2,
        titleJa: 'エコ図書館で絵本を読もう',
        titleEn: 'Read a Book in Eco Library',
        descJa: '「エコ図書館」で地球や動物たちのエコ絵本を1冊開いてみよう！',
        descEn: 'Open and read an illustrated nature book in the Eco Library!',
        targetTab: 'library',
        rewardExp: 50,
        rewardMaterials: { wood: 3, pebble: 2 },
        iconEmoji: '📖',
        completed: false,
        claimed: false,
      },
      {
        id: 'lv1-m3',
        level: 1,
        order: 3,
        titleJa: '今日のエコ習慣を1つチェック',
        titleEn: 'Check 1 Daily Eco Habit',
        descJa: '「習慣トラッカー」で、電気を消した・マイボトルを持った等を行動しよう！',
        descEn: 'Log one eco-friendly action like turning off lights or using a reusable bottle!',
        targetTab: 'habits',
        rewardExp: 50,
        rewardMaterials: { leaf: 4, plastic: 2 },
        iconEmoji: '✅',
        completed: false,
        claimed: false,
      },
    ],
  },
  {
    level: 2,
    titleJa: 'Lv.2 エコレンジャー',
    titleEn: 'Lv.2 Eco Ranger',
    subtitleJa: 'クラフトとゲームで地球のゴミを減らしてエネルギーを作ろう！',
    subtitleEn: 'Craft items & play runner mini-game to reduce waste and generate clean power!',
    badgeNameJa: 'グリーンガードの証',
    badgeNameEn: 'Green Guard Badge',
    badgeEmoji: '🌿',
    color: 'text-teal-700',
    bgGradient: 'from-teal-500/10 to-cyan-500/10 border-teal-300',
    missions: [
      {
        id: 'lv2-m1',
        level: 2,
        order: 1,
        titleJa: '脱出大作戦でゴミを回収しよう',
        titleEn: 'Collect Plastic in Runner Game',
        descJa: '「脱出大作戦」ゲームをプレイして、障害物を避けながらゴミを拾おう！',
        descEn: 'Play the Eco Runaway Game and gather recyclable items while avoiding obstacles!',
        targetTab: 'game',
        rewardExp: 80,
        rewardMaterials: { plastic: 5, pebble: 3 },
        iconEmoji: '🏃',
        completed: false,
        claimed: false,
      },
      {
        id: 'lv2-m2',
        level: 2,
        order: 2,
        titleJa: 'クラフト台でエコグッズを作ろう',
        titleEn: 'Craft an Item at the Bench',
        descJa: '「クラフト台」で集めた素材を使って、マイボトルやソーラーグッズを作ろう！',
        descEn: 'Use your collected materials at the Crafting Bench to build useful eco gear!',
        targetTab: 'craft',
        rewardExp: 80,
        rewardMaterials: { solar: 2, crystal: 1 },
        iconEmoji: '🔨',
        completed: false,
        claimed: false,
      },
      {
        id: 'lv2-m3',
        level: 2,
        order: 3,
        titleJa: 'CO₂フットプリントを診断しよう',
        titleEn: 'Calculate Your Carbon Footprint',
        descJa: '「計算機」で普段の生活のCO₂排出量を調べてエコ改善点を見つけよう！',
        descEn: 'Check your carbon footprint in the calculator to discover green lifestyle tips!',
        targetTab: 'calculator',
        rewardExp: 90,
        rewardMaterials: { solar: 2, leaf: 3 },
        iconEmoji: '🧭',
        completed: false,
        claimed: false,
      },
    ],
  },
  {
    level: 3,
    titleJa: 'Lv.3 自然の探検隊長',
    titleEn: 'Lv.3 Nature Scout Captain',
    subtitleJa: '世界と身近な街をパトロールして環境ホットスポットをレスキュー！',
    subtitleEn: 'Patrol both your local area & global hot zones to restore nature!',
    badgeNameJa: '探検隊長の証',
    badgeNameEn: 'Scout Captain Badge',
    badgeEmoji: '🌍',
    color: 'text-cyan-700',
    bgGradient: 'from-cyan-500/10 to-blue-500/10 border-cyan-300',
    missions: [
      {
        id: 'lv3-m1',
        level: 3,
        order: 1,
        titleJa: '身近な街のGPSパトロール',
        titleEn: 'Local GPS Eco Mission',
        descJa: '「地球レスキュー」の現在地パトロールで近隣のゴミ回収や水質調査をしよう！',
        descEn: 'Complete a local mission on the GPS map like park cleanup or water quality scan!',
        targetTab: 'explorer',
        rewardExp: 120,
        rewardMaterials: { crystal: 2, solar: 3 },
        iconEmoji: '📍',
        completed: false,
        claimed: false,
      },
      {
        id: 'lv3-m2',
        level: 3,
        order: 2,
        titleJa: '世界ホットゾーンの環境レスキュー',
        titleEn: 'Global Hot Zone Earth Rescue',
        descJa: '「地球レスキュー」の世界マップでサンゴ礁や熱帯雨林の再生ミッションをクリア！',
        descEn: 'Deploy eco gadgets to restore coral reefs, glaciers, or the Amazon rainforest!',
        targetTab: 'explorer',
        rewardExp: 150,
        rewardMaterials: { crystal: 3, solar: 4 },
        iconEmoji: '🚀',
        completed: false,
        claimed: false,
      },
      {
        id: 'lv3-m3',
        level: 3,
        order: 3,
        titleJa: 'エコ図鑑の妖精たちを観察しよう',
        titleEn: 'Discover Creatures in Eco-Dex',
        descJa: '「エコ図鑑」を開いて、仲間になったエコ精霊たちの生態をチェックしよう！',
        descEn: 'Open the Eco-Dex to review the elemental nature spirits you have befriended!',
        targetTab: 'dex',
        rewardExp: 130,
        rewardMaterials: { leaf: 5, crystal: 2 },
        iconEmoji: '🐾',
        completed: false,
        claimed: false,
      },
    ],
  },
  {
    level: 4,
    titleJa: 'Lv.4 マスターガーディアン',
    titleEn: 'Lv.4 Master Guardian',
    subtitleJa: '地球の自然を守り抜く真のマスター！究極のエコを目指そう！',
    subtitleEn: 'A true Master protecting our planet! Strive for ultimate sustainability!',
    badgeNameJa: 'マスターガーディアンの証',
    badgeNameEn: 'Master Guardian Badge',
    badgeEmoji: '👑',
    color: 'text-amber-700',
    bgGradient: 'from-amber-500/10 to-orange-500/10 border-amber-300',
    missions: [
      {
        id: 'lv4-m1',
        level: 4,
        order: 1,
        titleJa: 'シャトミンとの仲良し度を深めよう',
        titleEn: 'Deepen Bond with Shatomin',
        descJa: 'きのみをあげたりシャトル遊びをして、シャトミンをもっと元気にしよう！',
        descEn: 'Feed berries and play games to raise Shatomin\'s friendship & affection!',
        targetTab: 'buddy',
        rewardExp: 200,
        rewardMaterials: { crystal: 5, solar: 5 },
        iconEmoji: '✨',
        completed: false,
        claimed: false,
      },
      {
        id: 'lv4-m2',
        level: 4,
        order: 2,
        titleJa: 'デイリーエコルーレットを回そう',
        titleEn: 'Spin the Daily Eco Roulette',
        descJa: '毎日のエコルーレットを回して、ボーナスアイテムときのみをゲットしよう！',
        descEn: 'Spin the daily fortune wheel to claim bonus items and super berries!',
        targetTab: 'map',
        rewardExp: 180,
        rewardMaterials: { wood: 5, leaf: 5, plastic: 5 },
        iconEmoji: '🎰',
        completed: false,
        claimed: false,
      },
      {
        id: 'lv4-m3',
        level: 4,
        order: 3,
        titleJa: 'エコ電力・水資源ログを記録しよう',
        titleEn: 'Log Resource Monitor Data',
        descJa: '「資源モニター」で電気や水の使用量を記録してスマート生活を続けよう！',
        descEn: 'Log daily resource usage in the Resource Monitor to sustain a zero-waste life!',
        targetTab: 'resources',
        rewardExp: 220,
        rewardMaterials: { crystal: 5, solar: 5, wood: 5 },
        iconEmoji: '⚡',
        completed: false,
        claimed: false,
      },
    ],
  },
];
