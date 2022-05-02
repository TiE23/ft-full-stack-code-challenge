import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

import useFocus from '../../hooks/useFocus';
import CategoryMutations from '../../mutations/category.mutations';
import TaskMutations from '../../mutations/task.mutations';
import { EntityType } from '../../types/api.types';
import { EntityId } from '../../types/entity.types';
import { listenForEnter } from '../../utils/common.utils';

import SubmitButton from '../Common/Inputs/SubmitButton.styled';
import StringInput from '../Common/Inputs/StringInput.styled';

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

  const handleSubmit = () => {
    if (input.trim() === '') {
      return;
    }
    if (entityType === EntityType.CATEGORY) {
      categoryMutations.createCategoryMutation.mutate({
        createCategoryDto: { title: input.trim() },
      });
    } else if (entityType === EntityType.TASK) {
      taskMutations.createTaskMutation.mutate({
        categoryId: categoryId || -1,
        createTaskDto: { title: input.trim() },
      });
    }
    onSubmit();
  };

  return (
    <>
      <StringInput
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={listenForEnter(handleSubmit)}
      />
      <SubmitButton
        onClick={() => handleSubmit()}
        disabled={input.trim().length === 0}
      >
        Create {entityType}
      </SubmitButton>
    </>
  );
}

export default NewEntityForm;
