import styled from 'styled-components/macro';

export const NewEntityFormContainer = styled.div`
  max-width: ${(p) => p.theme.design.category.widthPx}px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  div,
  button,
  input {
    font-size: 0.9rem;
  }
`;

export const AddEntityButton = styled.button`
  width: 100%;
  max-width: ${(p) => p.theme.design.category.widthPx}px;

  color: black;
  text-align: left;

  padding: 0.5rem 1rem;

  border-radius: ${(p) => p.theme.design.newEntity.radiusPx}px;
  border: none;
  background-color: ${(p) => p.theme.design.newEntity.bgColor};
  cursor: pointer;
  transition: background 200ms ease-in;

  &:hover {
    background-color: ${(p) => p.theme.design.newEntity.bgColorHover};
  }
`;
