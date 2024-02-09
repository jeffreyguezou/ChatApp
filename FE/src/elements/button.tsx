import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  width: 100%;
  padding: 10px;
  color: white;
  background-color: ${(props) => props.bg};
  border-radius: 10px;
  font-weight: bold;
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  bg: string;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};
export default Button;
