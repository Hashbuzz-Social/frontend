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
  onclick?: React.MouseEventHandler<HTMLButtonElement>;
}

const SecondaryButton = ({ text, variant, onclick, width, height, radius, inverse, margin, disabled, ...props }: Props) => {
  return (
    <SC.SecondaryStyledButton variant={variant} onClick={onclick} width={width} height={height} radius={radius} inverse={inverse} margin={margin} disabled={disabled}>
      {text}
    </SC.SecondaryStyledButton>
  );
};

export default SecondaryButton;
