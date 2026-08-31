import React, { useState } from 'react';
import { 
  BookOpen, 
  Gamepad2, 
  CheckCircle2, 
  Calculator, 
  BarChart3, 
  ScrollText, 
  Heart, 
  Sparkles, 
  Award, 
  Flame, 
  ArrowRight,
  Compass,
  Star,
  CheckCircle,
  HelpCircle,
  Footprints,
  ShieldAlert,
  TreePine,
  Sun,
  Wind,
  Hammer,
  Gift,
  User,
  Zap
} from 'lucide-react';
import { ShatominPlush } from './ShatominPlush';
import { Language, translations } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';

interface WorldMapScreenProps {
  language: Language;
  onNavigate: (tab: string) => void;
  totalPoints: number;
  streak: number;
  onAddPoints: (pts: number) => void;
  onOpenRoulette?: () => void;
  onOpenTrainerCard?: () => void;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  language,
  onNavigate,
  totalPoints,
  streak,
  onAddPoints,
  onOpenRoulette,
  onOpenTrainerCard,
}) => {
  const t = translations[language];

  // Daily quest claim state (stored in local state)
  const [quest1Claimed, setQuest1Claimed] = useState(false);
  const [quest2Claimed, setQuest2Claimed] = useState(false);
  const [quest3Claimed, setQuest3Claimed] = useState(false);

  // Player Stats
  const playerLevel = Math.max(1, Math.floor(totalPoints / 150) + 1);
  const currentExp = totalPoints % 150;
  const nextExp = 150;
  const progressPercent = Math.min(100, Math.round((currentExp / nextExp) * 100));

  const getRankName = () => {
    if (playerLevel >= 10) return t.rankMaster;
    if (playerLevel >= 7) return t.rankChampion;
    if (playerLevel >= 4) return t.rankRanger;
    if (playerLevel >= 2) return t.rankGuardian;
    return t.rankNovice;
  };

  const handleClaimQuest = (questNum: number, expPts: number) => {
    sounds.playFanfare();
    onAddPoints(expPts);
    if (questNum === 1) setQuest1Claimed(true);
    if (questNum === 2) setQuest2Claimed(true);
    if (questNum === 3) setQuest3Claimed(true);
  };

  const areas = [
    {
      id: 'explorer',
      title: language === 'ja' ? '🌍 地球レスキュー (Eco Explorer)' : '🌍 Eco Explorer: Earth Rescue',
      desc: language === 'ja' ? '衛星レーダーで世界の環境ホットスポットを探索！ソーラーガジェットを展開して海洋・熱帯雨林・氷河を再生！' : 'Scan global hot zones with orbital radar & deploy high-tech science gadgets to rescue coral reefs, rainforests, and glaciers!',
      icon: Zap,
      badge: language === 'ja' ? '🚀 SF科学レスキュー' : '🚀 Sci-Fi Rescue Missions',
      bgColor: 'from-[#0b1b2f] to-[#132c4a]',
      borderColor: 'border-cyan-400',
      textColor: 'text-cyan-200',
      tagBg: 'bg-cyan-500 text-stone-950 font-black',
      accentColor: 'text-cyan-400',
      btnBg: 'bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-stone-950 font-black',
      exp: '+250~500 PTS',
      isHot: true,
      isSciFi: true,
    },
    {
      id: 'buddy',
      title: language === 'ja' ? '相棒シャトミンのお部屋' : 'Buddy Shatomin Haven',
      desc: language === 'ja' ? 'なでなで、きのみのご飯、シャトル遊びで「なかよし度」をアップ！' : 'Pet, feed berries, and play shuttle toss to level up your Buddy Rank!',
      icon: Heart,
      badge: language === 'ja' ? '❤️ 相棒システム' : '❤️ Buddy System',
      bgColor: 'from-[#fff0f3] to-[#ffd7df]',
      borderColor: 'border-[#f7a8b8]',
      textColor: 'text-[#8f2845]',
      tagBg: 'bg-[#8f2845] text-white',
      accentColor: 'text-[#8f2845]',
      btnBg: 'bg-[#b83b5e] hover:bg-[#962e4b] text-white',
      exp: '+50 EXP',
      isHot: true,
    },
    {
      id: 'dex',
      title: language === 'ja' ? '地球のエコ精霊図鑑' : 'Guardian Eco-Dex',
      desc: language === 'ja' ? '太陽・水・風・自然のエコモンスターたちを集めてCPアップ！' : 'Collect elemental nature sprites and boost your Eco-Power CP!',
      icon: BookOpen,
      badge: language === 'ja' ? '📖 ポケモンGOスタイル図鑑' : '📖 Collectible Dex',
      bgColor: 'from-[#eaf4ec] to-[#d6ebd9]',
      borderColor: 'border-[#a8d3af]',
      textColor: 'text-[#285732]',
      tagBg: 'bg-[#285732] text-white',
      accentColor: 'text-[#285732]',
      btnBg: 'bg-[#285732] hover:bg-[#1f4427] text-white',
      exp: '+45 EXP',
      isHot: true,
    },
    {
      id: 'craft',
      title: language === 'ja' ? 'エコクラフト作業台' : 'Eco Crafting Bench',
      desc: language === 'ja' ? '木くずやソーラー破片を組み合わせて発電機や昆虫ホテルを作成！' : 'Combine materials to forge solar turbines, treehouses, and gear!',
      icon: Hammer,
      badge: language === 'ja' ? '🔨 マイクラ風クラフト' : '🔨 Voxel Crafting',
      bgColor: 'from-[#fef5e7] to-[#fde2b8]',
      borderColor: 'border-[#f6c37a]',
      textColor: 'text-[#8a4e0a]',
      tagBg: 'bg-[#8a4e0a] text-white',
      accentColor: 'text-[#8a4e0a]',
      btnBg: 'bg-[#b86d1b] hover:bg-[#975814] text-white',
      exp: '+60 EXP',
      isHot: true,
    },
    {
      id: 'game',
      title: t.areaGameTitle,
      desc: t.areaGameDesc,
      icon: Gamepad2,
      badge: language === 'ja' ? '🎮 アクションラン' : '🎮 Arcade Action',
      bgColor: 'from-[#eef7f6] to-[#d3ece9]',
      borderColor: 'border-[#9ed5cf]',
      textColor: 'text-[#1c5d57]',
      tagBg: 'bg-[#1c5d57] text-white',
      accentColor: 'text-[#1c5d57]',
      btnBg: 'bg-[#22726b] hover:bg-[#1a5852] text-white',
      exp: '+50 EXP',
    },
    {
      id: 'library',
      title: t.areaLibraryTitle,
      desc: t.areaLibraryDesc,
      icon: BookOpen,
      badge: language === 'ja' ? '📚 知識とクイズ' : '📚 Learning & Quiz',
      bgColor: 'from-[#fdf8ee] to-[#faecd1]',
      borderColor: 'border-[#e8caa0]',
      textColor: 'text-[#7d5621]',
      tagBg: 'bg-[#7d5621] text-white',
      accentColor: 'text-[#7d5621]',
      btnBg: 'bg-[#7d5621] hover:bg-[#634419] text-white',
      exp: '+40 EXP',
    },
    {
      id: 'habits',
      title: t.areaHabitsTitle,
      desc: t.areaHabitsDesc,
      icon: CheckCircle2,
      badge: language === 'ja' ? '🌱 デイリー習慣' : '🌱 Daily Actions',
      bgColor: 'from-[#eaf4ec] to-[#d6ebd9]',
      borderColor: 'border-[#a8d3af]',
      textColor: 'text-[#285732]',
      tagBg: 'bg-[#285732] text-white',
      accentColor: 'text-[#285732]',
      btnBg: 'bg-[#285732] hover:bg-[#1f4427] text-white',
      exp: '+30 EXP',
    },
    {
      id: 'calculator',
      title: t.areaCalcTitle,
      desc: t.areaCalcDesc,
      icon: Calculator,
      badge: language === 'ja' ? '⚖️ 排出量診断' : '⚖️ Carbon Simulator',
      bgColor: 'from-[#f5f5f7] to-[#e6e6eb]',
      borderColor: 'border-[#cbccd6]',
      textColor: 'text-[#3e4259]',
      tagBg: 'bg-[#3e4259] text-white',
      accentColor: 'text-[#3e4259]',
      btnBg: 'bg-[#484c66] hover:bg-[#35384c] text-white',
      exp: '+60 EXP',
    },
    {
      id: 'resources',
      title: t.areaResourcesTitle,
      desc: t.areaResourcesDesc,
      icon: BarChart3,
      badge: language === 'ja' ? '📊 電気・水・ガス' : '📊 Resource Logs',
      bgColor: 'from-[#fcf4ec] to-[#f6decb]',
      borderColor: 'border-[#e6bca0]',
      textColor: 'text-[#84401c]',
      tagBg: 'bg-[#84401c] text-white',
      accentColor: 'text-[#84401c]',
      btnBg: 'bg-[#84401c] hover:bg-[#683215] text-white',
      exp: '+25 EXP',
    },
    {
      id: 'guides',
      title: t.areaGuidesTitle,
      desc: t.areaGuidesDesc,
      icon: ScrollText,
      badge: language === 'ja' ? '📜 実践ガイド' : '📜 Action Guides',
      bgColor: 'from-[#fef5e7] to-[#fde2b8]',
      borderColor: 'border-[#f6c37a]',
      textColor: 'text-[#8a4e0a]',
      tagBg: 'bg-[#8a4e0a] text-white',
      accentColor: 'text-[#8a4e0a]',
      btnBg: 'bg-[#b86d1b] hover:bg-[#975814] text-white',
      exp: '+35 EXP',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: World Map Header & Player Status */}
      <div className="bg-gradient-to-r from-[#387249] via-[#488258] to-[#2d5a39] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border-2 border-[#22452b]">
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold tracking-wider">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ja' ? 'エコアイランド・ワールドマップ' : 'ECO ISLAND WORLD MAP'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'ja' ? '冒険の舞台を選んで出発しよう！' : 'Choose Your Adventure Destination!'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              {t.chooseDestination}
            </p>
          </div>

          {/* Player Badge & Level Tracker */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 min-w-[260px] shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300 shrink-0 border border-white/30">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
                <span>{t.level} {playerLevel}</span>
                <span className="text-amber-300 font-extrabold">{getRankName()}</span>
              </div>
              
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-100 font-semibold pt-0.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {totalPoints} pts
                </span>
                <span className="flex items-center gap-1 text-orange-200">
                  <Flame className="w-3 h-3 fill-orange-300 text-orange-300" />
                  {streak} {t.streakDays}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quests / Mission Board */}
      <div className="bg-[#fcfaf5] rounded-3xl p-6 border-2 border-[#e6dbc8] shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                {t.dailyQuests}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'ja' ? '毎日の冒険ミッションをクリアしてボーナスEXPをゲット！' : 'Complete daily missions for bonus EXP and eco rewards!'}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#387249]/10 text-[#387249]">
            {language === 'ja' ? '毎日リセット' : 'Resets Daily'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Quest 1 */}
          <div className="bg-white rounded-2xl p-4 border border-[#e6dbc8] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  QUEST 1
                </span>
                <span className="text-xs font-black text-amber-700">+40 EXP</span>
              </div>
              <h3 className="text-xs font-bold text-stone-900">{t.quest1Title}</h3>
              <p className="text-[11px] text-stone-500 leading-tight mt-0.5">{t.quest1Desc}</p>
            </div>

            <button
              onClick={() => {
                if (!quest1Claimed) {
                  handleClaimQuest(1, 40);
                } else {
                  onNavigate('library');
                }
              }}
              className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                quest1Claimed
                  ? 'bg-stone-100 text-stone-500 border border-stone-200'
                  : 'bg-[#387249] hover:bg-[#2e603d] text-white shadow-xs'
              }`}
            >
              {quest1Claimed ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.rewardClaimed}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.claimReward}</span>
                </>
              )}
            </button>
          </div>

          {/* Quest 2 */}
          <div className="bg-white rounded-2xl p-4 border border-[#e6dbc8] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  QUEST 2
                </span>
                <span className="text-xs font-black text-amber-700">+50 EXP</span>
              </div>
              <h3 className="text-xs font-bold text-stone-900">{t.quest2Title}</h3>
              <p className="text-[11px] text-stone-500 leading-tight mt-0.5">{t.quest2Desc}</p>
            </div>

            <button
              onClick={() => {
                if (!quest2Claimed) {
                  handleClaimQuest(2, 50);
                } else {
                  onNavigate('game');
                }
              }}
              className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                quest2Claimed
                  ? 'bg-stone-100 text-stone-500 border border-stone-200'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
              }`}
            >
              {quest2Claimed ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.rewardClaimed}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>{t.claimReward}</span>
                </>
              )}
            </button>
          </div>

          {/* Quest 3 */}
          <div className="bg-white rounded-2xl p-4 border border-[#e6dbc8] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  QUEST 3
                </span>
                <span className="text-xs font-black text-amber-700">+30 EXP</span>
              </div>
              <h3 className="text-xs font-bold text-stone-900">{t.quest3Title}</h3>
              <p className="text-[11px] text-stone-500 leading-tight mt-0.5">{t.quest3Desc}</p>
            </div>

            <button
              onClick={() => {
                if (!quest3Claimed) {
                  handleClaimQuest(3, 30);
                } else {
                  onNavigate('habits');
                }
              }}
              className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                quest3Claimed
                  ? 'bg-stone-100 text-stone-500 border border-stone-200'
                  : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
              }`}
            >
              {quest3Claimed ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t.rewardClaimed}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>{t.claimReward}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* World Map Area Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#387249]" />
            <span>{t.areaMapTitle}</span>
          </h2>
          <span className="text-xs text-stone-500 font-semibold">
            {language === 'ja' ? '全7エリア探索可能' : '7 Accessible Areas'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.id}
                onClick={() => {
                  sounds.playSparkle();
                  onNavigate(area.id);
                }}
                className={`bg-gradient-to-br ${area.bgColor} rounded-3xl p-6 border-2 ${area.borderColor} shadow-xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden`}
              >
                {/* Top header of card */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${area.tagBg} tracking-wide shadow-2xs`}>
                      {area.badge}
                    </span>
                    <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                      {area.exp}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/90 shadow-xs flex items-center justify-center shrink-0 border border-white group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${area.accentColor}`} />
                    </div>
                    <div>
                      <h3 className={`text-base font-extrabold ${area.textColor} group-hover:underline`}>
                        {area.title}
                      </h3>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed ${area.isSciFi ? 'text-cyan-100' : 'text-stone-700'}`}>
                    {area.desc}
                  </p>
                </div>

                {/* Bottom button */}
                <div className={`mt-5 pt-3 flex items-center justify-between border-t ${area.isSciFi ? 'border-white/10' : 'border-black/5'}`}>
                  <span className={`text-xs font-bold flex items-center gap-1 ${area.isSciFi ? 'text-cyan-300' : 'text-stone-600'}`}>
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{language === 'ja' ? 'エリア探索' : 'Explore Area'}</span>
                  </span>

                  <button className={`px-4 py-2 rounded-xl font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition-all ${area.btnBg}`}>
                    <span>{language === 'ja' ? '入る' : 'Enter'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Shatomin Encouragement Card */}
      <div className="bg-[#f7f3ea] rounded-3xl p-6 border-2 border-[#d6c7b2] flex flex-col sm:flex-row items-center gap-6 justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white border border-[#d6c7b2] flex items-center justify-center p-2 shrink-0 shadow-2xs">
            <ShatominPlush expression="sunflower" size="sm" mood="happy" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
              {t.todayEcoTip}
            </span>
            <p className="text-sm font-bold text-stone-800">
              {language === 'ja' 
                ? '「こまめな消灯やマイボトルは、小さな一歩だけど地球にとっては大きなごちそうシャト！今日も楽しくエコしよう！」'
                : '"Carrying a reusable bottle and turning off unused lights may feel small, but together they make our planet thrive!"'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onNavigate('shatomin');
          }}
          className="px-5 py-3 rounded-2xl bg-white hover:bg-stone-50 border-2 border-[#d6c7b2] text-stone-900 font-extrabold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-2"
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>{t.openRoom} ❯</span>
        </button>
      </div>
    </div>
  );
};
