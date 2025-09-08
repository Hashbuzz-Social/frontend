import { useLazyGetTwitterBizHandleQuery } from '@/API/integration';
import { useAppSelector } from '@/Store/store';
import { Close, LinkOff } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BusinessIcon from '@mui/icons-material/Business';
import { Alert, Box, Button, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { images } from '../../../IconsPng/images';
import XPlatformIcon from '../../../SVGR/XPlatformIcon';
import { getErrorMessage, isAllowedToCmapigner } from '../../../comman/helpers';
import Balances from './Balances';
import CampaignList from './CampaignList';
import { CardGenUtility } from './CardGenUtility';
import * as SC from './styled';

const Dashboard = () => {
  const { currentUser } = useAppSelector(s => s.app);
  const [getTwitterBizHandle, { isLoading: isLoadingBizHandle }] =
    useLazyGetTwitterBizHandleQuery();
  const location = useLocation();
  const [showBanner, setShowBanner] = React.useState(true);

  const bizHandleIntegration = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        event.preventDefault();
        const { url } = await getTwitterBizHandle().unwrap();
        window.location.href = url;
      } catch (err) {
        console.error('Error during brand handle integration:', err);
        toast.error(
          getErrorMessage(err) ??
            'Error while requesting personal handle integration.'
        );
      }
    },
    [getTwitterBizHandle]
  );

  const errorFromState = location.state?.error;

  return (
    <React.Fragment>
      {errorFromState && (
        <Alert severity='error' sx={{ mb: 2, mt: 2 }}>
          {errorFromState}
        </Alert>
      )}

      {/* Promo Banner */}
      {showBanner && (
        <Box
          sx={{
            background: 'linear-gradient(135deg, #5265FF 0%, #243AE9 100%)',
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            mb: 3,
            position: 'relative',
            overflow: 'hidden',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: { xs: 'auto', sm: 80 },
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 0 },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.1,
            },
          }}
        >
          {/* Left side: Image + Text */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              zIndex: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <img
              src={images.speaker}
              alt='speaker_image'
              style={{
                width: 'clamp(60px, 15vw, 100px)',
                height: 'auto',
                maxHeight: '60px',
                objectFit: 'contain',
              }}
            />

            <Box>
              <Typography
                variant='body2'
                sx={{
                  opacity: 0.9,
                  mb: 0.5,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                Tap into Web3 audiences
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 700,
                  mb: { xs: 0, sm: 1 },
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Have a brand? Want to promote it?
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              zIndex: 1,
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'center', md: 'flex-end' },
            }}
          >
            <Button
              variant='contained'
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                color: '#667eea',
                fontWeight: 600,
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Become a Campaigner
            </Button>
            <IconButton
              onClick={() => setShowBanner(false)}
              sx={{
                color: 'rgba(255,255,255,0.8)',
                size: { xs: 'small', sm: 'medium' },
                '&:hover': { color: 'white' },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      )}
      <SC.StyledCardGenUtility>
        {/* Hedera Account ID Card */}
        <CardGenUtility
          startIcon={
            <AccountBalanceWalletIcon color='inherit' fontSize={'inherit'} />
          }
          title={'Hedera Account ID'}
          content={{
            texts: [
              currentUser?.hedera_wallet_id || 'Not Connected',
              'Make sure to fund your account with some HBARs to run campaigns',
            ],
          }}
        />

        {/* Personal Twitter Handle Card */}
        <CardGenUtility
          startIcon={<XPlatformIcon color='inherit' size={30} />}
          title={'Personal 𝕏 Account'}
          content={{
            image: currentUser?.profile_image_url,
            texts: [
              `@${currentUser?.personal_twitter_handle || 'Not Connected'}`,
              currentUser?.name ? `${currentUser.name}` : 'Personal Account',
            ],
          }}
        />

        {/* Brand Twitter Handle Card */}
        <CardGenUtility
          startIcon={<BusinessIcon color='inherit' fontSize={'inherit'} />}
          title={'Brand 𝕏 Account'}
          content={{
            texts: currentUser?.business_twitter_handle
              ? [
                  `@${currentUser.business_twitter_handle}`,
                  'Brand Account Connected',
                ]
              : [
                  'Not Connected',
                  'Connect your brand account to create campaigns',
                ],
          }}
        />

        {/* Account Balance Card */}
        <Balances />
      </SC.StyledCardGenUtility>

      {/* Brand Account Connection Button (if not connected) */}
      {!currentUser?.business_twitter_handle && (
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            paddingY: 4,
          }}
        >
          <Button
            endIcon={<LinkOff fontSize='inherit' />}
            variant='contained'
            onClick={bizHandleIntegration}
            disabled={
              isLoadingBizHandle || !isAllowedToCmapigner(currentUser?.role)
            }
            sx={{
              bgcolor: '#667eea',
              color: 'white',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '0.9rem',
              '&:hover': {
                bgcolor: '#5a67d8',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                bgcolor: '#a0aec0',
                color: 'white',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isLoadingBizHandle ? 'Connecting...' : 'Connect Brand Account'}
          </Button>
        </Box>
      )}

      {/* Campaign List section */}
      <CampaignList />
    </React.Fragment>
  );
};

export default Dashboard;
