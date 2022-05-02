import useHideOnClickOutside from '../../hooks/useHideOnClickOutside';
import { EntityType } from '../../types/api.types';
import { EntityId } from '../../types/entity.types';

import { AddEntityButton, NewEntityFormContainer } from './NewEntity.styles';
import NewEntityForm from './NewEntityForm';

/**
 * I love TypeScript.
 */
type NewEntityProps =
  | {
      entityType: EntityType.CATEGORY;
    }
  | {
      entityType: EntityType.TASK;
      categoryId: EntityId;
    };

export function NewEntity(props: NewEntityProps) {
  const { entityType } = props;
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
          categoryId={
            entityType === EntityType.TASK ? props.categoryId : undefined
          }
        />
      ) : (
        <AddEntityButton onClick={() => setShowForm(true)}>
          + Create a new {entityType}
        </AddEntityButton>
      )}
    </NewEntityFormContainer>
  );
}
