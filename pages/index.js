import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import Branding from "../components/HomePage/Branding";
import Login from "../components/HomePage/Login";
import CreateAcc from "../components/HomePage/CreateAcc";

export default function Home() {
  const router = useRouter();

  const [formType, setFormType] = useState("login");

  const handleLinkClick = () => setFormType(formType === "login" ? "create" : "login");

  // Route to workoutLog
  const routeToWorkoutLog = () => router.push("/workoutLog");

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
