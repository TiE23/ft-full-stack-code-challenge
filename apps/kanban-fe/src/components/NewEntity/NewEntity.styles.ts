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

interface NewEntityButtonProps {
  disabled?: boolean;
}
export const NewEntityCreateButton = styled.button<NewEntityButtonProps>`
  color: #fff;
  text-align: center;

  padding: 6px 12px;

  background-color: ${(p) => (p.disabled ? '#8b8b8b' : '#5aac44')};
  border: none;
  border-radius: ${(p) => p.theme.design.newEntity.radiusPx}px;
  box-shadow: none;
  cursor: pointer;
`;

export const NewEntityInput = styled.input`
  width: 100%;

  padding: 0.5rem 1rem;

  border: none;
  border-radius: 3px;
  box-shadow: #091e4240 0px 1px 0px 0px;
`;

export const AddEntityButton = styled.button`
  width: 100%;
  max-width: ${(p) => p.theme.design.category.widthPx}px;

  color: black;
  text-align: left;

  padding: 0.5rem 1rem;

  border-radius: ${(p) => p.theme.design.newEntity.radiusPx}px;
  border: none;
  background-color: #ffffff3d;
  cursor: pointer;
  transition: background 200ms ease-in;

  &:hover {
    background-color: #ffffff52;
  }
`;
