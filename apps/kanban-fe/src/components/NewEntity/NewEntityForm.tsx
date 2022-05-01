import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { createCategory } from '../../api/category.api';

import useFocus from '../../hooks/useFocus';
import { EntityType } from '../../types/api.types';
import { CategoryEntity, CreateCategoryDto } from '../../types/entity.types';
import { createOptimisticCategory } from '../../utils/entity.utils';
import { NewEntityCreateButton, NewEntityInput } from './NewEntity.styles';

export interface NewEntityFormProps {
  onSubmit: () => void;
  entityType: EntityType;
}

export function NewEntityForm({ onSubmit, entityType }: NewEntityFormProps) {
  const [input, setInput] = useState('');
  const inputRef = useFocus();

  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation(createCategory, {
    onMutate: async (newCategory: CreateCategoryDto) => {
      await queryClient.cancelQueries('categories');

      // Must define the return type explicitly due to a TS <4.7 limitation.
      const previousCategories =
        queryClient.getQueryData<CategoryEntity[]>('categories');

      const optimisticNewCategory = createOptimisticCategory(newCategory);

      queryClient.setQueryData<CategoryEntity[]>('categories', (old) => {
        if (old == null) {
          return [optimisticNewCategory];
        } else {
          return [...old, optimisticNewCategory];
        }
      });

      return { previousCategories };
    },
    onError: (err, newCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData<CategoryEntity[]>(
          'categories',
          context.previousCategories
        );
      }
      if (err) {
        console.error(err);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries('categories');
    },
  });

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
      createCategoryMutation.mutate({ title: input.trim() });
    } else {
      console.log(`Create new ${entityType} with title ${input}`);
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
        Create
      </NewEntityCreateButton>
    </>
  );
}

export default NewEntityForm;
