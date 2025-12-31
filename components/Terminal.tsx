import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Send, Cpu, ShieldAlert } from 'lucide-react';
import { checkAnswerWithGemini, askTutor } from '../services/geminiService';
import { Lesson, ChatMessage } from '../types';

interface TerminalProps {
  currentLesson: Lesson;
  onCompleteLesson: (id: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ currentLesson, onCompleteLesson }) => {
  const [mode, setMode] = useState<'practice' | 'tutor'>('practice');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<ChatMessage[]>([
    { role: 'model', text: 'Initialize RHEL9 Docker Environment... Ready.' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset chat when lesson changes
  useEffect(() => {
    setOutput([
        { role: 'model', text: `Welcome to ${currentLesson.title}.\n\nSystem: RHEL 9.2 (Plow)\nKernel: 5.14.0-284.11.1.el9_2.x86_64\n\nTask: ${currentLesson.exercises[0]?.question || "Review the lesson content."}` }
    ]);
  }, [currentLesson]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.trim();
    setInput('');
    setIsProcessing(true);

    // Add user command to display
    const newHistory = [...output, { role: 'user' as const, text: cmd }];
    setOutput(newHistory);

    if (mode === 'practice') {
        const currentExercise = currentLesson.exercises[0];
        if (currentExercise) {
             let isCorrect = false;
             let explanation = "";

             // 1. ROBUSTNESS: Fast exact/normalized check first.
             // This ensures correct answers work even if AI is offline or hallucinates.
             if (currentExercise.expectedCommand && 
                 cmd.replace(/\s+/g, ' ').trim() === currentExercise.expectedCommand.replace(/\s+/g, ' ').trim()) {
                 isCorrect = true;
                 explanation = "Perfect match!";
             } else {
                 // 2. Fallback to AI for semantic understanding (e.g. flag order, aliases)
                 const result = await checkAnswerWithGemini(
                     currentExercise.question, 
                     cmd, 
                     currentLesson.rhelNotes
                 );
                 isCorrect = result.correct;
                 explanation = result.explanation;
             }

             if (isCorrect) {
                 setOutput(prev => [...prev, { role: 'model', text: `✅ Correct!\n\n${explanation}` }]);
                 onCompleteLesson(currentLesson.id);
             } else {
                 setOutput(prev => [...prev, { role: 'model', text: `❌ Incorrect.\n\n${explanation}\n\nHint: ${currentExercise.hint}`, isError: true }]);
             }
        } else {
             setOutput(prev => [...prev, { role: 'model', text: "No active exercise for this lesson. Switch to Tutor mode to ask questions." }]);
        }
    } else {
        // Tutor Mode
        const historyForAi = output.slice(-6); // Keep context small
        const response = await askTutor(historyForAi, cmd, currentLesson.rhelNotes);
        setOutput(prev => [...prev, { role: 'model', text: response }]);
    }

    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#101010] text-zinc-300 font-mono text-sm border-l border-zinc-800">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#18181b] border-b border-zinc-800">
        <div className="flex gap-4">
            <button 
                onClick={() => setMode('practice')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${mode === 'practice' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <TerminalIcon size={14} />
                <span>Console</span>
            </button>
            <button 
                onClick={() => setMode('tutor')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${mode === 'tutor' ? 'bg-blue-900/30 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Cpu size={14} />
                <span>AI Tutor</span>
            </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-red-500 font-semibold">
            <ShieldAlert size={12} />
            <span>SELinux: Enforcing</span>
        </div>
      </div>

      {/* Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {output.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`mt-0.5 min-w-6 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold select-none ${
                msg.role === 'user' ? 'bg-zinc-700 text-zinc-300' : 'bg-red-900/50 text-red-500'
            }`}>
                {msg.role === 'user' ? 'root' : 'sys'}
            </div>
            <div className={`max-w-[85%] break-words whitespace-pre-wrap ${
                msg.role === 'user' 
                ? 'text-zinc-200' 
                : msg.isError ? 'text-red-400' : 'text-zinc-300'
            }`}>
              {msg.role === 'user' && <span className="text-zinc-500 mr-2">[root@rhel9 ~]#</span>}
              {msg.text}
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="flex gap-3">
               <div className="min-w-6 w-6 h-6 rounded bg-red-900/50 flex items-center justify-center text-[10px] text-red-500 animate-pulse">
                   sys
               </div>
               <div className="text-zinc-500 animate-pulse">Processing...</div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleCommand} className="p-3 bg-[#18181b] border-t border-zinc-800 flex gap-2">
        <div className="flex items-center text-zinc-500 px-2 select-none">
            {mode === 'practice' ? '>' : '?'}
        </div>
        <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-600 font-mono"
            placeholder={mode === 'practice' ? "Enter command..." : "Ask a question about RHEL or Docker..."}
            autoFocus
        />
        <button 
            type="submit" 
            disabled={!input.trim() || isProcessing}
            className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
        >
            <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default Terminal;