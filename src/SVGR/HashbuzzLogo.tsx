import { Box } from "@mui/material";
interface Props {
  className?: string;
  width?: number;
  height?: number;
  colors?:{
    color1:string,
    color2:string
  }
}



const calculateRespectivewidth = (height: number): number => Math.floor((height * 1200) / 310);
const calculateRespectivheight = (width: number): number => Math.floor((width * 310) / 1200);

const HashbuzzLogoMainTransparent = ({ className, width, height , colors}: Props) => {
  return (
    <Box
      component={"svg"}
      sx={{
        "& > .cls-1": {
          fill: colors?.color1 ?? "#040911",
        },
        "& > .cls-2": {
          fill: colors?.color2??"#5265ff",
        },
      }}
      id="Layer_1"
      viewBox={`0 0 1200 310`}
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? ""}
      width={height ? calculateRespectivewidth(height) : width ?? ""}
      height={width ? calculateRespectivheight(width) : height ?? ""}
    >
      <defs />
      <g>
        <g>
          <path
          
            fill={colors?.color2 ?? "#5265ff"}
            d="m136.95,41.68l-93.27,53.85c-2.06,1.19-3.33,3.39-3.33,5.77v42.31s120.12-69.35,120.12-69.35v-22.84s-16.87-9.73-16.87-9.73c-2.06-1.19-4.6-1.19-6.66,0Z"
          />
          <path
            fill={colors?.color2 ?? "#5265ff"}
            d="m80.58,166.53v46.16s.01,23.39.01,23.39l-20.26-11.69-16.43-9.5c-.22-.11-.42-.23-.62-.36-1.77-1.2-2.94-3.23-2.94-5.53v-65.39l40.25-23.23v46.15Z"
          />
          <polygon fill={colors?.color2 ?? "#5265ff"} points="120.53 143.47 160.47 120.41 160.47 74.26 120.53 97.32 120.53 143.47" />
        </g>
        <g>
          <path fill={colors?.color2 ?? "#5265ff"} d="m240.2,101.3c0-2.38-1.27-4.58-3.33-5.77l-16.66-9.62-19.8-11.43v22.87s0,46.16,0,46.16l39.79-22.97v-19.24Z" />
          <path
            fill={colors?.color2 ?? "#5265ff"}
            d="m200.41,143.51v46.15s-39.94,23.06-39.94,23.06v-46.15s-39.94,23.06-39.94,23.06v46.15s0,23.35,0,23.35l16.42,9.48c2.06,1.19,4.6,1.19,6.66,0l93.41-53.93c2.06-1.19,3.33-3.39,3.33-5.77v-42.31s0-46.15,0-46.15l-39.93,23.05Z"
          />
        </g>
      </g>
      <g>
        <polygon
          fill={colors?.color1 ?? "#040911"}
          points="1032.8 145.98 1063.01 145.98 1065.42 142.94 1065.42 123.65 981.78 123.65 981.78 145.97 1032.81 145.97 1032.8 145.98"
        />
        <polygon
          fill={colors?.color1 ?? "#040911"}
          points="1052.47 159.29 1022.11 159.29 979.4 212.49 979.4 230.47 1065.42 230.47 1065.42 208.15 1013.78 208.15 1052.47 159.29"
        />
      </g>
      <g>
        <polygon
          fill={colors?.color1 ?? "#040911"}
          points="1146.72 159.29 1116.37 159.29 1073.65 212.49 1073.65 230.47 1159.67 230.47 1159.67 208.15 1108.03 208.15 1146.72 159.29"
        />
        <polygon
          fill={colors?.color1 ?? "#040911"}
          points="1127.05 145.98 1157.26 145.98 1159.67 142.94 1159.67 123.65 1076.04 123.65 1076.04 145.97 1127.06 145.97 1127.05 145.98"
        />
      </g>
      <path
        fill={colors?.color1 ?? "#040911"}
        d="m320.29,230.47V79.45h27.08v68.47l-4.55.65c1.88-6.5,4.66-11.73,8.34-15.71,3.68-3.97,7.94-6.86,12.78-8.67,4.84-1.8,9.71-2.71,14.62-2.71,12.13,0,21.63,3.43,28.49,10.29,6.86,6.86,10.29,16.5,10.29,28.93v69.77h-27.08v-59.8c0-8.96-1.59-15.49-4.77-19.61-3.18-4.12-8.16-6.17-14.95-6.17-7.66,0-13.43,2.75-17.33,8.23-3.9,5.49-5.85,14.23-5.85,26.22v51.13h-27.08Z"
      />
      <path
        fill={colors?.color1 ?? "#040911"}
        d="m470.88,232.64c-7.8,0-14.77-1.45-20.91-4.33-6.14-2.89-10.98-7-14.52-12.35-3.54-5.34-5.31-11.48-5.31-18.42,0-6.21,1.26-11.52,3.79-15.92,2.53-4.41,5.88-7.76,10.08-10.08,3.61-2.17,7.62-3.68,12.03-4.55,4.4-.87,9.13-1.3,14.19-1.3h33.15v19.93h-29.25c-2.31,0-4.59.18-6.83.54-2.24.36-4.15,1.19-5.74,2.49-1.45,1.01-2.53,2.28-3.25,3.79-.72,1.52-1.08,3.22-1.08,5.09,0,4.05,1.59,7.3,4.77,9.75,3.18,2.46,7.44,3.68,12.78,3.68,4.77,0,9.13-1.04,13.11-3.14,3.97-2.09,7.15-4.98,9.53-8.67,2.38-3.68,3.58-7.91,3.58-12.67l7.15,14.3c-1.88,7.51-4.73,13.62-8.56,18.31-3.83,4.7-8.2,8.12-13.11,10.29-4.91,2.17-10.11,3.25-15.6,3.25Zm32.28-2.17l-2.17-16.04v-51.35c0-6.35-1.99-11.08-5.96-14.19-3.97-3.1-9.35-4.66-16.14-4.66-5.63,0-11.38,1.12-17.22,3.36-5.85,2.24-11.02,5.38-15.49,9.42l-13.65-18.42c7.51-6.07,15.2-10.43,23.08-13.11,7.87-2.67,16.36-4.01,25.46-4.01,14.73,0,26.22,3.68,34.45,11.05,8.23,7.37,12.35,17.55,12.35,30.55v67.39h-24.7Z"
      />
      <path
        fill={colors?.color1 ?? "#040911"}
        d="m582.25,232.64c-7.95,0-14.88-1.16-20.8-3.47-5.92-2.31-10.94-5.2-15.06-8.67s-7.4-6.79-9.86-9.97l18.42-16.04c2.46,4.05,5.96,7.77,10.51,11.16,4.55,3.4,10.22,5.09,17.01,5.09,5.34,0,9.5-1.05,12.46-3.14,2.96-2.09,4.44-4.73,4.44-7.91,0-2.6-.94-4.73-2.82-6.39-1.88-1.66-4.41-3.03-7.58-4.12-3.18-1.08-6.72-2.13-10.62-3.14-4.04-1.15-8.23-2.46-12.57-3.9-4.33-1.44-8.31-3.36-11.92-5.74-3.61-2.38-6.54-5.45-8.77-9.21-2.24-3.75-3.36-8.45-3.36-14.08,0-9.39,3.68-17.01,11.05-22.86,7.37-5.85,17.12-8.78,29.25-8.78,8.52,0,16.25,1.7,23.18,5.09,6.93,3.4,12.42,8.27,16.47,14.63l-16.68,13.22c-2.6-4.19-6.03-7.33-10.29-9.43-4.26-2.09-8.78-3.14-13.54-3.14-4.19,0-7.62.79-10.29,2.38-2.67,1.59-4.01,3.76-4.01,6.5,0,1.88.61,3.47,1.84,4.77,1.23,1.3,3.25,2.42,6.07,3.36,2.82.94,6.53,1.99,11.16,3.14,4.33,1.01,8.81,2.24,13.43,3.68,4.62,1.45,8.96,3.39,13,5.85,4.04,2.46,7.29,5.71,9.75,9.75,2.45,4.05,3.68,9.18,3.68,15.38,0,7.08-1.81,13.32-5.42,18.74-3.61,5.42-8.67,9.64-15.17,12.67-6.5,3.04-14.16,4.55-22.97,4.55Z"
      />
      <path
        fill={colors?.color1 ?? "#040911"}
        d="m639.66,230.47V79.45h27.08v68.47l-4.55.65c1.88-6.5,4.66-11.73,8.34-15.71,3.68-3.97,7.94-6.86,12.78-8.67,4.84-1.8,9.71-2.71,14.62-2.71,12.13,0,21.63,3.43,28.49,10.29,6.86,6.86,10.29,16.5,10.29,28.93v69.77h-27.08v-59.8c0-8.96-1.59-15.49-4.77-19.61-3.18-4.12-8.16-6.17-14.95-6.17-7.66,0-13.43,2.75-17.33,8.23-3.9,5.49-5.85,14.23-5.85,26.22v51.13h-27.08Z"
      />
      <path
        fill={colors?.color1 ?? "#040911"}
        d="m811.48,232.64c-5.35,0-10.51-1.05-15.49-3.14-4.98-2.09-9.35-5.63-13.11-10.62-3.76-4.98-6.57-11.66-8.45-20.04l6.5,3.03v28.6h-26.87V79.45h26.87v73.02l-5.63,1.73c1.3-7.37,3.72-13.47,7.26-18.31,3.54-4.84,7.83-8.45,12.89-10.83,5.05-2.38,10.4-3.58,16.03-3.58,8.38,0,16.03,2.2,22.97,6.61,6.93,4.41,12.42,10.73,16.47,18.96,4.04,8.23,6.07,18.2,6.07,29.9,0,10.55-1.81,20.04-5.42,28.49-3.61,8.45-8.85,15.1-15.71,19.93-6.86,4.84-14.99,7.26-24.38,7.26Zm-7.37-24.7c5.34,0,9.93-1.26,13.76-3.79,3.83-2.53,6.83-6.1,8.99-10.72,2.17-4.62,3.25-10.11,3.25-16.47s-1.08-11.81-3.25-16.36c-2.17-4.55-5.17-8.09-8.99-10.62-3.83-2.53-8.42-3.79-13.76-3.79s-9.72,1.27-13.54,3.79c-3.83,2.53-6.79,6.1-8.88,10.72-2.1,4.62-3.14,10.04-3.14,16.25s1.05,11.63,3.14,16.25c2.09,4.62,5.05,8.23,8.88,10.83,3.83,2.6,8.34,3.9,13.54,3.9Z"
      />
      <path
        fill={colors?.color1 ?? "#040911"}
        d="m908.33,232.64c-8.67,0-15.92-1.73-21.78-5.2-5.85-3.47-10.18-8.38-13-14.73-2.82-6.36-4.22-13.79-4.22-22.32v-66.73h26.87v60.02c0,4.91.58,9.28,1.73,13.11,1.15,3.83,3.21,6.86,6.17,9.1,2.96,2.24,7.04,3.36,12.24,3.36,6.35,0,11.16-1.8,14.41-5.42,3.25-3.61,5.49-8.63,6.72-15.06,1.23-6.43,1.84-13.97,1.84-22.64v-42.47h26.87v106.82h-26.87v-23.18l3.68,2.17c-3.18,8.23-7.87,14.16-14.08,17.77-6.21,3.61-13.07,5.42-20.58,5.42Z"
      />
    </Box>
  );
};

export default HashbuzzLogoMainTransparent;
