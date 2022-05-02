import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import {
  deleteTask,
  deleteTaskVariables,
  moveAndRepositionTask,
  moveAndRepositionTaskVariables,
} from '../../api/task.api';

import { CategoryEntity, EntityId, TaskEntity } from '../../types/entity.types';
import { createOptimisticCategory } from '../../utils/entity.utils';
import {
  ButtonWrapper,
  NoStyleButton,
  TaskContainer,
  TaskControlsSection,
  TaskTitle,
  TaskTitleRow,
} from './Task.styles';

export interface TaskProps {
  task: TaskEntity;
  categoryId: EntityId;
  leftCategoryId?: EntityId;
  rightCategoryId?: EntityId;
}

export function Task({
  task,
  categoryId,
  leftCategoryId,
  rightCategoryId,
}: TaskProps) {
  const queryClient = useQueryClient();

  /**
   * Mutation to delete Tasks
   * Tip: Read the comments in NewEntityForm for line-by-line details as it's
   * quite similar.
   */
  const deleteTaskMutation = useMutation(deleteTask, {
    onMutate: async ({ taskId }: deleteTaskVariables) => {
      await queryClient.cancelQueries('categories');

      const previousCategories =
        queryClient.getQueryData<CategoryEntity[]>('categories');

      const previousCategory = previousCategories?.find(
        (category) => category.id === categoryId
      );
      const optimisticNewTasks = previousCategory
        ? previousCategory.tasks.filter((task) => task.id !== taskId)
        : [];
      const optimisticNewCategory = createOptimisticCategory(
        { title: previousCategory?.title },
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
    onSuccess: () => {
      toast.success('Task deleted!');
    },
  });

  /**
   * Mutation to move a Task from one Category to another with optimistic
   * updates.
   * The optimistic updates make this quite silly, I must say.
   */
  const moveTaskMutation = useMutation(moveAndRepositionTask, {
    onMutate: async ({
      taskId,
      fromCategoryId,
      toCategoryId,
      newPosition,
    }: moveAndRepositionTaskVariables) => {
      await queryClient.cancelQueries('categories');

      const previousCategories =
        queryClient.getQueryData<CategoryEntity[]>('categories');

      const previousFromCategoryIndex = previousCategories?.findIndex(
        (category) => category.id === fromCategoryId
      );
      const previousToCategoryIndex = previousCategories?.findIndex(
        (category) => category.id === toCategoryId
      );

      const previousFromCategoryTasks = // JS... this is getting ridiculous.
        (previousCategories || [])[previousFromCategoryIndex || -1]?.tasks;
      const previousToCategoryTasks = (previousCategories || [])[
        previousFromCategoryIndex || -1
      ]?.tasks;

      const previousTaskIndex = previousFromCategoryTasks.findIndex(
        (task) => task.id === taskId
      );
      const previousTask = previousFromCategoryTasks[previousTaskIndex || -1];

      // Move the Task. Remove out of 'from'. Splice/push it into 'to'.
      if (previousTaskIndex != null && previousTask != null) {
        previousFromCategoryTasks.splice(previousTaskIndex, 1);
        if (
          newPosition < 0 ||
          newPosition > previousToCategoryTasks.length ||
          -1
        ) {
          previousToCategoryTasks.push(previousTask);
        } else {
          previousToCategoryTasks.splice(newPosition, 0, previousTask);
        }
      }

      queryClient.setQueryData<CategoryEntity[]>('categories', (old) => {
        if (
          old != null &&
          old[previousFromCategoryIndex || -1] != null &&
          old[previousToCategoryIndex || -1] != null
        ) {
          old[previousFromCategoryIndex || -1].tasks = [];
          old[previousToCategoryIndex || -1].tasks = [];
          return old;
        } else {
          return [];
        }
      });
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
        `An error occurred while moving Task${err ? `\n${String(err)}` : ''}`
      );
    },
    // Always refetch after error or success.
    onSettled: () => {
      queryClient.invalidateQueries('categories');
    },
    onSuccess: () => {
      toast.success(`Task moved!`);
    },
  });

  return (
    <TaskContainer>
      <TaskTitleRow>
        <TaskTitle>{task.title}</TaskTitle>
        <TaskControlsSection>
          <NoStyleButton
            disabled={leftCategoryId == null}
            onClick={() => {
              console.log(
                `move task from ${categoryId} left to ${leftCategoryId}`
              );
              moveTaskMutation.mutate({
                taskId: task.id,
                fromCategoryId: categoryId,
                toCategoryId: leftCategoryId!, // Coax TS a little here...
                newPosition: -1, // To the end.
              });
            }}
          >
            <ChevronLeftIcon />
          </NoStyleButton>
          <NoStyleButton
            disabled={rightCategoryId == null}
            onClick={() => {
              console.log(
                `move task from ${categoryId} right to ${rightCategoryId}`
              );

              moveTaskMutation.mutate({
                taskId: task.id,
                fromCategoryId: categoryId,
                toCategoryId: rightCategoryId!, // Coax TS a little here...
                newPosition: -1, // To the end.
              });
            }}
          >
            <ChevronRightIcon />
          </NoStyleButton>
          <DeleteIcon
            onClick={() => deleteTaskMutation.mutate({ taskId: task.id })}
            color="red"
          />
        </TaskControlsSection>
      </TaskTitleRow>
    </TaskContainer>
  );
}
