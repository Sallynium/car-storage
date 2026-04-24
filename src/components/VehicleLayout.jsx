import { useAuth } from '../hooks/useAuth';
import { useBlocks } from '../hooks/useBlocks';
import FloorArea from './FloorArea';
import WallArea from './WallArea';

export default function VehicleLayout() {
  const { isAdmin } = useAuth();
  const { floorBlocks, wallBlocks, loading, addBlock, updateBlock, deleteBlock } = useBlocks();

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#3B82F6', fontSize: '16px' }}>
        載入中...
      </div>
    );
  }

  return (
    <div style={{
      overflowX: 'auto',
      overflowY: 'visible',
      WebkitOverflowScrolling: 'touch',
      padding: '16px',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: 'max-content',
      }}>
        {/* Vehicle cab — horizontal decorative bar at top */}
        <div style={{
          height: 44,
          width: '100%',
          backgroundColor: '#93C5FD',
          borderRadius: '12px 12px 4px 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #60A5FA',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#1E40AF',
            letterSpacing: '0.3em',
            userSelect: 'none',
          }}>
            ── 車頭 ──
          </span>
        </div>

        {/* Floor + Wall side by side */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <FloorArea
            blocks={floorBlocks}
            isAdmin={isAdmin}
            onAdd={() => addBlock('floor')}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
          <WallArea
            blocks={wallBlocks}
            isAdmin={isAdmin}
            onAdd={() => addBlock('wall')}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
        </div>
      </div>
    </div>
  );
}
