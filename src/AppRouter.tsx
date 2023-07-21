import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./APIConfig/AuthGuard";
import { CreateCampaign, Dashboard, Landing, PageNotfound } from "./Ver2Designs";
import { AdminDashboard } from "./Ver2Designs/Admin";
import AdminAuthGuard from "./Ver2Designs/Admin/AdminAuthGuard";
import MainLayout from "./Ver2Designs/Layout";
import StyledComponentTheme from "./theme/Theme";

const router = createBrowserRouter([
  {
    index: true,
    element: <Landing />
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
        element: <Dashboard />
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "create-campaign",
        element: <CreateCampaign />,
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

const AppRouter = () => (
  <StyledComponentTheme>
    <RouterProvider router={router} />
  </StyledComponentTheme>
);

export default AppRouter;
