"use client";

import { useState } from "react";
import { Question, CrosswordData } from "../types";

interface QuestionManagerProps {
  data: CrosswordData;
  onUpdateData: (data: CrosswordData) => void;
}

const QuestionManager = ({ data, onUpdateData }: QuestionManagerProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newHint, setNewHint] = useState("");
  const [selectedKeywordIndex, setSelectedKeywordIndex] = useState<number>(0);

  const calculateKeyword = (questions: Question[]) => {
    return questions
      .map((q) => {
        const idx = q.keywordIndex ?? 0;
        return q.answer[idx]?.toUpperCase() || "";
      })
      .join("");
  };

  const calculateKeywordColumn = (questions: Question[]) => {
    if (questions.length === 0) return 5;
    const maxKeywordIndex = Math.max(...questions.map((q) => q.keywordIndex ?? 0));
    return maxKeywordIndex + 1;
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const answer = newAnswer.toUpperCase().replace(/\s/g, "");
    const newQ: Question = {
      id: Date.now(),
      question: newQuestion,
      answer: answer,
      hint: newHint,
      keywordIndex: selectedKeywordIndex,
    };

    const newQuestions = [...data.questions, newQ];
    const keyword = calculateKeyword(newQuestions);
    const keywordColumn = calculateKeywordColumn(newQuestions);

    onUpdateData({
      ...data,
      questions: newQuestions,
      keyword,
      keywordColumn,
    });

    setNewQuestion("");
    setNewAnswer("");
    setNewHint("");
    setSelectedKeywordIndex(0);
  };

  const handleDeleteQuestion = (id: number) => {
    const newQuestions = data.questions.filter((q) => q.id !== id);
    const keyword = calculateKeyword(newQuestions);
    const keywordColumn = calculateKeywordColumn(newQuestions);

    onUpdateData({
      ...data,
      questions: newQuestions,
      keyword,
      keywordColumn,
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingId(question.id);
    setNewQuestion(question.question);
    setNewAnswer(question.answer);
    setNewHint(question.hint || "");
    setSelectedKeywordIndex(question.keywordIndex ?? 0);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    const answer = newAnswer.toUpperCase().replace(/\s/g, "");
    const newQuestions = data.questions.map((q) =>
      q.id === editingId
        ? {
            ...q,
            question: newQuestion,
            answer: answer,
            hint: newHint,
            keywordIndex: selectedKeywordIndex,
          }
        : q
    );

    const keyword = calculateKeyword(newQuestions);
    const keywordColumn = calculateKeywordColumn(newQuestions);

    onUpdateData({
      ...data,
      questions: newQuestions,
      keyword,
      keywordColumn,
    });

    setEditingId(null);
    setNewQuestion("");
    setNewAnswer("");
    setNewHint("");
    setSelectedKeywordIndex(0);
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...data.questions];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newQuestions.length) return;
    [newQuestions[index], newQuestions[newIndex]] = [
      newQuestions[newIndex],
      newQuestions[index],
    ];

    const keyword = calculateKeyword(newQuestions);
    onUpdateData({ ...data, questions: newQuestions, keyword });
  };

  const answerLetters = newAnswer.toUpperCase().replace(/\s/g, "").split("");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Current Keyword Display */}
      {data.keyword && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔑</span> Từ khóa hiện tại
          </h3>
          <div className="flex gap-2 justify-center flex-wrap">
            {data.keyword.split("").map((letter, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-linear-to-br from-amber-100 to-yellow-200 border-2 border-amber-400 rounded-xl flex items-center justify-center font-bold text-xl text-amber-700 shadow-sm"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
        <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">{editingId ? "✏️" : "➕"}</span>
          {editingId ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Câu hỏi</label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Nhập câu hỏi..."
              className="w-full px-4 py-3 text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Đáp án</label>
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => {
                setNewAnswer(e.target.value);
                setSelectedKeywordIndex(0);
              }}
              placeholder="Nhập đáp án..."
              className="w-full px-4 py-3 text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          {/* Letter Selection for Keyword */}
          {answerLetters.length > 0 && (
            <div className="p-4 bg-linear-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
              <p className="text-amber-800 font-semibold mb-3 flex items-center gap-2">
                <span>👆</span> Chọn chữ cái đặc biệt (tạo thành từ khóa):
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {answerLetters.map((letter, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedKeywordIndex(index)}
                    className={`w-12 h-12 font-bold text-lg rounded-xl transition-all duration-200 cursor-pointer ${
                      selectedKeywordIndex === index
                        ? "bg-linear-to-br from-amber-400 to-orange-500 text-white scale-110 shadow-lg shadow-amber-500/30 ring-4 ring-amber-200"
                        : "bg-white border-2 border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <p className="text-amber-700 text-sm mt-3 text-center">
                Chữ được chọn: <span className="font-bold text-amber-600 text-lg">{answerLetters[selectedKeywordIndex] || "-"}</span>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {editingId ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 bg-linear-to-r from-emerald-500 to-teal-500 cursor-pointer text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
                >
                  💾 Lưu thay đổi
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setNewQuestion("");
                    setNewAnswer("");
                    setNewHint("");
                    setSelectedKeywordIndex(0);
                  }}
                  className="px-6 py-3 bg-slate-100 cursor-pointer text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  ❌ Hủy
                </button>
              </>
            ) : (
              <button
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim() || !newAnswer.trim()}
                className="flex-1 py-3 bg-linear-to-r from-emerald-500 to-teal-500 cursor-pointer text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➕ Thêm câu hỏi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
        <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">📋</span> Danh sách câu hỏi
          <span className="ml-auto bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
            {data.questions.length} câu
          </span>
        </h3>

        {data.questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-linear-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <span className="text-4xl">📝</span>
            </div>
            <p className="text-slate-500 text-lg">Chưa có câu hỏi nào</p>
            <p className="text-slate-400 text-sm mt-1">Hãy thêm câu hỏi đầu tiên!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.questions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center font-bold shadow-md shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 mb-2 line-clamp-2">
                      {question.question}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-500 text-sm">Đáp án:</span>
                      <div className="flex gap-0.5">
                        {question.answer.split("").map((letter, letterIndex) => (
                          <span
                            key={letterIndex}
                            className={`px-2 py-1 rounded text-sm font-semibold ${
                              letterIndex === (question.keywordIndex ?? 0)
                                ? "bg-linear-to-br from-amber-100 to-yellow-200 text-amber-700 border border-amber-400"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleMoveQuestion(index, "up")}
                      disabled={index === 0}
                      className="w-9 h-9 bg-slate-200 cursor-pointer text-slate-600 rounded-lg hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(index, "down")}
                      disabled={index === data.questions.length - 1}
                      className="w-9 h-9 bg-slate-200 cursor-pointer text-slate-600 rounded-lg hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="px-3 py-2 bg-amber-100 cursor-pointer text-amber-700 rounded-lg hover:bg-amber-200 transition-all font-medium text-sm"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="px-3 py-2 bg-rose-100 cursor-pointer text-rose-700 rounded-lg hover:bg-rose-200 transition-all font-medium text-sm"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionManager;
