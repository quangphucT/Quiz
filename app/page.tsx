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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-slate-700 text-xl flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-xy"></div>
      
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-indigo-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-pink-200/25 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 left-1/2 w-44 h-44 bg-cyan-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Sparkles */}
        <div className="absolute top-1/4 left-1/4 text-3xl opacity-40 animate-bounce-slow">✨</div>
        <div className="absolute top-2/3 right-1/4 text-2xl opacity-40 animate-bounce-delayed">🎉</div>
        <div className="absolute bottom-1/4 left-2/3 text-3xl opacity-40 animate-spin-slow">🌟</div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-4xl md:text-6xl font-black text-slate-700 mb-2 drop-shadow-lg transform hover:scale-105 transition-transform duration-300">
            TRÒ CHƠI <span className="text-indigo-600 animate-pulse-glow">Ô CHỮ</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-medium mt-3 animate-fade-in">Chinh phục từ khoá - Dễ hay khó? 💪✨</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8 animate-fade-in-up">
          <button
            onClick={() => setActiveTab("play")}
            className={`px-6 cursor-pointer py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
              activeTab === "play"
                ? "bg-white text-indigo-600 shadow-xl shadow-indigo-200/50 ring-4 ring-indigo-100/50"
                : "bg-white/40 text-slate-700 hover:bg-white/60 backdrop-blur-sm border-2 border-white/50"
            }`}
          >
             Chơi Game
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-6 py-3 cursor-pointer rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
              activeTab === "manage"
                ? "bg-white text-indigo-600 shadow-xl shadow-indigo-200/50 ring-4 ring-indigo-100/50"
                : "bg-white/40 text-slate-700 hover:bg-white/60 backdrop-blur-sm border-2 border-white/50"
            }`}
          >
             Quản Lý Câu Hỏi
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in-up border-2 border-white/50 hover:shadow-indigo-200/30 transition-shadow duration-300">
        {activeTab === "play" ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Crossword Grid */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient-x flex items-center gap-2">
                   Bảng Ô Chữ
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-blue-300/50 flex items-center gap-2"
                  >
                     Chơi lại
                  </button>
                  <button
                    onClick={handleShowAllAnswers}
                    disabled={showAllAnswers}
                    className="px-4 py-2 cursor-pointer bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-indigo-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                     Hiện tất cả
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

            {/* Right Sidebar */}
            <div className="lg:w-[400px] shrink-0">
              <QuestionDisplay
                question={currentQuestion}
                rowIndex={selectedRow}
                onRevealAnswer={handleRevealAnswer}
                isRevealed={
                  selectedRow !== null &&
                  (revealedAnswers.includes(selectedRow) || showAllAnswers)
                }
              />
            </div>
          </div>
          ) : (
            <QuestionManager data={data} onUpdateData={handleUpdateData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
