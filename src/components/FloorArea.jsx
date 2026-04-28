import FloorBlock from './FloorBlock';

const W = 640;
const H = 480;

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

export default function FloorArea({ blocks, isAdmin, layoutEditing, onAdd, onUpdate, onDelete }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '15px', color: '#1E40AF', fontWeight: 700 }}>
          🗺️ 車廂平面圖
        </h2>
        {isAdmin && (
          <button onClick={onAdd} style={addBtnStyle}>+ 新增區塊</button>
        )}
      </div>

      <div style={{
        width: W,
        height: H,
        position: 'relative',
        backgroundColor: '#DBEAFE',
        borderRadius: '10px',
        border: '2px solid #93C5FD',
        overflow: 'hidden',
        /* subtle grid */
        backgroundImage: [
          'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(147,197,253,0.5) 39px, rgba(147,197,253,0.5) 40px)',
          'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(147,197,253,0.5) 39px, rgba(147,197,253,0.5) 40px)',
        ].join(', '),
      }}>
        {blocks.map(block => (
          <FloorBlock
            key={block.id}
            block={block}
            isAdmin={isAdmin}
            layoutEditing={layoutEditing}
            containerW={W}
            containerH={H}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}

        {blocks.length === 0 && !isAdmin && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#93C5FD',
            fontSize: '14px',
          }}>
            暫無區塊
          </div>
        )}
      </div>
    </div>
  );
}
