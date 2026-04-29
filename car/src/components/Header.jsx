import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, isAdmin, login, logout, loginError } = useAuth();

  return (
    <>
      <header style={{
        backgroundColor: '#4E6E81',
        color: 'white',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        minHeight: '52px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🚐</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              工作車庫存
            </h1>
            {isAdmin && (
              <span style={{
                fontSize: '11px',
                backgroundColor: '#7895B2',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 600,
              }}>
                管理員
              </span>
            )}
          </div>
        </div>

        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!isAdmin && (
                <span style={{ fontSize: '12px', color: '#E1D4BB' }}>訪客</span>
              )}
              <button
                onClick={logout}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                }}
              >
                登出
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              style={{
                backgroundColor: '#F7FBFC',
                color: '#4E6E81',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              Google 登入
            </button>
          )}
        </div>
      </header>
      {loginError && (
        <div style={{
          backgroundColor: '#FFE4E6',
          color: '#9B1C1C',
          fontSize: '13px',
          padding: '8px 16px',
          textAlign: 'center',
        }}>
          登入錯誤：{loginError}
        </div>
      )}
    </>
  );
}
