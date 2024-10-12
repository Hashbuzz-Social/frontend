import { Box, Button, Container, Stack, Typography, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useStore } from "@store/hooks";
import HashbuzzIcon from "@svgr/HashbuzzIcon";
import HashbuzzLogoMainTransparent from "@svgr/HashbuzzLogo";
import { useConnectHandler, useSessions } from "@wallet/hooks";
import useAsyncStatusWrapper from "@wallet/services/useAsyncStatusWrapper";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LandingPageContent } from "./Compoents";
import AuthFlowCard from "./Compoents/AuthenticationFlowCard/AuthFlowCard";
import MenuItemsList from "./Compoents/MenuItesmsList";
import LandingPageSpeedDaial from "./Compoents/MenuItesmsList/SpeedDial";
import * as SC from "./styled";

const Landing = () => {
  const theme = useTheme();
  const { ping, auth } = useStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { state, dAppConnector } = useSessions();
  const conenctToWallet = useConnectHandler();
  const { modalWrapper } = useAsyncStatusWrapper();
  const { isLoading, extensions, selectedSigner } = state || {};

  const isReadyToAuthenticate = useMemo(() => !!(dAppConnector && selectedSigner), [dAppConnector, selectedSigner]);
  const pairedAccount = state?.selectedSigner?.getAccountId().toString();

  // Menu button click listener
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handeWalletConnect = async (id?: string) => {
    await modalWrapper(() => conenctToWallet(id));
  };

  const menuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    if (ping.status && (pairedAccount || auth?.auth)) {
      navigate("/dashboard");
    }
  }, [ping.status, pairedAccount, auth?.auth]);

  return (
    <Box sx={SC.landingPageContainerCss(theme)}>
      <Container>
        <Stack direction={"row"} justifyContent={"center"}>
          <HashbuzzLogoMainTransparent
            height={100}
            colors={{
              color1: "#fff",
              color2: "#fff",
            }}
          />
        </Stack>

        <Button
          startIcon={
            <Avatar sx={SC.LoginBtnCss}>
              <HashbuzzIcon size={40} color="#fff" />
            </Avatar>
          }
          onClick={handleClick}
          variant="outlined"
          color="primary"
          sx={{ ml: 2, position: "fixed", top: 20, right: 40 }}
          aria-controls={menuOpen ? "wallet-connecter-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          disabled={!dAppConnector || isLoading}
        >
          <Typography variant="subtitle1" component="span" color={"#fff"}>
            Log In
          </Typography>
        </Button>

        <Box sx={SC.landingContentBoxCss(theme)}>
          {isReadyToAuthenticate && <AuthFlowCard />}
          <LandingPageContent />
        </Box>
      </Container>
      <MenuItemsList
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        handleMenuClose={handleClose}
        avialbeExtensions={extensions}
        // click handler
        handleClick={handeWalletConnect}
      />
      <LandingPageSpeedDaial extensions={extensions} handleClick={handeWalletConnect} />
    </Box>
  );
};

export default Landing;
