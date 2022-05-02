import styled from 'styled-components/macro';
import { Px } from '../../types/styling.types';

export const TaskContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  background-color: ${(p) => p.theme.design.task.bgColor};
  border-radius: ${(p) => p.theme.design.task.radiusPx}px;
  box-shadow: ${(p) => p.theme.design.common.bottomBoxShadow};
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

export const TaskTitleRowLeft = styled.div`
  flex-grow: 1;
  padding: 0.5rem 1rem;
`;

export const TaskControlsContainer = styled.div`
  position: relative;
`;

interface TaskExpandedAreaProps {
  expanded: boolean;
  expandedHeightPx: Px;
}
export const TaskExpandedArea = styled.div<TaskExpandedAreaProps>`
  width: 100%;
  max-height: ${({ expanded, expandedHeightPx }) =>
    expanded ? expandedHeightPx : 0}px;

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
