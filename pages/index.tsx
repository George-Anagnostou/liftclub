import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import Branding from "../components/homepage/Branding";
import Login from "../components/homepage/Login";
import CreateAcc from "../components/homepage/CreateAcc";

export default function Home() {
  const router = useRouter();

  const [formType, setFormType] = useState<"login" | "create">("login");

  const changeFormType = () => setFormType(formType === "login" ? "create" : "login");

  const handleAuthSuccess = () => router.push(`/log`);

  return (
    <HomeContainer>
      <Branding />

      {formType === "login" && (
        <Login changeFormType={changeFormType} handleAuthSuccess={handleAuthSuccess} />
      )}
      {formType === "create" && (
        <CreateAcc changeFormType={changeFormType} handleAuthSuccess={handleAuthSuccess} />
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
