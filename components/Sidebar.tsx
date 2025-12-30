import React, { useMemo } from 'react';
import { ROADMAP } from '../constants';
import { Module, Lesson, Difficulty } from '../types';
import { BookOpen, CheckCircle, Server, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentLessonId: string;
  onSelectLesson: (module: Module, lesson: Lesson) => void;
  completedLessons: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentLessonId, onSelectLesson, completedLessons }) => {
  
  // Calculate navigation context
  const { prevLesson, nextLesson } = useMemo(() => {
    const flatList = ROADMAP.flatMap(module => 
      module.lessons.map(lesson => ({ lesson, module }))
    );
    
    const currentIndex = flatList.findIndex(item => item.lesson.id === currentLessonId);
    
    return {
      prevLesson: flatList[currentIndex - 1] || null,
      nextLesson: flatList[currentIndex + 1] || null
    };
  }, [currentLessonId]);

  return (
    <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 mb-1">
          <Server className="text-red-500" size={24} />
          <h1 className="text-xl font-bold text-white tracking-tight">DockMaster <span className="text-red-500">RHEL</span></h1>
        </div>
        <p className="text-xs text-slate-400">Zero to Pro in RHEL9 Environments</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {ROADMAP.map((module) => (
          <div key={module.id}>
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{module.title}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                module.difficulty === Difficulty.BEGINNER ? 'bg-green-900/50 text-green-400' :
                module.difficulty === Difficulty.INTERMEDIATE ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-red-900/50 text-red-400'
              }`}>
                {module.difficulty}
              </span>
            </div>
            <div className="space-y-1">
              {module.lessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId;
                const isCompleted = completedLessons.includes(lesson.id);
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(module, lesson)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 text-left group ${
                      isActive 
                        ? 'bg-red-600/10 text-red-400 border border-red-500/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className={`min-w-4 w-4`}>
                        {isCompleted ? (
                             <CheckCircle size={16} className="text-green-500" />
                        ) : (
                            <BookOpen size={16} className={isActive ? 'text-red-500' : 'opacity-50'} />
                        )}
                    </div>
                    <span className="truncate">{lesson.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-4">
        <div className="grid grid-cols-2 gap-3">
            <button
                disabled={!prevLesson}
                onClick={() => prevLesson && onSelectLesson(prevLesson.module, prevLesson.lesson)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-colors text-xs font-medium border border-slate-700"
            >
                <ChevronLeft size={14} />
                <span>Prev</span>
            </button>
            <button
                disabled={!nextLesson}
                onClick={() => nextLesson && onSelectLesson(nextLesson.module, nextLesson.lesson)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-slate-500 disabled:bg-slate-800 transition-colors text-xs font-medium border border-red-900/30 disabled:border-slate-700"
            >
                <span>Next</span>
                <ChevronRight size={14} />
            </button>
        </div>

        <div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-red-500 h-full transition-all duration-500" 
                style={{ width: `${(completedLessons.length / ROADMAP.reduce((acc, m) => acc + m.lessons.length, 0)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Progress</span>
                <span>{Math.round((completedLessons.length / ROADMAP.reduce((acc, m) => acc + m.lessons.length, 0)) * 100)}%</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;