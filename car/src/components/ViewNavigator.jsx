const VIEWS = [
  { key: 'floor',  label: '車廂底部', icon: '🚐' },
  { key: 'left',   label: '左側帆布', icon: '◀' },
  { key: 'right',  label: '右側帆布', icon: '▶' },
  { key: 'front',  label: '前壁',     icon: '🧱' },
  { key: 'cabin',  label: '副駕',     icon: '💺' },
];

const VIEW_COLORS = {
  floor: '#4E6E81',
  left:  '#6B8E7F',
  right: '#7F6B8E',
  front: '#8E7F6B',
  cabin: '#6B7F8E',
};

export default function ViewNavigator({ currentView, onViewChange, onSearchOpen }) {
  return (
    <nav style={{
      position: 'sticky',
      top: '52px',
      zIndex: 90,
      backgroundColor: '#D6C9AF',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'stretch',
    }}>
      {/* Scrollable view buttons */}
      <div
        className="hide-scrollbar"
        style={{
          display: 'flex',
          flex: 1,
          overflowX: 'auto',
          padding: '0 8px',
        }}
      >
        {VIEWS.map(({ key, label, icon }) => {
          const active = currentView === key;
          const activeColor = VIEW_COLORS[key];
          return (
            <button
              key={key}
              onClick={() => onViewChange(key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '8px 12px',
                border: 'none',
                borderBottom: active ? `3px solid ${activeColor}` : '3px solid transparent',
                backgroundColor: active ? 'rgba(255,255,255,0.35)' : 'transparent',
                color: active ? activeColor : '#5A4E3C',
                fontWeight: active ? 700 : 400,
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                minWidth: '56px',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Search button */}
      {onSearchOpen && (
        <button
          onClick={onSearchOpen}
          style={{
            padding: '0 16px',
            border: 'none',
            borderLeft: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#5A4E3C',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="物資總表搜尋"
        >
          🔍
        </button>
      )}
    </nav>
  );
}
