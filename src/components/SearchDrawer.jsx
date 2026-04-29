import { useState, useEffect, useRef } from 'react';

const VIEW_META = {
  floor: { label: '車廂底部', icon: '🚐', color: '#4E6E81' },
  left:  { label: '左側帆布', icon: '◀',  color: '#6B8E7F' },
  right: { label: '右側帆布', icon: '▶',  color: '#7F6B8E' },
  front: { label: '前壁',     icon: '🧱', color: '#8E7F6B' },
  cabin: { label: '副駕駛座', icon: '💺', color: '#6B7F8E' },
};

const VIEW_ORDER = ['floor', 'left', 'right', 'front', 'cabin'];

function getAllItems(container) {
  const results = [];
  const comps = container.compartments ?? [];
  if (comps.length > 0) {
    comps.forEach(comp => {
      (comp.items ?? []).forEach(item => {
        results.push({ compName: comp.name, item });
      });
    });
  } else {
    (container.items ?? []).forEach(item => {
      results.push({ compName: null, item });
    });
  }
  return results;
}

function matchesQuery(container, q) {
  if (!q) return true;
  const lower = q.toLowerCase();
  if ((container.name ?? '').toLowerCase().includes(lower)) return true;
  const comps = container.compartments ?? [];
  for (const comp of comps) {
    if (comp.name.toLowerCase().includes(lower)) return true;
    for (const item of comp.items ?? []) {
      if (item.name.toLowerCase().includes(lower)) return true;
      if ((item.notes ?? '').toLowerCase().includes(lower)) return true;
    }
  }
  for (const item of container.items ?? []) {
    if (item.name.toLowerCase().includes(lower)) return true;
    if ((item.notes ?? '').toLowerCase().includes(lower)) return true;
  }
  return false;
}

const typeIcon = { box: '🗃', basket: '🧺', hanging: '🪝', other: '📦' };

export default function SearchDrawer({ isOpen, onClose, containers, onSelectView }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filtered = containers.filter(c => matchesQuery(c, query));

  const grouped = VIEW_ORDER.reduce((acc, view) => {
    const viewContainers = filtered.filter(c => c.view === view);
    if (viewContainers.length > 0) acc[view] = viewContainers;
    return acc;
  }, {});

  const handleContainerClick = (view) => {
    onSelectView(view);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(44,51,51,0.4)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '320px',
        maxWidth: '90vw',
        backgroundColor: 'white',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E1D4BB',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
          backgroundColor: '#3D5A6C',
        }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋容器或品項..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              backgroundColor: 'transparent',
              color: 'white',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '18px', padding: 0, lineHeight: 1 }}
            >
              ✕
            </button>
          )}
          {!query && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '20px', padding: 0, lineHeight: 1 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#A0937D', fontSize: '14px' }}>
              {query ? `找不到「${query}」` : '沒有容器資料'}
            </div>
          )}

          {Object.entries(grouped).map(([view, viewContainers]) => {
            const meta = VIEW_META[view];
            return (
              <div key={view}>
                {/* View group header */}
                <div style={{
                  padding: '10px 20px 6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: meta.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F4F8FA',
                  borderTop: '1px solid #E8F0F4',
                }}>
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </div>

                {viewContainers.map(c => {
                  const icon = typeIcon[c.type] ?? '📦';
                  const items = getAllItems(c);
                  const parent = c.parentId ? containers.find(x => x.id === c.parentId) : null;

                  return (
                    <button
                      key={c.id}
                      onClick={() => handleContainerClick(view)}
                      style={{
                        width: '100%',
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        border: 'none',
                        borderBottom: '1px solid #F4F8FA',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'block',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '14px' }}>{icon}</span>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#2C3333', flex: 1 }}>
                          {c.name || '（未命名）'}
                        </span>
                        {c.color && (
                          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: c.color, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                        )}
                      </div>
                      {parent && (
                        <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '3px' }}>
                          📍 位於：{parent.name || '未命名'}
                        </div>
                      )}
                      {items.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6 }}>
                          {groupItemsByComp(items).map((line, i) => (
                            <div key={i} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {line}
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer summary */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid #E1D4BB', fontSize: '12px', color: '#A0937D', flexShrink: 0 }}>
          共 {filtered.length} 個容器
          {query && `（搜尋：${query}）`}
        </div>
      </div>
    </>
  );
}

function groupItemsByComp(items) {
  const map = new Map();
  items.forEach(({ compName, item }) => {
    const key = compName ?? '品項';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(`${item.name}×${item.quantity}`);
  });
  return Array.from(map.entries()).map(([comp, list]) =>
    comp === '品項' ? list.join('、') : `${comp}：${list.join('、')}`
  );
}
