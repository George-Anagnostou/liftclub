import { useContext, useState } from "react";
import styled from "styled-components";
import { ThemeToggleContext } from "./useThemeState";

const ThemeToggle: React.FC = () => {
  const themeToggler = useContext(ThemeToggleContext)!;

  const [checked, setChecked] = useState(localStorage.getItem("theme") === "dark");

  return (
    <Switch onClick={themeToggler}>
      <div className="toggle-btn">
        <input type="checkbox" defaultChecked={checked} />
        <span></span>
      </div>
    </Switch>
  );
};
export default ThemeToggle;

const Switch = styled.div`
  border-radius: 40px;
  overflow: hidden;

  .toggle-btn {
    position: relative;
    width: 56px;
    height: 27px;
    margin: 0 auto;
    border-radius: 40px;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.border};
  }

  input[type="checkbox"] {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: 0px;
    cursor: pointer;
    opacity: 0;
    z-index: 2;
  }

  span {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    overflow: hidden;
    opacity: 1;
    background-color: #fff;
    border-radius: 40px;
    transition: 0.2s ease background-color, 0.2s ease opacity;
  }

  span:before,
  span:after {
    content: "";
    position: absolute;
    top: 2px;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    transition: 0.5s ease transform, 0.2s ease background-color;
  }

  span:before {
    background-color: #fff;
    transform: translate(-60px, 0px);
    opacity: 0;
    z-index: 1;
  }

  input[type="checkbox"]:checked + span:before {
    background-color: #202020;
    transform: translate(23px, -7px);
    opacity: 1;
  }

  span:after {
    background-color: #202020;
    transform: translate(2px, 0px);
    z-index: 0;
  }

  input[type="checkbox"]:checked + span {
    background-color: #202020;
  }

  input[type="checkbox"]:checked + span:after {
    background-color: #ddd;
    transform: translate(30px, 0px);
  }
`;
