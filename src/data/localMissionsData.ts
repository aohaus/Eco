import { LocalEcoMission, Coordinates, LocalMissionType } from '../types/missionTypes';

// Haversine formula for calculating distance between two coordinates in meters
export function calculateDistanceMeters(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Preset city spots for instant teleporting/demoing if GPS is unavailable
export const POPULAR_LOCATIONS = [
  { nameJa: '現在地 (GPS)', nameEn: 'Current GPS', coords: null, icon: '📍' },
  { nameJa: '東京・代々木公園', nameEn: 'Tokyo Yoyogi Park', coords: { lat: 35.6717, lng: 139.6949 }, icon: '🗼' },
  { nameJa: '大阪・大阪城公園', nameEn: 'Osaka Castle Park', coords: { lat: 34.6873, lng: 135.5262 }, icon: '🏯' },
  { nameJa: '京都・鴨川デルタ', nameEn: 'Kyoto Kamo River', coords: { lat: 35.0302, lng: 135.7725 }, icon: '⛩️' },
  { nameJa: 'ニューヨーク・セントラルパーク', nameEn: 'New York Central Park', coords: { lat: 40.785091, lng: -73.968285 }, icon: '🗽' },
  { nameJa: 'ロンドン・ハイドパーク', nameEn: 'London Hyde Park', coords: { lat: 51.5072, lng: -0.1657 }, icon: '🎡' },
  { nameJa: 'パリ・エッフェル塔緑地', nameEn: 'Paris Champ de Mars', coords: { lat: 48.8556, lng: 2.2986 }, icon: '🥐' },
  { nameJa: 'シドニー・ボタニックガーデン', nameEn: 'Sydney Royal Botanic Garden', coords: { lat: -33.8642, lng: 151.2166 }, icon: '🦘' },
];

export interface LocalMissionTemplate {
  type: LocalMissionType;
  titleJa: string;
  titleEn: string;
  emoji: string;
  category: any;
  offsetLat: number;
  offsetLng: number;
  descriptionJa: string;
  descriptionEn: string;
  loreJa: string;
  loreEn: string;
  actionNameJa: string;
  actionNameEn: string;
  rewardPoints: number;
  rewardExp: number;
  gameType: 'tap_clean' | 'slider_calibrate' | 'sort_recycle' | 'solar_charge';
  promptJa: string;
  promptEn: string;
  actionVerbJa: string;
  actionVerbEn: string;
  goalCount: number;
  bonusFactJa: string;
  bonusFactEn: string;
}

const MISSION_TEMPLATES: LocalMissionTemplate[] = [
  {
    type: 'park_cleanup',
    titleJa: '近隣パークのゴミ回収＆クリーンアップ',
    titleEn: 'Local Green Park Micro-Cleanup',
    emoji: '🍂',
    category: 'Biodiversity & Forestry',
    offsetLat: 0.0018,
    offsetLng: 0.0014,
    descriptionJa: '公園の植え込みに落ちているポイ捨てゴミやプラスチック片を回収し、土壌生態系を保護しよう！',
    descriptionEn: 'Clear plastic scraps and litter in the local greenery to preserve healthy soil organisms!',
    loreJa: 'シャトミン「土の中のミミズや微生物が元気だと、木々がたくさんCO2を吸ってくれるんだミン！」',
    loreEn: 'Shatomin says: "Healthy soil microbes help urban trees absorb twice as much carbon!"',
    actionNameJa: 'ポイ捨てゴミ超音波バキューム',
    actionNameEn: 'Sonic Bio-Vacuum Cleanser',
    rewardPoints: 120,
    rewardExp: 60,
    gameType: 'tap_clean',
    promptJa: '画面内に出現するプラスチックゴミをタップして一掃しよう！',
    promptEn: 'Tap all floating litter pieces to vacuum clean the park grounds!',
    actionVerbJa: '回収完了！',
    actionVerbEn: 'Litter Collected!',
    goalCount: 5,
    bonusFactJa: '日本の都市公園1ヘクタールあたり、年間約1.5トンの二酸化炭素を吸収・固定しています。',
    bonusFactEn: 'One hectare of city park absorbs roughly 1.5 tons of carbon dioxide per year!',
  },
  {
    type: 'water_purity',
    titleJa: '河川・雨水路の水質浄化バイオスキャン',
    titleEn: 'Urban Stream & Drainage Bio-Purity Scan',
    emoji: '💧',
    category: 'Ocean Health',
    offsetLat: -0.0015,
    offsetLng: 0.0022,
    descriptionJa: '雨水溝から川へ流れる油分やマイクロゴミを検知し、バイオフィルターを展開して水質を守ろう！',
    descriptionEn: 'Scan storm drain runoff for micro-pollutants and deploy bio-purifying bubbles!',
    loreJa: 'シャトミン「街の川は海につながっているよ。ここできれいにすれば海中の魚たちも安心だね！」',
    loreEn: 'Shatomin says: "City streams lead directly to the ocean. Clean rivers protect wild marine reefs!"',
    actionNameJa: 'ナノバブル水質浄化ジェネレーター',
    actionNameEn: 'Nano-Bubble Hydro Purifier',
    rewardPoints: 150,
    rewardExp: 75,
    gameType: 'slider_calibrate',
    promptJa: 'スライダーを動かして「溶存酸素とpHバランス」を最適なグリーンゾーン（100%）に合わせよう！',
    promptEn: 'Adjust the frequency slider to balance the dissolved oxygen & pH into the green zone!',
    actionVerbJa: '水質浄化完了！',
    actionVerbEn: 'Water Purity Restored!',
    goalCount: 1,
    bonusFactJa: 'マイクロプラスチックの約80%は陸地の街や川から海へと流出しています。',
    bonusFactEn: 'Over 80% of ocean plastic begins as inland land-based municipal runoff.',
  },
  {
    type: 'recycle_depot',
    titleJa: '街のリサイクルステーション資源循環回収',
    titleEn: 'Smart Recycling Hub & Material Loop',
    emoji: '♻️',
    category: 'Plastic Neutralization',
    offsetLat: 0.0024,
    offsetLng: -0.0018,
    descriptionJa: 'ペットボトル、アルミ缶、紙パックを正しく分別して、100%リサイクルの循環ループを完成させよう！',
    descriptionEn: 'Sort bottles, aluminum cans, and paper cartons to power the circular zero-waste loop!',
    loreJa: 'シャトミン「アルミ缶をリサイクルすると、新しい缶を作るエネルギーの95%を節約できるんだよ！」',
    loreEn: 'Shatomin says: "Recycling an aluminum can saves 95% of the energy needed to make a new one!"',
    actionNameJa: 'マテリアル高速ソーティング',
    actionNameEn: 'High-Speed Material Sorter',
    rewardPoints: 140,
    rewardExp: 70,
    gameType: 'sort_recycle',
    promptJa: '3つの分別ボックス（ペットボトル・アルミ缶・古紙）にアイテムを正しく振り分けよう！',
    promptEn: 'Sort each recyclables into the correct recovery bin!',
    actionVerbJa: '分別成功！',
    actionVerbEn: 'Recycled Correctly!',
    goalCount: 6,
    bonusFactJa: 'ペットボトル1本をリサイクルすると、約60Wの電球を3時間点灯できるエネルギーが浮きます。',
    bonusFactEn: 'Recycling 1 plastic bottle saves enough energy to power a 60W lightbulb for 3 hours.',
  },
  {
    type: 'urban_bio',
    titleJa: '街路樹＆受粉バタフライの生態系オアシス調査',
    titleEn: 'Urban Pollinator & Native Canopy Sanctuary',
    emoji: '🦋',
    category: 'Biodiversity & Forestry',
    offsetLat: -0.0021,
    offsetLng: -0.0016,
    descriptionJa: 'ミツバチやアゲハチョウが蜜を集める花壇をスキャンし、受粉ネットワークを活性化させよう！',
    descriptionEn: 'Scan pollinator flowers and butterflies to boost the urban bio-corridor matrix!',
    loreJa: 'シャトミン「ミツバチやチョウチョは、僕たちが食べる野菜や果物の花を受粉してくれる大親友なんだ！」',
    loreEn: 'Shatomin says: "Bees and butterflies pollinate over 75% of the fruits and seeds humans eat!"',
    actionNameJa: 'バイオ受粉センサー＆花粉ドローン',
    actionNameEn: 'Bio-Pollination Sensor Array',
    rewardPoints: 160,
    rewardExp: 80,
    gameType: 'tap_clean',
    promptJa: '花壇に集まる受粉シンボルをタップして生物多様性スコアを満タンにしよう！',
    promptEn: 'Tap pollination points around the flower beds to complete the bio-census!',
    actionVerbJa: '調査完了！',
    actionVerbEn: 'Pollinator Protected!',
    goalCount: 6,
    bonusFactJa: '世界の農作物の75%以上がミツバチなどの昆虫による受粉の恩恵を受けています。',
    bonusFactEn: 'More than 75% of leading global food crops rely on animal pollination.',
  },
  {
    type: 'energy_patrol',
    titleJa: 'スマート省エネ＆街の待機電力パトロール',
    titleEn: 'Smart Grid & Standby Energy Patrol',
    emoji: '💡',
    category: 'Climate & Glacier',
    offsetLat: 0.0011,
    offsetLng: -0.0028,
    descriptionJa: '街の建物の無駄な待機電力や消し忘れ照明を検知し、スマート省エネパルスでCO2排出を抑制しよう！',
    descriptionEn: 'Detect idle power drain across buildings and deploy smart energy-saving pulses!',
    loreJa: 'シャトミン「使っていないプラグを抜くだけで、発電所のCO2排出を減らせるんだよ！」',
    loreEn: 'Shatomin says: "Unplugging unused chargers stops phantom energy drain and slashes power plant CO2!"',
    actionNameJa: 'スマートグリッド最適化パルス',
    actionNameEn: 'Smart-Grid Efficiency Pulse',
    rewardPoints: 130,
    rewardExp: 65,
    gameType: 'solar_charge',
    promptJa: 'エネルギーボタンを長押しチャージして、省エネウェーブをエリア全体へ広げよう！',
    promptEn: 'Hold down the Solar Charge button to transmit the energy conservation pulse!',
    actionVerbJa: '省エネ完了！',
    actionVerbEn: 'Energy Saved!',
    goalCount: 1,
    bonusFactJa: '家庭の消費電力の約5〜10%は、使っていない機器の「待機電力」が占めています。',
    bonusFactEn: 'Standby phantom power accounts for 5-10% of standard household electricity usage.',
  },
  {
    type: 'green_commute',
    titleJa: '低炭素エコモビリティ（自転車・徒歩）ルート調査',
    titleEn: 'Zero-Emission Green Mobility Waypoint',
    emoji: '🚲',
    category: 'Climate & Glacier',
    offsetLat: -0.0026,
    offsetLng: 0.0012,
    descriptionJa: '車を使わずに歩行や自転車で移動するグリーンルートを測定し、クリーンな空気を街へ広げよう！',
    descriptionEn: 'Map walking and cycling green pathways to reduce urban tailpipe exhaust and purify air!',
    loreJa: 'シャトミン「1kmの移動を車から自転車に変えるだけで、約150gのCO2が削減できるミン！」',
    loreEn: 'Shatomin says: "Biking just 1km instead of driving cuts ~150g of fossil CO2 emissions!"',
    actionNameJa: 'クリーンエア・ウェイポイント登録',
    actionNameEn: 'Clean-Air Mobility Beacon',
    rewardPoints: 140,
    rewardExp: 70,
    gameType: 'slider_calibrate',
    promptJa: 'エアクオリティメーターのゲージを「グリーンゾーン」に合わせてクリーンエアを放出！',
    promptEn: 'Align the air-quality scrubber meter to maximum purity level!',
    actionVerbJa: 'ルート登録完了！',
    actionVerbEn: 'Green Route Logged!',
    goalCount: 1,
    bonusFactJa: '自転車移動は自動車と比べて移動1kmあたりの温室効果ガス排出量が約10分の1以下です。',
    bonusFactEn: 'Cycling produces less than one-tenth the greenhouse emissions of passenger cars per km.',
  },
];

export function generateLocalMissionsForLocation(
  center: Coordinates,
  language: 'ja' | 'en' = 'ja'
): LocalEcoMission[] {
  return MISSION_TEMPLATES.map((tmpl, idx) => {
    const coords: Coordinates = {
      lat: Number((center.lat + tmpl.offsetLat).toFixed(6)),
      lng: Number((center.lng + tmpl.offsetLng).toFixed(6)),
    };
    const dist = calculateDistanceMeters(center, coords);

    return {
      id: `local_mission_${idx + 1}_${tmpl.type}`,
      title: language === 'ja' ? tmpl.titleJa : tmpl.titleEn,
      titleJa: tmpl.titleJa,
      type: tmpl.type,
      emoji: tmpl.emoji,
      category: tmpl.category,
      coordinates: coords,
      distanceMeters: dist,
      description: language === 'ja' ? tmpl.descriptionJa : tmpl.descriptionEn,
      descriptionJa: tmpl.descriptionJa,
      lore: language === 'ja' ? tmpl.loreJa : tmpl.loreEn,
      loreJa: tmpl.loreJa,
      actionName: language === 'ja' ? tmpl.actionNameJa : tmpl.actionNameEn,
      actionNameJa: tmpl.actionNameJa,
      rewardPoints: tmpl.rewardPoints,
      rewardExp: tmpl.rewardExp,
      interactiveChallenge: {
        prompt: language === 'ja' ? tmpl.promptJa : tmpl.promptEn,
        promptJa: tmpl.promptJa,
        goalCount: tmpl.goalCount,
        actionVerb: language === 'ja' ? tmpl.actionVerbJa : tmpl.actionVerbEn,
        actionVerbJa: tmpl.actionVerbJa,
        bonusFact: language === 'ja' ? tmpl.bonusFactJa : tmpl.bonusFactEn,
        bonusFactJa: tmpl.bonusFactJa,
        gameType: tmpl.gameType,
      },
    };
  });
}
