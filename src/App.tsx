import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Code2, Sparkles } from 'lucide-react';

import BlockPalette from './components/BlockPalette';
import Workspace from './components/Workspace';
import CodePreview from './components/CodePreview';
import Console from './components/Console';
import { CodeBlock, WorkspaceState } from './types/blocks';
import { CodeExecutor } from './utils/codeExecutor';

function App() {
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    blocks: [],
    connections: [],
  });
  
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [codeExecutor] = useState(() => new CodeExecutor());

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleBlockAdd = useCallback((blockTemplate: any, position: { x: number; y: number }) => {
    const newBlock: CodeBlock = {
      ...blockTemplate,
      id: generateId(),
      x: position.x,
      y: position.y,
    };

    setWorkspace(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
  }, []);

  const handleBlockMove = useCallback((id: string, position: { x: number; y: number }) => {
    setWorkspace(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === id ? { ...block, ...position } : block
      ),
    }));
  }, []);

  const handleBlockSelect = useCallback((id: string) => {
    setWorkspace(prev => ({ ...prev, selectedBlockId: id }));
  }, []);

  const handleBlockUpdate = useCallback((id: string, updates: Partial<CodeBlock>) => {
    setWorkspace(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      ),
    }));
  }, []);

  const handleBlockDelete = useCallback((id: string) => {
    setWorkspace(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== id),
      selectedBlockId: prev.selectedBlockId === id ? undefined : prev.selectedBlockId,
    }));
  }, []);

  const generateCodeFromBlocks = (blocks: CodeBlock[]): string => {
    if (blocks.length === 0) return '';
    
    const sortedBlocks = [...blocks].sort((a, b) => a.y - b.y);
    
    return sortedBlocks.map(block => {
      if (!block.template || !block.inputs) return `# ${block.label}`;

      let code = block.template;
      block.inputs.forEach(input => {
        const placeholder = `{${input.id}}`;
        const value = input.value || `"${input.label}"`;
        code = code.replace(new RegExp(placeholder, 'g'), value);
      });

      return code;
    }).join('\n\n');
  };

  const handleRunCode = useCallback(async () => {
    setIsRunning(true);
    
    try {
      const code = generateCodeFromBlocks(workspace.blocks);
      if (!code.trim()) {
        setConsoleOutput(['❌ No code to run! Add some blocks to the workspace first.']);
        return;
      }

      const result = await codeExecutor.executeCode(code);
      
      if (result.error) {
        setConsoleOutput([result.error, ...result.output]);
      } else {
        setConsoleOutput(['🎉 Code executed successfully!', ...result.output]);
      }
    } catch (error) {
      setConsoleOutput([`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsRunning(false);
    }
  }, [workspace.blocks, codeExecutor]);

  const handleClearConsole = useCallback(() => {
    setConsoleOutput([]);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Code2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Kids Code Studio</h1>
                <p className="text-sm opacity-90">Drag, Drop, and Create Amazing Programs!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-yellow-300">
              <Sparkles size={20} />
              <span className="font-semibold">Let's Code!</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <BlockPalette />
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <Workspace
                blocks={workspace.blocks}
                selectedBlockId={workspace.selectedBlockId}
                onBlockAdd={handleBlockAdd}
                onBlockMove={handleBlockMove}
                onBlockSelect={handleBlockSelect}
                onBlockUpdate={handleBlockUpdate}
                onBlockDelete={handleBlockDelete}
              />
              <CodePreview blocks={workspace.blocks} />
            </div>
            
            <Console
              output={consoleOutput}
              onRun={handleRunCode}
              onClear={handleClearConsole}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;