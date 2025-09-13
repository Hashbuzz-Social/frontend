<<<<<<< HEAD
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

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

  return (
    <Grid size={{ xs: 6, sm: 6, xl: 3, lg: 3 }}>
      <Card elevation={0} sx={cardStyle}>
        <SC.StyledCardStack>
          <SC.StyledCardHeader>
            <SC.StyledIconContainer>{startIcon}</SC.StyledIconContainer>
            <Typography variant='h6' component={SC.StyledCardTitle}>
              {title}
            </Typography>
          </SC.StyledCardHeader>

          <SC.StyledCardContent>
            {/* Image */}
            {content.image && (
              <SC.StyledImageContainer>
                <SC.StyledCardImage src={content.image} alt='' />
              </SC.StyledImageContainer>
            )}

            <SC.StyledTextContainer>
              {content.texts?.map((text, index) => (
                <Typography
                  key={index}
                  variant='body2'
                  component={SC.StyledCardText}
                  $isFirst={index === 0}
                >
                  {text}
                </Typography>
              ))}
            </SC.StyledTextContainer>
          </SC.StyledCardContent>
        </SC.StyledCardStack>
      </Card>
    </Grid>
  );
};
