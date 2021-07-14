import styled from "styled-components";

const Branding: React.FC = () => {
  return (
    <Brand>
      <span>
        <img src="favicon.jpeg" alt="brand logo" />
      </span>

      <h1>ALC</h1>
      <h4>Anagnostou Lift Club</h4>
    </Brand>
  );
};
export default Branding;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 170px;
  margin-bottom: 2rem;

  span img {
    max-height: 130px;
    margin-bottom: -0.5rem;
    border-radius: 50%;
  }

  h1 {
    text-align: center;
    font-weight: 100;
    font-size: 3.5rem;
    color: #5d78ee;
  }
  h4 {
    font-size: 1rem;
    text-align: center;
    font-weight: 200;
    color: grey;
  }
`;
