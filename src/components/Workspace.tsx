import React from 'react';
import { useDrop } from 'react-dnd';
import { CodeBlock } from '../types/blocks';
import WorkspaceBlock from './WorkspaceBlock';

interface WorkspaceProps {
  blocks: CodeBlock[];
  selectedBlockId?: string;
  onBlockAdd: (blockTemplate: any, position: { x: number; y: number }) => void;
  onBlockMove: (id: string, position: { x: number; y: number }) => void;
  onBlockSelect: (id: string) => void;
  onBlockUpdate: (id: string, updates: Partial<CodeBlock>) => void;
  onBlockDelete: (id: string) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({
  blocks,
  selectedBlockId,
  onBlockAdd,
  onBlockMove,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['block', 'workspace-block'],
    drop: (item: any, monitor) => {
      const offset = monitor.getSourceClientOffset();
      const workspaceRect = dropRef.current?.getBoundingClientRect();
      
      if (offset && workspaceRect) {
        const x = Math.max(0, offset.x - workspaceRect.left - 100);
        const y = Math.max(0, offset.y - workspaceRect.top - 50);
        
        // Snap to grid
        const snappedX = Math.round(x / 20) * 20;
        const snappedY = Math.round(y / 20) * 20;
        
        if (item.blockTemplate) {
          // New block from palette
          onBlockAdd(item.blockTemplate, { x: snappedX, y: snappedY });
        } else if (item.id) {
          // Existing block being moved
          onBlockMove(item.id, { x: snappedX, y: snappedY });
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const dropRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    drop(dropRef);
  }, [drop]);

  return (
    <div
      ref={dropRef}
      className={`
        flex-1 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden
        ${isOver ? 'bg-blue-100' : ''}
        transition-colors duration-200
      `}
      onClick={() => onBlockSelect('')}
      style={{
        backgroundImage: `
          radial-gradient(circle at 20px 20px, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    >
      {/* Grid dots for visual appeal */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Drop zone hint */}
      {blocks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-semibold mb-2">Start Building!</h3>
            <p className="text-lg">Drag code blocks here to create your program</p>
          </div>
        </div>
      )}

      {/* Render blocks */}
      {blocks.map((block) => (
        <WorkspaceBlock
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          onSelect={onBlockSelect}
          onUpdate={onBlockUpdate}
          onDelete={onBlockDelete}
        />
      ))}
    </div>
  );
};

export default Workspace;