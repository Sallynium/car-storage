import { useState, useRef, useEffect } from 'react';
import ContainerModal from './ContainerModal';

const MIN_W = 80;
const MIN_H = 60;

const LAYER_SHADOWS = {
  1: 'none',
  2: '2px -2px 0 #ccc, 4px -4px 0 #bbb',
  3: '2px -2px 0 #bbb, 4px -4px 0 #aaa, 6px -6px 0 #999',
};

function getLayerStyle(layer) {
  const l = Math.min(layer ?? 1, 3);
  return {
    boxShadow: LAYER_SHADOWS[l] ?? LAYER_SHADOWS[3],
    transform: l > 1 ? `translateY(-${(l - 1) * 4}px)` : 'none',
  };
}

// Flatten all items across compartments + legacy items for preview
function getPreviewLines(container) {
  const lines = [];
  const comps = container.compartments ?? [];
  if (comps.length > 0) {
    comps.forEach(comp => {
      const itemStr = (comp.items ?? []).map(i => `${i.name}×${i.quantity}`).join('、');
      if (itemStr) lines.push(`${comp.name}：${itemStr}`);
    });
  } else {
    (container.items ?? []).forEach(i => lines.push(`${i.name} ×${i.quantity}`));
  }
  return lines;
}

export default function ContainerCard({
  container, allContainers, isAdmin, layoutEditing,
  containerW, containerH, scale, onUpdate, onDelete,
}) {
  const [pos, setPos] = useState({ x: container.x ?? 20, y: container.y ?? 20 });
  const [size, setSize] = useState({ w: container.w ?? 160, h: container.h ?? 110 });
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const cardRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  useEffect(() => {
    if (!dragRef.current && !resizeRef.current) {
      setPos({ x: container.x ?? 20, y: container.y ?? 20 });
      setSize({ w: container.w ?? 160, h: container.h ?? 110 });
    }
  }, [container.x, container.y, container.w, container.h]);

  /* ---- Drag ---- */
  const onCardPointerDown = (e) => {
    if (!isAdmin || !layoutEditing) return;
    if (e.target.closest('[data-nondrag]')) return;
    e.preventDefault();
    cardRef.current.setPointerCapture(e.pointerId);
    dragRef.current = {
      startPX: e.clientX, startPY: e.clientY,
      startBX: pos.x, startBY: pos.y,
      moved: false, finalX: pos.x, finalY: pos.y,
    };
  };

  const onCardPointerMove = (e) => {
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

  const onCardPointerUp = () => {
    if (!dragRef.current) return;
    if (dragRef.current.moved) {
      onUpdate(container.id, { x: dragRef.current.finalX, y: dragRef.current.finalY });
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
    };
  };

  const onResizePointerMove = (e) => {
    if (!resizeRef.current) return;
    const dx = (e.clientX - resizeRef.current.startPX) / scale;
    const dy = (e.clientY - resizeRef.current.startPY) / scale;
    setSize({
      w: Math.max(MIN_W, resizeRef.current.startW + dx),
      h: Math.max(MIN_H, resizeRef.current.startH + dy),
    });
  };

  const onResizePointerUp = () => {
    if (!resizeRef.current) return;
    onUpdate(container.id, { w: size.w, h: size.h });
    resizeRef.current = null;
  };

  const parent = container.parentId ? allContainers.find(c => c.id === container.parentId) : null;
  const children = allContainers.filter(c => c.parentId === container.id && !c.isStoredInside);
  const previewLines = getPreviewLines(container);
  const comps = container.compartments ?? [];
  const legacyItems = container.items ?? [];
  const layerStyle = getLayerStyle(container.layer);

  const typeIcon = { box: '🗃', basket: '🧺', hanging: '🪝', other: '📦' };
  const icon = typeIcon[container.type] ?? '📦';

  return (
    <>
      <div
        ref={cardRef}
        onPointerDown={layoutEditing ? onCardPointerDown : undefined}
        onPointerMove={layoutEditing ? onCardPointerMove : undefined}
        onPointerUp={layoutEditing ? onCardPointerUp : undefined}
        onPointerCancel={layoutEditing ? () => { dragRef.current = null; } : undefined}
        onClick={!layoutEditing ? () => setModalOpen(true) : undefined}
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: size.w,
          height: size.h,
          backgroundColor: container.color || '#E0F2FE',
          border: '1.5px solid rgba(78,110,129,0.25)',
          borderRadius: '8px',
          padding: '6px 8px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          cursor: layoutEditing ? 'grab' : 'pointer',
          userSelect: 'none',
          touchAction: layoutEditing ? 'none' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          ...layerStyle,
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, minHeight: 0 }}>
          <span style={{ fontSize: '12px', flexShrink: 0 }}>{icon}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#2C3333',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {container.name || '（未命名）'}
          </span>
          {isAdmin && !layoutEditing && (
            <div data-nondrag style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
              <button
                data-nondrag
                onClick={e => { e.stopPropagation(); setModalOpen(true); }}
                style={iconBtn('#7895B2')}
              >✏️</button>
              <button
                data-nondrag
                onClick={e => { e.stopPropagation(); if (window.confirm(`確定刪除「${container.name || '此容器'}」？`)) onDelete(container.id); }}
                style={iconBtn('#A0937D')}
              >🗑️</button>
            </div>
          )}
        </div>

        {/* Parent tag */}
        {parent && (
          <div style={{ fontSize: '9px', color: '#6B7280', flexShrink: 0, lineHeight: 1.4, marginTop: '1px' }}>
            📍 位於：{parent.name || '未命名'}
          </div>
        )}

        {/* Content area */}
        <div style={{ flex: 1, overflow: 'hidden', marginTop: '3px' }}>
          {expanded ? (
            // Expanded: full compartments
            <div style={{ height: '100%', overflowY: 'auto' }}>
              {comps.length > 0 ? comps.map(comp => (
                <div key={comp.id} style={{ marginBottom: '4px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#4E6E81', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span>📂</span> {comp.name}
                  </div>
                  {(comp.items ?? []).map(item => (
                    <div key={item.id} style={{ fontSize: '10px', color: '#2C3333', paddingLeft: '12px', lineHeight: 1.5 }}>
                      • {item.name} ×{item.quantity}
                      {item.notes ? <span style={{ color: '#6B7280' }}> ({item.notes})</span> : null}
                    </div>
                  ))}
                  {(comp.items ?? []).length === 0 && (
                    <div style={{ fontSize: '10px', color: '#A0937D', paddingLeft: '12px', fontStyle: 'italic' }}>空</div>
                  )}
                </div>
              )) : legacyItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#2C3333', lineHeight: 1.55 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 1 }}>{item.name}</span>
                  <span style={{ fontWeight: 700, flexShrink: 0, color: '#4E6E81', marginLeft: '4px' }}>×{item.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            // Collapsed: preview lines
            <div style={{ overflow: 'hidden', height: '100%' }}>
              {previewLines.length > 0 ? previewLines.map((line, i) => (
                <div key={i} style={{
                  fontSize: '10px',
                  color: '#2C3333',
                  lineHeight: 1.55,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {line}
                </div>
              )) : (
                <div style={{ fontSize: '10px', color: '#A0937D', fontStyle: 'italic' }}>
                  {isAdmin && !layoutEditing ? '點 ✏️ 新增內容' : '（空）'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Children tag */}
        {children.length > 0 && (
          <div style={{ fontSize: '9px', color: '#6B7280', flexShrink: 0, lineHeight: 1.4, marginTop: '2px' }}>
            ▲ 上方：{children.map(c => c.name || '未命名').join('、')}
          </div>
        )}

        {/* Expand toggle */}
        {!layoutEditing && (comps.length > 0 || legacyItems.length > 0) && (
          <button
            data-nondrag
            onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '9px',
              color: '#7895B2',
              padding: '2px 0 0',
              textAlign: 'right',
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            {expanded ? '收合▲' : '展開▼'}
          </button>
        )}

        {/* Resize handle */}
        {isAdmin && layoutEditing && (
          <div
            data-nondrag
            onPointerDown={onResizePointerDown}
            onPointerMove={onResizePointerMove}
            onPointerUp={onResizePointerUp}
            onPointerCancel={() => { resizeRef.current = null; }}
            style={{
              position: 'absolute',
              bottom: 2, right: 2,
              width: 16, height: 16,
              cursor: 'nwse-resize',
              backgroundColor: 'rgba(78,110,129,0.4)',
              borderRadius: '3px',
              touchAction: 'none',
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {modalOpen && (
        <ContainerModal
          container={container}
          allContainers={allContainers}
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
  borderRadius: '4px',
  padding: '2px 4px',
  cursor: 'pointer',
  fontSize: '10px',
  color: 'white',
  lineHeight: 1.4,
  flexShrink: 0,
});
