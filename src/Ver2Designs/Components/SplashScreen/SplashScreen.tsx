import { Box } from "@mui/material";
import HashbuzzLogoMainTransparent from "@svgr/HashbuzzLogo";
import InfiniteLoop from "@svgr/InfineLoop";
import * as CS from "./styled";


const SplashScreen = () => {
    return (
        <Box sx={CS.SplashScreenContainerStyles} >
            <Box sx={CS.SplashScreenContentStyles}>
                <HashbuzzLogoMainTransparent height={150} />
                <InfiniteLoop height={75} />
            </Box>
        </Box>
    );
};



export default SplashScreen;