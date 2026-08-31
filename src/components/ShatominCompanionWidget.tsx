import React, { useState, useEffect } from 'react';
import { ShatominAvatar, ShatominExpression } from './ShatominAvatar';
import { sounds } from '../utils/soundEffects';
import { MessageCircle, X, ChevronUp, Sparkles, Heart } from 'lucide-react';

interface ShatominCompanionWidgetProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streak: number;
  totalPoints: number;
}

export const ShatominCompanionWidget: React.FC<ShatominCompanionWidgetProps> = ({
  activeTab,
  setActiveTab,
  streak,
  totalPoints,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expression, setExpression] = useState<ShatominExpression>('smile');
  const [speech, setSpeech] = useState<string>('こんにちはシャト！今日もエコを楽しもう！');
  const [isBouncing, setIsBouncing] = useState(false);

  // Dynamic reaction based on current tab
  useEffect(() => {
    switch (activeTab) {
      case 'calculator':
        setExpression('sunglasses');
        setSpeech('フットプリント計算中シャト！数値をチェックしてみてね！');
        break;
      case 'habits':
        setExpression('sparkle');
        setSpeech('エコ習慣をチェックして、シャトルみたいに軽やかな暮らしを！');
        break;
      case 'resources':
        setExpression('sunflower');
        setSpeech('電気・水道・ガスの記録で、お部屋の省エネ状況を見える化シャト！');
        break;
      case 'guides':
        setExpression('happy_closed');
        setSpeech('エコガイドで新しい知識を学ぼうシャト！');
        break;
      case 'library':
        setExpression('sparkle');
        setSpeech('図書室へようこそ！絵本を読んでクイズに挑戦してみようシャト！📚');
        break;
      case 'game':
        setExpression('wink');
        setSpeech('脱出ゲームスタート！障害物を避けてエコアイテムを集めるシャト！🏃‍♂️');
        break;
      case 'shatomin':
        setExpression('shy');
        setSpeech('私の部屋へようこそ！一緒に遊ぼうシャト！');
        break;
      default:
        setExpression('smile');
        setSpeech(`連続 ${streak} 日達成中！今日もナイスショットシャト！`);
        break;
    }
  }, [activeTab, streak]);

  const handlePetWidget = () => {
    sounds.playShatominSqueak(1.2);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);
    setExpression('shy');
    setSpeech('えへへ、なでてくれてありがとうシャト〜！💕');
  };

  return (
    <div id="shatomin-floating-widget" className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-auto">
      {/* Speech Bubble */}
      {isOpen && (
        <div className="relative mb-2 max-w-xs bg-white border-2 border-emerald-300 rounded-2xl p-3 shadow-lg text-xs text-stone-800 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-1 mb-1">
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              シャトミン
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-600 hover:text-stone-700"
              title="閉じる"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-medium text-stone-900 leading-snug">{speech}</p>
          
          <div className="mt-2 flex items-center justify-between pt-1 border-t border-stone-100">
            <button
              onClick={() => setActiveTab('shatomin')}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold underline"
            >
              部屋に遊びに行く ❯
            </button>
            <button
              onClick={handlePetWidget}
              className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5"
            >
              <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
              なでる
            </button>
          </div>

          {/* Pointer tail */}
          <div className="absolute -bottom-2 right-6 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-emerald-300" />
        </div>
      )}

      {/* Mascot Avatar Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white border border-stone-200 text-emerald-800 px-3 py-1.5 rounded-full shadow-md text-xs font-bold flex items-center gap-1 hover:bg-emerald-50 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            シャトミンと話す
          </button>
        )}

        <div
          onClick={handlePetWidget}
          className="relative bg-white/95 backdrop-blur-xs rounded-full p-2 border-2 border-emerald-400 shadow-xl cursor-pointer hover:scale-110 transition-transform select-none"
          title="シャトミンをタップ！"
        >
          <ShatominAvatar 
            expression={expression} 
            size="sm" 
            className={isBouncing ? 'animate-bounce' : ''} 
          />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </div>
      </div>
    </div>
  );
};
