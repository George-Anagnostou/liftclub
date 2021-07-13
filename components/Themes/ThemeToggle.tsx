import { useContext, useState } from "react";
import styled from "styled-components";
import { ThemeToggleContext } from "./useThemeState";

const ThemeToggle: React.FC = () => {
  const themeToggler = useContext(ThemeToggleContext)!;

  const [checked, setChecked] = useState(localStorage.getItem("theme") === "dark");

  return (
    <Switch>
      <input type="checkbox" defaultChecked={checked} />
      <div onClick={themeToggler}>
        <span></span>
      </div>
    </Switch>
  );
};
export default ThemeToggle;

const Switch = styled.label`
  --line: #000000;
  --dot: #c2c2c2;
  --circle: #3d3d3d;
  --duration: 0.25s;
  cursor: pointer;

  display: block;
  width: 45px;

  input {
    display: none;

    & + div {
      position: relative;
      height: 1.1rem;

      &:before,
      &:after {
        --s: 1;
        content: "";
        position: absolute;
        height: 4px;
        top: 7px;
        width: 25px;

        background: var(--line);
        transform: scaleX(var(--s));
        transition: transform var(--duration) ease;
      }
      &:before {
        --s: 0;
        left: 0;
        transform-origin: 0 50%;
        border-radius: 5px 0 0 5px;
      }
      &:after {
        left: 18px;
        transform-origin: 100% 50%;
        border-radius: 0 5px 5px 0;
      }
      span {
        padding-left: 56px;
        line-height: 24px;
        &:before {
          --x: 0;
          --b: var(--circle);
          --s: 4px;
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          box-shadow: inset 0 0 0 var(--s) var(--b);
          transform: translateX(var(--x));
          transition: all var(--duration) ease;
        }
        &:not(:empty) {
          padding-left: 64px;
        }
      }
    }
    &:checked {
      & + div {
        &:before {
          --s: 1;
        }
        &:after {
          --s: 0;
        }
        span {
          &:before {
            --x: 25px;
            --s: 12px;
            --b: var(--dot);
          }
        }
      }
    }
  }
`;
