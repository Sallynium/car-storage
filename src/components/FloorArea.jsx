import { useRef, useState, useEffect } from 'react';
import FloorBlock from './FloorBlock';

const H = 700;

export default function FloorArea({ blocks, isAdmin, layoutEditing, onUpdate, onDelete }) {
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(380);

  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const w = containerRef.current?.getBoundingClientRect().width;
      if (w > 0) setContainerW(w);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: H,
        position: 'relative',
        backgroundColor: '#EEF5F8',
        borderRadius: '0 0 12px 12px',
        border: '2px solid #4E6E81',
        borderTop: 'none',
        overflow: 'hidden',
        backgroundImage: [
          'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(120,149,178,0.15) 39px, rgba(120,149,178,0.15) 40px)',
          'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(120,149,178,0.15) 39px, rgba(120,149,178,0.15) 40px)',
        ].join(', '),
      }}
    >
      {blocks.map(block => (
        <FloorBlock
          key={block.id}
          block={block}
          isAdmin={isAdmin}
          layoutEditing={layoutEditing}
          containerW={containerW}
          containerH={H}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      {blocks.length === 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7895B2',
          fontSize: '14px',
          opacity: 0.6,
        }}>
          {isAdmin ? '點上方「+ 新增區塊」開始建立' : '暫無區塊'}
        </div>
      )}
    </div>
  );
}
