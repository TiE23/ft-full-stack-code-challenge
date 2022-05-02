import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

import {
  addTask,
  addTaskVariables,
  createCategory,
  createCategoryVariables,
} from '../../api/category.api';
import useFocus from '../../hooks/useFocus';
import { EntityType } from '../../types/api.types';
import { CategoryEntity, EntityId } from '../../types/entity.types';
import {
  createOptimisticCategory,
  createOptimisticTask,
} from '../../utils/entity.utils';

import { NewEntityCreateButton, NewEntityInput } from './NewEntity.styles';

export interface NewEntityFormProps {
  onSubmit: () => void;
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

  /**
   * Mutation to create new Categories with optimistic updates.
   */
  const createCategoryMutation = useMutation(createCategory, {
    // Must define the return type explicitly due to a TS <4.7 limitation.
    onMutate: async ({ createCategoryDto }: createCategoryVariables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries('categories');

      // Snapshot the previous value.
      const previousCategories =
        // Must also define explictly here.
        queryClient.getQueryData<CategoryEntity[]>('categories');

      const optimisticNewCategory = createOptimisticCategory(createCategoryDto);

      // Optimistically update to the new value.
      queryClient.setQueryData<CategoryEntity[]>('categories', (old) => {
        if (old == null) {
          return [optimisticNewCategory];
        } else {
          return [...old, optimisticNewCategory];
        }
      });

      // Return a context with the previous and new Category.
      return { previousCategories };
    },
    // If the mutation fails, use the context we returned above.
    onError: (err, _newCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData<CategoryEntity[]>(
          'categories',
          context.previousCategories
        );
      }
      toast.error(
        `An error occurred while adding a new Category${
          err ? `\n${String(err)}` : ''
        }`
      );
    },
    // Always refetch after error or success.
    onSettled: () => {
      queryClient.invalidateQueries('categories');
    },
    onSuccess: (data) => {
      toast.success(`Category "${data.title}" created!`);
    },
  });

  /**
   * Mutation to create new Tasks (added to a Category) with optimistic updates.
   */
  const createTaskMutation = useMutation(addTask, {
    // Performing optimistic updates.
    onMutate: async ({ categoryId, createTaskDto }: addTaskVariables) => {
      await queryClient.cancelQueries('categories');

      const previousCategories =
        queryClient.getQueryData<CategoryEntity[]>('categories');

      const previousCategory = previousCategories?.find(
        (category) => category.id === categoryId
      );

      // Insert an optimistic new Task into the optimistic Category.
      const optimisticNewTask = createOptimisticTask(createTaskDto);
      const optimisticNewTasks = previousCategory
        ? [...previousCategory.tasks, optimisticNewTask]
        : [];
      const optimisticNewCategory = createOptimisticCategory(
        undefined,
        optimisticNewTasks
      );

      queryClient.setQueryData<CategoryEntity[]>('categories', (old) => {
        if (old == null) {
          return [optimisticNewCategory];
        } else {
          return [...old, optimisticNewCategory];
        }
      });

      return { previousCategories };
    },
    onError: (err, _newCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData<CategoryEntity[]>(
          'categories',
          context.previousCategories
        );
      }
      toast.error(
        `An error occurred while adding a new Category${
          err ? `\n${String(err)}` : ''
        }`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries('categories');
    },
    onSuccess: (data) => {
      toast.success(
        `Task "${data.tasks[data.tasks.length - 1].title}" created!`
      );
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
      createCategoryMutation.mutate({
        createCategoryDto: { title: input.trim() },
      });
    } else {
      createTaskMutation.mutate({
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
