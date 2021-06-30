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
            key={type}
          >
            {type}
          </li>
        ))}
      </ul>
    </Bar>
  );
}

const Bar = styled.div`
  position: sticky;
  top: 0;
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

      &.selected {
        color: ${({ theme }) => theme.accentText};
        background: ${({ theme }) => theme.accentSoft};
      }
    }
  }
`;
