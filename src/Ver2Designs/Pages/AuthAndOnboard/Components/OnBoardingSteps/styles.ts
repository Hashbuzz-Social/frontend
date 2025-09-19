import { SxProps, Theme } from '@mui/system';

export const sideBar: SxProps<Theme> = {
  width: {
    xs: '100%',
    sm: '100%',
    md: '300px',
  },
  padding: {
    xs: '2rem',
    md: '2.5rem',
  },
  background: {
    xs: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
    md: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
  },
  borderRadius: {
    xs: 0,
    md: '20px 0 0 20px',
  },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background:
      'linear-gradient(90deg, transparent 0%, rgba(82, 101, 255, 0.2) 50%, transparent 100%)',
  },
};

export const sideBarLogoContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: {
    xs: 'flex-start',
    md: 'center',
  },
  justifyContent: 'flex-start',
  flexDirection: {
    xs: 'column',
    md: 'row',
  },
  paddingBottom: {
    xs: '2rem',
    md: '3rem',
  },
  marginBottom: {
    xs: '1.5rem',
    md: '2rem',
  },
  borderBottom: '1px solid rgba(82, 101, 255, 0.1)',
  '& p': {
    margin: {
      xs: '1.5rem 0 0 0',
      md: '0 0 0 1rem',
    },
    fontSize: {
      xs: '0.95rem',
      md: '1rem',
    },
    fontWeight: 500,
    color: '#4a5568',
    lineHeight: 1.6,
    background: 'linear-gradient(135deg, #5265ff 0%, #667eea 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
};

export const stepsList: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  '& ul': {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    width: '100%',
    '& li': {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '16px',
      lineHeight: 1.5,
      fontSize: '1rem',
      fontWeight: 600,
      position: 'relative',
      color: '#6b7280',
      background: 'rgba(255, 255, 255, 0.7)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(82, 101, 255, 0.15)',
        background: 'rgba(255, 255, 255, 0.9)',
      },
      '& .list-bullet': {
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        fontSize: '0.875rem',
        fontWeight: 700,
        color: '#64748b',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
      },
      '& .list-name': {
        flex: 1,
        transition: 'color 0.3s ease',
      },
      '&.active': {
        color: '#1e293b',
        background:
          'linear-gradient(135deg, rgba(82, 101, 255, 0.08) 0%, rgba(102, 126, 234, 0.08) 100%)',
        borderColor: 'rgba(82, 101, 255, 0.3)',
        '& .list-bullet': {
          background: 'linear-gradient(135deg, #5265ff 0%, #667eea 100%)',
          color: '#ffffff',
          borderColor: '#5265ff',
          boxShadow: '0 4px 12px rgba(82, 101, 255, 0.3)',
        },
        '& .list-name': {
          background: 'linear-gradient(135deg, #5265ff 0%, #667eea 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        height: '24px',
        width: '2px',
        background:
          'linear-gradient(180deg, rgba(82, 101, 255, 0.3) 0%, rgba(82, 101, 255, 0.1) 100%)',
        left: '39px',
        top: '80px',
        borderRadius: '1px',
      },
      '&:last-child::after': {
        display: 'none',
      },
    },
  },
};
