import styled from "styled-components";

interface Params<T> {
  keyProp: string;
  items: T[] | undefined;
  onItemClick: (item: T) => any;
  displayProp: string;
  onDeleteClick?: (item: T) => any;
  isHighlighted?: (item: T) => boolean;
  isLoading?: (item: T) => boolean;
}

export function TiledList<T>({
  keyProp,
  items,
  onItemClick,
  displayProp,
  onDeleteClick,
  isHighlighted,
  isLoading,
}: Params<T>) {
  return (
    <List>
      {items?.length ? (
        items.map((item) => (
          <li
            key={item[keyProp]}
            onClick={() => onItemClick(item)}
            className={` ${isHighlighted && isHighlighted(item) && "highlight"} ${
              isLoading && isLoading(item) && "loading"
            }`}
          >
            {item[displayProp]}
            {onDeleteClick && <button onClick={() => onDeleteClick(item)}>✕</button>}
          </li>
        ))
      ) : (
        <p className="fallback-text">None</p>
      )}
    </List>
  );
}
export default TiledList;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;

  li {
    background: ${({ theme }) => theme.buttonMed};
    box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
    border-radius: 5px;
    cursor: pointer;
    padding: 0.35rem 0.75rem;
    margin: 0 0.25rem 0.5rem;
    word-wrap: break-word;
    text-align: left;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    font-weight: 300;
    position: relative;
    overflow: hidden;

    button {
      font-size: 0.75rem;
      font-weight: 600;
      background: ${({ theme }) => theme.buttonLight};
      color: ${({ theme }) => theme.textLight};
      border: none;
      border-radius: 3px;
      margin-left: 0.75rem;
      height: 25px;
      width: 25px;
      min-width: 25px;
      display: grid;
      place-items: center;
      transition: all 0.25s ease;
    }

    &.highlight {
      background: ${({ theme }) => theme.accentSoft};
      color: ${({ theme }) => theme.accentText};

      button {
        background: ${({ theme }) => theme.accent};
        color: ${({ theme }) => theme.accentText};
      }
    }

    &:active {
      transform: scale(0.95);
    }

    &.loading {
      background: ${({ theme }) => theme.body};
      button {
        background: transparent;
      }

      &::after {
        position: absolute;
        z-index: -1;
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
          ${({ theme }) => theme.buttonMed} 60%
        );
        animation-name: shimmer;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        content: "";
      }
      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
    }
  }

  .fallback-text {
    width: fit-content;
    padding: 0 1rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 200;
  }
`;
