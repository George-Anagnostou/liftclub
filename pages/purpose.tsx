import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import Branding from "../components/homepage/Branding";

interface Props {}

const images = [
  {
    src: "/app-screenshots/user-profile.png",
    height: 500,
    width: 230,
    alt: "Lift Club user profile",
  },
  {
    src: "/app-screenshots/workout-log-1.png",
    height: 500,
    width: 230,
    alt: "Lift Club workout log 1",
  },
  {
    src: "/app-screenshots/workout-log-2.png",
    height: 500,
    width: 230,
    alt: "Lift Club workout log 2",
  },
  {
    src: "/app-screenshots/routine-builder.png",
    height: 500,
    width: 230,
    alt: "Lift Club workout routine builder",
  },
  {
    src: "/app-screenshots/team-page.png",
    height: 500,
    width: 230,
    alt: "Lift Club team page",
  },
  {
    src: "/app-screenshots/feed.png",
    height: 500,
    width: 230,
    alt: "Lift Club feed page",
  },
];

const purpose: React.FC<Props> = () => {
  const [imgNum, setImgNum] = useState<number>(0);

  useEffect(() => {
    const rotateImg = () => setImgNum((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const interval = setInterval(rotateImg, 5000);
    return () => clearInterval(interval);
  }, [imgNum]);

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
          {images.map((image, i) => (
            <div className={`image ${imgNum === i && "show"}`} key={image.alt}>
              <Image
                src={image.src}
                layout="intrinsic"
                height={image.height}
                width={image.width}
                quality={100}
                priority
                alt={image.alt}
              />
            </div>
          ))}
        </div>

        <div className="img-btns">
          {[...new Array(images.length)].map((num, i) => (
            <span
              onClick={() => setImgNum(i)}
              className={imgNum === i ? "highlight" : ""}
              key={i}
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
  cursor: pointer;
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

      > span {
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
