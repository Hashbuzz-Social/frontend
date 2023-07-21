import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessIcon from "@mui/icons-material/Business";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useStore } from "../../../Store/StoreProvider";
import AdminPasswordSetup from "./AdminPasswordSetup";
import Balances from "./Balances";
import CampaignList from "./CampaignList";
import { CardGenUtility } from "./CardGenUtility";
import ConsentModal from "./ConsentModal";

import { toast } from "react-toastify";
import { useApiInstance } from "../../../APIConfig/api";
import { getErrorMessage } from "../../../Utilities/helpers";
import SpeedDialActions from "../../Components/SpeedDialActions";
// import { useTheme } from "@emotion/react";

const Dashboard = () => {
  const store = useStore();
  const { Integrations } = useApiInstance();

  const personalHandleIntegration = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const { url } = await Integrations.twitterPersonalHandle();
      console.log({ url })
      alert("Check console")
      window.location.href = url;
    } catch (err) {
      toast.error(getErrorMessage(err) ?? "Error while requesting personal handle integration.")

    }
  };
  const bizHandleIntegration = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const { url } = await Integrations.twitterBizHandle();
      window.location.href = url;
    } catch (err) {
      toast.error(getErrorMessage(err) ?? "Error while requesting personal handle integration.")

    }
  }

  React.useEffect(() => {
    const toastsMessage = store?.toasts;
    toastsMessage?.map(t => toast(t.message, { type: t.type }));
    store?.updateState(_d => ({ ..._d, toasts: [] }))
  }, [])

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {/* Card for wallet info */}
        <CardGenUtility
          startIcon={<AccountBalanceWalletIcon color="inherit" fontSize={"inherit"} />}
          title={"Hedera account Id"}
          content={<Typography variant="h5">{store?.currentUser?.hedera_wallet_id}</Typography>}
        />

        {/* card for personal twitter handle */}
        <CardGenUtility
          startIcon={<TwitterIcon color="inherit" fontSize={"inherit"} />}
          title={"Personal twitter handle"}
          content={
            store?.currentUser?.personal_twitter_handle ? (
              <Typography variant="h5">{"@" + store?.currentUser?.personal_twitter_handle}</Typography>
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
          title={"Brand twitter handle"}
          content={
            store?.currentUser?.business_twitter_handle ? (
              <Typography variant="h5">{"@" + store?.currentUser?.business_twitter_handle}</Typography>
            ) : (
              <Button type="button" variant="contained" disableElevation startIcon={<TwitterIcon />} onClick={bizHandleIntegration}>
                Connect
              </Button>
            )
          }
        />

        {/* Card for account balance */}
        <Balances />
      </Grid>

      {/* Campaign List section */}
      <CampaignList user={store?.currentUser} />

      {/* speed dial  action button */}
      <SpeedDialActions />

      {/* Concent modal for requesting concent form user */}
      {!store?.currentUser?.consent ? <ConsentModal user={store?.currentUser!} /> : null}

      {/* Show modal to admin user for updating email and password */}
      {!store?.currentUser?.emailActive && ["SUPER_ADMIN", "ADMIN"].includes(store?.currentUser?.role!) ? (
        <AdminPasswordSetup user={store?.currentUser!} />
      ) : null}
    </React.Fragment>
  );
};

export default Dashboard;
