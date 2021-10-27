import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Link from "next/link";
// Components
import Branding from "../components/homepage/Branding";
import Login from "../components/homepage/Login";
import CreateAcc from "../components/homepage/CreateAcc";

export default function Home() {
  const router = useRouter();

  const getFormType = () => (router.query.create ? "create" : "login");

  const [formType, setFormType] = useState<"login" | "create">(getFormType);

  const changeFormType = () => setFormType(formType === "login" ? "create" : "login");

  const handleAuthSuccess = () => router.push(`/log`);

  return (
    <HomeContainer>
      <LinkContainer>
        <Link href="/purpose">Lift Club?</Link>
      </LinkContainer>

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
  max-width: 500px;
  margin: auto;
`;

const LinkContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.8rem;
  color: inherit;
  border: 1px solid ${({ theme }) => theme.textLight};
  box-shadow: 0 2px 10px ${({ theme }) => theme.boxShadow};
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
`;
