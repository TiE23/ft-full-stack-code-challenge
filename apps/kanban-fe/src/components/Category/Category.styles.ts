import styled from 'styled-components/macro';

export const CategoryContainer = styled.div`
  width: ${(p) => p.theme.design.category.widthPx}px;

  flex-grow: 0;
  padding: 0.5rem 1rem 1rem;

  background-color: ${(p) => p.theme.design.category.bgColor};
  border-radius: ${(p) => p.theme.design.category.radiusPx}px;
`;

export const CategoryTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
`;

export const CategoryTitle = styled.div`
  font-weight: bold;
  text-align: center;

  padding: 0.5rem 0 1rem;
`;

export const CategoryControlsContainer = styled.div`
  padding-bottom: 0.5rem; /* I don't like this. */
`;

export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 20px;
`;
