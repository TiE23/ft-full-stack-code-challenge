import useHideOnClickOutside from '../../hooks/useHideOnClickOutside';
import { EntityType } from '../../types/api.types';

import { AddEntityButton, NewEntityFormContainer } from './NewEntity.styles';
import NewEntityForm from './NewEntityForm';

interface NewEntityProps {
  entityType: EntityType;
}

export function NewEntity({ entityType }: NewEntityProps) {
  const [showForm, setShowForm, ref] =
    useHideOnClickOutside<HTMLDivElement>(false);

  return (
    <NewEntityFormContainer ref={ref}>
      {showForm ? (
        <NewEntityForm
          onSubmit={() => {
            setShowForm(false);
          }}
          entityType={entityType}
        />
      ) : (
        <AddEntityButton onClick={() => setShowForm(true)}>
          + Create a new {entityType}
        </AddEntityButton>
      )}
    </NewEntityFormContainer>
  );
}
