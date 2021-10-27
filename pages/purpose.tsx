import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Branding from "../components/homepage/Branding";

interface Props {}

const purpose: React.FC<Props> = () => {
  return (
    <Container>
      <Link href="/">
        <LogoIcon>
          <Branding />
        </LogoIcon>
      </Link>

      <Text>
        <h1>Lift for Life</h1>
        <p>
          Lift club assists in the process of making you physically superior. Through minimal
          interaction with the app, you can stay on top of every workout.
        </p>

        <Buttons>
          <p>Join the Club</p>
          <Link href="/?login=page">
            <button>Login</button>
          </Link>
          <Link href="/?create=page">
            <button>Create an Account</button>
          </Link>
        </Buttons>
      </Text>

      <Images></Images>
    </Container>
  );
};

export default purpose;

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
`;

const LogoIcon = styled.div`
  position: absolute;
  top: 0;
  right: 2.5rem;
  height: 0;
  width: 0;
  transform: scale(0.4);
`;

const Text = styled.div`
  text-align: left;
  padding: 1rem;

  h1 {
    font-weight: 500;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-weight: 200;
    letter-spacing: 1px;
  }
`;

const Buttons = styled.div`
  border-top: 1px solid ${({ theme }) => theme.textLight};
  margin-top: 2rem;
  padding: 1rem 0;

  p {
    font-weight: 400;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }

  button {
    background: inherit;
    border: 1px solid ${({ theme }) => theme.textLight};
    margin-right: 1rem;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    color: ${({ theme }) => theme.textLight};
  }
`;

const Images = styled.div``;
