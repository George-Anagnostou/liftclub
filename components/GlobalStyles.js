import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.25s linear;
  }

  a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: underline;
    color: inherit;
  }

  ul {
    list-style: none;
  }
`;
