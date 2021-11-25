import styled, { css } from "styled-components";

const options = [
  { value: "avgWeight", text: "Rep Avg" },
  { value: "totalWeight", text: "Volume" },
  { value: "maxWeight", text: "Max" },
];

interface Props {
  setStatOption: React.Dispatch<React.SetStateAction<"avgWeight" | "totalWeight" | "maxWeight">>;
  statOption: "avgWeight" | "totalWeight" | "maxWeight";
}

const ChartStatButtons: React.FC<Props> = ({ setStatOption, statOption }) => {
  const handleButtonClick = (e) => {
    setStatOption(e.target.value);
  };

  return (
    <Buttons xPos={options.findIndex(({ value }) => value === statOption) * 33.33}>
      {options.map(({ value, text }) => (
        <button
          key={value}
          onClick={handleButtonClick}
          value={value}
          className={statOption === value ? "highlight" : ""}
        >
          {text}
        </button>
      ))}
    </Buttons>
  );
};
export default ChartStatButtons;

const Buttons = styled.div<{ xPos: number }>`
  height: 30px;
  display: flex;
  width: 100%;
  margin: 0 auto 0.5rem;
  position: relative;

  button {
    background: transparent;
    flex: 1;
    font-weight: 300;
    font-size: 0.8rem;
    padding: 0.25rem;
    color: ${({ theme }) => theme.textLight};
    border: none;
    text-shadow: 0 0 3px ${({ theme }) => theme.boxShadow};
    transition: all 0.2s ease;

    &.highlight {
      color: ${({ theme }) => theme.text};
    }
  }
  ${({ xPos }) => css`
    &::after {
      pointer-events: none;
      transition: all 0.2s ease;
      border-radius: 0 0 5px 5px;
      content: "";
      left: ${xPos}%;
      position: absolute;
      height: 100%;
      width: 33.33%;
      background-color: ${({ theme }) => theme.medOpacity};
    }
  `}
`;
