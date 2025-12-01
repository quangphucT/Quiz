"use client";

import { useState, useEffect } from "react";
import { Question, CrosswordData } from "../types";

interface CrosswordGameProps {
  data: CrosswordData;
  onSelectRow: (rowIndex: number) => void;
  selectedRow: number | null;
  revealedAnswers: number[];
  showAllAnswers: boolean;
}

const CrosswordGame = ({
  data,
  onSelectRow,
  selectedRow,
  revealedAnswers,
  showAllAnswers,
}: CrosswordGameProps) => {
  // Show empty state if no questions
  if (data.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <span className="text-5xl">📝</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-700 mb-2">Chưa có câu hỏi nào</h3>
        <p className="text-slate-500 text-center max-w-sm">
          Vui lòng vào tab <span className="font-semibold text-emerald-600">"Quản lý câu hỏi"</span> để tạo câu hỏi mới
        </p>
      </div>
    );
  }

  const maxLength = Math.max(...data.questions.map((q) => q.answer.length));
  const keywordCol = data.keywordColumn;

  const getStartCol = (answer: string, keywordLetterIndex: number) => {
    return keywordCol - keywordLetterIndex;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {data.questions.map((question, rowIndex) => {
        const answer = question.answer.toUpperCase();
        const keywordLetterIndex = question.keywordIndex ?? 0;
        const startCol = getStartCol(answer, keywordLetterIndex);
        const isRevealed = revealedAnswers.includes(rowIndex) || showAllAnswers;
        const isSelected = selectedRow === rowIndex;

        return (
          <div key={question.id} className="flex items-center gap-3">
            <button
              onClick={() => onSelectRow(rowIndex)}
              className={`w-12 h-12 rounded-xl cursor-pointer font-bold text-lg transition-all duration-300 shadow-md ${
                isSelected
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white scale-110 shadow-lg shadow-amber-500/30 ring-4 ring-amber-200"
                  : isRevealed
                  ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-500/20"
                  : "bg-gradient-to-br from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600 hover:scale-105"
              }`}
            >
              {rowIndex + 1}
            </button>
            <div className="flex gap-1">
              {Array.from({ length: maxLength + 4 }).map((_, colIndex) => {
                const letterIndex = colIndex - startCol;
                const hasLetter = letterIndex >= 0 && letterIndex < answer.length;
                const isKeywordCell = colIndex === keywordCol;
                const letter = hasLetter ? answer[letterIndex] : "";

                if (!hasLetter) {
                  return <div key={colIndex} className="w-11 h-11" />;
                }

                return (
                  <div
                    key={colIndex}
                    className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-sm ${
                      isKeywordCell
                        ? "bg-gradient-to-br from-amber-100 to-yellow-200 border-2 border-amber-400 shadow-amber-200"
                        : "bg-white border-2 border-slate-200"
                    } ${
                      isRevealed 
                        ? isKeywordCell 
                          ? "text-amber-700" 
                          : "text-emerald-600" 
                        : "text-transparent"
                    }`}
                  >
                    {isRevealed ? letter : ""}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Keyword display */}
      {data.keyword && (
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-xl">
          <h3 className="text-white font-bold text-xl mb-4 text-center flex items-center justify-center gap-2">
            <span className="text-2xl">🔑</span> TỪ KHÓA
          </h3>
          <div className="flex gap-2 justify-center">
            {data.keyword.split("").map((letter, index) => {
              const isRevealed = revealedAnswers.includes(index) || showAllAnswers;
              return (
                <div
                  key={index}
                  className={`w-14 h-14 rounded-xl bg-white flex items-center justify-center font-bold text-2xl shadow-lg transition-all duration-500 ${
                    isRevealed 
                      ? "text-amber-600 scale-105" 
                      : "text-transparent"
                  }`}
                >
                  {isRevealed ? letter.toUpperCase() : "?"}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrosswordGame;
