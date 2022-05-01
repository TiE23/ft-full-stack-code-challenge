import styled from 'styled-components';

/* eslint-disable-next-line */
export interface NewEntityFormProps {}

const StyledNewEntityForm = styled.div`
  color: pink;
`;

export function NewEntityForm(props: NewEntityFormProps) {
  return (
    <StyledNewEntityForm>
      <h1>Welcome to NewEntityForm!</h1>
    </StyledNewEntityForm>
  );
}

export default NewEntityForm;
