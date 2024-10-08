import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./APIConfig/AuthGuard";
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

const router = createBrowserRouter([
  {
    index: true,
    element: <Landing />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
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
  const { ping, auth } = useStore();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // Static Data Loading
  useEffect(() => {
    const savedState = loadState();
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


  useEffect(() => {
    // Check if user is authenticated and ping is successful make splash screen disappear
    if (ping.status && ((auth?.auth) || cookies.aSToken)) {
      setShowSplashScreen(false);
    }
    if (!cookies.aSToken || !ping.status) {
      setShowSplashScreen(false);
    }
  }, [ping, auth, cookies.aSToken]);

  if (showSplashScreen) {
    return <SplashScreen />
  }

  return (
    <StyledComponentTheme>
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

export default AppRouter;
