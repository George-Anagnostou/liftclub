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
  height: 30px;
  display: flex;
  width: 100%;
  margin: 0 auto 0.5rem;

  button {
    flex: 1;
    font-weight: 300;
    font-size: 0.8rem;
    padding: 0.25rem;
    color: ${({ theme }) => theme.textLight};
    background: inherit;
    border: none;
    /* border-top: 0.5px solid ${({ theme }) => theme.medOpacity}; */
    border-radius: 0 0 5px 5px;
    transition: all 0.2s ease;

    &.highlight {
      background: ${({ theme }) => theme.medOpacity};
      color: ${({ theme }) => theme.text};
      /* border-top: 0.5px solid ${({ theme }) => theme.accentSoft}; */
    }
  }
`;
