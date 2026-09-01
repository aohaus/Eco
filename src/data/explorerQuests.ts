import { Language } from '../utils/i18n';

export interface ExplorerStepMission {
  id: string;
  level: number;
  order: number;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  targetView: 'local_gps' | 'global_radar' | 'briefing' | 'deploy' | 'logbook';
  targetMissionId?: string;
  iconEmoji: string;
  rewardExp: number;
  rewardPoints: number;
  completed: boolean;
  claimed: boolean;
}

export interface ExplorerLevelTier {
  level: number;
  rankNameJa: string;
  rankNameEn: string;
  badgeEmoji: string;
  descriptionJa: string;
  descriptionEn: string;
  targetGlobalMissionsRequired: number;
  targetLocalMissionsRequired: number;
  missions: ExplorerStepMission[];
}

export const EXPLORER_LEVEL_TIERS: ExplorerLevelTier[] = [
  {
    level: 1,
    rankNameJa: 'Lv.1 見習いフィールド調査員',
    rankNameEn: 'Lv.1 Junior Field Cadet',
    badgeEmoji: '🔰',
    descriptionJa: 'まずは身近な街のパトロールと、初めての地球ホットゾーン調査に出発しよう！',
    descriptionEn: 'Start by scanning your local area and deploying your very first Earth hotspot rescue!',
    targetGlobalMissionsRequired: 1,
    targetLocalMissionsRequired: 1,
    missions: [
      {
        id: 'exp-lv1-1',
        level: 1,
        order: 1,
        titleJa: '現在地GPSパトロールを実施しよう',
        titleEn: 'Conduct a Local GPS Patrol',
        descJa: '「現在地パトロール」マップで近くの公園や水質・ゴミ調査スポットをタップして調査完了しよう！',
        descEn: 'Open the Local GPS Map and investigate a nearby park, clean water spot, or recycling depot!',
        targetView: 'local_gps',
        iconEmoji: '📍',
        rewardExp: 60,
        rewardPoints: 100,
        completed: false,
        claimed: false,
      },
      {
        id: 'exp-lv1-2',
        level: 1,
        order: 2,
        titleJa: 'サンゴ礁レスキュー作戦を出撃しよう',
        titleEn: 'Deploy Great Barrier Reef Coral Shield',
        descJa: '「世界ホットゾーン」からグレートバリアリーフを選び、遮光ブイとサンゴ幼生注入器で白化を防ごう！',
        descEn: 'Select the Great Barrier Reef on the Global Radar, and deploy shade buoys to rescue coral reefs!',
        targetView: 'global_radar',
        targetMissionId: 'mission_coral_reef',
        iconEmoji: '🪸',
        rewardExp: 80,
        rewardPoints: 150,
        completed: false,
        claimed: false,
      },
      {
        id: 'exp-lv1-3',
        level: 1,
        order: 3,
        titleJa: '解禁された生態系インテルを観察しよう',
        titleEn: 'Review Unlocked Field Intel',
        descJa: '「生態系図鑑」を開き、救出した生き物や環境データをじっくり読んでみよう！',
        descEn: 'Open the Field Intel Logbook to study the vital stats and key facts of saved wildlife!',
        targetView: 'logbook',
        iconEmoji: '📖',
        rewardExp: 50,
        rewardPoints: 80,
        completed: false,
        claimed: false,
      },
    ],
  },
  {
    level: 2,
    rankNameJa: 'Lv.2 エコパトロール偵察員',
    rankNameEn: 'Lv.2 Earth Patrol Scout',
    badgeEmoji: '📡',
    descriptionJa: '世界の熱帯雨林と北極の氷河を救うため、最新の科学ガジェットを使いこなそう！',
    descriptionEn: 'Master advanced science gadgets to regenerate the Amazon rainforest and Arctic glaciers!',
    targetGlobalMissionsRequired: 3,
    targetLocalMissionsRequired: 2,
    missions: [
      {
        id: 'exp-lv2-1',
        level: 2,
        order: 1,
        titleJa: 'アマゾン熱帯雨林の緑化作戦をクリア',
        titleEn: 'Restore the Amazon Rainforest Canopy',
        descJa: 'ドローンから自生種の種子ポッドを散布し、分断されたジャガーの回廊を繋げよう！',
        descEn: 'Fly seed dispersal drones to drop native rainforest seed balls and reconnect wildlife corridors!',
        targetView: 'global_radar',
        targetMissionId: 'mission_amazon_reforest',
        iconEmoji: '🚁',
        rewardExp: 100,
        rewardPoints: 200,
        completed: false,
        claimed: false,
      },
      {
        id: 'exp-lv2-2',
        level: 2,
        order: 2,
        titleJa: '北極圏グリーンランド氷河の遮熱作戦',
        titleEn: 'Deploy Arctic Glacier Solar Reflectors',
        descJa: '北極の氷床に環境配慮型の反射バイオエアロゲルを散布して融解を食い止めよう！',
        descEn: 'Apply non-toxic reflective bio-aerogel blankets to slow melting on Greenland glaciers!',
        targetView: 'global_radar',
        targetMissionId: 'mission_arctic_ice',
        iconEmoji: '🧊',
        rewardExp: 110,
        rewardPoints: 220,
        completed: false,
        claimed: false,
      },
      {
        id: 'exp-lv2-3',
        level: 2,
        order: 3,
        titleJa: '異なる2箇所のローカルパトロールを完了',
        titleEn: 'Complete 2 Distinct Local Missions',
        descJa: 'エコエネルギー見回りやリサイクルデポなど、身近なミッションを2つ達成しよう！',
        descEn: 'Investigate 2 different local mission points like energy patrol or urban biodiversity scan!',
        targetView: 'local_gps',
        iconEmoji: '🗺️',
        rewardExp: 90,
        rewardPoints: 180,
        completed: false,
        claimed: false,
      },
    ],
  },
  {
    level: 3,
    rankNameJa: 'Lv.3 生態系シグナル専門官',
    rankNameEn: 'Lv.3 Bio-Signal Specialist',
    badgeEmoji: '🔬',
    descriptionJa: '太平洋ゴミベルトのプラスチック回収とサハラ砂漠の緑化に挑戦！',
    descriptionEn: 'Tackle the Great Pacific Garbage Patch and expand the Great Green Wall of Africa!',
    targetGlobalMissionsRequired: 5,
    targetLocalMissionsRequired: 3,
    missions: [
      {
        id: 'exp-lv3-1',
        level: 3,
        order: 1,
        titleJa: '太平洋ゴミベルトのナノバイオ酵素回収',
        titleEn: 'Neutralize Pacific Garbage Patch',
        descJa: '自律型スイープブイとPET分解酵素を用いて、海を漂うマイクロプラスチックを回収！',
        descEn: 'Deploy autonomous ocean sweepers and bio-enzymes to neutralize marine microplastics!',
        targetView: 'global_radar',
        targetMissionId: 'mission_pacific_patch',
        iconEmoji: '🌊',
        rewardExp: 140,
        rewardPoints: 280,
        completed: false,
        claimed: false,
      },
      {
        id: 'exp-lv3-2',
        level: 3,
        order: 2,
        titleJa: 'アフリカ「緑の長城」土壌保水作戦',
        titleEn: 'Reinforce the Great Green Wall',
        descJa: 'サヘル地域の土壌に高保水バイオゲルとアカシア種子を定着させ、砂漠化を阻止！',
        descEn: 'Enrich Sahel soils with mycorrhizal water-trapping nutrients and plant desert acacia trees!',
        targetView: 'global_radar',
        targetMissionId: 'mission_sahel_greenwall',
        iconEmoji: '🏜️',
        rewardExp: 150,
        rewardPoints: 300,
        completed: false,
        claimed: false,
      },
      {
        id: 'exp-lv3-3',
        level: 3,
        order: 3,
        titleJa: 'ガラパゴス海洋保護区の水中ネット回収',
        titleEn: 'Protect Galapagos Marine Sanctuary',
        descJa: '音響水中ドローンで海中を探索し、ウミイグアナやウミガメを漂流漁具から守ろう！',
        descEn: 'Pilot hydro-acoustic sonar sentinels to recover hazardous ghost gear around Galapagos!',
        targetView: 'global_radar',
        targetMissionId: 'mission_galapagos_guard',
        iconEmoji: '🐢',
        rewardExp: 160,
        rewardPoints: 320,
        completed: false,
        claimed: false,
      },
    ],
  },
  {
    level: 4,
    rankNameJa: 'Lv.4 惑星再生最高司令官',
    rankNameEn: 'Lv.4 Chief Planetary Guardian',
    badgeEmoji: '⭐',
    descriptionJa: '地球上のすべての環境ホットゾーンを救出し、完全な惑星バランスを達成しよう！',
    descriptionEn: 'Restore all planetary hotspots worldwide and achieve complete planetary harmony!',
    targetGlobalMissionsRequired: 6,
    targetLocalMissionsRequired: 4,
    missions: [
      {
        id: 'exp-lv4-1',
        level: 4,
        order: 1,
        titleJa: '全6箇所の世界ホットゾーンを完全再生',
        titleEn: 'Restore All 6 Global Hot Zones',
        descJa: 'すべての地球レスキュー作戦を完了し、全地域の再生率を100%に引き上げよう！',
        descEn: 'Achieve 100% restoration across all 6 planetary hot zones across the globe!',
        targetView: 'global_radar',
        iconEmoji: '🌍',
        rewardExp: 250,
        rewardPoints: 500,
        completed: false,
        claimed: false,
      },
      {
        id: 'exp-lv4-2',
        level: 4,
        order: 2,
        titleJa: '生態系インテル図鑑をコンプリート',
        titleEn: 'Complete Field Intel Dossiers',
        descJa: '解禁されたすべての野生動物・生態系インテルカードを閲覧して知識を深めよう！',
        descEn: 'Collect and inspect all 6 detailed ecological dossiers in the Field Intel Logbook!',
        targetView: 'logbook',
        iconEmoji: '🏆',
        rewardExp: 200,
        rewardPoints: 400,
        completed: false,
        claimed: false,
      },
      {
        id: 'exp-lv4-3',
        level: 4,
        order: 3,
        titleJa: '身近な街のマスターパトロール',
        titleEn: 'Master of Local Area Patrols',
        descJa: 'GPSマップのローカルミッションを合計4回以上クリアして、身近な地域を守り抜こう！',
        descEn: 'Complete 4 or more local GPS eco activities to create a sustainable neighborhood!',
        targetView: 'local_gps',
        iconEmoji: '✨',
        rewardExp: 220,
        rewardPoints: 450,
        completed: false,
        claimed: false,
      },
    ],
  },
];
