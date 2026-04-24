import { useState } from 'react';

const COLORS = ['#BFDBFE', '#BAE6FD', '#A7F3D0', '#FEF3C7', '#FECACA', '#DDD6FE', '#FBD5E1', '#CFFAFE'];

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1.5px solid #D1D5DB',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: 'white',
};

const btnPrimary = {
  backgroundColor: '#1D4ED8',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '9px 18px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
};

const btnSecondary = {
  backgroundColor: '#F3F4F6',
  color: '#374151',
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

  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;
    const item = {
      id: crypto.randomUUID(),
      name: newItem.name.trim(),
      quantity: Number(newItem.quantity) || 0,
      notes: newItem.notes.trim(),
    };
    setItems([...items, item]);
    setNewItem({ name: '', quantity: 1, notes: '' });
    setShowAdd(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
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
          overflowY: 'auto',
          padding: '12px 20px 28px',
        }}
      >
        {/* drag bar */}
        <div style={{ width: '40px', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', margin: '0 auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#1E40AF', fontSize: '18px', fontWeight: 700 }}>
            {isAdmin ? '編輯區塊' : '品項清單'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9CA3AF', lineHeight: 1 }}>✕</button>
        </div>

        {/* Color picker — admin only */}
        {isAdmin && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontWeight: 500 }}>區塊顏色</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: c,
                    border: color === c ? '3px solid #1E40AF' : '2px solid #E5E7EB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Items list */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>品項列表</div>

          {items.length === 0 && (
            <div style={{ fontSize: '13px', color: '#9CA3AF', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>
              尚無品項
            </div>
          )}

          {items.map(item => (
            <div key={item.id} style={{
              backgroundColor: '#F8FAFF',
              border: '1px solid #DBEAFE',
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
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                      {item.name}
                      <span style={{ marginLeft: '8px', fontSize: '13px', color: '#6B7280', fontWeight: 400 }}>
                        × {item.quantity}
                      </span>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => startEdit(item)} style={{ background: '#EFF6FF', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '13px' }}>✏️</button>
                        <button onClick={() => deleteItem(item.id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
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
        </div>

        {/* Add item — admin only */}
        {isAdmin && !showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            style={{
              width: '100%',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              border: '1.5px dashed #93C5FD',
              borderRadius: '10px',
              padding: '11px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '14px',
            }}
          >
            + 新增品項
          </button>
        )}

        {isAdmin && showAdd && (
          <div style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '14px',
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

        {/* Footer button */}
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
  );
}
