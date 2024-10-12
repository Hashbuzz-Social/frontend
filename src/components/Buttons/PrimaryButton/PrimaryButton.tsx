import React from "react";
import { ButtonProps } from "@mui/material";
import * as SC from "./styled";

interface Props extends ButtonProps {
  text?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  inverse?: boolean;
  border?: number | string;
  colors?: string;
  position?: string;
  top?: number | string;
  right?: number | string;
  margin?: number | string;
  disabled?: boolean;
}

const PrimaryButton = ({ text, width, height, radius, inverse, border, colors, position, top, right, margin, disabled, variant, onClick, ...restProps }: Props) => {
  return (
    <SC.ButtonStyled variant={variant} onClick={onClick} width={width} height={height} radius={radius} inverse={inverse} border={border} colors={colors} position={position} top={top} right={right} margin={margin} disabled={disabled} {...restProps}>
      {text}
    </SC.ButtonStyled>
  );
};

export default PrimaryButton;
