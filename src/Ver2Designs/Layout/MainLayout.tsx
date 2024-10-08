import { Container, useTheme } from "@mui/material";
import { useStore } from "@store/hooks";
import React from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../APIConfig/api";
import { getErrorMessage } from "../../utils/helpers";
import { DashboardHeader } from "../Components";




const MainLayout = () => {
  const theme = useTheme();
  const { ping, dispatch } = useStore();
  const { User } = useApiInstance();


  /**
   * Call for user data and config if any needed.
   */
  const getUserData = React.useCallback(async () => {
    try {
      const currentUser = await User.getCurrentUser();
      dispatch({ type: "UPDATE_CURRENT_USER", payload: currentUser });
    } catch (error) {
      toast.error(getErrorMessage(error) ?? "Error while getting current user details.");
    }
  }, [User, dispatch]);

  // Effect fot calling current user data
  React.useEffect(() => {
    if (ping.status) {
      getUserData();
    }
  }, [ping.status]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        background: "hsl(0, 0%, 95%)",
        minHeight: "100vh",
        [theme.breakpoints.up("sm")]: {
          display: "grid",
          gridTemplateRows: "auto 1fr",
          height: "100vh",
          gridGap: "12px",
        },
      }}
    >
      <DashboardHeader />
      <Outlet />
    </Container>
  );
};

export default MainLayout;
