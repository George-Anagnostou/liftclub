import styled from "styled-components";

const options = [
  { value: "avgWeight", text: "Average" },
  { value: "totalWeight", text: "Total" },
  { value: "maxWeight", text: "Max" },
];

interface Props {
  setStatOption: React.Dispatch<React.SetStateAction<"avgWeight" | "totalWeight" | "maxWeight">>;
  statOption: "avgWeight" | "totalWeight" | "maxWeight";
}

const StatButtons: React.FC<Props> = ({ setStatOption, statOption }) => {
  const handleButtonClick = (e) => {
    setStatOption(e.target.value);
  };

  return (
    <Buttons>
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
export default StatButtons;

const Buttons = styled.div`
  display: flex;
  width: 90%;
  margin: 0 auto 0.5rem;

  button {
    flex: 1;
    font-size: 0.8rem;
    padding: 0.25rem;
    border-radius: 0px;
    color: ${({ theme }) => theme.textLight};
    background: inherit;
    border: none;
    border-bottom: 2px solid ${({ theme }) => theme.border};

    &.highlight {
      color: ${({ theme }) => theme.text};
      border-bottom: 2px solid ${({ theme }) => theme.accentSoft};
    }
  }
`;
