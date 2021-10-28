import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import Branding from "../components/homepage/Branding";

interface Props {}

const purpose: React.FC<Props> = () => {
  const [imgNum, setImgNum] = useState(0);

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

      <Images>
        <div className="slider" style={{ marginLeft: `${imgNum * -100}%` }}>
          <div className={`image ${imgNum === 0 && "show"}`}>
            <Image
              src="/app-screenshots/liftclub-mobile2.jpg"
              layout="intrinsic"
              height={500}
              width={230}
            />
          </div>
          <div className={`image ${imgNum === 1 && "show"}`}>
            <Image
              src="/app-screenshots/liftclub-mobile1.jpg"
              layout="intrinsic"
              height={500}
              width={230}
            />
          </div>
          <div className={`image ${imgNum === 2 && "show"}`}>
            <Image
              src="/app-screenshots/liftclub-main.jpg"
              layout="intrinsic"
              height={450}
              width={800}
            />
          </div>
        </div>

        <div className="img-btns">
          {[0, 1, 2].map((num) => (
            <span onClick={() => setImgNum(num)} className={imgNum === num ? "highlight" : ""} />
          ))}
        </div>
      </Images>
    </Container>
  );
};

export default purpose;

const Container = styled.section`
  display: flex;
  height: 93vh;
  justify-content: center;
  align-items: center;
  padding: 11vh 1rem 0;

  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
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
  padding: 1rem 3rem;
  flex: 1;

  h1 {
    font-weight: 500;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-weight: 200;
    letter-spacing: 1px;
    width: 90%;
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

const Images = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: show;
  height: 100%;

  .slider {
    display: flex;
    height: 100%;
    width: 100%;
    transition: margin-left 0.25s ease-out;

    .image {
      opacity: 0;
      display: grid;
      place-items: center;
      min-height: 100%;
      min-width: 100%;
      transition: all 0.25s ease-in;

      img {
        border-radius: 10px;
      }

      &.show {
        opacity: 1;
      }
    }
  }

  .img-btns {
    margin: 1.5rem auto 0;
    width: fit-content;
    display: flex;

    span {
      transition: all 0.25s ease-in;
      margin: 0 0.35rem;
      border-radius: 50%;
      height: 15px;
      width: 15px;
      background: ${({ theme }) => theme.textLight};

      &.highlight {
        background: ${({ theme }) => theme.accent};
      }
    }
  }
`;
