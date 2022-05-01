import styled from 'styled-components/macro';

export const CategoryContainer = styled.div`
  width: ${(p) => p.theme.design.category.widthPx}px;

  flex-grow: 0;
  padding: 0.5rem 1rem;

  background-color: #ebecf0;
  border-radius: ${(p) => p.theme.design.category.radiusPx}px;
`;

export const CategoryTitle = styled.div`
  font-weight: bold;
  text-align: center;

  padding: 0.5rem 0 1rem;
`;

export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 20px;
`;
