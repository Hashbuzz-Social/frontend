import { SxProps, Theme } from '@mui/material';

export const associateTokensStyles: SxProps<Theme> = {
  minHeight: '100dvh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
};

export const containerStyles: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  padding: {
    xs: '20px 16px',
    sm: '32px 24px',
    md: '48px 40px',
    lg: '64px 60px',
  },
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  gap: {
    xs: '24px',
    md: '32px',
  },
};

export const mainContentWrapper: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: {
    xs: '24px',
    md: '32px',
  },
};

export const headerSection: SxProps<Theme> = {
  textAlign: {
    xs: 'center',
    md: 'left',
  },
  marginBottom: {
    xs: '16px',
    md: '24px',
  },
};

export const tokensPaper: SxProps<Theme> = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: {
    xs: '16px',
    md: '24px',
  },
  border: '1px solid rgba(255, 255, 255, 0.2)',
  // boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderColor: 'rgba(107, 114, 128, 0.3)',
  padding: {
    xs: '20px',
    sm: '24px',
    md: '32px',
  },
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  },
};

export const tokensHeader: SxProps<Theme> = {
  marginBottom: {
    xs: '20px',
    md: '28px',
  },
  paddingBottom: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
};

export const tokensTitle: SxProps<Theme> = {
  fontWeight: 600,
  fontSize: {
    xs: '1.25rem',
    sm: '1.5rem',
    md: '1.75rem',
  },
  color: '#1a1a1a',
  marginBottom: '8px',
  letterSpacing: '-0.025em',
};

export const tokensSubtitle: SxProps<Theme> = {
  color: '#6b7280',
  fontSize: {
    xs: '0.875rem',
    md: '1rem',
  },
  fontWeight: 400,
};

export const tokensGrid: SxProps<Theme> = {
  display: 'grid',
  gap: {
    xs: '12px',
    sm: '16px',
    md: '20px',
  },
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(auto-fit, minmax(300px, 1fr))',
    lg: 'repeat(auto-fit, minmax(350px, 1fr))',
  },
};

export const actionFooter: SxProps<Theme> = {
  display: 'flex',
  justifyContent: {
    xs: 'center',
    sm: 'space-between',
  },
  alignItems: 'center',
  gap: {
    xs: '16px',
    md: '24px',
  },
  padding: {
    xs: '20px 0',
    md: '32px 0',
  },
  marginTop: 'auto',
  flexDirection: {
    xs: 'column-reverse',
    sm: 'row',
  },
};

export const skipButton: SxProps<Theme> = {
  borderColor: 'rgba(107, 114, 128, 0.3)',
  color: '#6b7280',
  padding: {
    xs: '12px 24px',
    md: '14px 32px',
  },
  fontSize: {
    xs: '0.9rem',
    md: '1rem',
  },
  fontWeight: 500,
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  minWidth: {
    xs: '160px',
    sm: 'auto',
  },

  '&:hover': {
    borderColor: 'rgba(107, 114, 128, 0.5)',
    background: 'rgba(107, 114, 128, 0.04)',
    transform: 'translateY(-1px)',
  },
};

export const proceedButton: SxProps<Theme> = {
  padding: {
    xs: '12px 32px',
    md: '14px 40px',
  },
  fontSize: {
    xs: '0.9rem',
    md: '1rem',
  },
  fontWeight: 600,
  borderRadius: '12px',
  textTransform: 'none',
  minWidth: {
    xs: '160px',
    sm: 'auto',
  },
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
  },

  '&:active': {
    transform: 'translateY(0)',
  },
};

// Legacy styles for backward compatibility
export const associateTokenWrapper: SxProps<Theme> = {
  ...mainContentWrapper,
};

export const listContainer: SxProps<Theme> = {
  ...tokensPaper,
};

export const associateTokenFooter: SxProps<Theme> = {
  ...actionFooter,
};
