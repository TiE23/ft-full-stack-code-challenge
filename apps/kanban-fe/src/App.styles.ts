import styled from 'styled-components/macro';

export const AppContainer = styled.div`
  height: 100%;
  width: 100%;

  padding: 15px;

  background-color: ${(p) => p.theme.design.app.bgColor};
`;
