import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBlocks } from '../hooks/useBlocks';
import FloorArea from './FloorArea';

export default function VehicleLayout() {
  const { isAdmin } = useAuth();
  const { floorBlocks, loading, addBlock, updateBlock, deleteBlock } = useBlocks();
  const [layoutEditing, setLayoutEditing] = useState(false);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#7895B2', fontSize: '16px' }}>
        載入中...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F7FBFC', minHeight: '100vh' }}>
      {/* Sticky admin toolbar */}
      {isAdmin && (
        <div style={{
          position: 'sticky',
          top: '52px',
          zIndex: 90,
          padding: '8px 16px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          backgroundColor: '#E1D4BB',
          borderBottom: '1px solid #A0937D',
        }}>
          <button
            onClick={() => setLayoutEditing(v => !v)}
            style={{
              backgroundColor: layoutEditing ? '#2C3333' : '#4E6E81',
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
          {!layoutEditing && (
            <button
              onClick={() => addBlock('floor')}
              style={{
                backgroundColor: '#7895B2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              + 新增區塊
            </button>
          )}
          {layoutEditing && (
            <span style={{ fontSize: '12px', color: '#6B7280' }}>可拖曳 / 縮放區塊</span>
          )}
        </div>
      )}

      {/* Content — centered on desktop, full width on mobile */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '16px',
      }}>
        {/* Cab bar — top, same width as floor */}
        <div style={{
          width: '100%',
          height: '42px',
          backgroundColor: '#7895B2',
          borderRadius: '12px 12px 0 0',
          border: '2px solid #4E6E81',
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 -2px 6px rgba(0,0,0,0.06)',
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#F7FBFC',
            letterSpacing: '0.3em',
            userSelect: 'none',
          }}>
            ── 車頭 ──
          </span>
        </div>

        {/* Floor area */}
        <FloorArea
          blocks={floorBlocks}
          isAdmin={isAdmin}
          layoutEditing={layoutEditing}
          onUpdate={updateBlock}
          onDelete={deleteBlock}
        />
      </div>
    </div>
  );
}
