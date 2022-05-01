import useHideOnClickOutside from '../../hooks/useHideOnClickOutside';

import { AddEntityButton, NewEntityFormContainer } from './NewEntity.styles';
import NewEntityForm from './NewEntityForm';

interface NewEntityProps {
  buttonText: string;
}

export function NewEntity({ buttonText }: NewEntityProps) {
  const [showForm, setShowForm, ref] =
    useHideOnClickOutside<HTMLDivElement>(false);

  return (
    <NewEntityFormContainer ref={ref}>
      {showForm ? (
        <NewEntityForm
          onCreate={(input) => {
            console.log('Submitted:', input);
            setShowForm(false);
          }}
        />
      ) : (
        <AddEntityButton onClick={() => setShowForm(true)}>
          {buttonText}
        </AddEntityButton>
      )}
    </NewEntityFormContainer>
  );
}
