import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBlocks } from '../hooks/useBlocks';
import FloorArea from './FloorArea';
import WallArea from './WallArea';

export default function VehicleLayout() {
  const { isAdmin } = useAuth();
  const { floorBlocks, wallBlocks, loading, addBlock, updateBlock, deleteBlock } = useBlocks();
  const [layoutEditing, setLayoutEditing] = useState(false);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#3B82F6', fontSize: '16px' }}>
        載入中...
      </div>
    );
  }

  return (
    <div>
      {isAdmin && (
        <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#EFF6FF', borderBottom: '1px solid #DBEAFE' }}>
          <button
            onClick={() => setLayoutEditing(v => !v)}
            style={{
              backgroundColor: layoutEditing ? '#1D4ED8' : '#E0EAFF',
              color: layoutEditing ? 'white' : '#1D4ED8',
              border: '1.5px solid #93C5FD',
              borderRadius: '8px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {layoutEditing ? '✓ 版面編輯中（點此結束）' : '⊞ 調整區塊位置'}
          </button>
          {layoutEditing && (
            <span style={{ fontSize: '12px', color: '#6B7280' }}>可拖曳 / 縮放區塊</span>
          )}
        </div>
      )}
    <div style={{
      overflowX: 'auto',
      overflowY: 'visible',
      WebkitOverflowScrolling: 'touch',
      padding: '16px',
      touchAction: layoutEditing ? 'none' : 'auto',
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
            layoutEditing={layoutEditing}
            onAdd={() => addBlock('floor')}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
          <WallArea
            blocks={wallBlocks}
            isAdmin={isAdmin}
            layoutEditing={layoutEditing}
            onAdd={() => addBlock('wall')}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
        </div>
      </div>
    </div>
    </div>
  );
}
