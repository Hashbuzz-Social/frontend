import { Box, Stack } from "@mui/material";
import HashbuzzLogoMainTransparent from "@svgr/HashbuzzLogo";
import HeaderMenu from "./HeaderMenu";

const Header = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Stack alignItems={"center"} justifyContent="center" direction={"row"}>
        <HashbuzzLogoMainTransparent height={160} />
      </Stack>
      <HeaderMenu />
    </Box>
  );
};

export default Header;
