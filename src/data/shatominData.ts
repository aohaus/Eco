import { ShatominExpression } from '../components/ShatominAvatar';

export interface ShatominDialogue {
  textJa: string;
  textEn: string;
  expression: ShatominExpression;
  mood: 'happy' | 'sparkle' | 'cheer' | 'cool' | 'shy' | 'proud';
}

export interface ExpressionItem {
  id: ShatominExpression;
  nameJa: string;
  nameEn: string;
  descriptionJa: string;
  descriptionEn: string;
  tag: string;
}

export const shatominExpressions: ExpressionItem[] = [
  {
    id: 'smile',
    nameJa: 'いつもにこにこ (Standard Smile)',
    nameEn: 'Sunny Smile',
    descriptionJa: 'つぶらな瞳と優しい笑顔。みんなをほっこりさせる定番スタイル！',
    descriptionEn: 'Gentle and friendly standard plush expression with sweet bead eyes.',
    tag: 'ベーシック',
  },
  {
    id: 'sparkle',
    nameJa: 'キラキラおめめ (Sparkling Eyes)',
    nameEn: 'Star Sparkle',
    descriptionJa: '瞳にゴールドの星がキラリ！エコな成果を出した時に大興奮！',
    descriptionEn: 'Star-struck golden sparkling eyes when discovering great eco progress.',
    tag: '大喜び',
  },
  {
    id: 'wink',
    nameJa: '元気ウインク (Wink & Cheer)',
    nameEn: 'Cheery Wink',
    descriptionJa: 'バチッとウインク＆お口を大きくあけて「ナイスショット！」の合図！',
    descriptionEn: 'Playful wink with a wide joyful smile celebrating your accomplishments.',
    tag: 'ごきげん',
  },
  {
    id: 'shy',
    nameJa: 'てれやさん (Blushing Shy)',
    nameEn: 'Blushing Sweet',
    descriptionJa: '両手をほっぺに当てて「えへへ…褒められると照れちゃうシャト！」。',
    descriptionEn: 'Hands on pink blushing cheeks, sweet and modest when petted or praised.',
    tag: 'かわいい',
  },
  {
    id: 'happy_closed',
    nameJa: 'にこにこ笑顔 (Laughing Eyes)',
    nameEn: 'Joyful Laugh',
    descriptionJa: '目を細めて思いっきりハッピー！地球に優しい毎日に大満足。',
    descriptionEn: 'Laughing closed-eye smile thoroughly enjoying a low-carbon day.',
    tag: '癒やし',
  },
  {
    id: 'sunglasses',
    nameJa: 'クールなサングラス (Cool Shades)',
    nameEn: 'Cool Sunglasses',
    descriptionJa: '真っ黒なサングラスでキメポーズ！夏の省エネや日差し対策もバッチリ。',
    descriptionEn: 'Sporting sleek black shades, cool and confident ready for summer efficiency.',
    tag: 'クール',
  },
  {
    id: 'sunflower',
    nameJa: 'ひまわり持ち (Sunflower Buddy)',
    nameEn: 'Sunflower Charm',
    descriptionJa: '大好きなひまわりの花を抱えて自然のパワーをたっぷりチャージ！',
    descriptionEn: 'Holding a bright yellow sunflower radiating natural solar energy.',
    tag: 'お花',
  },
  {
    id: 'wave',
    nameJa: '元気にてをふる (Friendly Wave)',
    nameEn: 'Friendly Wave',
    descriptionJa: '右手を高々とあげて「こんにちはシャト！今日も一緒にがんばろう！」。',
    descriptionEn: 'Waving right hand warmly to welcome you to another sustainable day.',
    tag: 'あいさつ',
  },
];

export const shatominGreetings: ShatominDialogue[] = [
  {
    textJa: 'こんにちはシャト！今日も地球にいいこと、一緒に見つけよう！',
    textEn: 'Hello! Let\'s find great ways to care for our Earth together today!',
    expression: 'wave',
    mood: 'cheer',
  },
  {
    textJa: 'バドミントンの羽根のように軽やかに、フットプリントを減らしていこうシャト！',
    textEn: 'Just like a badminton shuttle, let\'s keep our footprint light and breezy!',
    expression: 'smile',
    mood: 'happy',
  },
  {
    textJa: 'マイボトル持った？エコバッグ持った？準備バッチリシャト！',
    textEn: 'Got your reusable bottle and eco tote bag? Ready to go!',
    expression: 'sparkle',
    mood: 'sparkle',
  },
  {
    textJa: 'えへへ、いつも遊びにきてくれてありがとうシャト…！',
    textEn: 'Hehe, thank you so much for hanging out with me every day!',
    expression: 'shy',
    mood: 'shy',
  },
  {
    textJa: '省エネ対策もクールにキメるのがシャトミン流シャト！',
    textEn: 'Keeping energy savings cool and stylish—that\'s the Shatomin way!',
    expression: 'sunglasses',
    mood: 'cool',
  },
  {
    textJa: 'お日さまの光でひまわりもシャトミンも元気いっぱいシャト！',
    textEn: 'Soaking in the clean sunshine just like a bright sunflower!',
    expression: 'sunflower',
    mood: 'happy',
  },
  {
    textJa: '図書室には太陽光やゼロウェイストの面白い絵本がたくさんあるシャト！',
    textEn: 'Our Eco Library has awesome illustrated books and quizzes on renewable energy and zero waste!',
    expression: 'sparkle',
    mood: 'sparkle',
  },
  {
    textJa: '脱出ゲームで障害物を避けてエコアイテムを集めるシャト！一緒に走ろう！',
    textEn: 'Dodge pollution obstacles and gather green power in the Runaway Game! Let’s dash together!',
    expression: 'wink',
    mood: 'cheer',
  },
];

