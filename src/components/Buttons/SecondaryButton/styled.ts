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

export const SecondaryStyledButton = styled(Button) <Partial<ButtonStyledProps>>`
  && {
    padding: 5px 10px;
    border-radius: ${({ radius }) => (radius ? radius : "100px")};
    margin-right: ${({ margin }) => (margin ? margin : "")};
    background-color: ${({ inverse }) => (inverse ? "#fff" : "#2C2A44")};
    color: ${({ inverse }) => (inverse ? "#2C2A44" : "#fff")};
    border: ${({ inverse }) => (inverse ? "1px solid #2C2A44" : "none")};
    font-size: 10px;
    font-weight: 500;
    font-family: Poppins;
    &:hover{
      background-color: ${({ inverse }) => (inverse ? "#fff" : "#2C2A55")};
    }
  }
`;
