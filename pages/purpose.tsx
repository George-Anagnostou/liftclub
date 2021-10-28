import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import Branding from "../components/homepage/Branding";
import { ThemeToggleContext, useThemeState } from "../components/Themes/useThemeState";

interface Props {}

const purpose: React.FC<Props> = () => {
  const { themeMode } = useThemeState();

  const [imgNum, setImgNum] = useState<undefined | number>(undefined);

  useEffect(() => {
    themeMode === "dark" ? setImgNum(1) : setImgNum(0);
  }, [themeMode]);

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
        <div className="slider" style={{ marginLeft: `${(imgNum || 0) * -100}%` }}>
          <div className={`image ${imgNum === 0 && "show"}`}>
            <Image
              src="/app-screenshots/liftclub-mobile2.jpg"
              layout="intrinsic"
              height={500}
              width={230}
              quality={100}
              priority
            />
          </div>
          <div className={`image ${imgNum === 1 && "show"}`}>
            <Image
              src="/app-screenshots/liftclub-mobile1.jpg"
              layout="intrinsic"
              height={500}
              width={230}
              quality={100}
              priority
            />
          </div>
          <div className={`image ${imgNum === 2 && "show"}`}>
            <Image
              src="/app-screenshots/liftclub-main.jpg"
              layout="intrinsic"
              height={450}
              width={800}
              quality={100}
              priority
            />
          </div>
        </div>

        <div className="img-btns">
          {[0, 1, 2].map((num) => (
            <span
              onClick={() => setImgNum(num)}
              className={imgNum === num ? "highlight" : ""}
              key={num}
            />
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
    height: auto;
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

  @media screen and (max-width: 600px) {
    padding: 1rem 0;
  }

  h1 {
    font-weight: 500;
    font-size: 3.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.body};
    text-shadow: -2px 2px 0 ${({ theme }) => theme.accent},
      1px 1px 0 ${({ theme }) => theme.accentSoft}, 1px -1px 0 ${({ theme }) => theme.accent},
      -1px -1px 0 ${({ theme }) => theme.accentSoft};
    letter-spacing: 1px;
  }

  p {
    font-weight: 200;
    letter-spacing: 1px;
    width: 90%;
  }
`;

const Buttons = styled.div`
  border-top: 1px solid ${({ theme }) => theme.accent};
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
    border: 1px solid ${({ theme }) => theme.accent};
    margin-right: 1rem;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    color: ${({ theme }) => theme.textLight};
    box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
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
      transition: all 0.15s ease-in;

      > div {
        border-radius: 10px;
        box-shadow: 0px 10px 20px ${({ theme }) => theme.boxShadow};
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
      &:hover {
        background: ${({ theme }) => theme.border};
      }
      &.highlight {
        background: ${({ theme }) => theme.accent};
      }
    }
  }
`;
