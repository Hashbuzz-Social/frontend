import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Dashboard, Landing, PageNotfound } from "./Ver2Designs";
import { AdminDashboard } from "./Ver2Designs/Admin";
import AdminAuthGuard from "./Ver2Designs/Admin/AdminAuthGuard";
import MainLayout from "./Ver2Designs/Layout";
import useConnector from "./Wallet/hooks/useConnector";
import { loadState, saveState } from "./Wallet/services/localstorage";
import useWalletConnectService from "./Wallet/services/walletConnectService";
import StyledComponentTheme from "./theme/Theme";
import SplashScreen from "@componentsV2/SplashScreen/SplashScreen";
import { useCookies } from "react-cookie";
import { useStore } from "@store/hooks";
import { RedirectIfAuthenticated, RequiredAuth } from "@componentsV2/SecureRoutes";

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RedirectIfAuthenticated>
        <Landing />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/",
    element: (
      <RequiredAuth>
        <MainLayout />
      </RequiredAuth>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      // {
      //   path: "campaign",
      //   element: <Template />,
      // },
      // {
      //   path: "create-campaign",
      //   element: <CreateCampaign />,
      // },
      // {
      //   path: "invoice",
      //   element: <Invoice />,
      // },
      // {
      //   path: "onboarding",
      //   element: <OnBoarding />,
      // },
      // {
      //   path: "settings",
      //   element: "",
      // },
      {
        path: "transactions",
        element: "",
      },
      {
        path: "archived",
        element: "",
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <AdminAuthGuard>
        <AdminDashboard />
      </AdminAuthGuard>
    ),
  },
  { path: "/*", element: <PageNotfound /> },
]);

const AppRouter = () => {
  const initializeConnector = useWalletConnectService();
  const { projectId, name, description, url, icons } = useConnector();
  const [cookies] = useCookies(["aSToken", "refreshToken"]);
  const { ping, auth, shouldShowSplashScreen } = useStore();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // Static Data Loading
  useEffect(() => {
    loadState();
  }, []);

  //Initialize Connector
  useEffect(() => {
    if (projectId && name && description && url && icons.length > 0) {
      initializeConnector().catch((error) => {
        console.error("Error initializing connector", error);
      });
    }
  }, [projectId, name, description, url, icons]);

  //Persist state to localStorage
  useEffect(() => {
    saveState({
      projectId,
      name,
      description,
      url,
      icons,
      // Add other necessary state variables if needed
    });
  }, [projectId, name, description, url, icons]);

  if (shouldShowSplashScreen) {
    return <SplashScreen />
  }

  return (
    <StyledComponentTheme>
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

export default AppRouter;
