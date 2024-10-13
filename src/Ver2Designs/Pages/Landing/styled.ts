import { SxProps, Theme } from "@mui/material";

export const landingPageContainerCss = (theme: Theme): SxProps<Theme> => ({
  background: "linear-gradient(to right bottom, #071159, #07114d, #091140, #0b0f34, #0d0c28, #0c0a23, #0a081f, #08061a, #07051b, #05051c, #03041e, #01041f)",
  backgroundImage: `url("./images/landing-bg-2.jpg")`,
  minHeight: "100vh",
  backgroundRepeat: "no-repeat",
  // paddingBottom: "20px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  [theme.breakpoints.between("md", "xl")]: {
    backgroundPosition: "top right",
  },
  // backdropFilter: "blur(20px)",
});

export const landingContentBoxCss = (theme: Theme): SxProps<Theme> => ({
  background: "linear-gradient(rgba(0, 96, 231, 0.15), rgba(80, 360, 350, 0.17))",
  p: 3,
  backdropFilter: "blur(12px)",
  borderRadius: 1,
  [theme.breakpoints.up("md")]: {
    maxWidth: "90%",
    width: "max(768, 1150)",
    marginTop: 2,
  },
  // maxWidth: 1250,
  [theme.breakpoints.up("lg")]: {
    maxWidth: "85%",
    width: "max(900, 1200)",
  },
  [theme.breakpoints.up("xl")]: {
    maxWidth: "80%",
    width: "max(1150, 14400)",
  },
  marginLeft: "auto",
  marginRight: "auto",
});



export const LoginBtnAvatarCss: SxProps<Theme> = ({
  width: 40, height: 40, background: "#1976d2"
})
export const LoginBtnCss: SxProps<Theme> = (
  { ml: 2, position: "fixed", top: 20, right: 40, zIndex: 3 }
)