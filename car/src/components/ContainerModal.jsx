import { useState } from 'react';

const COLORS = [
  '#FEF9C3', '#DCFCE7', '#F3E8FF', '#FFE4E6',
  '#E0F2FE', '#FFEDD5', '#F0FDFA', '#F5F5F4',
  '#FFEDFA', '#ECFCCB',
];

const VIEWS = [
  { key: 'floor', label: '車廂底部' },
  { key: 'left',  label: '左側帆布' },
  { key: 'right', label: '右側帆布' },
  { key: 'front', label: '前壁' },
  { key: 'cabin', label: '副駕駛座' },
];

const TYPES = [
  { key: 'box',     label: '🗃 箱子' },
  { key: 'basket',  label: '🧺 籃子' },
  { key: 'hanging', label: '🪝 掛物' },
  { key: 'other',   label: '📦 其他' },
];

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1.5px solid #A0937D',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: 'white',
  color: '#2C3333',
};

const btnPrimary = {
  backgroundColor: '#4E6E81',
  color: 'white', border: 'none',
  borderRadius: '8px', padding: '9px 18px',
  cursor: 'pointer', fontSize: '14px', fontWeight: 600,
};

const btnSecondary = {
  backgroundColor: '#E1D4BB',
  color: '#2C3333', border: 'none',
  borderRadius: '8px', padding: '9px 18px',
  cursor: 'pointer', fontSize: '14px',
};

function initCompartments(container) {
  if (container.compartments?.length > 0) return container.compartments;
  if (container.items?.length > 0) {
    return [{ id: crypto.randomUUID(), name: '主格', items: container.items }];
  }
  return [];
}

function ItemEditor({ items, onChange }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const addItem = () => {
    if (!newItem.name.trim()) return;
    onChange([...items, {
      id: crypto.randomUUID(),
      name: newItem.name.trim(),
      quantity: Number(newItem.quantity) || 0,
      notes: newItem.notes.trim(),
    }]);
    setNewItem({ name: '', quantity: 1, notes: '' });
    setShowAdd(false);
  };

  const confirmEdit = (id) => {
    onChange(items.map(i => i.id === id ? { ...i, ...editForm, quantity: Number(editForm.quantity) } : i));
    setEditingId(null);
  };

  return (
    <div style={{ marginLeft: '12px' }}>
      {items.map(item => (
        <div key={item.id} style={{
          backgroundColor: 'rgba(255,255,255,0.7)',
          border: '1px solid #E1D4BB',
          borderRadius: '8px',
          padding: '8px 10px',
          marginBottom: '6px',
        }}>
          {editingId === item.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="品項名稱" style={inputStyle} />
              <input type="number" value={editForm.quantity} onChange={e => setEditForm({ ...editForm, quantity: e.target.value })} placeholder="數量" style={inputStyle} min="0" />
              <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} placeholder="備註（選填）" style={{ ...inputStyle, height: '56px', resize: 'none' }} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => confirmEdit(item.id)} style={{ ...btnPrimary, padding: '6px 14px', fontSize: '13px' }}>儲存</button>
                <button onClick={() => setEditingId(null)} style={{ ...btnSecondary, padding: '6px 14px', fontSize: '13px' }}>取消</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#2C3333' }}>{item.name}</span>
                <span style={{ marginLeft: '8px', fontSize: '13px', color: '#6B7280' }}>×{item.quantity}</span>
                {item.notes && <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '3px' }}>📝 {item.notes}</div>}
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginLeft: '8px' }}>
                <button onClick={() => { setEditingId(item.id); setEditForm({ name: item.name, quantity: item.quantity, notes: item.notes || '' }); }} style={{ background: '#E0F2FE', border: 'none', borderRadius: '5px', padding: '3px 7px', cursor: 'pointer', fontSize: '12px' }}>✏️</button>
                <button onClick={() => onChange(items.filter(i => i.id !== item.id))} style={{ background: '#FFE4E6', border: 'none', borderRadius: '5px', padding: '3px 7px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {showAdd ? (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1.5px solid #E1D4BB', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '6px' }}>
          <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="品項名稱 *" style={inputStyle} autoFocus />
          <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} placeholder="數量" style={inputStyle} min="0" />
          <textarea value={newItem.notes} onChange={e => setNewItem({ ...newItem, notes: e.target.value })} placeholder="備註（選填）" style={{ ...inputStyle, height: '56px', resize: 'none' }} />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={addItem} style={{ ...btnPrimary, padding: '6px 14px', fontSize: '13px' }}>新增</button>
            <button onClick={() => { setShowAdd(false); setNewItem({ name: '', quantity: 1, notes: '' }); }} style={{ ...btnSecondary, padding: '6px 14px', fontSize: '13px' }}>取消</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          style={{ width: '100%', backgroundColor: 'transparent', color: '#4E6E81', border: '1.5px dashed #A0937D', borderRadius: '8px', padding: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}
        >
          + 新增品項
        </button>
      )}
    </div>
  );
}

