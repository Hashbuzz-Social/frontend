import { useGetAccountTokensQuery } from '@/API/mirrorNodeAPI';
import PrimaryButtonV2 from '@/components/Buttons/PrimaryButtonV2';
import { useAppDispatch, useAppSelector } from '@/Store/store';
import {
  Box,
  Button,
  Container,
  Fade,
  Paper,
  Slide,
  Typography,
} from '@mui/material';
import { markAllTokensAssociated } from '../authStoreSlice';
import SectionHeader from '../Components/SectionHeader/SectionHeader';
import { TokenListItem } from './components';
import * as styles from './styles';

const AssociateTokens = () => {
  const {
    wallet: { address },
    token: { tokens },
  } = useAppSelector(state => state.auth.userAuthAndOnBoardSteps);
  const { data: accountTokens } = useGetAccountTokensQuery(address as string, {
    skip: !address,
  });
  const dispatch = useAppDispatch();

  const handleSkipOrContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(markAllTokensAssociated());
  };

  return (
    <Box sx={styles.associateTokensStyles}>
      <Container maxWidth='xl' sx={styles.containerStyles}>
        <Fade in timeout={600}>
          <Box sx={styles.mainContentWrapper}>
            <Box sx={styles.headerSection}>
              <SectionHeader
                title='Associate reward tokens'
                subtitle='Select and associate tokens to unlock rewards and enhance your portfolio'
              />
            </Box>

            <Slide direction='up' in timeout={800}>
              <Paper elevation={0} sx={styles.tokensPaper}>
                <Box sx={styles.tokensHeader}>
                  <Typography variant='h5' sx={styles.tokensTitle}>
                    Available Tokens
                  </Typography>
                  <Typography variant='body2' sx={styles.tokensSubtitle}>
                    {tokens.length} token{tokens.length !== 1 ? 's' : ''}{' '}
                    available for association
                  </Typography>
                </Box>

                <Box sx={styles.tokensGrid}>
                  {tokens.map((token, index) => (
                    <Fade in timeout={600 + index * 100} key={index}>
                      <Box>
                        <TokenListItem
                          token={token}
                          userAccountTokens={accountTokens}
                        />
                      </Box>
                    </Fade>
                  ))}
                </Box>
              </Paper>
            </Slide>
          </Box>
        </Fade>

        <Fade in timeout={1000}>
          <Box sx={styles.actionFooter}>
            <Button
              onClick={handleSkipOrContinue}
              variant='outlined'
              size='large'
              sx={styles.skipButton}
            >
              Skip for now
            </Button>
            <PrimaryButtonV2
              onClick={handleSkipOrContinue}
              color='primary'
              aria-label='Proceed with token association'
              sx={styles.proceedButton}
            >
              <span>Continue</span>
            </PrimaryButtonV2>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AssociateTokens;
