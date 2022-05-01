import styled from 'styled-components/macro';

export const CategoryContainer = styled.div`
  background-color: #ebecf0;
  width: 300px;
  min-height: 100px;
  border-radius: 6px;
  padding: 8px 16px;
  flex-grow: 0;
`;

export const CategoryTitle = styled.div`
  padding: 6px 0 12px;
  font-weight: bold;
  text-align: center;
`;

export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;
