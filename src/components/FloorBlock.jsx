import { useState, useRef, useEffect } from 'react';
import BlockModal from './BlockModal';

const MIN_W = 80;
const MIN_H = 60;

export default function FloorBlock({ block, isAdmin, layoutEditing, containerW, containerH, scale = 1, onUpdate, onDelete }) {
  const [pos, setPos] = useState({ x: block.x ?? 20, y: block.y ?? 20 });
  const [size, setSize] = useState({ w: block.width ?? 140, h: block.height ?? 100 });
  const [modalOpen, setModalOpen] = useState(false);

  const blockRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  useEffect(() => {
    if (!dragRef.current && !resizeRef.current) {
      setPos({ x: block.x ?? 20, y: block.y ?? 20 });
      setSize({ w: block.width ?? 140, h: block.height ?? 100 });
    }
  }, [block.x, block.y, block.width, block.height]);

  /* ---- Drag ---- */
  const onBlockPointerDown = (e) => {
    if (!isAdmin || !layoutEditing) return;
    if (e.target.closest('[data-nondrag]')) return;
    e.preventDefault();
    blockRef.current.setPointerCapture(e.pointerId);
    dragRef.current = {
      startPX: e.clientX, startPY: e.clientY,
      startBX: pos.x, startBY: pos.y,
      moved: false, finalX: pos.x, finalY: pos.y,
    };
  };

  const onBlockPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startPX) / scale;
    const dy = (e.clientY - dragRef.current.startPY) / scale;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true;
    if (!dragRef.current.moved) return;
    const nx = Math.max(0, Math.min(containerW - size.w, dragRef.current.startBX + dx));
    const ny = Math.max(0, Math.min(containerH - size.h, dragRef.current.startBY + dy));
    dragRef.current.finalX = nx;
    dragRef.current.finalY = ny;
    setPos({ x: nx, y: ny });
  };

  const onBlockPointerUp = () => {
    if (!dragRef.current) return;
    if (dragRef.current.moved) {
      onUpdate(block.id, { x: dragRef.current.finalX, y: dragRef.current.finalY });
    } else {
      setModalOpen(true);
    }
    dragRef.current = null;
  };

  /* ---- Resize ---- */
  const onResizePointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeRef.current = {
      startPX: e.clientX, startPY: e.clientY,
      startW: size.w, startH: size.h,
      finalW: size.w, finalH: size.h,
    };
  };

  const onResizePointerMove = (e) => {
    if (!resizeRef.current) return;
    const dx = (e.clientX - resizeRef.current.startPX) / scale;
    const dy = (e.clientY - resizeRef.current.startPY) / scale;
    const nw = Math.max(MIN_W, resizeRef.current.startW + dx);
    const nh = Math.max(MIN_H, resizeRef.current.startH + dy);
    resizeRef.current.finalW = nw;
    resizeRef.current.finalH = nh;
    setSize({ w: nw, h: nh });
  };

  const onResizePointerUp = () => {
    if (!resizeRef.current) return;
    onUpdate(block.id, { width: resizeRef.current.finalW, height: resizeRef.current.finalH });
    resizeRef.current = null;
  };

  const items = block.items || [];

  return (
    <>
      <div
        ref={blockRef}
        onPointerDown={layoutEditing ? onBlockPointerDown : undefined}
        onPointerMove={layoutEditing ? onBlockPointerMove : undefined}
        onPointerUp={layoutEditing ? onBlockPointerUp : undefined}
        onPointerCancel={layoutEditing ? () => { dragRef.current = null; } : undefined}
        onClick={!layoutEditing ? () => setModalOpen(true) : undefined}
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: size.w,
          height: size.h,
          backgroundColor: block.color || '#E0F2FE',
          border: '1.5px solid rgba(78,110,129,0.25)',
          borderRadius: '8px',
          padding: '6px 8px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          cursor: layoutEditing ? 'grab' : 'pointer',
          userSelect: 'none',
          touchAction: layoutEditing ? 'none' : 'auto',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        }}
      >
        {/* Admin edit/delete toolbar — only when NOT in layout edit mode */}
        {isAdmin && !layoutEditing && (
          <div data-nondrag style={{ position: 'absolute', top: 3, right: 3, display: 'flex', gap: '3px', zIndex: 1 }}>
            <button
              data-nondrag
              onClick={e => { e.stopPropagation(); setModalOpen(true); }}
              style={iconBtn('#7895B2')}
            >✏️</button>
            <button
              data-nondrag
              onClick={e => { e.stopPropagation(); if (window.confirm('確定刪除此區塊？')) onDelete(block.id); }}
              style={iconBtn('#A0937D')}
            >🗑️</button>
          </div>
        )}

        {/* Items */}
        <div style={{ marginTop: (isAdmin && !layoutEditing) ? '22px' : '0', overflow: 'hidden', height: '100%' }}>
          {items.length > 0 ? items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '4px',
              fontSize: '11px',
              lineHeight: '1.55',
              color: '#2C3333',
            }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 1 }}>
                {item.name}
              </span>
              <span style={{ fontWeight: 700, flexShrink: 0, color: '#4E6E81' }}>×{item.quantity}</span>
            </div>
          )) : (
            <div style={{ fontSize: '11px', color: '#6B7280', fontStyle: 'italic', paddingTop: '2px' }}>
              {isAdmin && !layoutEditing ? '點 ✏️ 新增品項' : '（空）'}
            </div>
          )}
        </div>

        {/* Resize handle — only in layout edit mode */}
        {isAdmin && layoutEditing && (
          <div
            data-nondrag
            onPointerDown={onResizePointerDown}
            onPointerMove={onResizePointerMove}
            onPointerUp={onResizePointerUp}
            onPointerCancel={() => { resizeRef.current = null; }}
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 16,
              height: 16,
              cursor: 'nwse-resize',
              backgroundColor: 'rgba(78,110,129,0.4)',
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
