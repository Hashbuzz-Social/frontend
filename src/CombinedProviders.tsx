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
import { HashconnectAPIProvider, HashconnectAPIProviderProps } from "./Wallet/ConnectionProvider/HashconnectProvider";

const theme = createTheme();

const name = "hashbuzz would like to connect to your wallet.";
const description = `Please select which account you wish to connect with, hashbuzz will never store your private key information or your seed phrases. \n
              Note - Ledger accounts are unable to be used with HashConnect at this time.`;
const url = "https://testnet.hashbuzz.social";
const icon = "https://testnet.hashbuzz.social/favicons/apple-touch-icon.png";

const walletConnectProps: WalletConnectProviedrProps = {
  metadata: {
    name,
    description,
    url,
    icons: [icon],
  },
  //@ts-ignore
  network: NETWORK,
  debug: true,
};

const hashconnectAPIProps: HashconnectAPIProviderProps = {
  metaData: {
    name,
    description,
    url,
    icon,
  },
  //@ts-ignore
  network: NETWORK,
  debug: true,
};

const CombinedProviders: React.FC = ({ children }) => {
  return (
    <CookiesProvider>
      <StoreProvider>
        <AxiosProvider>
          <HashconnectAPIProvider {...hashconnectAPIProps}>
            <WalletConnectProvider {...walletConnectProps}>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </WalletConnectProvider>
          </HashconnectAPIProvider>
        </AxiosProvider>
      </StoreProvider>
      <ToastContainer />
    </CookiesProvider>
  );
};

export default CombinedProviders;
