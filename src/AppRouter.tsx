import React from 'react';
import { RouterProvider } from 'react-router-dom';
// import SimpleSessionTest from './components/SimpleSessionTest';
// import TokenRefreshDebugger from './components/TokenRefreshDebugger';
import { useAppSessionManager } from './hooks';
import router from './Router.tsx';
import StyledComponentTheme from './theme/Theme';

const AppRouter = () => {
  const sessionManager = useAppSessionManager();

  // Expose to window for debugging (development only)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as { sessionManager?: typeof sessionManager }).sessionManager =
      sessionManager;
  }

  // Show loading screen while app is initializing
  if (sessionManager.shouldShowSplash || !sessionManager.isAppReady) {
    return (
      <StyledComponentTheme>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>Loading...</div>
          {process.env.NODE_ENV === 'development' && (
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              hasInitialized: {sessionManager.hasInitialized ? '✅' : '❌'} |{' '}
              isRefreshing: {sessionManager.isRefreshing ? '⏳' : '✅'} |{' '}
              isAppReady: {sessionManager.isAppReady ? '✅' : '❌'}
            </div>
          )}
        </div>
      </StyledComponentTheme>
    );
  }

  return (
    <StyledComponentTheme>
      {/* Temporarily disabled debugger */}
      {/* {process.env.NODE_ENV === 'development' && (
        <>
          <TokenRefreshDebugger />
        </>
      )} */}
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

export default React.memo(AppRouter);
