import styled from "styled-components";

interface Props {
  styles?: any;
}

const LoadingSpinner: React.FC<Props> = ({ styles }) => {
  return <Loader style={styles} className="loadingSpinner" />;
};

export default LoadingSpinner;

const Loader = styled.div`
  margin: auto;
  border: 3px solid ${({ theme }) => theme.buttonLight};
  border-radius: 50%;
  border-top: 3px solid ${({ theme }) => theme.accentSoft};
  width: 25px;
  height: 25px;
  -webkit-animation: spin 0.5s linear infinite; /* Safari */
  animation: spin 0.5s linear infinite;

  /* Safari */
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
