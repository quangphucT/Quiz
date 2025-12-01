"use client";

import { useState, useEffect, useRef } from "react";
import { Question } from "../types";

interface QuestionDisplayProps {
  question: Question | null;
  rowIndex: number | null;
  onRevealAnswer: (index: number) => void;
  isRevealed: boolean;
}

const QuestionDisplay = ({
  question,
  rowIndex,
  onRevealAnswer,
  isRevealed,
}: QuestionDisplayProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakQuestion = () => {
    if (!question) return;
    stopSpeaking();
    setIsSpeaking(true);

    const text = encodeURIComponent(question.question);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${text}`;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => {
      setIsSpeaking(false);
      fallbackSpeak(question.question);
    };

    audio.play().catch(() => {
      setIsSpeaking(false);
      fallbackSpeak(question.question);
    });
  };

  const fallbackSpeak = (text: string) => {
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find((voice) => voice.lang.includes("vi"));
    if (vietnameseVoice) utterance.voice = vietnameseVoice;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  if (!question || rowIndex === null) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <span className="text-4xl">🎯</span>
          </div>
          <p className="text-slate-500 text-lg text-center">
            Chọn một câu hỏi để hiển thị
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg">
              {rowIndex + 1}
            </span>
            <div>
              <h3 className="text-white font-bold text-lg">Câu hỏi</h3>
              <p className="text-white/70 text-sm">{question.answer.length} ký tự</p>
            </div>
          </div>
          <button
            onClick={isSpeaking ? stopSpeaking : speakQuestion}
            className={`p-3 cursor-pointer rounded-xl font-bold transition-all duration-300 ${
              isSpeaking
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {isSpeaking ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Question content */}
      <div className="p-6">
        <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl mb-4">
          <p className="text-xl text-slate-800 leading-relaxed font-medium">
            {question.question}
          </p>
        </div>

        {question.hint && (
          <div className="p-4 bg-amber-50 rounded-xl mb-4 border border-amber-200">
            <p className="text-amber-800 flex items-start gap-2">
              <span className="text-xl">💡</span>
              <span><strong>Gợi ý:</strong> {question.hint}</span>
            </p>
          </div>
        )}

        {!isRevealed ? (
          <button
            onClick={() => onRevealAnswer(rowIndex)}
            className="w-full py-4 cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
          >
             Hiển thị đáp án
          </button>
        ) : (
          <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl">
            <p className="text-white text-center text-3xl font-bold tracking-widest">
              {question.answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
