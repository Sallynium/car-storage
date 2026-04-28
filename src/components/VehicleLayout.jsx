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
      <div style={{ padding: '60px', textAlign: 'center', color: '#547792', fontSize: '16px' }}>
        載入中...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#EAE0CF', minHeight: '100vh' }}>
      {isAdmin && (
        <div style={{
          padding: '8px 16px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          backgroundColor: '#D2C4B4',
          borderBottom: '1px solid #AACDDC',
        }}>
          <button
            onClick={() => setLayoutEditing(v => !v)}
            style={{
              backgroundColor: layoutEditing ? '#213448' : '#547792',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {layoutEditing ? '✓ 結束版面編輯' : '⊞ 調整區塊位置'}
          </button>
          {layoutEditing && (
            <span style={{ fontSize: '12px', color: '#547792' }}>可拖曳 / 縮放區塊</span>
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
          gap: '14px',
          alignItems: 'flex-start',
          minWidth: 'max-content',
        }}>
          {/* Vehicle cab — vertical decorative strip on the left (front of van) */}
          <div style={{
            width: 36,
            alignSelf: 'stretch',
            backgroundColor: '#94B4C1',
            borderRadius: '10px 4px 4px 10px',
            border: '2px solid #547792',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '2px 0 6px rgba(0,0,0,0.08)',
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#213448',
              writingMode: 'vertical-rl',
              letterSpacing: '0.25em',
              userSelect: 'none',
            }}>
              車頭
            </span>
          </div>

          {/* Floor + Wall side by side */}
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
  );
}
