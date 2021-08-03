import styled from "styled-components";

const Branding: React.FC = () => {
  return (
    <Brand>
      <div>
        <img src="favicon.png" alt="brand logo" />
      </div>

      <h1>Lift Club</h1>
    </Brand>
  );
};
export default Branding;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 2rem;

  div img {
    max-height: 100px;
    margin-bottom: -0.5rem;
    border-radius: 50%;
  }

  h1 {
    margin-top: 1rem;
    font-weight: 200;
    color: ${({ theme }) => theme.text};
  }
`;
