import { EcoCategory } from '../types';

export interface QuizQuestion {
  id: string;
  questionJa: string;
  questionEn: string;
  optionsJa: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationJa: string;
  explanationEn: string;
  points: number;
}

export interface BookChapter {
  titleJa: string;
  titleEn: string;
  contentJa: string;
  contentEn: string;
  keyTakeawayJa: string;
  keyTakeawayEn: string;
}

export interface LibraryBook {
  id: string;
  titleJa: string;
  titleEn: string;
  subtitleJa: string;
  subtitleEn: string;
  category: EcoCategory | 'biodiversity' | 'kids';
  coverGradient: string;
  iconName: string;
  readTimeMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  author: string;
  summaryJa: string;
  summaryEn: string;
  shatominNoteJa: string;
  shatominNoteEn: string;
  chapters: BookChapter[];
  quiz: QuizQuestion[];
  tags: string[];
}

export const libraryCategories = [
  { id: 'all', labelJa: 'すべて (All)', labelEn: 'All Books' },
  { id: 'energy', labelJa: 'エネルギー (Energy)', labelEn: 'Energy' },
  { id: 'food', labelJa: '食と農 (Food & Forest)', labelEn: 'Food & Farming' },
  { id: 'consumption', labelJa: 'ごみ・消費 (Zero Waste)', labelEn: 'Zero Waste' },
  { id: 'transport', labelJa: '移動・モビリティ (Mobility)', labelEn: 'Mobility' },
  { id: 'biodiversity', labelJa: '自然・生物多様性 (Ecology)', labelEn: 'Ecology' },
];

