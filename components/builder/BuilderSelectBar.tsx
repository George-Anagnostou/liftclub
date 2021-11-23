import React from "react";
import styled from "styled-components";

interface Props {
  builderType: string;
  setBuilderType: React.Dispatch<React.SetStateAction<string>>;
}

const BuilderSelectBar: React.FC<Props> = ({ builderType, setBuilderType }) => {
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
};
export default BuilderSelectBar;

const Bar = styled.div`
  position: sticky;
  top: 0;
  width: calc(100% + 1rem);
  margin-left: -0.5rem;
  margin-bottom: 0.5rem;

  ul {
    display: flex;
    background: ${({ theme }) => theme.background};

    li {
      text-transform: uppercase;
      letter-spacing: 1px;
      flex: 1;
      font-weight: 200;
      padding: 0.5rem 0 0.25rem;
      color: ${({ theme }) => theme.textLight};
      border-bottom: 3px solid ${({ theme }) => theme.buttonMed};
      cursor: pointer;
      transition: all 0.5s ease;

      &.selected {
        color: ${({ theme }) => theme.text};
        border-bottom: 3px solid ${({ theme }) => theme.accentSoft};
      }
    }
  }
`;
