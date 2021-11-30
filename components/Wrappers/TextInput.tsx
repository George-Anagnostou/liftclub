import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDebouncedState } from "../hooks/useDebouncedState";

interface Props {
  onChange: (inputText: string) => void;
  inputName: string;
  debounceTime?: number;
  labelText?: string;
  placeholder?: string;
  autoComplete?: boolean;
}

const TextInput: React.FC<Props> = ({
  onChange,
  inputName,
  debounceTime = 0,
  labelText,
  placeholder,
  autoComplete = true,
}) => {
  const router = useRouter();

  const [text, setText] = useState("");
  const debouncedText = useDebouncedState(text, debounceTime);

  const handleTermChange = ({ target }) => {
    setText(target.value);
  };

  useEffect(() => {
    onChange(debouncedText);
  }, [debouncedText]);

  useEffect(() => {
    setText("");
  }, [router]);

  return (
    <InputContainer>
      <label htmlFor={inputName}>{labelText}</label>

      <div className="input-bar">
        <input
          type="text"
          value={text}
          onChange={handleTermChange}
          name={inputName}
          className="text-input"
          placeholder={placeholder}
          autoComplete={autoComplete?.toString()}
        />

        <span onClick={() => setText("")} className={` ${text.length ? "highlight" : ""}`}>
          ✕
        </span>
      </div>
    </InputContainer>
  );
};

export default TextInput;

const InputContainer = styled.div`
  width: 100%;
  position: relative;
  padding: 0.25rem;

  label {
    font-weight: 200;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .input-bar {
    display: flex;
    align-items: center;

    .text-input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      font-size: inherit;
      font-weight: 300;
      flex: 1;
      width: 100%;
      background: ${({ theme }) => theme.buttonMed};
      border: none;
      padding: 0.25rem 0.5rem;
      color: inherit;
      border-radius: 5px;
      border: 1px solid ${({ theme }) => theme.border};
      box-shadow: none;

      &:focus {
        outline: none;
        border: 1px solid ${({ theme }) => theme.accent};
      }
      &::placeholder {
        color: ${({ theme }) => theme.border};
      }
    }
    span {
      position: absolute;
      right: 0.23rem;
      color: ${({ theme }) => theme.border};
      text-align: center;
      padding: 0 6px;
      transition: all 0.25s ease;

      &.highlight {
        color: ${({ theme }) => theme.textLight};
      }
    }
  }
`;
