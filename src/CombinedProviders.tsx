import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosProvider from "./APIConfig/AxiosProvider";
import "./index.css";
import { StoreProvider } from "./Store/StoreProvider";
import { NETWORK } from "./utils/helpers";
import { ConnectorProvider } from "./Wallet/context/ConnectorContext";
import { SessionProvider } from "./Wallet/context/SessionContext";

const theme = createTheme();

const CombinedProviders: React.FC = ({ children }) => {
  return (
    <CookiesProvider>
      <StoreProvider>
        <AxiosProvider>
          <ConnectorProvider>
            <SessionProvider>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </SessionProvider>
          </ConnectorProvider>
        </AxiosProvider>
      </StoreProvider>
      <ToastContainer />
    </CookiesProvider>
  );
};

export default CombinedProviders;
