"use client";

import React from "react";
import { Lightbulb, ChevronDown, Plus, Trash2 } from "lucide-react";

export interface ITrivia {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface TriviaFormProps {
  activeFolder: string;
  setActiveFolder: (f: string) => void;
  triviaQuestions: ITrivia[];
  setTriviaQuestions: (t: ITrivia[]) => void;
  SectionHeader: React.FC<{ icon: React.ReactNode; children: React.ReactNode }>;
}

export default function TriviaForm({
  activeFolder,
  setActiveFolder,
  triviaQuestions,
  setTriviaQuestions,
  SectionHeader
}: TriviaFormProps) {
  const isOpen = activeFolder === "trivia";

  const addQuestion = () => {
    setTriviaQuestions([...triviaQuestions, { question: "", options: ["", "", "", ""], correctAnswerIndex: 0 }]);
  };

  const updateQuestion = (idx: number, val: string) => {
    const newT = [...triviaQuestions];
    newT[idx].question = val;
    setTriviaQuestions(newT);
  };

  const updateOption = (qIdx: number, oIdx: number, val: string) => {
    const newT = [...triviaQuestions];
    newT[qIdx].options[oIdx] = val;
    setTriviaQuestions(newT);
  };

  const updateCorrectAnswer = (qIdx: number, oIdx: number) => {
    const newT = [...triviaQuestions];
    newT[qIdx].correctAnswerIndex = oIdx;
    setTriviaQuestions(newT);
  };

  const removeQuestion = (idx: number) => {
    const newT = [...triviaQuestions];
    newT.splice(idx, 1);
    setTriviaQuestions(newT);
  };

  return (
    <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
      <button
        type="button"
        onClick={() => setActiveFolder(isOpen ? "basics" : "trivia")}
        className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
      >
        <SectionHeader icon={<Lightbulb className="w-3.5 h-3.5" />}>Relationship Trivia</SectionHeader>
        <ChevronDown className={`w-4 h-4 text-[#B5ADA5] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="p-5 space-y-6 bg-white">
          <p className="text-xs text-[#6F655E]">Add fun trivia questions they must answer before unlocking the final wish!</p>
          
          {triviaQuestions.map((trivia, tIdx) => (
            <div key={tIdx} className="space-y-3 bg-[#F9F5F0] p-4 rounded-xl border border-[#ECE3DA] relative group">
              <button 
                type="button" 
                onClick={() => removeQuestion(tIdx)}
                className="absolute top-3 right-3 text-[#B5ADA5] hover:text-[#C46D5E] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <input 
                type="text" 
                placeholder="Question (e.g. Where did we first meet?)" 
                value={trivia.question} 
                onChange={e => updateQuestion(tIdx, e.target.value)} 
                className="input-saas w-full text-sm py-2 pr-8" 
              />
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                {trivia.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      checked={trivia.correctAnswerIndex === oIdx} 
                      onChange={() => updateCorrectAnswer(tIdx, oIdx)} 
                      className="accent-[#C97B84]" 
                    />
                    <input 
                      type="text" 
                      placeholder={`Option ${oIdx + 1}`} 
                      value={opt} 
                      onChange={e => updateOption(tIdx, oIdx, e.target.value)} 
                      className="input-saas w-full text-sm py-1.5" 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addQuestion} 
            className="text-xs text-[#C97B84] font-semibold flex items-center gap-1 hover:text-[#B5616B] transition-colors"
          >
            <Plus className="w-3 h-3" /> Add another question
          </button>
        </div>
      )}
    </div>
  );
}
