import WallBlock from './WallBlock';

const addBtnStyle = {
  backgroundColor: '#3B82F6',
  color: 'white',
  border: 'none',
  padding: '6px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 600,
};

export default function WallArea({ blocks, isAdmin, onAdd, onUpdate, onDelete }) {
  return (
    <div style={{ width: 240, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '15px', color: '#1E40AF', fontWeight: 700 }}>
          📌 右側牆壁
        </h2>
        {isAdmin && (
          <button onClick={onAdd} style={addBtnStyle}>+ 新增</button>
        )}
      </div>

      <div style={{
        width: 240,
        minHeight: 480,
        backgroundColor: '#EFF6FF',
        borderRadius: '10px',
        border: '2px solid #93C5FD',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {blocks.length === 0 && (
          <div style={{ fontSize: '13px', color: '#93C5FD', textAlign: 'center', paddingTop: '24px', fontStyle: 'italic' }}>
            {isAdmin ? '按「新增」建立掛載區塊' : '（暫無掛載品項）'}
          </div>
        )}
        {blocks.map(block => (
          <WallBlock
            key={block.id}
            block={block}
            isAdmin={isAdmin}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
