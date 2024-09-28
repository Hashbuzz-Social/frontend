import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosProvider from "./APIConfig/AxiosProvider";
import { StoreProvider } from "./Store/StoreProvider";
import { NETWORK } from "./Utilities/helpers";
import WalletConnectProvider, { WalletConnectProviedrProps } from "./Wallet/ConnectionProvider/WalletConnectProvider";
import "./index.css";

const theme = createTheme();

const walletConnectProps: WalletConnectProviedrProps = {
  metadata: {
    name: "hashbuzz would like to connect to your wallet.",
    description: `Please select which account you wish to connect with, hashbuzz will never store your private key information or your seed phrases. \n
              Note - Ledger accounts are unable to be used with HashConnect at this time.`,

    icons: ["https://testnet.hashbuzz.social/favicons/apple-touch-icon.png"],
    url: "https://testnet.hashbuzz.social",
  },
  //@ts-ignore
  network: NETWORK,
  debug: false,
};

const CombinedProviders: React.FC = ({ children }) => {
  return (
    <CookiesProvider>
      <StoreProvider>
        <AxiosProvider>
          <WalletConnectProvider {...walletConnectProps}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </WalletConnectProvider>
        </AxiosProvider>
      </StoreProvider>
      <ToastContainer />
    </CookiesProvider>
  );
};

export default CombinedProviders;
