import WallBlock from './WallBlock';

export default function WallArea({ blocks, isAdmin, layoutEditing, onAdd, onUpdate, onDelete }) {
  return (
    <div style={{ width: 200, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '14px', color: '#213448', fontWeight: 700 }}>
          側牆掛載
        </h2>
        {isAdmin && (
          <button
            onClick={onAdd}
            style={{
              backgroundColor: '#547792',
              color: 'white',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            + 新增
          </button>
        )}
      </div>

      <div style={{
        width: 200,
        minHeight: 700,
        backgroundColor: '#F3E3D0',
        borderRadius: '8px',
        border: '2px solid #D2C4B4',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {blocks.length === 0 && (
          <div style={{ fontSize: '12px', color: '#D2C4B4', textAlign: 'center', paddingTop: '24px', fontStyle: 'italic' }}>
            {isAdmin ? '按「新增」建立掛載區塊' : '（暫無掛載品項）'}
          </div>
        )}
        {blocks.map(block => (
          <WallBlock
            key={block.id}
            block={block}
            isAdmin={isAdmin}
            layoutEditing={layoutEditing}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
