import React, { useMemo } from 'react';
import { ROADMAP } from '../constants';
import { Module, Lesson, Difficulty } from '../types';
import { BookOpen, CheckCircle, Server, ChevronLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';

interface SidebarProps {
  currentLessonId: string;
  onSelectLesson: (module: Module, lesson: Lesson) => void;
  completedLessons: string[];
  onResetModule: (moduleId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentLessonId, onSelectLesson, completedLessons, onResetModule }) => {
  
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
    <div className="w-full md:w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-2 mb-1">
          <Server className="text-red-600" size={24} />
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">DockMaster <span className="text-red-600">RHEL</span></h1>
        </div>
        <p className="text-xs text-zinc-400">Zero to Pro in RHEL9 Environments</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {ROADMAP.map((module) => {
            const moduleCompletedCount = module.lessons.filter(l => completedLessons.includes(l.id)).length;
            const isModuleCompleted = module.lessons.length > 0 && moduleCompletedCount === module.lessons.length;
            const isModuleStarted = moduleCompletedCount > 0;

            return (
              <div key={module.id}>
                <div className="flex justify-between items-center mb-2 px-2 group/module">
                  <div className="flex items-center gap-2">
                      {isModuleCompleted && <Trophy size={14} className="text-emerald-500 animate-pulse" />}
                      <h3 className={`text-sm font-semibold uppercase tracking-wider ${isModuleCompleted ? 'text-emerald-400' : 'text-zinc-400'}`}>{module.title}</h3>
                      {isModuleStarted && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if(window.confirm(`Reset progress for ${module.title}?`)) {
                                    onResetModule(module.id);
                                }
                            }}
                            className="opacity-0 group-hover/module:opacity-100 transition-opacity text-zinc-600 hover:text-red-400 p-1"
                            title="Reset Module Progress"
                        >
                            <RotateCcw size={12} />
                        </button>
                      )}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    module.difficulty === Difficulty.BEGINNER ? 'bg-emerald-900/30 text-emerald-400' :
                    module.difficulty === Difficulty.INTERMEDIATE ? 'bg-amber-900/30 text-amber-400' :
                    'bg-red-900/30 text-red-400'
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
                            ? 'bg-red-900/10 text-red-400 border border-red-500/20' 
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <div className={`min-w-4 w-4`}>
                            {isCompleted ? (
                                 <CheckCircle size={16} className="text-emerald-500" />
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
            );
        })}
      </div>
      
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 space-y-4">
        <div className="grid grid-cols-2 gap-3">
            <button
                disabled={!prevLesson}
                onClick={() => prevLesson && onSelectLesson(prevLesson.module, prevLesson.lesson)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-300 transition-colors text-xs font-medium border border-zinc-700"
            >
                <ChevronLeft size={14} />
                <span>Prev</span>
            </button>
            <button
                disabled={!nextLesson}
                onClick={() => nextLesson && onSelectLesson(nextLesson.module, nextLesson.lesson)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-zinc-500 disabled:bg-zinc-800 transition-colors text-xs font-medium border border-red-900/30 disabled:border-zinc-700"
            >
                <span>Next</span>
                <ChevronRight size={14} />
            </button>
        </div>

        <div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-red-600 h-full transition-all duration-500" 
                style={{ width: `${(completedLessons.length / ROADMAP.reduce((acc, m) => acc + m.lessons.length, 0)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-zinc-500">
                <span>Progress</span>
                <span>{Math.round((completedLessons.length / ROADMAP.reduce((acc, m) => acc + m.lessons.length, 0)) * 100)}%</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;