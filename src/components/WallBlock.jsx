import { useState, useRef, useEffect } from 'react';
import BlockModal from './BlockModal';

const MIN_H = 60;

export default function WallBlock({ block, isAdmin, layoutEditing, onUpdate, onDelete }) {
  const [height, setHeight] = useState(block.height ?? 120);
  const [modalOpen, setModalOpen] = useState(false);
  const resizeRef = useRef(null);

  useEffect(() => {
    if (!resizeRef.current) setHeight(block.height ?? 120);
  }, [block.height]);

  const onResizePointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeRef.current = { startPY: e.clientY, startH: height, finalH: height };
  };

  const onResizePointerMove = (e) => {
    if (!resizeRef.current) return;
    const dy = e.clientY - resizeRef.current.startPY;
    const nh = Math.max(MIN_H, resizeRef.current.startH + dy);
    resizeRef.current.finalH = nh;
    setHeight(nh);
  };

  const onResizePointerUp = () => {
    if (!resizeRef.current) return;
    onUpdate(block.id, { height: resizeRef.current.finalH });
    resizeRef.current = null;
  };

  const items = block.items || [];

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: block.color || '#F3E3D0',
          border: '1.5px solid rgba(33,52,72,0.15)',
          borderRadius: '8px',
          padding: '8px 10px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
          flexShrink: 0,
        }}
      >
        {/* Admin toolbar */}
        {isAdmin && !layoutEditing && (
          <div style={{ position: 'absolute', top: 3, right: 3, display: 'flex', gap: '3px', zIndex: 1 }}>
            <button
              onClick={e => { e.stopPropagation(); setModalOpen(true); }}
              style={iconBtn('#547792')}
              title="編輯"
            >✏️</button>
            <button
              onClick={e => { e.stopPropagation(); if (window.confirm('確定刪除此區塊？')) onDelete(block.id); }}
              style={iconBtn('#8B4444')}
              title="刪除"
            >🗑️</button>
          </div>
        )}

        {/* Items */}
        <div style={{ marginTop: (isAdmin && !layoutEditing) ? '22px' : '0', overflow: 'hidden' }}>
          {items.length > 0 ? items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '4px',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#213448',
            }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </span>
              <span style={{ fontWeight: 700, flexShrink: 0 }}>×{item.quantity}</span>
            </div>
          )) : (
            <div style={{ fontSize: '12px', color: '#D2C4B4', fontStyle: 'italic' }}>
              {isAdmin ? '點 ✏️ 新增品項' : '（空）'}
            </div>
          )}
        </div>

        {/* Resize handle (height only) */}
        {isAdmin && layoutEditing && (
          <div
            onPointerDown={onResizePointerDown}
            onPointerMove={onResizePointerMove}
            onPointerUp={onResizePointerUp}
            onPointerCancel={() => { resizeRef.current = null; }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 16,
              height: 16,
              cursor: 's-resize',
              backgroundColor: 'rgba(33,52,72,0.35)',
              borderRadius: '3px',
              touchAction: 'none',
            }}
          />
        )}
      </div>

      {modalOpen && (
        <BlockModal
          block={block}
          isAdmin={isAdmin}
          onClose={() => setModalOpen(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}

const iconBtn = (bg) => ({
  backgroundColor: bg,
  border: 'none',
  borderRadius: '5px',
  padding: '2px 5px',
  cursor: 'pointer',
  fontSize: '11px',
  color: 'white',
  lineHeight: 1.4,
});
