import TemplatePage from "@components/Pages/TemplatePage/TemplatePage";
import { RedirectIfAuthenticated, RequiredAuth } from "@componentsV2/SecureRoutes";
import SplashScreen from "@componentsV2/SplashScreen/SplashScreen";
import { useAuth, useStore } from "@store/hooks";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Invoice } from "screens/Invoice";
import { CreateCampaign, Dashboard, Landing, PageNotfound } from "./Ver2Designs";
import { AdminDashboard } from "./Ver2Designs/Admin";
import AdminAuthGuard from "./Ver2Designs/Admin/AdminAuthGuard";
import MainLayout from "./Ver2Designs/Layout";
import useConnector from "./Wallet/hooks/useConnector";
import { loadState, saveState } from "./Wallet/services/localstorage";
import StyledComponentTheme from "./theme/Theme";

const router = createBrowserRouter([
  {
    path: "/",
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
      {
        path: "campaign",
        element: <TemplatePage />,
      },
      {
        path: "create-campaign",
        element: <CreateCampaign />,
      },
      {
        path: "invoice",
        element: <Invoice />,
      },
      {
        path: "settings",
        element: "",
      },
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
  const { projectId, name, description, url, icons } = useConnector();
  const { shouldShowSplashScreen, dispatch } = useStore();
  const [cookies] = useCookies(["aSToken"]);
  const { authCheckPing } = useAuth();

  // Static Data Loading
  useEffect(() => {
    loadState();
  }, []);

  //Persist state to localStorage
  useEffect(() => {
    saveState({
      projectId,
      name,
      description,
      url,
      icons,
    });
  }, [projectId, name, description, url, icons]);

  useEffect(() => {
    // Auth checking ping
    const checkAuth = async () => {
      if (cookies.aSToken) {
        await authCheckPing();
      } else {
        dispatch({ type: "HIDE_SPLASH_SCREEN" });
      }
    };
    checkAuth();
    // Clean up the debounce effect on unmount
    return () => {
      authCheckPing.cancel();
    };
  }, [cookies.aSToken]);

  if (shouldShowSplashScreen) {
    return <SplashScreen />;
  }

  return (
    <StyledComponentTheme>
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

export default AppRouter;
