import React from "react";
import styled from "styled-components";

interface Props {
  style?: React.CSSProperties | undefined;
}

const SkeletonBox: React.FC<Props> = ({ style }) => {
  return <Skeleton style={style} />;
};

export default SkeletonBox;

const Skeleton = styled.span`
  display: inline-block;
  height: 1em;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.body};

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-position: center;
    background-image: linear-gradient(
      90deg,
      ${({ theme }) => theme.body} 0,
      ${({ theme }) => theme.buttonMed} 20%,
      ${({ theme }) => theme.buttonMed} 60%,
      ${({ theme }) => theme.body}
    );
    animation-name: fadein, shimmer;
    animation-duration: 0.25s, 2s;
    animation-iteration-count: 1, infinite;
    animation-delay: inherit;
    content: "";
  }
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;
