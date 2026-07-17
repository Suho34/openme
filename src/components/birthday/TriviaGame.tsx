"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Lightbulb } from "lucide-react";
import confetti from "canvas-confetti";

interface ITrivia {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface TriviaGameProps {
  trivia: ITrivia[];
  onComplete: () => void;
}

export default function TriviaGame({ trivia, onComplete }: TriviaGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (selected !== null) return; // Prevent multiple clicks

    setSelected(idx);
    const correct = idx === trivia[currentIndex].correctAnswerIndex;
    setIsCorrect(correct);

    if (correct) {
      confetti({
        particleCount: 50, spread: 60, origin: { y: 0.7 },
        colors: ["#8FA27A", "#FFFFFF"]
      });
      setTimeout(() => {
        if (currentIndex < trivia.length - 1) {
          setCurrentIndex(c => c + 1);
          setSelected(null);
          setIsCorrect(null);
        } else {
          setCompleted(true);
        }
      }, 1500);
    } else {
      // Shake effect or just wait to let them try again
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  if (completed) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-[#8FA27A]/10 text-[#8FA27A] flex items-center justify-center mx-auto mb-4 border border-[#8FA27A]/20">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl text-[#2E2A27] mb-2">You know me so well!</h3>
        <p className="text-[#6F655E] text-sm mb-6">You answered all the trivia correctly.</p>
        <button onClick={onComplete} className="btn-primary px-8 py-3.5 text-sm">
          Continue ✨
        </button>
      </motion.div>
    );
  }

  const currentQ = trivia[currentIndex];

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-[#D8B88A]" />
        <span className="text-[0.6875rem] font-semibold text-[#D8B88A] uppercase tracking-[0.15em]">
          Trivia {currentIndex + 1} of {trivia.length}
        </span>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="font-serif text-xl sm:text-2xl text-[#2E2A27] mb-8 leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selected === idx;
              let bgClass = "bg-white border-[#ECE3DA] hover:bg-[#F9F5F0]";
              let textClass = "text-[#2E2A27]";
              let icon = null;

              if (isSelected) {
                if (isCorrect) {
                  bgClass = "bg-[#8FA27A]/10 border-[#8FA27A]/30";
                  textClass = "text-[#8FA27A] font-medium";
                  icon = <Check className="w-4 h-4 text-[#8FA27A]" />;
                } else {
                  bgClass = "bg-[#C46D5E]/10 border-[#C46D5E]/30";
                  textClass = "text-[#C46D5E] font-medium";
                  icon = <X className="w-4 h-4 text-[#C46D5E]" />;
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={selected !== null}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border ${bgClass} transition-all duration-300 shadow-sm disabled:cursor-default`}
                >
                  <span className={`text-sm ${textClass}`}>{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
