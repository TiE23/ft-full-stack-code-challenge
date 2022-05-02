import styled from 'styled-components/macro';

const StringInput = styled.input`
  width: 100%;

  padding: 0.5rem 1rem;

  border: none;
  border-radius: 3px;
  box-shadow: ${(p) => p.theme.design.common.bottomBoxShadow};
`;

export default StringInput;
