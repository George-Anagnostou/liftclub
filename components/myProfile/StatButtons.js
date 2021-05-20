import styled from "styled-components";

const activeStyles = { background: "#eaeeff" };

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
          style={statOption === value ? activeStyles : null}
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
    cursor: pointer;
    margin: 0.5rem;
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;

    &:hover {
      background: #eaeeff;
    }
  }
`;
