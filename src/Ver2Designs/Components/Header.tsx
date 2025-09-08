import { useAppSelector } from '@/Store/store';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import HashbuzzLogo from '../../SVGR/HashbuzzLogo';
import HeaderMenu from './HeaderMenu';

const Header = () => {
  const { currentUser } = useAppSelector(s => s.app);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [active, setActive] = useState<'dashboard' | 'leaderboard'>(
    'dashboard'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuItemClick = (item: 'dashboard' | 'leaderboard') => {
    setActive(item);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    {
      key: 'dashboard' as const,
      label: 'Dashboard',
      icon: <DashboardIcon sx={{ fontSize: 20 }} />,
    },
    {
      key: 'leaderboard' as const,
      label: 'Leaderboard',
      icon: <LeaderboardIcon sx={{ fontSize: 20 }} />,
    },
  ];

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#fff',
          zIndex: 1100,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: { xs: '12px 16px', sm: '12px 24px' },
          }}
        >
          {/* Left side - Logo and Desktop Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <HashbuzzLogo height={isMobile ? 32 : 40} />

            {/* Desktop Menu Items */}
            {!isMobile && (
              <Box
                sx={{ display: 'flex', alignItems: 'center', ml: 8, gap: 1 }}
              >
                {menuItems.map(item => (
                  <Button
                    key={item.key}
                    onClick={() => setActive(item.key)}
                    startIcon={item.icon}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      px: 2,
                      py: 1,
                      color: active === item.key ? '#667eea' : '#64748b',
                      bgcolor: active === item.key ? '#f8fafc' : 'transparent',
                      fontWeight: active === item.key ? 600 : 400,
                      border:
                        active === item.key
                          ? '1px solid #e2e8f0'
                          : '1px solid transparent',
                      '&:hover': {
                        bgcolor: active === item.key ? '#f1f5f9' : '#f8fafc',
                        borderColor: '#e2e8f0',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          {/* Right side - HeaderMenu and Mobile Hamburger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && <HeaderMenu />}

            {isMobile && (
              <IconButton
                onClick={toggleMobileMenu}
                sx={{
                  color: '#64748b',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                  },
                }}
                aria-label='Open menu'
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* Mobile Sidebar */}
      <Drawer
        anchor='right'
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: '70%',
            maxWidth: '300px',
            bgcolor: '#ffffff',
            borderRadius: '16px 0 0 16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          },
        }}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
            },
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Sidebar Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <HashbuzzLogo height={32} />
            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                color: '#64748b',
                '&:hover': { bgcolor: '#f8fafc' },
              }}
              aria-label='Close menu'
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User Info Section */}
          {currentUser && (
            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {currentUser.profile_image_url ? (
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #e2e8f0',
                    }}
                  >
                    <img
                      src={currentUser.profile_image_url}
                      alt='Profile'
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#667eea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1.2rem',
                    }}
                  >
                    {currentUser.personal_twitter_handle
                      ?.charAt(0)
                      ?.toUpperCase() || 'U'}
                  </Box>
                )}
                <Box>
                  <Typography
                    variant='body1'
                    sx={{ fontWeight: 600, color: '#1e293b' }}
                  >
                    @{currentUser.personal_twitter_handle}
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#64748b' }}>
                    {currentUser.name || 'User'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Navigation Items */}
          <Box sx={{ flexGrow: 1, py: 2 }}>
            <List sx={{ px: 2 }}>
              {menuItems.map(item => (
                <ListItem key={item.key} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleMenuItemClick(item.key)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      px: 2,
                      bgcolor: active === item.key ? '#f8fafc' : 'transparent',
                      border:
                        active === item.key
                          ? '1px solid #e2e8f0'
                          : '1px solid transparent',
                      '&:hover': {
                        bgcolor: '#f8fafc',
                        borderColor: '#e2e8f0',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Box
                      sx={{
                        color: active === item.key ? '#667eea' : '#64748b',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: active === item.key ? 600 : 400,
                        color: active === item.key ? '#667eea' : '#64748b',
                        fontSize: '0.95rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Bottom Section with HeaderMenu */}
          <Box sx={{ p: 3, borderTop: '1px solid #f1f5f9' }}>
            <HeaderMenu />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
