import { Alert, Box, Button, Container, Grid, Link, Stack, Typography, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useStore } from "../../../Store/StoreProvider";
import HashbuzzIcon from "../../../SVGR/HashbuzzIcon";
import HashbuzzLogo from "../../../SVGR/HashbuzzLogo";
import { useHashconnectService } from "../../../Wallet";
import useHandleAuthenticateWithHashconnect from "../../../Wallet/hashpack/useHandleAuthenticateWithHashconnect";
import { MenuItemsAndSpeedDial } from "../../Components";

const Landing = () => {
  const store = useStore();
  const theme = useTheme();
  const [cookies] = useCookies(["aSToken"]);
  const { pairingData } = useHashconnectService();
  const { handleAuthenticate, authStatusLog } = useHandleAuthenticateWithHashconnect();
  const navigate = useNavigate();
  const ping = store.ping;
  const auth = store.auth;
  const pairedAccount = pairingData?.accountIds[0];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    if ((cookies.aSToken && ping.status && pairedAccount) || auth?.auth) {
      navigate("/dashboard");
    }
  }, [cookies.aSToken, navigate, pairedAccount, ping]);

  React.useEffect(() => {
    if (pairedAccount && !ping.status && !cookies.aSToken) {
      handleAuthenticate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairedAccount, ping, cookies]);

  const StyledText = styled.div`
    display: flex;
    flex-direction: column;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif !important;
    gap: 10px;

    p {
      width: 100%;
      word-wrap: break-word;
    }
  `;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuOpen = Boolean(anchorEl);

  return (
    <Box
      sx={{
        background: "linear-gradient(to right bottom, #071159, #07114d, #091140, #0b0f34, #0d0c28, #0c0a23, #0a081f, #08061a, #07051b, #05051c, #03041e, #01041f)",
        backgroundImage: `url("./images/landing-bg-2.jpg")`,
        minHeight: "100vh",
        backgroundRepeat: "no-repeat",
        // paddingBottom: "20px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        [theme.breakpoints.between("md", "xl")]: {
          backgroundPosition: "top right",
        },
        // backdropFilter: "blur(20px)",
      }}
    >
      <Container>
        <Stack
          direction={"row"}
          //</Container>alignItems={"center"}
          justifyContent={"center"}
        >
          <HashbuzzLogo
            height={100}
            colors={{
              color1: "#fff",
              color2: "#fff",
            }}
          />
        </Stack>

        <Button
          startIcon={
            <Avatar sx={{ width: 40, height: 40 , background:"#1976d2" }}>
              <HashbuzzIcon size={40} color="#fff" />
            </Avatar>
          }
          onClick={handleClick}
          variant="outlined"
          color="primary"
          sx={{ ml: 2 , position:"fixed" , top: 20, right: 40  }}
          aria-controls={menuOpen ? "wallet-connecter-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
        
        >
          <Typography variant="subtitle1" component="span" color={"#fff"}>Log In</Typography>
        </Button>

        <Box
          sx={{
            background: "linear-gradient(rgba(0, 96, 231, 0.15), rgba(80, 360, 350, 0.17))",
            p: 3,
            backdropFilter: "blur(12px)",
            borderRadius: 1,
            [theme.breakpoints.up("md")]: {
              maxWidth: "90%",
              width: "max(768, 1150)",
              marginTop: 2,
            },
            // maxWidth: 1250,
            [theme.breakpoints.up("lg")]: {
              maxWidth: "85%",
              width: "max(900, 1200)",
            },
            [theme.breakpoints.up("xl")]: {
              maxWidth: "80%",
              width: "max(1150, 14400)",
            },
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {pairedAccount ? (
            <Grid container>
              <Grid item sm={6} xs={12} sx={{ color: "#fff" }}>
                <Typography variant="h4">{pairedAccount}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                {authStatusLog.length > 0 ? <Alert severity={authStatusLog[authStatusLog.length - 1]?.type ?? "info"}>{authStatusLog[authStatusLog.length - 1]?.message ?? "Message"}</Alert> : null}
              </Grid>
            </Grid>
          ) : null}
          <Stack sx={{ color: "rgb(255, 255, 255)" }} spacing={2}>
            <Typography variant="subtitle1">
              Discover the power of hashbuzz, a dynamic platform that elevates brand communities through incentivized Xposts. By leveraging project tokens, brands can significantly boost their visibility and exposure. This approach not only enhances token adoption within the community but also transforms regular posts into viral sensations. Expect a substantial increase in overall engagement, as your audience becomes more interactive and invested in your brand's success. Additionally, hashbuzz
              drives authentic interactions, builds long-term brand loyalty, and taps into new audience segments, fostering a stronger, more vibrant community around your brand.
            </Typography>

            <Typography>In this proof of concept, campaigners can run Xpost promos and reward their dedicated influencers with either HBAR or from a selection of whitelisted fungible HTS tokens.</Typography>

            <Typography>Our goal is to create a seamless rewarding mechanism that bridges both web2 and web3. It's all about ensuring that the right individuals receive recognition for their contributions.</Typography>
            <Typography>
              <StyledText>
                Ready to get started?
                <div>
                  * Learn how to launch your very first promo [{" "}
                  <Typography component={Link} style={{ color: "red" }} target="_blank" href="https://www.youtube.com/watch?v=e0cv-B9aWTE&t=2s">
                    here
                  </Typography>
                  ].
                </div>
                <div>
                  * To request the whitelisting of your token, simply submit a request [
                  <Typography component={Link} style={{ color: "red" }} href={"https://about.hashbuzz.social/whitelist-token"}>
                    here
                  </Typography>
                  ].
                </div>
                <div>
                  * Stay in the loop with our latest updates and announcements by following us on{" "}
                  <Typography component={Link} href={"https://x.com/hbuzzs"} style={{ color: "red" }}>
                    X
                  </Typography>{" "}
                  -{" "}
                  <Typography component={Link} href={"https://discord.gg/6Yrg4u8bvB"} target="_blank" style={{ color: "red" }}>
                    Discord
                  </Typography>
                </div>
                <div>
                  * Read our terms and conditions, and privacy policy [
                  <Typography component={Link} style={{ color: "red" }} href={"/#"}>
                    here
                  </Typography>
                  ].
                </div>
              </StyledText>
            </Typography>
            <Typography>Join us in revolutionizing the way we share and validate information on social media.</Typography>
          </Stack>
        </Box>
      </Container>

      <MenuItemsAndSpeedDial menuOpen={menuOpen} handleMenuClose={handleClose} anchorEl={anchorEl} />
    </Box>
  );
};

export default Landing;
