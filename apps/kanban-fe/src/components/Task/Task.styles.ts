import styled from 'styled-components/macro';

export const TaskContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  background-color: ${(p) => p.theme.design.task.bgColor};
  border-radius: ${(p) => p.theme.design.task.radiusPx}px;
  box-shadow: #091e4240 0px 1px 0px 0px;
  cursor: pointer;
  overflow: hidden;
`;

export const TaskTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
`;

export const TaskTitle = styled.div`
  flex-grow: 1;
  padding: 0.5rem 1rem;
`;

interface TaskExpandedAreaProps {
  expanded: boolean;
}
export const TaskExpandedArea = styled.div<TaskExpandedAreaProps>`
  width: 100%;
  max-height: ${({ expanded }) => (expanded ? 60 : 0)}px;

  background-image: linear-gradient(
    to top,
    ${(p) => p.theme.design.task.expandedBgColor},
    ${(p) => p.theme.design.task.bgColor}
  );
  opacity: ${({ expanded }) => (expanded ? 100 : 0)}%;
  overflow-y: clipped;

  transition: all 500ms ease-in-out;
`;

export const TaskExpandedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  padding: 0.5rem 1rem;
`;
export const TaskDatesGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto auto;
  grid-gap: 0.5rem;
  justify-items: start;

  span:nth-child(odd) {
    justify-self: right;
  }
`;

export const TaskDate = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.design.task.fadedTextColor};
`;
