import styled, { css } from 'styled-components/macro';
import { Percent } from '../../types/styling.types';

interface ControlsSecetionProps {
  show: boolean;
  opacityMin: Percent;
}
export const ControlsSection = styled.div<ControlsSecetionProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0 0.5rem;
  gap: 0.4rem;

  opacity: ${({ show, opacityMin }) => (show ? 100 : opacityMin)}%;

  transition: opacity 100ms;
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
