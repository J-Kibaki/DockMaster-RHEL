import React, { useState } from 'react';
import { Lesson } from '../types';
import { Info, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';

interface LessonContentProps {
  lesson: Lesson;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderHighlighted = () => {
    if (language?.toLowerCase() === 'dockerfile') {
      return code.split('\n').map((line, i) => {
        // Comments
        if (line.trim().startsWith('#')) {
          return <div key={i} className="text-slate-500 italic">{line}</div>;
        }

        const keywords = ['FROM', 'RUN', 'CMD', 'LABEL', 'EXPOSE', 'ENV', 'ADD', 'COPY', 'ENTRYPOINT', 'VOLUME', 'USER', 'WORKDIR', 'ARG', 'ONBUILD', 'STOPSIGNAL', 'HEALTHCHECK', 'SHELL'];
        
        // Find the first word to detect instruction
        const trimmed = line.trimStart();
        const indent = line.substring(0, line.length - trimmed.length);
        const firstSpace = trimmed.indexOf(' ');
        const firstWord = firstSpace === -1 ? trimmed : trimmed.substring(0, firstSpace);

        if (keywords.includes(firstWord.toUpperCase())) {
          const rest = firstSpace === -1 ? '' : trimmed.substring(firstSpace);
          return (
            <div key={i}>
              {indent}
              <span className="text-pink-400 font-bold">{firstWord}</span>
              {/* Simple highlighting for strings in the rest of the line */}
              {rest.split(/(".*?"|'.*?')/g).map((part, j) => {
                  if (part.startsWith('"') || part.startsWith("'")) {
                      return <span key={j} className="text-green-400">{part}</span>;
                  }
                  return <span key={j} className="text-slate-200">{part}</span>;
              })}
            </div>
          );
        }

        return <div key={i} className="text-slate-200">{line}</div>;
      });
    }
    
    // Default or Bash: simple highlighting for comments
    if (language?.toLowerCase() === 'bash' || !language) {
         return code.split('\n').map((line, i) => {
            if (line.trim().startsWith('#')) {
                return <div key={i} className="text-slate-500 italic">{line}</div>;
            }
            return <div key={i} className="text-slate-200">{line}</div>;
         });
    }

    return code;
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-xl group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400 lowercase">{language || 'bash'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          <span className={copied ? 'text-green-400' : ''}>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-slate-200 whitespace-pre font-medium leading-relaxed">
          {renderHighlighted()}
        </pre>
      </div>
    </div>
  );
};

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  // Simple parser to separate code blocks from text
  const renderContent = () => {
    // Split by triple backticks
    const parts = lesson.content.split('```');
    
    return parts.map((part, index) => {
      // Odd indexes are code blocks (assuming content starts with text)
      if (index % 2 === 1) {
        // Extract language if specified (e.g. ```bash)
        const firstLineBreak = part.indexOf('\n');
        let language = 'bash';
        let code = part;
        
        if (firstLineBreak > -1) {
           const potentialLang = part.substring(0, firstLineBreak).trim();
           if (potentialLang && !potentialLang.includes(' ')) {
               language = potentialLang;
               code = part.substring(firstLineBreak + 1);
           }
        }
        
        return <CodeBlock key={index} code={code.trim()} language={language} />;
      }

      // Even indexes are Markdown-ish text
      return (
        <div key={index} className="prose prose-invert prose-slate max-w-none mb-4">
           {part.split('\n').map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lineIdx} className="h-2"></div>;
              
              if (trimmed.startsWith('### ')) {
                  return <h3 key={lineIdx} className="text-xl font-bold text-white mt-6 mb-3">{trimmed.replace('### ', '')}</h3>
              }
              if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                  return <h4 key={lineIdx} className="text-lg font-semibold text-slate-200 mt-4 mb-2">{trimmed.replace(/\*\*/g, '')}</h4>
              }
              if (trimmed.startsWith('- ')) {
                  return (
                    <div key={lineIdx} className="flex gap-2 ml-2 mb-1 text-slate-300">
                        <span className="text-slate-500">•</span>
                        <span>
                            {trimmed.replace('- ', '').split(/(\*\*.*?\*\*|`.*?`)/g).map((seg, segIdx) => {
                                if (seg.startsWith('**') && seg.endsWith('**')) return <strong key={segIdx} className="text-white font-semibold">{seg.slice(2, -2)}</strong>;
                                if (seg.startsWith('`') && seg.endsWith('`')) return <code key={segIdx} className="bg-slate-800 text-red-300 px-1 py-0.5 rounded text-sm">{seg.slice(1, -1)}</code>;
                                return seg;
                            })}
                        </span>
                    </div>
                  )
              }
              
              // Standard Paragraph with simple inline bold/code support
              return (
                  <p key={lineIdx} className="mb-2 text-slate-300 leading-relaxed">
                      {line.split(/(\*\*.*?\*\*|`.*?`)/g).map((seg, segIdx) => {
                          if (seg.startsWith('**') && seg.endsWith('**')) return <strong key={segIdx} className="text-white font-semibold">{seg.slice(2, -2)}</strong>;
                          if (seg.startsWith('`') && seg.endsWith('`')) return <code key={segIdx} className="bg-slate-800 text-red-300 px-1 py-0.5 rounded text-sm">{seg.slice(1, -1)}</code>;
                          return seg;
                      })}
                  </p>
              )
           })}
        </div>
      );
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 bg-slate-950 custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{lesson.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm">
            <span className="bg-blue-900/30 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded">RHEL 9 Compatible</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
            <span>Beginner Friendly</span>
          </div>
        </header>

        {/* Main Content Render */}
        <div>
            {renderContent()}
        </div>

        {/* RHEL Specific Note Box */}
        {lesson.rhelNotes && (
            <div className="bg-slate-900/50 border-l-4 border-red-500 rounded-r-lg p-6 my-8">
                <div className="flex items-center gap-2 mb-3 text-red-400 font-bold uppercase tracking-wider text-xs">
                    <AlertTriangle size={16} />
                    <span>RHEL 9 Important Note</span>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed">
                   {/* Handle inline bolding for notes too */}
                   {lesson.rhelNotes.split(/(\*\*.*?\*\*|`.*?`)/g).map((seg, segIdx) => {
                          if (seg.startsWith('**') && seg.endsWith('**')) return <strong key={segIdx} className="text-red-300 font-semibold">{seg.slice(2, -2)}</strong>;
                          if (seg.startsWith('`') && seg.endsWith('`')) return <code key={segIdx} className="bg-slate-800 text-red-300 px-1 py-0.5 rounded text-sm">{seg.slice(1, -1)}</code>;
                          return seg;
                   })}
                </div>
            </div>
        )}

        {/* Exercise Prompt */}
        <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/20 rounded-xl p-6 shadow-lg">
             <div className="flex items-center gap-2 mb-4 text-blue-400 font-semibold">
                <Info size={20} />
                <h2>Practice Time</h2>
            </div>
            <p className="text-slate-200 mb-4 text-lg">{lesson.exercises[0]?.question}</p>
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <span className="text-blue-400">Tip:</span>
                <span>You can type commands in the simulator on the right, or <strong>copy</strong> the code blocks above to run on your own machine!</span>
            </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center">
            <a href="https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/building_running_and_managing_containers/index" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-sm group">
                <span className="group-hover:underline">Official RHEL9 Container Documentation</span>
                <ExternalLink size={14} />
            </a>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;