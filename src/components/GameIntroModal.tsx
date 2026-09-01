import React, { useState } from 'react';
import { 
  Sparkles, 
  Leaf, 
  Globe, 
  Heart, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Shield, 
  Compass, 
  Hammer, 
  BookOpen, 
  Zap, 
  Gamepad2 
} from 'lucide-react';
import { ShatominPlush } from './ShatominPlush';
import { Language } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';

interface GameIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onStartFirstQuest: () => void;
}

export const GameIntroModal: React.FC<GameIntroModalProps> = ({
  isOpen,
  onClose,
  language,
  onStartFirstQuest,
}) => {
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#fdfbf7] via-[#f8f5ee] to-[#ede3d4] border-2 border-[#d6c7b2] shadow-2xl p-6 sm:p-8 text-stone-800 overflow-hidden max-h-[90vh] flex flex-col justify-between">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-stone-500 hover:text-stone-800 border border-stone-200 transition-all shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-2xl bg-emerald-600 text-white shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-emerald-800 uppercase">
              {language === 'ja' ? 'はじめての冒険ガイド' : 'Beginner Guide & Story'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
              {language === 'ja' ? 'エコ大冒険へようこそ！🌱' : 'Welcome to Eco Quest! 🌱'}
            </h2>
          </div>
        </div>

        {/* Content Tabs / Steps */}
        <div className="flex-1 overflow-y-auto pr-1 my-2 space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              {/* Story Intro Card */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/90 rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs">
                <div className="w-28 h-28 shrink-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-emerald-50 rounded-2xl border border-emerald-200 p-2">
                  <ShatominPlush expression="sparkle" size="md" mood="sparkle" />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'ja' ? '妖精シャトミンからのメッセージ' : "Message from Shatomin"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {language === 'ja' ? (
                      <>
                        「こんにちはシャト！ぼくは地球の自然を守る妖精<strong>シャトミン</strong>！いま地球の自然エネルギーが減って困っているんだ。君に<strong>『エコガーディアン』</strong>になってもらって、一緒に地球を救いたいシャト！✨」
                      </>
                    ) : (
                      <>
                        "Hi there! I am <strong>Shatomin</strong>, the nature spirit of Earth! Our planet needs green energy to thrive. Will you become an <strong>Eco Guardian</strong> and rescue our world with me? ✨"
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* What is this game? */}
              <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 space-y-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  {language === 'ja' ? 'どんなゲームなの？' : 'What kind of game is this?'}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'ja'
                    ? '日々のエコ活動やクイズ、楽しいミニゲームをクリアしながら、相棒シャトミンを育てて地球を元気に再生していく育成RPGです！Lv.1の見習いからスタートして、最高ランクの「マスターガーディアン」を目指そう！'
                    : 'A fun educational green RPG where you level up by logging daily habits, playing mini-games, crafting eco tools, and rescuing ecosystems worldwide with Shatomin!'}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <h3 className="text-xs sm:text-sm font-bold text-stone-600">
                {language === 'ja' ? '💡 3つの楽しい遊び方' : '💡 3 Fun Ways to Play'}
              </h3>

              {/* Step 1: Quests */}
              <div className="flex items-start gap-3 bg-white/95 rounded-2xl p-3.5 border border-amber-200 shadow-2xs">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    {language === 'ja' ? 'Lv.1からのクエストをクリア！' : 'Complete Quests from Lv.1'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-600">
                    {language === 'ja'
                      ? '迷ったらまず画面の「クエスト」をチェック！順番にタスクをクリアしてEXPを獲得し、Lv.2、Lv.3へとステップアップしよう。'
                      : 'Follow the step-by-step missions starting at Lv.1 to earn EXP and level up your Guardian Rank!'}
                  </p>
                </div>
              </div>

              {/* Step 2: Buddy & Dex */}
              <div className="flex items-start gap-3 bg-white/95 rounded-2xl p-3.5 border border-rose-200 shadow-2xs">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    {language === 'ja' ? 'シャトミンのお世話 ＆ エコ図鑑' : 'Nurture Buddy & Collect Eco-Dex'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-600">
                    {language === 'ja'
                      ? '頭をなでたり、きのみのご飯をあげて「なかよし度」をUP！世界各地の珍しいエコ妖精たちも発見して図鑑に登録！'
                      : 'Pet and feed Shatomin to strengthen your friendship! Discover unique nature elemental creatures in your Eco-Dex!'}
                  </p>
                </div>
              </div>

              {/* Step 3: Craft & Rescue */}
              <div className="flex items-start gap-3 bg-white/95 rounded-2xl p-3.5 border border-cyan-200 shadow-2xs">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black text-sm">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
                    <Hammer className="w-4 h-4 text-cyan-600" />
                    {language === 'ja' ? 'クラフト台 ＆ リアルGPS地球レスキュー' : 'Craft Gear & Rescue Earth on GPS Map'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-600">
                    {language === 'ja'
                      ? '集めたリサイクル素材でエコグッズを作成！さらにリアルな現在地GPSや世界地図で環境ホットスポットを救出しよう！'
                      : 'Craft sustainable items from gathered materials, and patrol real GPS coordinates or global hot zones to restore nature!'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step Indicator & Navigation Footer */}
        <div className="pt-4 border-t border-[#e2d8c7] flex items-center justify-between gap-3">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStep(1)}
              className={`w-3 h-3 rounded-full transition-all ${step === 1 ? 'w-7 bg-emerald-600' : 'bg-stone-300'}`}
            />
            <button
              onClick={() => setStep(2)}
              className={`w-3 h-3 rounded-full transition-all ${step === 2 ? 'w-7 bg-emerald-600' : 'bg-stone-300'}`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {step === 1 ? (
              <button
                onClick={() => {
                  sounds.playPop();
                  setStep(2);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'ja' ? '遊び方を見る' : 'See How to Play'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playFanfare();
                  onClose();
                  onStartFirstQuest();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{language === 'ja' ? 'Lv.1のミッションを始める！' : 'Start Lv.1 Missions!'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
