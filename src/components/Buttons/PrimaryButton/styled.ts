import Button from "@mui/material/Button";
import styled from "styled-components";

interface ButtonStyledProps {
    width: string | number;
    height: string | number;
    radius: string | number;
    inverse: boolean;
    border: string | number;
    colors: string | number;
    position: string;
    top: string | number;
    right: string | number;
    margin: string | number;
    disabled: boolean;
}

export const ButtonStyled = styled(Button) <Partial<ButtonStyledProps>>`
  && {
    width: ${({ width }) => (width ?? "215px")};
    margin: ${({ margin }) => (margin ?? "0px")};
    height: ${({ height }) => (height ?? "56px")};
    border-radius: ${({ radius }) => (radius ?? "8px")};
    background-color: ${({ inverse }) => (inverse ? "#fff" : "#2546EB")};
    color: ${({ colors }) => (colors ?? "#fff")};
    border: ${({ border }) => border};
    position: ${({ position }) => (position ?? "none")};
    right: ${({ right }) => (right ?? "10px")};
    top: ${({ top }) => (top ?? "10px")};
    font-size: 15px;
    font-weight: 500;
    font-family: Poppins;
    
    &:hover{
      background-color: ${({ inverse }) => (inverse ? "#fff" : "#2555EB")};
    }
    @media (max-width: 960px) {
      width: ${({ width }) => (width ?? "100%")};
    }
  }
`;
