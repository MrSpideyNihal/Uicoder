import React from 'react';
import { useDrag } from 'react-dnd';
import * as Icons from 'lucide-react';
import { blockCategories, blockTemplates } from '../data/blockTemplates';

interface DraggableBlockProps {
  block: typeof blockTemplates[0];
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ block }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: { blockTemplate: block },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const IconComponent = Icons[block.icon as keyof typeof Icons] || Icons.Square;

  return (
    <div
      ref={drag}
      className={`
        ${block.color} text-white p-3 rounded-lg cursor-grab shadow-md
        hover:shadow-lg transition-all duration-200 hover:scale-105
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        flex items-center gap-2 text-sm font-medium
      `}
    >
      <IconComponent size={16} />
      <span>{block.label}</span>
    </div>
  );
};

const BlockPalette: React.FC = () => {
  const categorizedBlocks = blockTemplates.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, typeof blockTemplates>);

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Code Blocks</h2>
        <p className="text-sm text-gray-600">Drag blocks to the workspace!</p>
      </div>

      {Object.entries(categorizedBlocks).map(([category, blocks]) => {
        const categoryInfo = blockCategories[category as keyof typeof blockCategories];
        const IconComponent = Icons[categoryInfo.icon as keyof typeof Icons] || Icons.Square;
        
        return (
          <div key={category} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className={`${categoryInfo.color} p-1.5 rounded text-white`}>
                <IconComponent size={14} />
              </div>
              <h3 className="font-semibold text-gray-700 text-sm">{categoryInfo.name}</h3>
            </div>
            <div className="space-y-2">
              {blocks.map((block, index) => (
                <DraggableBlock key={`${block.type}-${index}`} block={block} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlockPalette;