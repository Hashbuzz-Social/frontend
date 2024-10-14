import { Container, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "../Components";

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
