import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    letter-spacing: .5px;
  }

  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.25s linear;
  }

  a:link,
  a:visited,
  a:active {
    color: inherit;
  }

  a{
    cursor: pointer;
    text-decoration: none;
  }

  button{
    cursor: pointer;
  }

  ul {
    list-style: none;
  }
`;
