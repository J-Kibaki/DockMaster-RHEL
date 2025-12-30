import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LessonContent from './components/LessonContent';
import Terminal from './components/Terminal';
import { ROADMAP } from './constants';
import { Module, Lesson } from './types';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>(ROADMAP[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson>(ROADMAP[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLessonSelect = (module: Module, lesson: Lesson) => {
    setActiveModule(module);
    setActiveLesson(lesson);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800 text-white rounded shadow-lg border border-zinc-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          currentLessonId={activeLesson.id}
          onSelectLesson={handleLessonSelect}
          completedLessons={completedLessons}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
        {/* Lesson View */}
        <div className="w-full md:w-1/2 lg:w-3/5 h-1/2 md:h-full overflow-hidden border-r border-zinc-800">
          <LessonContent lesson={activeLesson} />
        </div>

        {/* Terminal/Interactive View */}
        <div className="w-full md:w-1/2 lg:w-2/5 h-1/2 md:h-full overflow-hidden">
          <Terminal 
            currentLesson={activeLesson}
            onCompleteLesson={handleLessonComplete}
          />
        </div>
      </div>
    </div>
  );
}