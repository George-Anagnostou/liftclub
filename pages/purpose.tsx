import React from "react";
import styled from "styled-components";

interface Props {}

const purpose: React.FC<Props> = () => {
  return (
    <div>
      <TextContainer>
        <h1>Lift for Life</h1>
        <p>
          Lift club assists in the process of making you physically superior. With minimal
          interaction, you can finally stay on track to achieve your fitness goals.
        </p>
      </TextContainer>
    </div>
  );
};

export default purpose;

const TextContainer = styled.div``;