export const shatominDailyTips = [
  {
    titleJa: 'シャトル冠のお手入れとマイバッグ',
    titleEn: 'Feather Crown & Reusable Bags',
    bodyJa: 'お買い物にはマイバッグを持参！レジ袋を1枚辞退するだけで約10gのCO₂をカットできるシャト！',
    bodyEn: 'Bringing your own shopping bag cuts roughly 10g of CO₂ every single time!',
    icon: 'bag',
  },
  {
    titleJa: '涼しいエアコン設定28℃の魔法',
    titleEn: 'The 28°C Smart AC Setting',
    bodyJa: '冷房の温度を1℃上げるだけで約10%の節電！サングラスをかけて涼しく過ごそうシャト。',
    bodyEn: 'Raising your AC temp by just 1°C saves around 10% on cooling electricity!',
    icon: 'snowflake',
  },
  {
    titleJa: '自転車＆ウォーキングで軽快フットワーク',
    titleEn: 'Nimble Footwork on Foot or Bike',
    bodyJa: '近い場所なら歩くか自転車が一番！シャトルのような軽やかなステップで健康＆脱炭素シャト！',
    bodyEn: 'For short trips, walking or biking gives you great health and zero-emission travel!',
    icon: 'bike',
  },
  {
    titleJa: '旬の野菜とひまわりパワー',
    titleEn: 'Seasonal Produce & Sun Power',
    bodyJa: '地元で採れた旬の野菜を食べると、輸送時のCO₂（フードマイレージ）をグッと抑えられるシャト！',
    bodyEn: 'Choosing local seasonal foods drastically cuts transportation emissions (food miles)!',
    icon: 'sunflower',
  },
  {
    titleJa: '待機電力カットでちりつも節約',
    titleEn: 'Vampire Draw & Standby Power',
    bodyJa: '使わない家電の主電源をOFF！スイッチ付きタップを使うと手軽にエコできるシャト！',
    bodyEn: 'Turning off power strips on idle electronics stops phantom energy drain easily!',
    icon: 'zap',
  },
];

export const ecoFortunes = [
  {
    luck: '大大吉 (Ultra Mega Eco Luck)',
    color: 'text-amber-500',
    titleJa: '太陽サンサン・エコ絶好調！',
    titleEn: 'Sunshine Super Fortune!',
    messageJa: '今日はどんなエコアクションも大成功！マイボトルを持って出かけるとハッピーな出会いがあるかもシャト！',
    messageEn: 'Your sustainable habits shine bright today! Take your refillable bottle along for great karma.',
    bonusPoints: 30,
    expression: 'sparkle' as ShatominExpression,
  },
  {
    luck: '大吉 (Great Eco Fortune)',
    color: 'text-emerald-600',
    titleJa: '軽やかステップ・脱炭素日和',
    titleEn: 'Breezy Low-Carbon Day',
    messageJa: '階段を使ったり自転車に乗ることで運気UP！シャトミンも応援してるシャト！',
    messageEn: 'Taking the stairs or cycling will give you a major boost of vitality and energy!',
    bonusPoints: 20,
    expression: 'wink' as ShatominExpression,
  },
  {
    luck: '中吉 (Good Eco Fortune)',
    color: 'text-teal-600',
    titleJa: 'まごころマイバッグ・吉日',
    titleEn: 'Kind Conscious Day',
    messageJa: '地元の美味しい野菜を食べると身体も地球も大喜び！ひまわりのように笑顔で過ごそうシャト。',
    messageEn: 'Enjoy local seasonal vegetables to keep both your body and the planet thriving.',
    bonusPoints: 15,
    expression: 'sunflower' as ShatominExpression,
  },
  {
    luck: '吉 (Happy Eco Fortune)',
    color: 'text-cyan-600',
    titleJa: 'クール＆スマート節電',
    titleEn: 'Cool & Smart Efficiency',
    messageJa: '使っていないお部屋の電気をこまめに消してスッキリ！小さな積み重ねが未来を変えるシャト！',
    messageEn: 'Flipping off lights when leaving rooms keeps your space peaceful and sustainable.',
    bonusPoints: 10,
    expression: 'sunglasses' as ShatominExpression,
  },
];
