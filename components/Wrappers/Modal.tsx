import { useRef, useEffect } from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  removeModal: () => void;
  isOpen: boolean;
}

const Modal: React.FC<Props> = ({ children, removeModal, isOpen }) => {
  const shadow = useRef<HTMLDivElement>(null);

  const handleShadowClick = ({ target }) => {
    if (target.classList.contains("shadow")) removeModal();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.height = "100vh";
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.height = "auto";
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <Shadow ref={shadow} className="shadow" onClick={handleShadowClick}>
      {children}
    </Shadow>
  );
};
export default Modal;

const Shadow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.opacityBackground};
  z-index: 99999;

  touch-action: none;
  -webkit-overflow-scrolling: none;
  overflow: hidden;
  overscroll-behavior: none;
`;