export const libraryBooks: LibraryBook[] = [
  {
    id: 'clean-energy-forest',
    titleJa: 'シャトミンとクリーンエネルギーの森',
    titleEn: 'Shatomin & The Clean Energy Forest',
    subtitleJa: '太陽・風・水がおりなす未来の電力図鑑',
    subtitleEn: 'An Illustrated Guide to Solar, Wind, and Natural Power',
    category: 'energy',
    coverGradient: 'from-amber-400 via-emerald-500 to-teal-600',
    iconName: 'Sun',
    readTimeMinutes: 5,
    difficulty: 'Beginner',
    author: 'Eco Knowledge Labs ft. Shatomin',
    summaryJa: '太陽光発電や風力タービンがどのように私たちの家庭にクリーンな電気を届けるのか、シャトミンと一緒に森を冒険しながら学ぶ絵本スタイルガイド。',
    summaryEn: 'Join Shatomin on an adventure through the green forest to discover how solar panels and wind turbines deliver clean, infinite electricity to our communities.',
    shatominNoteJa: 'お日さまの光でひまわりもソーラーパネルもエネルギー満タンシャト！',
    shatominNoteEn: 'Just like sunflowers soak in sunlight, solar panels turn every beam into clean energy!',
    chapters: [
      {
        titleJa: '第1章: 太陽の恵みとソーラーパワー',
        titleEn: 'Chapter 1: The Sun’s Gift & Solar Power',
        contentJa: '地球には毎日、人類が1年間に消費するエネルギーの1万倍以上もの太陽光が降り注いでいます。太陽光パネル（シリコン半導体）は光を直接電気へ変換し、発電時にCO₂や有害ガスを一切排出しません。家庭用ソーラーや屋上緑化とのハイブリッドが急速に広がっています。',
        contentEn: 'The earth receives more energy from the sun in a single hour than human civilization consumes in an entire year. Photovoltaic cells convert photons directly into electricity without producing any direct greenhouse gases.',
        keyTakeawayJa: '太陽光発電は発電時に温室効果ガスを出さず、屋根スペースを有効活用できる自立型エネルギーです。',
        keyTakeawayEn: 'Solar panels harness boundless natural radiation with zero operational emissions.'
      },
      {
        titleJa: '第2章: 風のささやきと風力タービン',
        titleEn: 'Chapter 2: Wind Whispers & Turbine Aerodynamics',
        contentJa: '風力発電は、風の力で大きなブレード（羽根）を回転させて発電機を回します。バドミントンのシャトルコックのように空気力学に基づいた美しい流線型が特徴です。特に洋上風力発電は強い海風を安定して活用できる切り札として注目されています。',
        contentEn: 'Wind turbines capture the kinetic motion of atmospheric air currents. Designed with aerodynamic blade profiles like high-performance shuttlecocks, they generate substantial utility-scale green electricity.',
        keyTakeawayJa: '風力は夜間も発電でき、洋上風力は日本の海域でも大きなポテンシャルを秘めています。',
        keyTakeawayEn: 'Wind energy operates around the clock, providing dependable renewable baseload capacity.'
      },
      {
        titleJa: '第3章: 蓄電池とスマートグリッド',
        titleEn: 'Chapter 3: Battery Storage & Smart Grids',
        contentJa: '晴れた日や風の強い日に作られた余剰電力を大型蓄電池（リチウムイオンや全固体電池）にためておくことで、夜間や曇りの日でも安定供給が可能になります。AIによるスマートグリッドが電力の需要と供給をリアルタイムで最適化しています。',
        contentEn: 'Advanced energy storage systems store peak renewable surpluses for on-demand discharge during high-load evenings, while smart grids dynamically route power efficiently.',
        keyTakeawayJa: '蓄電池とITの組み合わせが、再生可能エネルギー100%社会への鍵となります。',
        keyTakeawayEn: 'Battery storage coupled with AI power routing solves renewable intermittency.'
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        questionJa: '太陽光発電が発電している最中に排出されるCO₂量はどれくらいでしょうか？',
        questionEn: 'How much CO₂ is directly emitted during the operation of solar panels?',
        optionsJa: ['ゼロ (0g)', '火力発電の半分', '自動車1台分', '石炭と同じ'],
        optionsEn: ['Zero (0g)', 'Half of thermal plants', 'Equivalent to one car', 'Same as coal'],
        correctIndex: 0,
        explanationJa: '太陽光発電は光電効果によって発電するため、運転中の直接CO₂排出はゼロです！',
        explanationEn: 'Photovoltaic power generation emits zero direct greenhouse gases during electricity production.',
        points: 25
      },
      {
        id: 'q1-2',
        questionJa: '再生可能エネルギーを夜間や雨の日でも安定して使うために最も重要な技術は？',
        questionEn: 'Which technology is critical for providing steady renewable energy during nights or rainy days?',
        optionsJa: ['大型蓄電池＆エネルギー貯蔵システム', '夜間にライトを照らす', '風車を手で回す', '使い捨て乾電池'],
        optionsEn: ['Grid-scale battery storage & energy storage systems', 'Shining artificial lights at night', 'Spinning blades manually', 'Disposable AA batteries'],
        correctIndex: 0,
        explanationJa: '余剰電力を蓄電池にためておくことで、必要なときにいつでもクリーンな電気を使えます。',
        explanationEn: 'Grid-scale batteries and storage systems bridge production peaks with consumption needs seamlessly.',
        points: 25
      }
    ],
    tags: ['再エネ', '太陽光', '風力', '基礎知識']
  },
  {
    id: 'zero-waste-handbook',
    titleJa: 'ゼロウェイスト実践ハンドブック',
    titleEn: 'Zero-Waste Living Handbook',
    subtitleJa: '5つのRで変える！ごみを減らして豊かに暮らすヒント',
    subtitleEn: 'The 5Rs of Circular Living: Reduce, Refuse, Reuse, Repurpose, Recycle',
    category: 'consumption',
    coverGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    iconName: 'Recycle',
    readTimeMinutes: 6,
    difficulty: 'Beginner',
    author: 'Circular Life Initiative',
    summaryJa: '不要なものをもらわない「Refuse」から始まる、無理なく続けられるゼロウェイスト生活の教科書。マイボトルの効果やプラスチックフリーの買い物を徹底解説。',
    summaryEn: 'An actionable manual for waste reduction starting with Refuse. Discover the measurable environmental impact of reusable bottles and packaging-free lifestyle habits.',
    shatominNoteJa: 'お買い物にはマイバッグとお気に入りのマイボトルを連れて出かけるシャト！',
    shatominNoteEn: 'Always pack your favorite tote and reusable bottle before heading out for a stroll!',
    chapters: [
      {
        titleJa: '第1章: 5つのR（リフューズ・リデュース・リユース・リパーパス・リサイクル）',
        titleEn: 'Chapter 1: The 5Rs Framework',
        contentJa: '最も効果が高いのは「Refuse（断る）」です。無料のレジ袋、使い捨てストロー、不要なチラシなどを最初に受け取らないことで、ごみそのものの発生を元から防ぎます。リサイクルは最後の手段であり、まずはリデュース（減らす）とリユース（再利用）が肝心です。',
        contentEn: 'The most impactful step in the waste hierarchy is Refusing single-use items like disposable cutlery and plastic shopping bags at the source, preventing waste before it is ever created.',
        keyTakeawayJa: 'ごみを分別する前に「最初からもらわない・買わない」選択が最も地球に優しい行動です。',
        keyTakeawayEn: 'Refusing unnecessary packaging is far superior to recycling downstream.'
      },
      {
        titleJa: '第2章: マイボトルと使い捨てプラ削減のインパクト',
        titleEn: 'Chapter 2: The Reusable Bottle Revolution',
        contentJa: '日本国内で年間に消費されるペットボトルは約250億本。1本のペットボトルの製造・輸送・廃棄には約120gのCO₂が排出されます。マイボトルを週に5日使うだけで、年間約30kgのCO₂と数千円以上の節約になります。',
        contentEn: 'Billions of PET bottles are consumed each year. Carrying a stainless steel thermos or reusable bottle prevents significant carbon emissions and microplastic contamination.',
        keyTakeawayJa: '毎日のマイボトル持参は、お財布にも地球にもダブルで嬉しい習慣です。',
        keyTakeawayEn: 'A daily reusable bottle saves both substantial money and thousands of single-use bottles over its lifetime.'
      },
      {
        titleJa: '第3章: コンポストで生ごみを栄養満点の土へ',
        titleEn: 'Chapter 3: Composting Kitchen Scraps',
        contentJa: '家庭ごみの約30〜40%は水分を多く含んだ「生ごみ」です。これを焼却すると多くの燃料とCO₂が必要になります。バッグ型やベランダ用コンポストを使うことで、野菜くずを良質な堆肥（たいひ）に変え、観葉植物や家庭菜園の栄養に循環できます。',
        contentEn: 'Organic food waste constitutes up to 40% of residential trash. Composting transforms kitchen trimmings into fertile microbial soil instead of generating methane in landfills.',
        keyTakeawayJa: '生ごみを土に還すことで、焼却炉の負荷とCO₂排出を大幅に抑えられます。',
        keyTakeawayEn: 'Composting redirects heavy moist waste into valuable local soil nutrients.'
      }
    ],
    quiz: [
      {
        id: 'q2-1',
        questionJa: '5Rの中で、ごみを減らすために最も効果的・優先度が高い行動はどれでしょうか？',
        questionEn: 'Which action in the 5Rs is considered the highest priority and most effective?',
        optionsJa: ['Refuse (不要な使い捨てを断る)', 'Recycle (分別してリサイクルする)', 'Rot (生ごみを捨てる)', 'Replace (新しいものを買う)'],
        optionsEn: ['Refuse (Decline single-use items at the source)', 'Recycle (Separate for processing)', 'Rot (Throw in general trash)', 'Replace (Buy newer items)'],
        correctIndex: 0,
        explanationJa: 'ごみを処理する前に「元から発生させない」Refuseが最も効果的です。',
        explanationEn: 'Refusing prevents raw material extraction and disposal emissions at the origin.',
        points: 25
      }
    ],
    tags: ['ゼロウェイスト', 'プラスチック削減', 'コンポスト', '節約']
  },
  {
    id: 'eco-kitchen-food-miles',
    titleJa: 'フードマイレージと旬を味わうエコキッチン',
    titleEn: 'Food Mileage & The Sustainable Kitchen',
    subtitleJa: '地元野菜とプラントベースで身体も地球も元気に！',
    subtitleEn: 'Local Seasonality, Plant-Rich Cooking, and Food Waste Prevention',
    category: 'food',
    coverGradient: 'from-lime-500 via-emerald-600 to-green-700',
    iconName: 'Utensils',
    readTimeMinutes: 5,
    difficulty: 'Beginner',
    author: 'Chef Eco & Shatomin Cooking Club',
    summaryJa: '食材が食卓に届くまでの輸送距離（フードマイレージ）と温室効果ガスの関係を分かりやすく解説。週1回のベジデイや食品ロスゼロの作り置きテクニック。',
    summaryEn: 'Learn how food transport miles affect our atmosphere and discover the immense climate benefits of seasonal local produce and mindful meal planning.',
    shatominNoteJa: '採れたての旬の野菜は甘くて栄養たっぷり！身体にも地球にも最高シャト！',
    shatominNoteEn: 'Freshly harvested seasonal veggies are packed with nutrients and naturally low in emissions!',
    chapters: [
      {
        titleJa: '第1章: フードマイレージとは？',
        titleEn: 'Chapter 1: Understanding Food Miles',
        contentJa: 'フードマイレージ＝「食料の輸送量（トン）× 輸送距離（キロメートル）」で計算されます。遠い国から飛行機や船で輸入される食材は、運ぶだけで大量の化石燃料を消費します。地産地消（地元で採れたものを地元で食べる）を選ぶだけで、輸送時のCO₂を80%以上削減できます。',
        contentEn: 'Food mileage measures the carbon footprint of transport logistics. Choosing produce grown within your region drastically reduces aviation and maritime shipping emissions.',
        keyTakeawayJa: '地元の直売所や旬のコーナーを選ぶことが、身近で強力な脱炭素アクションです。',
        keyTakeawayEn: 'Locally grown seasonal foods minimize transportation emissions.'
      },
      {
        titleJa: '第2章: 週に1日のミートフリーマンデー',
        titleEn: 'Chapter 2: Meatless Mondays & Plant Power',
        contentJa: '牛肉1kgを生産するには、約25〜30kgのCO₂と大量の飼料・水が必要です。週に1日だけお肉をお豆腐や大豆ミート、旬のきのこや根菜に置き換えるだけで、年間約150kgの温室効果ガスを削減できます。',
        contentEn: 'Ruminant livestock requires substantial feed crops and land. Replacing meat with legumes and vegetables even once a week saves hundreds of kilograms of annual CO₂ equivalent.',
        keyTakeawayJa: '無理のないプラントベースの食事を取り入れることで、健康と環境を同時に守れます。',
        keyTakeawayEn: 'Integrating plant-based meals weekly produces major environmental benefits.'
      }
    ],
    quiz: [
      {
        id: 'q3-1',
        questionJa: '「地産地消」が地球温暖化防止に役立つ主な理由は何でしょうか？',
        questionEn: 'What is the primary climate benefit of eating locally produced foods?',
        optionsJa: ['輸送距離が短くなり、トラックや飛行機のCO₂排出が減るから', '野菜が早く育つから', 'プラスチックで作られているから', '冷蔵庫がいらなくなるから'],
        optionsEn: ['Shortened transportation routes reduce transit fossil fuel emissions', 'Vegetables grow faster', 'Made from plastic', 'Eliminates need for refrigerators'],
        correctIndex: 0,
        explanationJa: '運ぶ距離（フードマイレージ）が短縮されることで、輸送時の温室効果ガスが大幅に削減されます。',
        explanationEn: 'Shortened logistics lines significantly cut transport-related emissions.',
        points: 25
      }
    ],
    tags: ['食と環境', '地産地消', 'フードロス', '旬のレシピ']
  },
  {
    id: 'urban-biodiversity-pollinators',
    titleJa: '街の中の小さな森：生物多様性とミツバチ',
    titleEn: 'Urban Ecosystems & The Pollinators',
    subtitleJa: 'ベランダのひまわりが地球の生態系をつなぐ！',
    subtitleEn: 'How Urban Greenery and Native Flowers Support Vital Wildlife',
    category: 'biodiversity',
    coverGradient: 'from-teal-500 via-emerald-600 to-sky-600',
    iconName: 'Bug',
    readTimeMinutes: 5,
    difficulty: 'Intermediate',
    author: 'Urban Nature Project',
    summaryJa: '私たちが口にする野菜や果物の3分の1以上は、ミツバチや蝶などの花粉媒介者（ポリネーター）によって受粉しています。都市のベランダ緑化が生態系を救う仕組みを解説。',
    summaryEn: 'Over one third of our human food supply depends on pollinators like bees and butterflies. Discover how balcony plants and native flowers build essential ecological corridors.',
    shatominNoteJa: 'ひまわりのお花にはミツバチさんやお友だちがたくさん集まるシャト！',
    shatominNoteEn: 'Bright sunflowers provide essential nectar and pollen for our buzzing insect friends!',
    chapters: [
      {
        titleJa: '第1章: 花粉媒介者（ポリネーター）の重要性',
        titleEn: 'Chapter 1: The Vital Role of Pollinators',
        contentJa: 'ミツバチ、マルハナバチ、蝶、野鳥などのポリネーターは、世界の主要作物の75%以上の結実を支えています。近年、農薬や気候変動、都市化により生息地が減少していますが、都市の公園や屋上庭園が貴重なオアシスになっています。',
        contentEn: 'Pollinators underpin wild ecosystems and agricultural stability. Urban wildflower gardens provide vital stepping stones across concrete cityscapes.',
        keyTakeawayJa: 'ミツバチを守ることは、私たちの食卓と豊かな森を守ることに直結しています。',
        keyTakeawayEn: 'Protecting pollinator habitats directly safeguards global food systems.'
      },
      {
        titleJa: '第2章: ベランダでできるネイティブガーデン',
        titleEn: 'Chapter 2: Balcony Native Habitats',
        contentJa: 'プランターに自生種の花（ひまわり、ラベンダー、コスモス、ハーブなど）を植えるだけで、小さな緑の飛び石（エコロジカル・コリドー）が生まれます。化学農薬を避け、有機肥料で育てることで安全な休憩所を提供できます。',
        contentEn: 'Planting nectar-rich flowers on balconies builds corridors that allow insects to navigate safely through metropolitan areas.',
        keyTakeawayJa: '小さな植木鉢ひとつでも、街の生物多様性を支える大切なピースになります。',
        keyTakeawayEn: 'Even a single potted plant contributes to local ecological health.'
      }
    ],
    quiz: [
      {
        id: 'q4-1',
        questionJa: '世界で栽培される主要な作物のうち、ミツバチなどの花粉媒介者に依存している割合はおよそどれくらいでしょうか？',
        questionEn: 'Approximately what percentage of leading global crop types depend on animal pollinators?',
        optionsJa: ['約75% (4分の3)', '約10%', '約1%', 'ゼロ (0%)'],
        optionsEn: ['About 75% (Three quarters)', 'About 10%', 'About 1%', 'Zero (0%)'],
        correctIndex: 0,
        explanationJa: '果物、野菜、ナッツ類など、人間が食べる主要作物の約75%がポリネーターの受粉に支えられています！',
        explanationEn: 'Around 75% of global food crops producing fruits and seeds depend in part on pollinators.',
        points: 25
      }
    ],
    tags: ['生物多様性', 'ミツバチ', 'ベランダ園芸', 'ひまわり']
  },
  {
    id: 'smart-green-mobility',
    titleJa: 'アクティブモビリティと未来の低炭素交通',
    titleEn: 'Active Mobility & Future Low-Carbon Transit',
    subtitleJa: '自転車・徒歩・EVで街を軽快に駆け抜けよう',
    subtitleEn: 'Cycling, Micro-Transit, and the Evolution of Clean Urban Movement',
    category: 'transport',
    coverGradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    iconName: 'Bike',
    readTimeMinutes: 5,
    difficulty: 'Beginner',
    author: 'Eco Transit Forum',
    summaryJa: '近距離移動の主役である徒歩と自転車（アクティブモビリティ）の健康＆環境メリット。鉄道やEVバスとのシームレスな乗り継ぎが生むスマートシティの姿。',
    summaryEn: 'Explore the health and climate benefits of active human-powered mobility, from commuter cycling to interconnected electric rail networks.',
    shatominNoteJa: 'バドミントンのフットワークのように、歩いたり自転車に乗ると気分爽快シャト！',
    shatominNoteEn: 'Nimble footwork on walks and bike rides keeps our lungs fresh and carbon footprint ultra-light!',
    chapters: [
      {
        titleJa: '第1章: 2km以内の移動は徒歩と自転車が主役',
        titleEn: 'Chapter 1: The 2-Kilometer Sweet Spot',
        contentJa: '都市部の自動車移動の約40%は移動距離が3km未満の短距離です。短距離の車利用はエンジンが温まる前に燃費が悪化し、大量のCO₂を排出します。これを自転車や徒歩に切り替えることで、排出量を100%カットし、適度な有酸素運動にもなります。',
        contentEn: 'A high proportion of personal car trips are under 3 kilometers. Shifting these short trips to bicycles or walking eliminates cold-engine emissions and enhances physical stamina.',
        keyTakeawayJa: '近所への移動を自転車や徒歩にするだけで、都市の空気は劇的にきれいになります。',
        keyTakeawayEn: 'Replacing short automobile journeys with cycling delivers immediate emissions reductions.'
      }
    ],
    quiz: [
      {
        id: 'q5-1',
        questionJa: '短距離移動（1〜2km）で自転車や徒歩を選択した場合の移動時のCO₂排出量は？',
        questionEn: 'What is the operational CO₂ emission when walking or cycling for short trips?',
        optionsJa: ['ゼロ (0g)', 'ガソリン車と同じ', '新幹線と同じ', '飛行機より多い'],
        optionsEn: ['Zero (0g)', 'Same as petrol car', 'Same as bullet train', 'Higher than airplanes'],
        correctIndex: 0,
        explanationJa: '人力による徒歩や自転車は、移動中に温室効果ガスを全く排出しません！',
        explanationEn: 'Human-powered transport emits zero direct exhaust gases.',
        points: 25
      }
    ],
    tags: ['自転車', 'ウォーキング', '脱炭素交通', '健康']
  }
];
