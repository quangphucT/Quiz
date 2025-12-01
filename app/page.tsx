

"use client";

import { useState, useEffect } from "react";
import CrosswordGame from "./components/CrosswordGame";

import QuestionDisplay from "./components/QuestionDisplay";
import { CrosswordData } from "./types";
import QuestionManager from "./components/QuestionManager";

const defaultData: CrosswordData = {
  questions: [],
  keyword: "",
  keywordColumn: 5,
};

const STORAGE_KEY = "crossword_game_data";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"play" | "manage">("play");
  const [data, setData] = useState<CrosswordData>(defaultData);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved data:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const handleSelectRow = (rowIndex: number) => {
    setSelectedRow(rowIndex);
  };

  const handleRevealAnswer = (index: number) => {
    if (!revealedAnswers.includes(index)) {
      setRevealedAnswers([...revealedAnswers, index]);
    }
  };

  const handleShowAllAnswers = () => {
    setShowAllAnswers(true);
  };

  const handleReset = () => {
    setSelectedRow(null);
    setRevealedAnswers([]);
    setShowAllAnswers(false);
  };

  const handleUpdateData = (newData: CrosswordData) => {
    setData(newData);
  };

  const currentQuestion =
    selectedRow !== null ? data.questions[selectedRow] : null;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative text-center py-8">
        <div className="inline-block">
          <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tight">
            TRÒ CHƠI <span className="text-yellow-300">Ô CHỮ</span>
          </h1>
          <div className="mt-2 h-1 w-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent"></div>
        </div>
        <p className="text-xl md:text-2xl text-white/90 mt-4 font-medium tracking-wide">
          ✨ CHINH PHỤC DANH HIỆU: DỄ HAY KHÓ? ✨
        </p>
      </div>

      {/* Tabs */}
      <div className="relative flex justify-center gap-4 mb-8 px-4">
        <button
          onClick={() => setActiveTab("play")}
          className={`px-8 py-4 cursor-pointer rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
            activeTab === "play"
              ? "bg-white text-emerald-600 shadow-xl scale-105 ring-4 ring-white/30"
              : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          }`}
        >
          🎮 Chơi Game
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-8 py-4 cursor-pointer rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
            activeTab === "manage"
              ? "bg-white text-emerald-600 shadow-xl scale-105 ring-4 ring-white/30"
              : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          }`}
        >
          ⚙️ Quản Lý Câu Hỏi
        </button>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pb-12">
        {activeTab === "play" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Crossword Grid */}
            <div className="xl:col-span-2">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                    🧩 Ô Chữ
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="px-5 py-2.5 cursor-pointer bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center gap-2 shadow-sm"
                    >
                      🔄 Chơi lại
                    </button>
                    <button
                      onClick={handleShowAllAnswers}
                      disabled={showAllAnswers}
                      className={`px-5 py-2.5 cursor-pointer rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm ${
                        showAllAnswers
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/25"
                      }`}
                    >
                      👁️ Hiện tất cả
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <CrosswordGame
                    data={data}
                    onSelectRow={handleSelectRow}
                    selectedRow={selectedRow}
                    revealedAnswers={revealedAnswers}
                    showAllAnswers={showAllAnswers}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Question Display */}
              <QuestionDisplay
                question={currentQuestion}
                rowIndex={selectedRow}
                onRevealAnswer={handleRevealAnswer}
                isRevealed={
                  selectedRow !== null &&
                  (revealedAnswers.includes(selectedRow) || showAllAnswers)
                }
              />

              {/* Stats Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
                <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                  📊 Thống Kê
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600 font-medium">Tổng câu hỏi</span>
                    <span className="font-bold text-2xl text-emerald-600">
                      {data.questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                    <span className="text-slate-600 font-medium">Đã trả lời</span>
                    <span className="font-bold text-2xl text-emerald-600">
                      {revealedAnswers.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                    <span className="text-slate-600 font-medium">Còn lại</span>
                    <span className="font-bold text-2xl text-amber-600">
                      {data.questions.length - revealedAnswers.length}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                      <span>Tiến độ</span>
                      <span className="font-semibold">
                        {data.questions.length > 0 
                          ? Math.round((revealedAnswers.length / data.questions.length) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700 ease-out rounded-full"
                        style={{
                          width: `${data.questions.length > 0 
                            ? (revealedAnswers.length / data.questions.length) * 100 
                            : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <QuestionManager data={data} onUpdateData={handleUpdateData} />
        )}
      </div>

      {/* Trophy decoration */}
      <div className="fixed bottom-6 right-6 opacity-20 pointer-events-none">
        <div className="text-8xl">🏆</div>
      </div>
    </div>
  );
};

export default HomePage;
