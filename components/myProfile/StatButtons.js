import styled from "styled-components";

const options = [
  { value: "avgWeight", text: "Average Weight" },
  { value: "totalWeight", text: "Total Weight" },
  { value: "maxWeight", text: "Max Weight" },
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
    cursor: pointer;
    margin: 0.35rem;
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.body};

    &.highlight {
      background: ${({ theme }) => theme.accentSoft};
    }
  }
`;
