import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

import useFocus from '../../hooks/useFocus';
import CategoryMutations from '../../mutations/category.mutations';
import TaskMutations from '../../mutations/task.mutations';
import { EntityType } from '../../types/api.types';
import { EntityId } from '../../types/entity.types';

import { NewEntityCreateButton, NewEntityInput } from './NewEntity.styles';

export interface NewEntityFormProps {
  onSubmit: VoidFunction;
  entityType: EntityType;
  categoryId?: EntityId;
}

export function NewEntityForm({
  onSubmit,
  entityType,
  categoryId,
}: NewEntityFormProps) {
  const [input, setInput] = useState('');
  const inputRef = useFocus();

  const queryClient = useQueryClient();
  const taskMutations = new TaskMutations(queryClient);
  const categoryMutations = new CategoryMutations(queryClient);

  /**
   * Listen for the enter key so we can trigger a submit in a controlled manner.
   * @param event
   */
  const handleInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submit();
    }
  };

  const submit = () => {
    if (entityType === EntityType.CATEGORY) {
      categoryMutations.createCategoryMutation.mutate({
        createCategoryDto: { title: input.trim() },
      });
    } else {
      taskMutations.createTaskMutation.mutate({
        categoryId: categoryId || -1,
        createTaskDto: { title: input.trim() },
      });
    }
    onSubmit();
  };

  return (
    <>
      <NewEntityInput
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleInput}
      />
      <NewEntityCreateButton
        onClick={() => submit()}
        disabled={input.trim().length === 0}
      >
        Create {entityType}
      </NewEntityCreateButton>
    </>
  );
}

export default NewEntityForm;
