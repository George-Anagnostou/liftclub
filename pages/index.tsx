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

  const [formType, setFormType] = useState<"login" | "create">(
    router.query.create ? "create" : "login"
  );

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
  /* font-family: Tahoma, Helvetica; */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: fit-content;
  max-width: 500px;
  margin: auto;
`;

const LinkContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.8rem;
  color: inherit;
  border: 0.5px solid ${({ theme }) => theme.accentSoft};
  box-shadow: inset 0 0px 3px ${({ theme }) => theme.accentSoft},
    0 2px 5px ${({ theme }) => theme.boxShadow};
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
`;
