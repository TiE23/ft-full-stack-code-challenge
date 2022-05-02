import styled, { css } from 'styled-components/macro';

export const TaskContainer = styled.div`
  width: 100%;

  background-color: #fff;
  border-radius: ${(p) => p.theme.design.task.radiusPx}px;
  box-shadow: #091e4240 0px 1px 0px 0px;
  cursor: pointer;
`;

export const TaskTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
`;

export const TaskTitle = styled.div`
  padding: 0.5rem 1rem;
`;

export const TaskControlsSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0 0.5rem;
  gap: 0.4rem;
`;

interface ButtonWrapperProps {
  disabled?: boolean;
}
export const ButtonWrapper = styled.div<ButtonWrapperProps>`
  ${({ disabled }) =>
    disabled
      ? css`
          * {
            opacity: 50%;
          }
        `
      : null}
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
