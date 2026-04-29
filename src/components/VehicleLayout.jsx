import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useContainers } from '../hooks/useContainers';
import { useView } from '../hooks/useView';
import ViewNavigator from './ViewNavigator';
import CanvasArea from './CanvasArea';
import SearchDrawer from './SearchDrawer';

export default function VehicleLayout() {
  const { isAdmin } = useAuth();
  const { containers, loading, visibleContainers, addContainer, updateContainer, deleteContainer } = useContainers();
  const { currentView, setCurrentView } = useView();
  const [layoutEditing, setLayoutEditing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  if (loading) {
    return (
      <>
        <ViewNavigator currentView={currentView} onViewChange={setCurrentView} onSearchOpen={() => setSearchOpen(true)} />
        <div style={{ padding: '60px', textAlign: 'center', color: '#7895B2', fontSize: '16px' }}>
          載入中...
        </div>
      </>
    );
  }

  const visible = visibleContainers(currentView);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* View navigator + search */}
      <ViewNavigator
        currentView={currentView}
        onViewChange={v => { setCurrentView(v); setLayoutEditing(false); }}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Admin toolbar */}
      {isAdmin && (
        <div style={{
          position: 'sticky',
          top: '104px',
          zIndex: 80,
          padding: '8px 16px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          backgroundColor: 'var(--color-toolbar)',
          borderBottom: '1px solid #A0937D',
        }}>
          <button
            onClick={() => setLayoutEditing(v => !v)}
            style={{
              backgroundColor: layoutEditing ? '#2C3333' : 'var(--view-floor)',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            }}
          >
            {layoutEditing ? '✓ 結束版面編輯' : '⊞ 調整容器位置'}
          </button>
          {!layoutEditing && (
            <button
              onClick={() => addContainer(currentView)}
              style={{
                backgroundColor: '#7895B2',
                color: 'white', border: 'none', borderRadius: '8px',
                padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              }}
            >
              + 新增容器
            </button>
          )}
          {layoutEditing && (
            <span style={{ fontSize: '12px', color: '#5A4E3C' }}>可拖曳 / 縮放容器</span>
          )}
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}>
        {/* Cab bar — floor view only */}
        {currentView === 'floor' && (
          <div style={{
            width: '100%', height: '42px',
            backgroundColor: '#7895B2',
            borderRadius: '12px 12px 0 0',
            border: '2px solid #4E6E81',
            borderBottom: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 -2px 6px rgba(0,0,0,0.06)',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#F7FBFC', letterSpacing: '0.3em', userSelect: 'none' }}>
              ── 車頭 ──
            </span>
          </div>
        )}

        {/* Container count label for non-floor views */}
        {currentView !== 'floor' && visible.length > 0 && (
          <div style={{ padding: '10px 0 8px', fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
            {visible.length} 個容器
          </div>
        )}

        <CanvasArea
          view={currentView}
          containers={visible}
          allContainers={containers}
          isAdmin={isAdmin}
          layoutEditing={layoutEditing}
          onUpdate={updateContainer}
          onDelete={deleteContainer}
        />
      </div>

      {/* Search drawer */}
      <SearchDrawer
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        containers={containers}
        onSelectView={v => { setCurrentView(v); }}
      />
    </div>
  );
}
