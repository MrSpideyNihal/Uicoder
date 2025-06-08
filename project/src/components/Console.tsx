import React from 'react';
import { Play, RotateCcw, Terminal } from 'lucide-react';

interface ConsoleProps {
  output: string[];
  onRun: () => void;
  onClear: () => void;
  isRunning: boolean;
}

const Console: React.FC<ConsoleProps> = ({ output, onRun, onClear, isRunning }) => {
  return (
    <div className="h-48 bg-gray-900 text-white border-t border-gray-200 flex flex-col">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal size={16} />
          <span className="text-sm font-semibold">Console Output</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="
              flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 
              disabled:bg-gray-600 disabled:cursor-not-allowed
              text-white rounded-lg text-sm font-medium transition-colors
            "
          >
            <Play size={14} />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          
          <button
            onClick={onClear}
            className="
              flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700
              text-white rounded-lg text-sm font-medium transition-colors
            "
          >
            <RotateCcw size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Console Output */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
        {output.length === 0 ? (
          <div className="text-gray-500 italic">
            🚀 Click "Run Code\" to see your program output here!
          </div>
        ) : (
          <div className="space-y-1">
            {output.map((line, index) => (
              <div key={index} className="leading-relaxed">
                {line.startsWith('ERROR:') ? (
                  <span className="text-red-400">❌ {line}</span>
                ) : line.startsWith('>>> ') ? (
                  <span className="text-blue-400">{line}</span>
                ) : (
                  <span className="text-green-400">{line}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;