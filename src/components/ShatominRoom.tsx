import React, { useState } from 'react';
import { 
  ShatominAvatar, 
  ShatominExpression 
} from './ShatominAvatar';
import { 
  shatominExpressions, 
  shatominGreetings, 
  shatominDailyTips, 
  ecoFortunes, 
  ExpressionItem 
} from '../data/shatominData';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Heart, 
  Sun, 
  Feather, 
  Volume2, 
  Dice5, 
  Info, 
  Flame, 
  Award,
  CheckCircle,
  HelpCircle,
  Library,
  Gamepad2,
  BookOpen,
  ArrowRight,
  Zap
} from 'lucide-react';

interface ShatominRoomProps {
  totalPoints: number;
  currentStreak: number;
  onAddPoints?: (pts: number) => void;
  setActiveTab?: (tab: string) => void;
}

export const ShatominRoom: React.FC<ShatominRoomProps> = ({
  totalPoints,
  currentStreak,
  onAddPoints,
  setActiveTab,
}) => {
  const [currentExpression, setCurrentExpression] = useState<ShatominExpression>('smile');
  const [speechIndex, setSpeechIndex] = useState(0);
  const [petCount, setPetCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [drawnFortune, setDrawnFortune] = useState<typeof ecoFortunes[0] | null>(null);
  const [fortuneDrawnToday, setFortuneDrawnToday] = useState(false);
  const [selectedTipIndex, setSelectedTipIndex] = useState(0);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<ExpressionItem | null>(shatominExpressions[0]);

  // Handle interacting/petting Shatomin
  const handlePetShatomin = (e?: React.MouseEvent) => {
    sounds.playShatominSqueak(petCount % 4);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 400);

    setPetCount(prev => prev + 1);

    // Rotate speech or switch to shy when heavily petted
    if (petCount > 0 && petCount % 5 === 0) {
      setCurrentExpression('shy');
    } else if (petCount % 3 === 0) {
      setCurrentExpression('sparkle');
    }

    // Spawn floating heart effect
    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = e ? e.clientX - (rect?.left || 0) : 50;
    const y = e ? e.clientY - (rect?.top || 0) : 50;

    const newHeart = { id: Date.now() + Math.random(), x, y };
    setHearts(prev => [...prev.slice(-6), newHeart]);

    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1200);
  };

  // Next speech bubble
  const handleNextSpeech = () => {
    sounds.playSparkle();
    const nextIdx = (speechIndex + 1) % shatominGreetings.length;
    setSpeechIndex(nextIdx);
    setCurrentExpression(shatominGreetings[nextIdx].expression);
  };

  // Draw Eco Fortune
  const handleDrawFortune = () => {
    if (fortuneDrawnToday && drawnFortune) return;

    sounds.playEcoChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    const randomIndex = Math.floor(Math.random() * ecoFortunes.length);
    const fortune = ecoFortunes[randomIndex];
    setDrawnFortune(fortune);
    setFortuneDrawnToday(true);
    setCurrentExpression(fortune.expression);

    if (onAddPoints) {
      onAddPoints(fortune.bonusPoints);
    }
  };

  const currentSpeech = shatominGreetings[speechIndex];
  const friendshipLevel = Math.min(10, Math.floor(petCount / 5) + Math.floor(totalPoints / 80) + 1);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner introducing Shatomin */}
      <div id="shatomin-hero" className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-emerald-100 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Official Eco Mascot
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              シャトミンの部屋 <span className="text-emerald-200 text-2xl font-medium">(Shatomin&apos;s Room)</span>
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed">
              バドミントンのシャトル（羽根冠）とグリーンリボン、オレンジのあんよがチャームポイント！
              毎日の脱炭素やエコ習慣をいつでも明るく応援してくれる妖精マスコット「シャトミン」の部屋へようこそ！
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                <span>なかよし度: Lvl {friendshipLevel}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>タップ回数: {petCount}回</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <Sun className="w-4 h-4 text-yellow-300" />
                <span>ひまわりパワー: 満タン</span>
              </div>
            </div>
          </div>

          {/* Quick interactive peek of Shatomin */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/30 cursor-pointer hover:scale-105 transition-all shadow-inner"
              onClick={handlePetShatomin}
              title="クリックしてシャトミンをなでる！"
            >
              <ShatominAvatar expression={currentExpression} size="lg" className={isBouncing ? 'animate-bounce' : ''} />
            </div>
            <span className="text-xs text-emerald-100 mt-2 font-medium">タップしてなでてね！🐾</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage & Speech */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Shatomin Interactive Lounge & Speech */}
        <div className="lg:col-span-2 space-y-6">
          <div id="interactive-stage" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
            {/* Ambient Background decoration */}
            <div className="absolute inset-0 bg-radial from-emerald-50/70 via-stone-50/40 to-transparent pointer-events-none" />

            {/* Floating Heart Particles when petted */}
            {hearts.map(h => (
              <div
                key={h.id}
                className="absolute text-rose-500 animate-float pointer-events-none flex items-center gap-1 font-bold text-sm"
                style={{ top: h.y, left: h.x }}
              >
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                <span className="text-xs text-rose-600 bg-white/80 px-1.5 rounded-full shadow-xs">キュン♥</span>
              </div>
            ))}

            {/* Speech Bubble from Shatomin */}
            <div className="relative z-10 max-w-lg w-full bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-4 sm:p-5 shadow-xs mb-6 text-center">
              <div className="flex items-center justify-between gap-2 border-b border-emerald-200/80 pb-2 mb-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  シャトミンのつぶやき
                </span>
                <button
                  onClick={handleNextSpeech}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors"
                >
                  別のおしゃべり ❯
                </button>
              </div>
              <p className="text-stone-900 text-base sm:text-lg font-bold leading-snug">
                &ldquo;{currentSpeech.textJa}&rdquo;
              </p>
              <p className="text-stone-600 text-xs sm:text-sm mt-1 italic">
                &ldquo;{currentSpeech.textEn}&rdquo;
              </p>

              {/* Triangle Tail */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-emerald-300" />
            </div>

            {/* Center Plush Avatar (Interactive) */}
            <div 
              className="relative z-10 cursor-pointer group flex flex-col items-center"
              onClick={handlePetShatomin}
            >
              <div className="relative">
                <ShatominAvatar 
                  expression={currentExpression} 
                  size="xl" 
                  className={`transition-transform duration-300 ${isBouncing ? 'animate-bounce' : 'group-hover:scale-110'}`} 
                />
              </div>

              <div className="mt-4 flex items-center gap-2 bg-emerald-100/90 text-emerald-900 border border-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs hover:bg-emerald-200 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>クリックしてシャトミンと遊ぶ (なでる)</span>
              </div>
            </div>

            {/* Action Buttons Under Avatar */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                id="btn-voice-cheer"
                onClick={() => {
                  sounds.playShatominSqueak(2);
                  setCurrentExpression('wink');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                ナイスショット！
              </button>

              <button
                id="btn-sunflower-pose"
                onClick={() => {
                  sounds.playSparkle();
                  setCurrentExpression('sunflower');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors shadow-xs"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                ひまわりを持つ
              </button>

              <button
                id="btn-sunglasses-pose"
                onClick={() => {
                  sounds.playShatominSqueak(1);
                  setCurrentExpression('sunglasses');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                😎 クールにキメる
              </button>
            </div>
          </div>

          {/* Outfit & Expression Dressing Booth (8 Variations from Photo!) */}
          <div id="expression-dressing-booth" className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  シャトミンのきせかえ＆表情チェンジ
                </h2>
                <p className="text-xs text-stone-700">
                  写真のマスコットコレクションから好きな表情を選んでね！
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                全8スタイル
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {shatominExpressions.map(exp => {
                const isSelected = currentExpression === exp.id;
                return (
                  <button
                    key={exp.id}
                    onClick={() => {
                      sounds.playShatominSqueak(0.5);
                      setCurrentExpression(exp.id);
                      setSelectedGalleryItem(exp);
                    }}
                    className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="p-1">
                      <ShatominAvatar expression={exp.id} size="sm" />
                    </div>
                    <span className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">
                      {exp.nameJa.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full bg-white border border-stone-200 mt-1">
                      {exp.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Fortune Card + Daily Eco Tip + Profile */}
        <div className="space-y-6">
          {/* Daily Eco Fortune (シャトミンのエコおみくじ) */}
          <div id="eco-fortune-card" className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-amber-100 flex items-center gap-1">
                <Dice5 className="w-3.5 h-3.5" />
                1日1回
              </span>
              <span className="text-xs font-medium text-amber-100">Daily Eco Fortune</span>
            </div>

            <div>
              <h2 className="text-xl font-black">今日のエコおみくじ</h2>
              <p className="text-amber-100 text-xs mt-1">
                シャトミンが今日のあなたのエコ運勢とラッキーアクションを占うシャト！
              </p>
            </div>

            {drawnFortune ? (
              <div className="bg-white text-stone-900 rounded-2xl p-4 shadow-sm space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className={`text-base font-black ${drawnFortune.color}`}>
                    {drawnFortune.luck}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    +{drawnFortune.bonusPoints} pts 獲得!
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">{drawnFortune.titleJa}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{drawnFortune.messageJa}</p>
                <p className="text-[11px] text-stone-600 italic border-t border-stone-100 pt-1.5">{drawnFortune.messageEn}</p>
              </div>
            ) : (
              <button
                id="btn-draw-fortune"
                onClick={handleDrawFortune}
                className="w-full bg-white text-amber-800 hover:bg-amber-50 font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                おみくじを引く！(Ptsボーナス)
              </button>
            )}
          </div>

          {/* Daily Advice from Shatomin */}
          <div id="shatomin-daily-advice" className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Feather className="w-4 h-4 text-emerald-600" />
                シャトミンのエコアドバイス
              </h2>
            </div>

            <div className="space-y-3">
              {shatominDailyTips.map((tip, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTipIndex(idx)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${
                    selectedTipIndex === idx
                      ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">{tip.titleJa}</span>
                    {selectedTipIndex === idx && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  {selectedTipIndex === idx && (
                    <div className="mt-2 text-xs text-stone-600 space-y-1 animate-fadeIn">
                      <p>{tip.bodyJa}</p>
                      <p className="text-[11px] text-stone-600 italic">{tip.bodyEn}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* About Shatomin Profile Card */}
          <div id="shatomin-bio-card" className="bg-stone-900 text-stone-100 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Info className="w-4 h-4" />
              シャトミンのプロフィール
            </div>
            <h2 className="text-lg font-bold text-white">シャトミン (Shatomin)</h2>
            <div className="text-xs space-y-2 text-stone-300 leading-relaxed">
              <p>
                🏸 <strong>由来:</strong> バドミントンシャトルの羽根から生まれたエコの妖精。
              </p>
              <p>
                👑 <strong>チャームポイント:</strong> ふわふわの羽根冠、深緑のリボンバンド、オレンジの愛らしいあんよ。
              </p>
              <p>
                🌻 <strong>大好きなもの:</strong> ひまわり、木漏れ日、マイボトル、爽快なナイスショット！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Educational Apps Section: Library & Runaway Game */}
      <div id="shatomin-apps-gateway" className="bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-stone-50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Shatomin&apos;s Special Apps
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              シャトミンの学び＆遊び (Eco Apps Hub)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              図書室で知識を深めたり、脱出ゲームでCO₂削減ランに挑戦しよう！
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Eco Library */}
          <div 
            onClick={() => {
              sounds.playSparkle();
              if (setActiveTab) setActiveTab('library');
            }}
            className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 tracking-wider">
                  LEARNING &amp; QUIZ
                </span>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                  <Library className="w-5 h-5 text-emerald-600" />
                  シャトミンのエコ図書室 (Library)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  太陽光・ゼロウェイスト・生物多様性などの図解絵本を読もう！理解度クイズ正解でエコポイント大量獲得！
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700">全5冊・クイズ付き</span>
              <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 flex items-center gap-1">
                図書室を開く <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Runaway Game */}
          <div 
            onClick={() => {
              sounds.playSparkle();
              if (setActiveTab) setActiveTab('game');
            }}
            className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 tracking-wider">
                  ACTION ARCADE
                </span>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-amber-600" />
                  シャトミンの脱出大作戦 (Runaway)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  煙突やプラスチックごみを軽快にジャンプ＆スライディングで回避！ひまわりを集めてCO₂を削減しよう！
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800">2段ジャンプ＆無敵シャトル</span>
              <span className="text-xs font-bold text-stone-900 group-hover:text-amber-700 flex items-center gap-1">
                ゲームを遊ぶ <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shatomin Plush Expression Encyclopedia / Gallery */}
      <div id="shatomin-gallery-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            シャトミン・コレクション図鑑 (Mascot Archive)
          </h2>
          <p className="text-xs text-stone-700 mt-1">
            ユーザー様にご共有いただいたシャトミンの写真をもとに再現した全表情アーカイブです。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shatominExpressions.map(exp => (
            <div
              key={exp.id}
              onClick={() => {
                sounds.playShatominSqueak(1);
                setCurrentExpression(exp.id);
                setSelectedGalleryItem(exp);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                currentExpression === exp.id
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-stone-100/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                  {exp.tag}
                </span>
                <span className="text-[10px] text-stone-600 font-mono">#{exp.id}</span>
              </div>

              <div className="flex justify-center py-3">
                <ShatominAvatar expression={exp.id} size="md" />
              </div>

              <h4 className="text-sm font-bold text-stone-900 mt-2">{exp.nameJa}</h4>
              <p className="text-xs text-stone-600 mt-1 line-clamp-2">{exp.descriptionJa}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
