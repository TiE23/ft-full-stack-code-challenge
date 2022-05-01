import styled from 'styled-components/macro';

export const BoardBase = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  overflow-y: scroll;
  gap: 20px;
  padding: ${(p) => p.theme.design.board.paddingPx}px;

  background-color: #c3ceda;
  border-radius: ${(p) => p.theme.design.board.radiusPx}px;
`;
