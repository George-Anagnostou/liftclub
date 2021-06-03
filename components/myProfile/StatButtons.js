import styled from "styled-components";

const options = [
  { value: "avgWeight", text: "Average" },
  { value: "totalWeight", text: "Total" },
  { value: "maxWeight", text: "Max" },
];

export default function StatButtons({ setStatOption, statOption }) {
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
}

const Buttons = styled.div`
  display: flex;
  width: 100%;
  button {
    flex: 1;
    font-size: 1rem;
    margin: 0 0.5rem 0.5rem;
    padding: 0.5rem;
    border-radius: 5px;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.buttonMed};
    border: 1px solid ${({ theme }) => theme.border};

    &.highlight {
      background: ${({ theme }) => theme.accentSoft};
      border: 1px solid ${({ theme }) => theme.accent};
    }
  }
`;
