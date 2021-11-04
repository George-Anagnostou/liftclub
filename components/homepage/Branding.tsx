import styled from "styled-components";
import Image from "next/image";

const Branding: React.FC = () => {
  return (
    <Brand>
      <div>
        <Image
          src="/favicon.png"
          layout="fixed"
          height="100"
          width="100"
          alt="Lift Club Logo"
          priority
        />
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
    font-weight: 400;
    color: ${({ theme }) => theme.text};
    width: max-content;
  }
`;
