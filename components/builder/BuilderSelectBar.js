import React from "react";
import styled from "styled-components";

export default function BuilderSelectBar({ builderType, setBuilderType }) {
  return (
    <Bar>
      <ul>
        {["workout", "routine", "team"].map((type) => (
          <li
            className={builderType === type ? "selected" : ""}
            onClick={() => setBuilderType(type)}
          >
            {type}
          </li>
        ))}
      </ul>
    </Bar>
  );
}

const Bar = styled.div`
  width: calc(100% + 1rem);
  margin-left: -0.5rem;
  margin-bottom: 0.5rem;
  ul {
    display: flex;

    li {
      text-transform: capitalize;
      flex: 1;
      padding: 0.5rem 0;
      color: ${({ theme }) => theme.text};
      background: ${({ theme }) => theme.background};

      &:nth-child(1) {
        border-radius: 0 0 5px 0;
        margin-right: 3px;
      }
      &:nth-child(2) {
        border-radius: 0 0 5px 5px;
      }
      &:nth-child(3) {
        border-radius: 0 0 0 5px;
        margin-left: 3px;
      }

      &.selected {
        color: ${({ theme }) => theme.accentText};
        background: ${({ theme }) => theme.accentSoft};
      }
    }
  }
`;
