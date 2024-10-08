import { SxProps, Theme } from "@mui/material";

export const SplashScreenContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100dvw",
  height: "100dvh",
  // background: "linear-gradient(to right bottom, #071159, #07114d, #091140, #0b0f34, #0d0c28, #0c0a23, #0a081f, #08061a, #07051b, #05051c, #03041e, #01041f)"
};

export const SplashScreenContentStyles: SxProps<Theme> = { display: "flex", flexDirection: "column", alignItems: "center" };