export default function ContainerModal({ container, allContainers, isAdmin, onClose, onUpdate }) {
  const [name, setName] = useState(container.name || '');
  const [type, setType] = useState(container.type || 'other');
  const [color, setColor] = useState(container.color || COLORS[0]);
  const [view, setView] = useState(container.view || 'floor');
  const [compartments, setCompartments] = useState(() => initCompartments(container));
  const [parentId, setParentId] = useState(container.parentId || '');
  const [isStoredInside, setIsStoredInside] = useState(container.isStoredInside ?? false);
  const [w, setW] = useState(Math.round(container.w ?? 160));
  const [h, setH] = useState(Math.round(container.h ?? 110));
  const [newCompName, setNewCompName] = useState('');
  const [addingComp, setAddingComp] = useState(false);
  const [renamingCompId, setRenamingCompId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const handleViewChange = (v) => {
    setView(v);
    setParentId('');
  };

  const handleSave = async () => {
    await onUpdate(container.id, {
      name: name.trim(),
      type,
      color,
      view,
      compartments,
      parentId: parentId || null,
      isStoredInside,
      w,
      h,
    });
    onClose();
  };

  const addCompartment = () => {
    if (!newCompName.trim()) return;
    setCompartments([...compartments, { id: crypto.randomUUID(), name: newCompName.trim(), items: [] }]);
    setNewCompName('');
    setAddingComp(false);
  };

  const updateCompItems = (compId, items) => {
    setCompartments(compartments.map(c => c.id === compId ? { ...c, items } : c));
  };

  const deleteComp = (compId) => {
    setCompartments(compartments.filter(c => c.id !== compId));
  };

  const startRenameComp = (comp) => {
    setRenamingCompId(comp.id);
    setRenameValue(comp.name);
  };

  const confirmRenameComp = (compId) => {
    if (renameValue.trim()) {
      setCompartments(compartments.map(c => c.id === compId ? { ...c, name: renameValue.trim() } : c));
    }
    setRenamingCompId(null);
  };

  // Eligible parents: same view, not self, not already a child of this container
  const eligibleParents = allContainers.filter(c =>
    c.view === view &&
    c.id !== container.id &&
    c.parentId !== container.id
  );

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(44,51,51,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: 'white', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '520px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Drag bar + header */}
        <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '4px', backgroundColor: '#E1D4BB', borderRadius: '2px', margin: '0 auto 14px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#2C3333', fontSize: '18px', fontWeight: 700 }}>
              {isAdmin ? '編輯容器' : container.name || '容器詳情'}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#A0937D', lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px 8px' }}>
          {isAdmin ? (
            <>
              {/* ── 基本資料 ── */}
              <SectionLabel>基本資料</SectionLabel>

              <div style={{ marginBottom: '12px' }}>
                <FieldLabel>容器名稱</FieldLabel>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="例：黃色鐵箱" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>類型</FieldLabel>
                  <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                    {TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <FieldLabel>所屬視角</FieldLabel>
                  <select value={view} onChange={e => handleViewChange(e.target.value)} style={inputStyle}>
                    {VIEWS.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <FieldLabel>顏色</FieldLabel>
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      style={{ width: '28px', height: '28px', backgroundColor: c, border: color === c ? '3px solid #2C3333' : '1.5px solid #A0937D', borderRadius: '7px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>寬度 (px)</FieldLabel>
                  <input type="number" value={w} onChange={e => setW(Number(e.target.value))} min="80" style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <FieldLabel>高度 (px)</FieldLabel>
                  <input type="number" value={h} onChange={e => setH(Number(e.target.value))} min="60" style={inputStyle} />
                </div>
              </div>

              {/* ── 格層管理 ── */}
              <SectionLabel>格層管理</SectionLabel>

              {compartments.map(comp => (
                <div key={comp.id} style={{ backgroundColor: '#F4F8FA', border: '1px solid #D6C9AF', borderRadius: '10px', padding: '10px 12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px' }}>📂</span>
                    {renamingCompId === comp.id ? (
                      <>
                        <input value={renameValue} onChange={e => setRenameValue(e.target.value)} style={{ ...inputStyle, padding: '4px 8px', fontSize: '13px', flex: 1 }} autoFocus onKeyDown={e => e.key === 'Enter' && confirmRenameComp(comp.id)} />
                        <button onClick={() => confirmRenameComp(comp.id)} style={{ ...btnPrimary, padding: '4px 10px', fontSize: '12px' }}>確認</button>
                      </>
                    ) : (
                      <>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#2C3333', flex: 1 }}>{comp.name}</span>
                        <button onClick={() => startRenameComp(comp)} style={{ background: '#E0F2FE', border: 'none', borderRadius: '5px', padding: '3px 7px', cursor: 'pointer', fontSize: '12px' }}>改名</button>
                        <button onClick={() => deleteComp(comp.id)} style={{ background: '#FFE4E6', border: 'none', borderRadius: '5px', padding: '3px 7px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
                      </>
                    )}
                  </div>
                  <ItemEditor items={comp.items ?? []} onChange={(items) => updateCompItems(comp.id, items)} />
                </div>
              ))}

              {addingComp ? (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input value={newCompName} onChange={e => setNewCompName(e.target.value)} placeholder="格層名稱，例：前格" style={{ ...inputStyle, flex: 1 }} autoFocus onKeyDown={e => e.key === 'Enter' && addCompartment()} />
                  <button onClick={addCompartment} style={{ ...btnPrimary, padding: '9px 14px', whiteSpace: 'nowrap' }}>新增</button>
                  <button onClick={() => { setAddingComp(false); setNewCompName(''); }} style={{ ...btnSecondary, padding: '9px 14px' }}>取消</button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingComp(true)}
                  style={{ width: '100%', backgroundColor: 'transparent', color: '#4E6E81', border: '1.5px dashed #A0937D', borderRadius: '10px', padding: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}
                >
                  + 新增格層
                </button>
              )}

              {/* ── 堆疊設定 ── */}
              <SectionLabel>堆疊設定</SectionLabel>

              <div style={{ marginBottom: '10px' }}>
                <FieldLabel>放置位置</FieldLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="radio" checked={!parentId} onChange={() => setParentId('')} />
                    獨立放置（地面 / 牆面）
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="radio" checked={!!parentId} onChange={() => eligibleParents.length > 0 && setParentId(eligibleParents[0].id)} />
                    疊在其他容器上方
                  </label>
                </div>
                {!!parentId && (
                  <select
                    value={parentId}
                    onChange={e => setParentId(e.target.value)}
                    style={{ ...inputStyle, marginTop: '8px' }}
                  >
                    {eligibleParents.map(c => (
                      <option key={c.id} value={c.id}>{c.name || '（未命名）'}</option>
                    ))}
                  </select>
                )}
              </div>

              {!!parentId && (
                <div style={{ marginBottom: '16px' }}>
                  <FieldLabel>收納方式</FieldLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      <input type="radio" checked={!isStoredInside} onChange={() => setIsStoredInside(false)} />
                      顯示在主畫布（只標示從屬關係）
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      <input type="radio" checked={isStoredInside} onChange={() => setIsStoredInside(true)} />
                      收納至內部（從主畫布隱藏）
                    </label>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ── 訪客：只讀模式 ── */
            <>
              {compartments.length > 0 ? compartments.map(comp => (
                <div key={comp.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span>📂</span>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#2C3333' }}>{comp.name}</span>
                  </div>
                  {(comp.items ?? []).length === 0 && (
                    <div style={{ fontSize: '13px', color: '#A0937D', fontStyle: 'italic', paddingLeft: '20px' }}>空</div>
                  )}
                  {(comp.items ?? []).map(item => (
                    <div key={item.id} style={{ backgroundColor: '#F7FBFC', border: '1px solid #E1D4BB', borderRadius: '8px', padding: '8px 12px', marginBottom: '6px', marginLeft: '20px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#2C3333' }}>
                        {item.name} <span style={{ fontWeight: 400, color: '#6B7280' }}>×{item.quantity}</span>
                      </div>
                      {item.notes && <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>📝 {item.notes}</div>}
                    </div>
                  ))}
                </div>
              )) : (
                container.items?.length > 0 ? container.items.map(item => (
                  <div key={item.id} style={{ backgroundColor: '#F7FBFC', border: '1px solid #E1D4BB', borderRadius: '8px', padding: '8px 12px', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#2C3333' }}>
                      {item.name} <span style={{ fontWeight: 400, color: '#6B7280' }}>×{item.quantity}</span>
                    </div>
                    {item.notes && <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>📝 {item.notes}</div>}
                  </div>
                )) : (
                  <div style={{ fontSize: '13px', color: '#A0937D', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>尚無品項</div>
                )
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px 28px', borderTop: '1px solid #E1D4BB', flexShrink: 0, backgroundColor: 'white' }}>
          {isAdmin ? (
            <button onClick={handleSave} style={{ ...btnPrimary, width: '100%', padding: '13px' }}>
              儲存所有變更
            </button>
          ) : (
            <button onClick={onClose} style={{ ...btnSecondary, width: '100%', padding: '13px' }}>
              關閉
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '13px', fontWeight: 700, color: '#4E6E81', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', paddingBottom: '4px', borderBottom: '1px solid #E1D4BB' }}>
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: 500 }}>{children}</div>;
}
