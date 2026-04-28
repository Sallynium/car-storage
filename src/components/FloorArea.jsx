import { useRef, useState, useEffect } from 'react';
import FloorBlock from './FloorBlock';

export const DESIGN_W = 448;
export const DESIGN_H = 700;

export default function FloorArea({ blocks, isAdmin, layoutEditing, onUpdate, onDelete }) {
  const wrapperRef = useRef(null);
  const [containerW, setContainerW] = useState(DESIGN_W);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const measure = () => {
      const w = wrapperRef.current?.getBoundingClientRect().width;
      if (w > 0) setContainerW(w);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(1, containerW / DESIGN_W);
  const visualH = Math.round(DESIGN_H * scale);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: visualH,
        overflow: 'hidden',
        borderRadius: '0 0 12px 12px',
        border: '2px solid #4E6E81',
        borderTop: 'none',
        position: 'relative',
      }}
    >
      {/* Design canvas — always DESIGN_W wide, scaled down on small screens */}
      <div style={{
        width: DESIGN_W,
        height: DESIGN_H,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#EEF5F8',
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
        backgroundImage: [
          'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(120,149,178,0.15) 39px, rgba(120,149,178,0.15) 40px)',
          'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(120,149,178,0.15) 39px, rgba(120,149,178,0.15) 40px)',
        ].join(', '),
      }}>
        {blocks.map(block => (
          <FloorBlock
            key={block.id}
            block={block}
            isAdmin={isAdmin}
            layoutEditing={layoutEditing}
            containerW={DESIGN_W}
            containerH={DESIGN_H}
            scale={scale}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>

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
          pointerEvents: 'none',
        }}>
          {isAdmin ? '點上方「+ 新增區塊」開始建立' : '暫無區塊'}
        </div>
      )}
    </div>
  );
}
