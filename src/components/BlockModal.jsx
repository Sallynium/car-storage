import { useState } from 'react';

const COLORS = [
  '#FEF9C3', '#DCFCE7', '#F3E8FF', '#FFE4E6',
  '#E0F2FE', '#FFEDD5', '#F0FDFA', '#F5F5F4',
  '#FFEDFA', '#ECFCCB',
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
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '9px 18px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
};

const btnSecondary = {
  backgroundColor: '#E1D4BB',
  color: '#2C3333',
  border: 'none',
  borderRadius: '8px',
  padding: '9px 18px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default function BlockModal({ block, isAdmin, onClose, onUpdate }) {
  const [items, setItems] = useState(block.items || []);
  const [color, setColor] = useState(block.color || COLORS[0]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, notes: '' });

  const handleSave = async () => {
    await onUpdate(block.id, { items, color });
    onClose();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, quantity: item.quantity, notes: item.notes || '' });
  };

  const confirmEdit = () => {
    setItems(items.map(i =>
      i.id === editingId ? { ...i, ...editForm, quantity: Number(editForm.quantity) } : i
    ));
    setEditingId(null);
  };

  const deleteItem = (id) => setItems(items.filter(i => i.id !== id));

  const addItem = () => {
    if (!newItem.name.trim()) return;
    setItems([...items, {
      id: crypto.randomUUID(),
      name: newItem.name.trim(),
      quantity: Number(newItem.quantity) || 0,
      notes: newItem.notes.trim(),
    }]);
    setNewItem({ name: '', quantity: 1, notes: '' });
    setShowAdd(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(44,51,51,0.5)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag bar */}
        <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '4px', backgroundColor: '#E1D4BB', borderRadius: '2px', margin: '0 auto 14px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#2C3333', fontSize: '18px', fontWeight: 700 }}>
              {isAdmin ? '編輯區塊' : '品項清單'}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#A0937D', lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px 8px' }}>
          {/* Color picker */}
          {isAdmin && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontWeight: 500 }}>區塊顏色</div>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: c,
                      border: color === c ? '3px solid #2C3333' : '1.5px solid #A0937D',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      padding: 0,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#2C3333', marginBottom: '10px' }}>品項列表</div>

          {items.length === 0 && (
            <div style={{ fontSize: '13px', color: '#A0937D', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>
              尚無品項
            </div>
          )}

          {items.map(item => (
            <div key={item.id} style={{
              backgroundColor: '#F7FBFC',
              border: '1px solid #E1D4BB',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '8px',
            }}>
              {editingId === item.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="品項名稱" style={inputStyle} />
                  <input type="number" value={editForm.quantity} onChange={e => setEditForm({ ...editForm, quantity: e.target.value })} placeholder="數量" style={inputStyle} min="0" />
                  <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} placeholder="備註（選填）" style={{ ...inputStyle, height: '64px', resize: 'none' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={confirmEdit} style={btnPrimary}>儲存</button>
                    <button onClick={() => setEditingId(null)} style={btnSecondary}>取消</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#2C3333' }}>
                      {item.name}
                      <span style={{ marginLeft: '8px', fontSize: '13px', color: '#6B7280', fontWeight: 400 }}>
                        × {item.quantity}
                      </span>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => startEdit(item)} style={{ background: '#E0F2FE', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '13px' }}>✏️</button>
                        <button onClick={() => deleteItem(item.id)} style={{ background: '#FFE4E6', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
                      </div>
                    )}
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '5px', lineHeight: 1.4 }}>
                      📝 {item.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add item */}
          {isAdmin && !showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              style={{
                width: '100%',
                backgroundColor: '#F7FBFC',
                color: '#4E6E81',
                border: '1.5px dashed #A0937D',
                borderRadius: '10px',
                padding: '11px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              + 新增品項
            </button>
          )}

          {isAdmin && showAdd && (
            <div style={{
              backgroundColor: '#F7FBFC',
              border: '1.5px solid #E1D4BB',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="品項名稱 *" style={inputStyle} autoFocus />
              <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} placeholder="數量" style={inputStyle} min="0" />
              <textarea value={newItem.notes} onChange={e => setNewItem({ ...newItem, notes: e.target.value })} placeholder="備註（選填）" style={{ ...inputStyle, height: '64px', resize: 'none' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={addItem} style={btnPrimary}>新增</button>
                <button onClick={() => { setShowAdd(false); setNewItem({ name: '', quantity: 1, notes: '' }); }} style={btnSecondary}>取消</button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div style={{
          padding: '10px 20px 28px',
          borderTop: '1px solid #E1D4BB',
          flexShrink: 0,
          backgroundColor: 'white',
          borderRadius: '0 0 0 0',
        }}>
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
