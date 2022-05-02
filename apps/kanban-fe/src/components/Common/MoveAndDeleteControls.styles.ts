import styled, { css } from 'styled-components/macro';
import { animated } from '@react-spring/web';

import { Percent, Px } from '../../types/styling.types';

interface FadeDivProps {
  show: boolean;
  opacityMin?: Percent;
}
const FadeDiv = styled.div<FadeDivProps>`
  opacity: ${({ show, opacityMin = 0 }) => (show ? 100 : opacityMin)}%;
  transition: opacity ${(p) => p.theme.design.controls.transitionTimeMs}ms
    ${(p) => p.theme.design.controls.transitionDelayMs}ms;
`;

interface ControlsContainerProps {
  heightPx: Px;
  widthPx: Px;
}

export const ControlsContainer = styled(FadeDiv)<ControlsContainerProps>`
  position: relative;
  height: ${({ heightPx }) => heightPx}px;
  width: ${({ widthPx }) => widthPx}px;
`;

const EditSection = styled.div`
  right: 0.5rem;
`;
export const AnimatedEditSection = animated(EditSection);

const ControlsSection = styled.div`
  right: 0.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;
export const AnimatedControlsSection = animated(ControlsSection);

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
