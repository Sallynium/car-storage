import { useRef, useState, useEffect } from 'react';
import ContainerCard from './ContainerCard';

export const DESIGN_W = 448;
export const DESIGN_H = 700;

const VIEW_STYLES = {
  floor: {
    backgroundColor: '#EEF5F8',
    backgroundImage: [
      'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(78,110,129,0.12) 39px, rgba(78,110,129,0.12) 40px)',
      'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(78,110,129,0.12) 39px, rgba(78,110,129,0.12) 40px)',
    ].join(', '),
  },
  left: {
    backgroundColor: '#EBF4EF',
    backgroundImage: [
      'repeating-linear-gradient(90deg, rgba(107,142,127,0.12) 0px, rgba(107,142,127,0.12) 1px, transparent 1px, transparent 28px)',
      'linear-gradient(to bottom, #8DB4A4 0px, #8DB4A4 18px, transparent 18px)',
    ].join(', '),
  },
  right: {
    backgroundColor: '#F0EBF7',
    backgroundImage: [
      'repeating-linear-gradient(90deg, rgba(127,107,142,0.12) 0px, rgba(127,107,142,0.12) 1px, transparent 1px, transparent 28px)',
      'linear-gradient(to bottom, #A08DB4 0px, #A08DB4 18px, transparent 18px)',
    ].join(', '),
  },
  front: {
    backgroundColor: '#F5EFE6',
    backgroundImage: [
      'repeating-linear-gradient(0deg, rgba(142,127,107,0.18) 0, rgba(142,127,107,0.18) 1px, transparent 1px, transparent 40px)',
      'repeating-linear-gradient(0deg, transparent 0px, transparent 20px, rgba(142,127,107,0.08) 20px, rgba(142,127,107,0.08) 21px)',
      'repeating-linear-gradient(90deg, rgba(142,127,107,0.1) 0, rgba(142,127,107,0.1) 1px, transparent 1px, transparent 60px)',
    ].join(', '),
  },
  cabin: {
    backgroundColor: '#2C3333',
    backgroundImage: [
      'radial-gradient(ellipse 160px 100px at 50% 85%, rgba(60,70,70,0.9) 0%, transparent 100%)',
      'linear-gradient(to bottom, rgba(50,60,60,0.8) 0%, transparent 30%)',
    ].join(', '),
  },
};

const EMPTY_LABELS = {
  floor: '點上方「+ 新增容器」開始建立',
  left: '點上方「+ 新增容器」在左側帆布掛物',
  right: '點上方「+ 新增容器」在右側帆布掛物',
  front: '點上方「+ 新增容器」在前壁放置',
  cabin: '點上方「+ 新增容器」在副駕空間放置',
};

export default function CanvasArea({ view, containers, allContainers, isAdmin, layoutEditing, onUpdate, onDelete }) {
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
  const bgStyle = VIEW_STYLES[view] ?? VIEW_STYLES.floor;

  const cabinTextColor = view === 'cabin' ? 'rgba(255,255,255,0.4)' : '#7895B2';

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: visualH,
        overflow: 'hidden',
        borderRadius: view === 'floor' ? '0 0 12px 12px' : '8px',
        border: '2px solid rgba(78,110,129,0.3)',
        borderTop: view === 'floor' ? 'none' : '2px solid rgba(78,110,129,0.3)',
        position: 'relative',
      }}
    >
      <div style={{
        width: DESIGN_W,
        height: DESIGN_H,
        position: 'absolute',
        top: 0,
        left: 0,
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
        ...bgStyle,
      }}>
        {containers.map(c => (
          <ContainerCard
            key={c.id}
            container={c}
            allContainers={allContainers}
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

      {containers.length === 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: cabinTextColor,
          fontSize: '14px',
          opacity: 0.7,
          pointerEvents: 'none',
          padding: '20px',
          textAlign: 'center',
        }}>
          {isAdmin ? EMPTY_LABELS[view] : '暫無容器'}
        </div>
      )}
    </div>
  );
}
