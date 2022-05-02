import styled, { css } from 'styled-components/macro';

export const ControlsSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0 0.5rem;
  gap: 0.4rem;
`;

export const NoStyleButton = styled.button`
  ${({ disabled }) =>
    disabled
      ? css`
          * {
            opacity: 50%;
          }
        `
      : null}

  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;
