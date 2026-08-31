import React, { useState, useEffect } from 'react';
import { 
  libraryBooks, 
  libraryCategories, 
  LibraryBook, 
  QuizQuestion 
} from '../data/libraryData';
import { ShatominAvatar } from './ShatominAvatar';
import { sounds } from '../utils/soundEffects';
import { Language } from '../utils/i18n';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Sun, 
  Recycle, 
  Utensils, 
  Bug, 
  Bike, 
  Lightbulb, 
  Check,
  Compass
} from 'lucide-react';

interface EcoLibraryProps {
  onAddPoints?: (pts: number) => void;
  setActiveTab: (tab: string) => void;
  language?: Language;
}

export const EcoLibrary: React.FC<EcoLibraryProps> = ({ 
  onAddPoints, 
  setActiveTab,
  language = 'ja'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBook, setActiveBook] = useState<LibraryBook | null>(null);
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  
  // Bookmarks & Completed books in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('eco_library_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedBookIds, setCompletedBookIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('eco_library_completed');
    return saved ? JSON.parse(saved) : [];
  });

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem('eco_library_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('eco_library_completed', JSON.stringify(completedBookIds));
  }, [completedBookIds]);

  const toggleBookmark = (bookId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playCollect();
    setBookmarkedIds(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const handleOpenBook = (book: LibraryBook) => {
    sounds.playSparkle();
    setActiveBook(book);
    setCurrentChapterIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseReader = () => {
    setActiveBook(null);
  };

  const handleCompleteBook = (book: LibraryBook) => {
    if (!completedBookIds.includes(book.id)) {
      setCompletedBookIds(prev => [...prev, book.id]);
      sounds.playEcoChime();
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.6 }
      });
      if (onAddPoints) {
        onAddPoints(50); // 50 bonus pts for completing a book
      }
    }
  };

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    if (quizSubmitted[qId]) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleCheckAnswer = (question: QuizQuestion) => {
    const selected = quizAnswers[question.id];
    if (selected === undefined) return;

    setQuizSubmitted(prev => ({ ...prev, [question.id]: true }));

    if (selected === question.correctIndex) {
      sounds.playEcoChime();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
      if (onAddPoints) {
        onAddPoints(question.points);
      }
    } else {
      sounds.playHit();
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-amber-600" />;
      case 'Recycle': return <Recycle className="w-5 h-5 text-emerald-600" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-lime-700" />;
      case 'Bug': return <Bug className="w-5 h-5 text-teal-600" />;
      case 'Bike': return <Bike className="w-5 h-5 text-cyan-600" />;
      default: return <BookOpen className="w-5 h-5 text-emerald-700" />;
    }
  };

  const filteredBooks = libraryBooks.filter(book => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const title = language === 'ja' ? book.titleJa : book.titleEn;
    const summary = language === 'ja' ? book.summaryJa : book.summaryEn;
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="eco-library-root" className="space-y-8 animate-fadeIn">
      {/* Return to Quest Map Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('map');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#d6c7b2] text-xs font-bold text-stone-700 transition-colors shadow-2xs"
        >
          <Compass className="w-4 h-4 text-[#387249]" />
          <span>{language === 'ja' ? '🗺️ 冒険マップへ戻る' : '🗺️ Back to World Map'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
          <span className="px-3 py-1 rounded-full bg-[#f4ebe1] border border-[#d6c7b2] text-[#4a5d4e]">
            {language === 'ja' ? `読了数: ${completedBookIds.length} / ${libraryBooks.length} 冊` : `Completed: ${completedBookIds.length} / ${libraryBooks.length} Books`}
          </span>
        </div>
      </div>

      {/* Reader Modal / Fullview View when a book is active */}
      {activeBook ? (
        <div id="active-book-reader" className="bg-[#fcfaf5] rounded-3xl p-6 sm:p-10 border-2 border-[#d6c7b2] shadow-md space-y-8">
          {/* Reader Top Bar */}
          <div className="flex items-center justify-between border-b border-[#e2d8c7] pb-4">
            <button
              onClick={handleCloseReader}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-[#d6c7b2] text-stone-700 font-bold text-xs shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'ja' ? '図書室の本棚へ戻る' : 'Back to Bookshelf'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => toggleBookmark(activeBook.id, e)}
                className={`p-2 rounded-xl border transition-colors shadow-2xs ${
                  bookmarkedIds.includes(activeBook.id)
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-white border-[#d6c7b2] text-stone-600 hover:text-stone-900'
                }`}
                title={language === 'ja' ? 'ブックマーク' : 'Bookmark'}
              >
                {bookmarkedIds.includes(activeBook.id) ? (
                  <BookmarkCheck className="w-5 h-5 text-amber-700" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleCloseReader}
                className="p-2 rounded-xl bg-white border border-[#d6c7b2] text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Book Header Meta */}
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between bg-white rounded-2xl p-6 border border-[#e2d8c7] shadow-2xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ebe1] text-[#4a5d4e] text-xs font-extrabold uppercase">
                {getCategoryIcon(activeBook.iconName)}
                <span>{language === 'ja' ? 'シャトミン推薦図書' : "Shatomin's Pick"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
                {language === 'ja' ? activeBook.titleJa : activeBook.titleEn}
              </h1>
              <p className="text-sm font-semibold text-[#387249]">
                {language === 'ja' ? activeBook.subtitleJa : activeBook.subtitleEn}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-2">
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <Clock className="w-3.5 h-3.5" />
                  {activeBook.readTimeMinutes} {language === 'ja' ? '分で読める' : 'min read'}
                </span>
                <span>•</span>
                <span>{language === 'ja' ? '著者・監修' : 'Author'}: {activeBook.author}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px]">
                  {activeBook.difficulty}
                </span>
              </div>
            </div>

            {/* Mascot advice bubble */}
            <div className="bg-[#f5fbf6] rounded-2xl p-4 border border-[#a8d3af] flex items-start gap-3 max-w-sm shrink-0">
              <ShatominAvatar expression="sparkle" size="sm" animate={true} />
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#387249]/10 text-[#387249]">
                  {language === 'ja' ? 'シャトミンの読書メモ' : "Shatomin's Tip"}
                </span>
                <p className="text-xs text-stone-800 leading-relaxed font-medium">
                  {language === 'ja' ? activeBook.shatominNoteJa : activeBook.shatominNoteEn}
                </p>
              </div>
            </div>
          </div>

          {/* Chapter Navigation Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600">
              <span>{language === 'ja' ? '目次 (チャプター)' : 'Chapters'}:</span>
              <span>{currentChapterIdx + 1} / {activeBook.chapters.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeBook.chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playPop();
                    setCurrentChapterIdx(idx);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    currentChapterIdx === idx
                      ? 'bg-[#387249] text-white border-[#244b30] shadow-2xs'
                      : 'bg-white hover:bg-stone-50 border-[#d6c7b2] text-stone-800'
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-80 uppercase">
                    Chapter {idx + 1}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {language === 'ja' ? ch.titleJa : ch.titleEn}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chapter Reading Body */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d6c7b2] shadow-2xs space-y-6">
            <div className="space-y-2 border-b border-stone-100 pb-4">
              <span className="text-xs font-extrabold text-[#387249] uppercase tracking-wider">
                CHAPTER {currentChapterIdx + 1}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {language === 'ja' 
                  ? activeBook.chapters[currentChapterIdx].titleJa 
                  : activeBook.chapters[currentChapterIdx].titleEn}
              </h2>
            </div>

            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-sm sm:text-base space-y-4">
              <p>
                {language === 'ja'
                  ? activeBook.chapters[currentChapterIdx].contentJa
                  : activeBook.chapters[currentChapterIdx].contentEn}
              </p>
            </div>

            {/* Key Takeaway Box */}
            <div className="bg-[#fcf7ea] rounded-2xl p-5 border-2 border-[#f3ddb3] flex items-start gap-4">
              <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                  {language === 'ja' ? '★ この章の大切なポイント' : '★ Key Takeaway'}
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed">
                  {language === 'ja'
                    ? activeBook.chapters[currentChapterIdx].keyTakeawayJa
                    : activeBook.chapters[currentChapterIdx].keyTakeawayEn}
                </p>
              </div>
            </div>

            {/* Chapter Step Forward / Back Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                disabled={currentChapterIdx === 0}
                onClick={() => {
                  sounds.playPop();
                  setCurrentChapterIdx(prev => Math.max(0, prev - 1));
                }}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'ja' ? '前の章' : 'Prev Chapter'}</span>
              </button>

              {currentChapterIdx < activeBook.chapters.length - 1 ? (
                <button
                  onClick={() => {
                    sounds.playPop();
                    setCurrentChapterIdx(prev => prev + 1);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#387249] hover:bg-[#2e603d] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <span>{language === 'ja' ? '次の章へ進む' : 'Next Chapter'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => handleCompleteBook(activeBook)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all ${
                    completedBookIds.includes(activeBook.id)
                      ? 'bg-stone-100 text-stone-500 border border-stone-200'
                      : 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-black'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{completedBookIds.includes(activeBook.id) ? (language === 'ja' ? '読了済み (+50pt 獲得済)' : 'Completed (+50pt)') : (language === 'ja' ? '本を読み終える (+50pt)' : 'Finish Book (+50pt)')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Knowledge Check Quizzes Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#387249]" />
              <h3 className="text-xl font-black text-stone-900">
                {language === 'ja' ? '理解度チェッククイズ (Eco Quiz Challenge)' : 'Eco Quiz Challenge'}
              </h3>
            </div>

            <div className="space-y-6">
              {activeBook.quiz.map((q, qIdx) => {
                const selected = quizAnswers[q.id];
                const submitted = quizSubmitted[q.id];
                const isCorrect = submitted && selected === q.correctIndex;
                const options = language === 'ja' ? q.optionsJa : q.optionsEn;

                return (
                  <div 
                    key={q.id} 
                    className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-2xs ${
                      submitted
                        ? isCorrect 
                          ? 'border-emerald-400 bg-emerald-50/20' 
                          : 'border-rose-300 bg-rose-50/20'
                        : 'border-[#e2d8c7]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#f4ebe1] text-[#4a5d4e]">
                          Question {qIdx + 1}
                        </span>
                        <h4 className="text-base font-bold text-stone-900">
                          {language === 'ja' ? q.questionJa : q.questionEn}
                        </h4>
                      </div>
                      <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl shrink-0">
                        +{q.points} pt
                      </span>
                    </div>

                    {/* Options list */}
                    <div className="space-y-2 mb-4">
                      {options.map((opt, optIdx) => {
                        let btnStyle = "bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100";
                        if (selected === optIdx) {
                          btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-200";
                        }
                        if (submitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = "bg-emerald-100 border-emerald-600 text-emerald-950 font-bold";
                          } else if (selected === optIdx && optIdx !== q.correctIndex) {
                            btnStyle = "bg-rose-100 border-rose-500 text-rose-950 line-through";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submitted}
                            onClick={() => {
                              sounds.playPop();
                              handleSelectAnswer(q.id, optIdx);
                            }}
                            className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {submitted && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Action & Explanation */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                      {!submitted ? (
                        <button
                          disabled={selected === undefined}
                          onClick={() => handleCheckAnswer(q)}
                          className="px-6 py-2.5 rounded-xl bg-[#387249] hover:bg-[#2e603d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-2xs transition-all"
                        >
                          {language === 'ja' ? '回答を判定する' : 'Submit Answer'}
                        </button>
                      ) : (
                        <div className="w-full bg-[#fdfbf7] rounded-2xl p-4 border border-[#e2d8c7] space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-extrabold">
                            {isCorrect ? (
                              <span className="text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {language === 'ja' ? '正解！素晴らしいシャト！ 🎉' : 'Correct! Awesome job! 🎉'}
                              </span>
                            ) : (
                              <span className="text-rose-700 flex items-center gap-1">
                                <X className="w-4 h-4" />
                                {language === 'ja' ? 'おしい！もう一度解説を読んでみようシャト！' : 'Not quite! Check out the explanation:'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {language === 'ja' ? q.explanationJa : q.explanationEn}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Bookshelf & Gallery View */
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#285732] via-[#387249] to-[#254b30] rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden border-2 border-[#1e4225]">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'ja' ? 'エコ図書室 & クイズ' : 'ECO LIBRARY & QUIZ'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                {language === 'ja' ? 'シャトミンのエコ図書室' : "Shatomin's Eco Library"}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                {language === 'ja' 
                  ? '子どもから大人まで楽しく読める図解絵本とガイド。太陽光、ゼロウェイスト、生物多様性を学んで、クイズでエコポイントを獲得しよう！'
                  : 'Illustrated green books and interactive guides. Learn about clean power, zero waste, biodiversity and test your understanding with quizzes!'}
              </p>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-3 border border-[#d6c7b2] shadow-2xs">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ja' ? 'タイトルやキーワードで検索...' : 'Search books, topics...'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#387249]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
              {libraryCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#387249] text-white shadow-2xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {language === 'ja' ? cat.labelJa : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const isBookmarked = bookmarkedIds.includes(book.id);
              const isCompleted = completedBookIds.includes(book.id);

              return (
                <div
                  key={book.id}
                  onClick={() => handleOpenBook(book)}
                  className="bg-white rounded-3xl p-6 border-2 border-[#e2d8c7] shadow-xs hover:shadow-md hover:border-[#387249] transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Tag & Bookmark Button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#f4ebe1] text-[#4a5d4e]">
                          {book.category}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {language === 'ja' ? '読了' : 'Read'}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => toggleBookmark(book.id, e)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBookmarked 
                            ? 'bg-amber-100 border-amber-300 text-amber-800' 
                            : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Book Icon & Title */}
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f4ebe1] to-[#e8efe9] border border-[#d6c7b2] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {getCategoryIcon(book.iconName)}
                      </div>
                      <h3 className="text-lg font-black text-stone-900 group-hover:text-[#387249] transition-colors leading-snug">
                        {language === 'ja' ? book.titleJa : book.titleEn}
                      </h3>
                      <p className="text-xs font-semibold text-[#387249] line-clamp-1">
                        {language === 'ja' ? book.subtitleJa : book.subtitleEn}
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {language === 'ja' ? book.summaryJa : book.summaryEn}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {book.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Meta & Open Action */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{book.readTimeMinutes} {language === 'ja' ? '分' : 'min'}</span>
                      <span>•</span>
                      <span>{book.quiz.length} {language === 'ja' ? '問クイズ' : 'Quizzes'}</span>
                    </div>

                    <span className="text-xs font-bold text-[#387249] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>{language === 'ja' ? '本を開く' : 'Open'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
