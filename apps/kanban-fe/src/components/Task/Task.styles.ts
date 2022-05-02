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
