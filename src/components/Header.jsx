import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, isAdmin, login, logout, loginError } = useAuth();

  return (
    <>
    <header style={{
      backgroundColor: '#213448',
      color: 'white',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '22px' }}>🚐</span>
        <div>
          <h1 style={{ margin: 0, fontSize: '17px', fontWeight: 700, lineHeight: 1.2 }}>
            工作車庫存
          </h1>
          {isAdmin && (
            <span style={{
              fontSize: '11px',
              backgroundColor: '#34699A',
              padding: '1px 7px',
              borderRadius: '9999px',
              fontWeight: 600,
            }}>
              管理員模式
            </span>
          )}
        </div>
      </div>

      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', opacity: 0.8, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
              <div style={{ fontSize: '11px', color: isAdmin ? '#94B4C1' : '#F3E3D0', fontWeight: 600 }}>
                {isAdmin ? '✓ 管理員' : '訪客'}
              </div>
            </div>
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
              backgroundColor: '#EAE0CF',
              color: '#213448',
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
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
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
