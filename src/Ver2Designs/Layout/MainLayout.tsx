import { Container, useTheme } from "@mui/material";
import { useStore } from "@store/hooks";
import React from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../APIConfig/api";
import { getErrorMessage } from "../../utils/helpers";
import { DashboardHeader } from "../Components";
import { useCookies } from "react-cookie";




const MainLayout = () => {
  const theme = useTheme();
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
