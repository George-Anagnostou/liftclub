import styled from "styled-components";
import Image from "next/image";
import { useThemeState } from "../Themes/useThemeState";

const Branding: React.FC = () => {
  const { themeMode } = useThemeState();
  console.log(themeMode);

  return (
    <Brand>
      <div className={themeMode === "dark" ? "dark" : "light"}>
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

  div {
    span {
      overflow: visible !important;
      img {
        box-shadow: 0 5px 10px ${({ theme }) => theme.boxShadow};
        max-height: 100px;
        margin-bottom: -0.5rem;
        border-radius: 50%;
      }
    }

    &.dark img {
      opacity: 0.8;
    }
  }

  h1 {
    margin-top: 0.5rem;
    font-weight: 300;
    color: ${({ theme }) => theme.text};
    width: max-content;
  }
`;
