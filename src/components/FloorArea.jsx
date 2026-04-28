import FloorBlock from './FloorBlock';

const W = 380;
const H = 700;

export default function FloorArea({ blocks, isAdmin, layoutEditing, onAdd, onUpdate, onDelete }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '14px', color: '#213448', fontWeight: 700 }}>
          車廂地板
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
            + 新增區塊
          </button>
        )}
      </div>

      <div style={{
        width: W,
        height: H,
        position: 'relative',
        backgroundColor: '#C8DDE8',
        borderRadius: '8px',
        border: '2px solid #81A6C6',
        overflow: 'hidden',
        backgroundImage: [
          'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(81,166,198,0.2) 39px, rgba(81,166,198,0.2) 40px)',
          'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(81,166,198,0.2) 39px, rgba(81,166,198,0.2) 40px)',
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

        {blocks.length === 0 && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#81A6C6',
            fontSize: '13px',
          }}>
            {isAdmin ? '點「新增區塊」開始建立' : '暫無區塊'}
          </div>
        )}
      </div>
    </div>
  );
}
