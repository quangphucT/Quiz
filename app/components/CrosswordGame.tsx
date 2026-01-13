"use client";


import { CrosswordData } from "../types";

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
          <div key={question.id} className="flex items-center gap-3 animate-fade-in-left" style={{animationDelay: `${rowIndex * 0.1}s`}}>
            <button
              onClick={() => onSelectRow(rowIndex)}
              className={`min-w-[40px] h-[50px] cursor-pointer px-2 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-110 hover:rotate-3 ${
                isSelected
                  ? "bg-gradient-to-br from-indigo-400 to-purple-400 text-white shadow-lg shadow-indigo-300/50 animate-bounce-gentle"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 border-2 border-slate-300 hover:border-indigo-300"
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
                  return <div key={colIndex} className="w-9 h-9" />;
                }

                return (
                  <div
                    key={colIndex}
                    className={`w-[50px] h-[50px] rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 cursor-pointer animate-pop-in ${
                      isKeywordCell
                        ? "bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-300 shadow-md hover:shadow-amber-200/50"
                        : "bg-gradient-to-br from-white to-slate-50 border-2 border-slate-300 hover:border-indigo-300 shadow-sm hover:shadow-indigo-200/30"
                    } ${
                      isRevealed 
                        ? isKeywordCell 
                          ? "text-amber-700 animate-bounce-in" 
                          : "text-slate-800 animate-bounce-in" 
                        : "text-transparent"
                    }`}
                    style={{animationDelay: `${colIndex * 0.05}s`}}
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
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-2xl shadow-xl animate-fade-in-up border-2 border-indigo-200/50 backdrop-blur-sm">
          <h3 className="text-indigo-700 font-black text-2xl mb-4 text-center flex items-center justify-center gap-2 drop-shadow-sm animate-pulse-glow">
            <span className="text-3xl animate-bounce">🔑</span> Từ Khóa
          </h3>
          <div className="flex gap-2 justify-center flex-wrap">
            {data.keyword.split("").map((letter, index) => {
              const isRevealed = revealedAnswers.includes(index) || showAllAnswers;
              return (
                <div
                  key={index}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-300 flex items-center justify-center font-black text-2xl shadow-lg transition-all duration-500 transform hover:scale-125 hover:rotate-12 cursor-pointer animate-pop-in ${
                    isRevealed 
                      ? "text-indigo-700 shadow-indigo-200/50" 
                      : "text-transparent"
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
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
