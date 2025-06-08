import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import * as Icons from 'lucide-react';
import { CodeBlock } from '../types/blocks';

interface WorkspaceBlockProps {
  block: CodeBlock;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CodeBlock>) => void;
  onDelete: (id: string) => void;
}

const WorkspaceBlock: React.FC<WorkspaceBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'workspace-block',
    item: { id: block.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const IconComponent = Icons[block.icon as keyof typeof Icons] || Icons.Square;

  const handleInputChange = (inputId: string, value: string) => {
    const updatedInputs = block.inputs?.map(input =>
      input.id === inputId ? { ...input, value } : input
    );
    onUpdate(block.id, { inputs: updatedInputs });
  };

  return (
    <div
      ref={drag}
      className={`
        absolute ${block.color} text-white rounded-lg shadow-lg p-4 min-w-64
        cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
        ${isSelected ? 'ring-4 ring-white ring-opacity-50' : ''}
        hover:shadow-xl
      `}
      style={{
        left: block.x,
        top: block.y,
        transform: isDragging ? 'rotate(5deg)' : 'none',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(block.id);
      }}
      onDoubleClick={() => setIsEditing(!isEditing)}
    >
      {/* Block Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent size={18} />
          <span className="font-semibold text-sm">{block.label}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
          className="text-white hover:text-red-200 transition-colors"
        >
          <Icons.X size={16} />
        </button>
      </div>

      {/* Block Inputs */}
      {block.inputs && block.inputs.length > 0 && (
        <div className="space-y-2">
          {block.inputs.map((input) => (
            <div key={input.id} className="flex flex-col gap-1">
              <label className="text-xs font-medium opacity-80">
                {input.label}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={input.value || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded border border-white border-opacity-30 text-white placeholder-gray-200"
                  placeholder={`Enter ${input.label.toLowerCase()}`}
                />
              ) : (
                <div className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded min-h-6 flex items-center">
                  {input.value || `Enter ${input.label.toLowerCase()}`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Connection Points */}
      {block.outputs && block.outputs.length > 0 && (
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-white rounded-full border-2 border-current"></div>
        </div>
      )}
      
      {block.inputs && block.inputs.some(input => !input.value) && (
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-white rounded-full border-2 border-current"></div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceBlock;