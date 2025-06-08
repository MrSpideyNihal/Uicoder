import React from 'react';
import { CodeBlock } from '../types/blocks';

interface CodePreviewProps {
  blocks: CodeBlock[];
}

const CodePreview: React.FC<CodePreviewProps> = ({ blocks }) => {
  const generateCode = (blocks: CodeBlock[]): string => {
    if (blocks.length === 0) {
      return '# Your code will appear here!\n# Drag blocks to the workspace to get started.';
    }

    // Sort blocks by Y position to maintain visual order
    const sortedBlocks = [...blocks].sort((a, b) => a.y - b.y);
    
    return sortedBlocks.map(block => {
      if (!block.template || !block.inputs) {
        return `# ${block.label}`;
      }

      let code = block.template;
      
      // Replace placeholders with actual values
      block.inputs.forEach(input => {
        const placeholder = `{${input.id}}`;
        const value = input.value || `"${input.label}"`;
        code = code.replace(new RegExp(placeholder, 'g'), value);
      });

      return code;
    }).join('\n\n');
  };

  const generatedCode = generateCode(blocks);

  return (
    <div className="w-80 bg-gray-900 text-green-400 p-4 font-mono text-sm border-l border-gray-200 flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-white">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="ml-2 text-sm font-semibold">Python Code</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <pre className="whitespace-pre-wrap leading-relaxed">
          {generatedCode}
        </pre>
      </div>
    </div>
  );
};

export default CodePreview;