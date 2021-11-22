import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    letter-spacing: .5px;
    font-family: inherit;
  }

  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Poppins ,Tahoma, Helvetica, Arial, Roboto, sans-serif;
    /* transition: all 0.25s linear; */
    scroll-behavior: smooth
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

  ::-webkit-scrollbar {
    width: 20px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #818181;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background-color: #a7a7a7;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
