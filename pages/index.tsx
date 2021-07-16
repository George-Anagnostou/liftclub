import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import Branding from "../components/homepage/Branding";
import Login from "../components/homepage/Login";
import CreateAcc from "../components/homepage/CreateAcc";

export default function Home() {
  const router = useRouter();

  const [formType, setFormType] = useState("login");

  const handleLinkClick = () => setFormType(formType === "login" ? "create" : "login");

  // Route to workoutLog
  const routeToWorkoutLog = () => router.push("/log");

  return (
    <HomeContainer>
      <Branding />

      {formType === "login" && (
        <Login routeToWorkoutLog={routeToWorkoutLog} handleLinkClick={handleLinkClick} />
      )}
      {formType === "create" && (
        <CreateAcc routeToWorkoutLog={routeToWorkoutLog} handleLinkClick={handleLinkClick} />
      )}
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  font-family: Tahoma, Helvetica;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;
