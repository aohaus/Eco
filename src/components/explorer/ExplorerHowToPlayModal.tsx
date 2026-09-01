import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  MapPin, 
  Radar, 
  FileText, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass,
  Zap,
  Award
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface ExplorerHowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ja' | 'en';
  onStartFirstQuest: () => void;
}

export const ExplorerHowToPlayModal: React.FC<ExplorerHowToPlayModalProps> = ({
  isOpen,
  onClose,
  language,
  onStartFirstQuest,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      titleJa: '🌍 ECO EXPLORER（地球レスキュー）とは？',
      titleEn: '🌍 What is ECO EXPLORER?',
      descJa: '人工衛星とGPSデータを活用し、世界中の環境ホットゾーン（海洋白化・森林伐採・氷河融解）と身近な街の自然環境を調査・修復する科学レスキュー任務です！',
      descEn: 'A planetary rescue game where you deploy eco-restoration gadgets to save world hotspots (coral reefs, rainforests, glaciers) and patrol local green spots!',
      icon: <Globe className="w-10 h-10 text-cyan-400 animate-pulse" />,
      tagJa: 'ゲームの世界観と目的',
      tagEn: 'Story & Mission Objective',
    },
    {
      titleJa: '📍 STEP 1: 身近な街をパトロール（GPS調査）',
      titleEn: '📍 STEP 1: Local GPS Area Patrols',
      descJa: '「現在地パトロール」マップを開き、近くの公園や水質浄化エリア、リサイクル施設などを調査！身近なエコ行動を実践してEXPとポイントを獲得しよう。',
      descEn: 'Open the Local GPS Map to inspect real-world parks, clean water rivers, and recycling depots nearby to earn vital Field EXP and credits.',
      icon: <MapPin className="w-10 h-10 text-emerald-400" />,
      tagJa: 'まずはここからスタート！',
      tagEn: 'Start Here First!',
    },
    {
      titleJa: '🌍 STEP 2: 世界のホットゾーンに出撃（科学ガジェット投入）',
      titleEn: '🌍 STEP 2: Deploy to Global Crisis Zones',
      descJa: '「世界ホットゾーン」レーダーでSOSシグナルを探知！グレートバリアリーフやアマゾン熱帯雨林へ、遮光ブイや種子散布ドローンを出撃させて環境異常を解決しよう。',
      descEn: 'Scan the Global Radar for SOS signals! Deploy high-tech micro-shade buoys, seed drones, and ocean cleaners to restore damaged ecosystems.',
      icon: <Radar className="w-10 h-10 text-cyan-400" />,
      tagJa: 'ガジェットを調整して修復！',
      tagEn: 'Calibrate Science Gadgets!',
    },
    {
      titleJa: '📖 STEP 3: 生態系図鑑を集めてランクアップ！',
      titleEn: '📖 STEP 3: Collect Field Intel & Level Up',
      descJa: '任務を成功させると、救出した野生動物や最新の環境科学データが「生態系図鑑」に記録されます。Lv.1からLv.4へ昇格して「惑星再生最高司令官」を目指そう！',
      descEn: 'Every resolved mission unlocks detailed animal and environmental dossiers in your Field Intel Logbook. Progress through Lv.1 to Lv.4 to become Chief Planetary Guardian!',
      icon: <Award className="w-10 h-10 text-amber-400" />,
      tagJa: '知識のコレクションと称号',
      tagEn: 'Dossiers & Guardian Rank',
    },
  ];

  const current = steps[stepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#0e1c31] via-[#0b1525] to-[#070e1a] border-2 border-cyan-500/50 shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        {/* Background Grid Accent */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-cyan-300 transition-all cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-400/30 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'ja' ? current.tagJa : current.tagEn}</span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 mb-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? 'w-8 bg-cyan-400'
                  : i < stepIndex
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center text-center py-2 space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {current.icon}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {language === 'ja' ? current.titleJa : current.titleEn}
          </h3>

          <p className="text-sm sm:text-base text-cyan-100/90 leading-relaxed max-w-md font-sans">
            {language === 'ja' ? current.descJa : current.descEn}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 mt-8 pt-4 border-t border-white/10">
          {stepIndex > 0 ? (
            <button
              onClick={() => {
                sounds.playPop();
                setStepIndex((prev) => prev - 1);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-200 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              {language === 'ja' ? '前へ戻る' : 'Previous'}
            </button>
          ) : (
            <div />
          )}

          {stepIndex < steps.length - 1 ? (
            <button
              onClick={() => {
                sounds.playPop();
                setStepIndex((prev) => prev + 1);
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-mono text-xs font-black shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ja' ? '次へ進む' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playFanfare();
                onStartFirstQuest();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-stone-950 font-mono text-sm font-black shadow-xl shadow-cyan-500/40 transition-all flex items-center gap-2 cursor-pointer animate-bounce"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>{language === 'ja' ? 'Lv.1 任務に出発する！' : 'Start Lv.1 Missions!'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
