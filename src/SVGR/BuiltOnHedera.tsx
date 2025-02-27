import React from 'react';
import { Box } from "@mui/material";

interface Props {
  className?: string;
  width?: number;
  height?: number;
  colors?: {
    color1: string,
    color2: string
  }
}

const calculateRespectivewidth = (height: number): number => Math.floor((height * 169.13) / 76.86);
const calculateRespectivheight = (width: number): number => Math.floor((width * 76.86) / 169.13);

const BuiltOnHedera: React.FC<Props> = ({ className, width, height, colors }) => (
  <Box
    component={"svg"}
    sx={{
      "& > .cls-1": {
        fill: colors?.color1 ?? "#fff",
      },
      "& > .cls-2": {
        fill: colors?.color2 ?? "#fff",
        fillRule: "evenodd",
      },
    }}
    id="built_on_hedera_logo"
    data-name="built_on_hedera_logo"
    viewBox="0 0 169.13 76.86"
    xmlns="http://www.w3.org/2000/svg"
    className={className ?? ""}
    width={height ? calculateRespectivewidth(height) : width ?? ""}
    height={width ? calculateRespectivheight(width) : height ?? ""}
  >
    <defs>
      <style>
        {`
          .cls-1, .cls-2 {
            fill: ${colors?.color1 ?? "#fff"};
          }

          .cls-2 {
            fill-rule: evenodd;
          }
        `}
      </style>
    </defs>
    <g id="built_on_hedera_logo_layer" data-name="built_on_hedera_logo_layer">
      <g>
        <g>
          <path className="cls-1" d="M85.12,25.16h6.96c2.63,0,4.04,1.29,4.04,3.27,0,1.26-.85,2.07-1.7,2.41,1.05,.36,2,1.32,2,2.92,0,2.09-1.44,3.44-4.23,3.44h-7.08v-12.05Zm2.83,2.32v2.38h3.67c.98,0,1.56-.37,1.56-1.19s-.56-1.19-1.56-1.19h-3.67Zm0,4.7v2.7h3.73c1.19,0,1.8-.48,1.8-1.36s-.61-1.34-1.8-1.34h-3.73Z"/>
          <path className="cls-1" d="M105.92,31.74v-6.58h2.85v6.77c0,3.09-1.98,5.53-5.75,5.53s-5.79-2.41-5.79-5.53v-6.77h2.88v6.58c0,1.85,1.04,3.09,2.9,3.09s2.9-1.24,2.9-3.09Z"/>
          <path className="cls-1" d="M110.2,25.16h2.88v12.05h-2.88v-12.05Z"/>
          <path className="cls-1" d="M124.57,37.2h-9.99v-12.05h2.88v9.5h7.11v2.54Z"/>
          <path className="cls-1" d="M121.99,25.16h12v2.51h-4.56v9.54h-2.87v-9.54h-4.56v-2.51Z"/>
          <path className="cls-1" d="M136.82,31.18c0-3.7,2.78-6.23,6.4-6.23s6.38,2.53,6.38,6.23-2.78,6.23-6.38,6.23-6.4-2.54-6.4-6.23Zm9.84,0c0-2.02-1.32-3.65-3.44-3.65s-3.46,1.61-3.46,3.65,1.34,3.65,3.46,3.65,3.44-1.61,3.44-3.65Z"/>
          <path className="cls-1" d="M162.2,37.24h-2.34l-6.57-8.33v8.3h-2.82v-12.05h3.27l5.7,7.38v-7.38h2.75v12.08Z"/>
        </g>
        <g>
          <path className="cls-2" d="M38.43,0c21.23,0,38.44,17.2,38.44,38.43s-17.2,38.43-38.44,38.43S0,59.66,0,38.43,17.2,0,38.43,0m-10.51,40.79h21.49v-5.35H27.92v5.35Zm26.13,14.26h-4.88v-10.37H27.69v10.37h-4.88V21.41h4.88v10.13h21.49v-10.13h4.88V55.05Z"/>
          <g>
            <path className="cls-1" d="M95.41,48.06h-6.76v5.48h-3.31v-13.83h3.31v5.44h6.76v-5.44h3.29v13.83h-3.29v-5.48Z"/>
            <path className="cls-1" d="M100.4,39.71h11.57v2.73h-8.26v2.49h4.93v2.79h-4.93v2.96h9.02v2.86h-12.33v-13.83Z"/>
            <path className="cls-1" d="M113.43,39.71h5.73c4.42,0,7.58,2.38,7.58,6.92s-3.16,6.92-7.58,6.92h-5.73v-13.83Zm3.31,2.84v8.15h2.36c2.55,0,4.27-1.5,4.27-4.07s-1.71-4.07-4.27-4.07h-2.36Z"/>
            <path className="cls-1" d="M127.75,39.71h11.57v2.73h-8.26v2.49h4.93v2.79h-4.93v2.96h9.02v2.86h-12.33v-13.83Z"/>
            <path className="cls-1" d="M140.78,39.71h8.11c3.06,0,4.93,1.48,4.93,4.35,0,1.93-.97,3.25-2.63,3.86l3.12,5.63h-3.49l-2.92-5.26h-3.8v5.26h-3.31v-13.83Zm3.31,2.84v2.94h4.44c1.23,0,1.89-.49,1.89-1.44,0-1.05-.64-1.5-1.89-1.5h-4.44Z"/>
            <path className="cls-1" d="M164.59,51.14h-6.59l-1.03,2.4h-3.33l6.06-13.85h3.39l6.04,13.85h-3.51l-1.03-2.4Zm-1.19-2.77l-2.1-4.89-2.1,4.89h4.21Z"/>
          </g>
        </g>
      </g>
    </g>
  </Box>
);

export default BuiltOnHedera;