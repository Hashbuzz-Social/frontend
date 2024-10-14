import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessIcon from "@mui/icons-material/Business";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Button, Typography } from "@mui/material";
import { useBalances, useStore } from "@store/hooks";
import React from "react";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../APIConfig/api";
import { getErrorMessage, isAllowedToCmapigner } from "../../../utils/helpers";
import Balances from "./Balances";
import CampaignList from "./CampaignList";
import { CardGenUtility } from "./CardGenUtility";
import * as SC from "./styled";
import { useCookies } from "react-cookie";

const Dashboard = () => {
  const [cookies] = useCookies(["aSToken", "refreshToken"]);
  const store = useStore();
  const { Integrations } = useApiInstance();
  const { currentUser, dispatch } = store;
  const { checkAndUpdateEntityBalances } = useBalances();

  const personalHandleIntegration = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const { url } = await Integrations.twitterPersonalHandle();
      window.location.href = url;
    } catch (err) {
      toast.error(getErrorMessage(err) ?? "Error while requesting personal handle integration.");
    }
  };
  const bizHandleIntegration = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const { url } = await Integrations.twitterBizHandle();
      window.location.href = url;
    } catch (err) {
      toast.error(getErrorMessage(err) ?? "Error while requesting personal handle integration.");
    }
  };

  React.useEffect(() => {
    const toastsMessage = store.toasts;
    toastsMessage.map((t) => toast(t.message, { type: t.type }));
    dispatch({ type: "RESET_TOAST" });
  }, [store.toasts]);

  React.useEffect(() => {
    if (cookies.aSToken) {
      checkAndUpdateEntityBalances();
    }
  }, [cookies.aSToken]);

  return (
    <React.Fragment>
      <SC.StyledCardGenUtility>
        <CardGenUtility startIcon={<AccountBalanceWalletIcon color="inherit" fontSize={"inherit"} />} title={"Hedera Account ID"} content={<Typography variant="h5">{currentUser?.hedera_wallet_id}</Typography>} />

        {/* card for personal twitter handle */}
        <CardGenUtility
          startIcon={<TwitterIcon color="inherit" fontSize={"inherit"} />}
          title={"Personal X Account"}
          content={
            currentUser?.personal_twitter_handle ? (
              <Typography variant="h5">{"@" + currentUser?.personal_twitter_handle}</Typography>
            ) : (
              <Button type="button" variant="contained" disableElevation startIcon={<TwitterIcon />} onClick={personalHandleIntegration}>
                Connect
              </Button>
            )
          }
        />

        {/* card for Brand twitter handle */}
        <CardGenUtility
          startIcon={<BusinessIcon color="inherit" fontSize={"inherit"} />}
          title={"Brand X Account"}
          content={
            currentUser?.business_twitter_handle ? (
              <Typography variant="h5">{"@" + currentUser?.business_twitter_handle}</Typography>
            ) : (
              <Button type="button" disabled={!isAllowedToCmapigner(currentUser?.role)} variant="contained" disableElevation startIcon={<TwitterIcon />} onClick={bizHandleIntegration}>
                Connect
              </Button>
            )
          }
        />

        {/* Card for account balance */}
        <Balances />
        {/* </Grid> */}
      </SC.StyledCardGenUtility>

      {/* Campaign List section */}
      <CampaignList />

      {/* speed dial  action button */}
      {/* <MenuItemsAndSpeedDial /> */}
    </React.Fragment>
  );
};

export default Dashboard;
