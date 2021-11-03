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
            {onDeleteClick && <button onClick={() => onDeleteClick(item)}>X</button>}
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
    box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
    border-radius: 5px;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    margin: 0 0.25rem 0.5rem;
    word-wrap: break-word;
    text-align: left;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    font-weight: 300;

    button {
      font-size: 0.7rem;
      font-weight: 600;
      background: ${({ theme }) => theme.buttonLight};
      color: ${({ theme }) => theme.textLight};
      border: none;
      border-radius: 3px;
      margin-left: 0.3rem;
      height: 20px;
      min-width: 20px;
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

    &.loading {
      background: linear-gradient(
        to left,
        ${({ theme }) => theme.buttonMed},
        ${({ theme }) => theme.border}
      );
      color: ${({ theme }) => theme.text};
      background-position: -100%;
      background-size: 200% 100%;

      animation: ease-in loading 1s infinite;

      @keyframes loading {
        to {
          background-position: 100%;
          background-size: 100% 100%;
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
