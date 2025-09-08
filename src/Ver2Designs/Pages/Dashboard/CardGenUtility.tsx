import { Box, Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import React from 'react';
import { cardStyle } from '../../../components/Card/Card.styles';

interface CardGenUtilityProps {
  title: string;
  content: {
    image?: string;
    texts: string[];
  };
  startIcon: React.ReactNode;
}

export const CardGenUtility = ({
  title,
  content,
  startIcon,
}: CardGenUtilityProps) => {
  // const theme = useTheme();
  // const aboveXs = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Grid size={{ xs: 6, sm: 6, xl: 3, lg: 3 }}>
      <Card elevation={0} sx={cardStyle}>
        <Stack
          direction='column'
          spacing={2.5}
          sx={{ height: '100%', width: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                color: '#667eea',
                fontSize: { xs: 28, sm: 32 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {startIcon}
            </Box>
            <Typography
              variant='h6'
              sx={{
                color: '#1e293b',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              flexGrow: 1,
            }}
          >
            {/* Image on the left */}
            {content.image && (
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: 40, sm: 50 },
                  height: { xs: 40, sm: 50 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: '#f8fafc',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <img
                  src={content.image}
                  alt=''
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}

            <Stack
              direction='column'
              spacing={0.8}
              sx={{ flexGrow: 1, minWidth: 0 }}
            >
              {content.texts?.map((text, index) => (
                <Typography
                  key={index}
                  variant='body2'
                  sx={{
                    color: index === 0 ? '#475569' : '#64748b',
                    fontSize: { xs: '0.75rem', sm: '0.825rem' },
                    lineHeight: 1.4,
                    fontWeight: index === 0 ? 500 : 400,
                    wordBreak: 'break-word',
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Card>
    </Grid>
  );
};
