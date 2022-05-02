import { cloneDeep } from 'lodash';
import toast from 'react-hot-toast';
import { QueryClient, useMutation } from 'react-query';

import { addTask, addTaskVariables } from '../api/category.api';
import {
  deleteTask,
  deleteTaskVariables,
  moveAndRepositionTask,
  moveAndRepositionTaskVariables,
  updateTask,
  updateTaskVariables,
} from '../api/task.api';
import { CategoryEntity, TaskEntity } from '../types/entity.types';
import { findObjectAndIndexCloneDeep } from '../utils/common.utils';
import { createOptimisticTask } from '../utils/entity.utils';

/**
 * Mutations for Tasks.. though, everything updates the 'categories' query in
 * the end.
 * All mutations have optimistic updates.
 * Now, if this isn't the ideal way to do this - if there's something obviously
 * wrong - please take a grain of mercy on me as this is the first time I've
 * used react-query. Ever.
 */
export default class TaskMutations {
  private queryClient: QueryClient;
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Mutation to create new Tasks (added to a Category) with optimistic updates.
   * Tip: Read createCategoryMutation for basic comments explaining what's
   * happening.
   */
  createTaskMutation = useMutation(addTask, {
    // Performing optimistic updates.
    onMutate: async ({ categoryId, createTaskDto }: addTaskVariables) => {
      await this.queryClient.cancelQueries('categories');

      const previousCategories =
        this.queryClient.getQueryData<CategoryEntity[]>('categories');

      this.queryClient.setQueryData<CategoryEntity[]>(
        'categories',
        (oldCategories) => {
          if (oldCategories != null) {
            const oldCategoriesClone = cloneDeep(oldCategories!);
            const [targetCategoryIndex, targetCategoryClone] =
              findObjectAndIndexCloneDeep(
                ({ id }) => id === categoryId,
                oldCategories
              );

            if (targetCategoryClone != null) {
              const optimisticNewTask = createOptimisticTask(createTaskDto);

              // Insert an optimistic new Task into the Category.
              targetCategoryClone.tasks.push(optimisticNewTask);
              oldCategoriesClone[targetCategoryIndex] = targetCategoryClone;
            }

            return oldCategoriesClone;
          }
          return []; // Don't know what to do; return empty!
        }
      );

      return { previousCategories };
    },
    onError: (err, _newCategory, context) => {
      if (context?.previousCategories) {
        this.queryClient.setQueryData<CategoryEntity[]>(
          'categories',
          context.previousCategories
        );
      }
      toast.error(
        `An error occurred while creating a new Task${
          err ? `\n${String(err)}` : ''
        }`
      );
    },
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (category) => {
      toast.success(
        `Task "${category.tasks[category.tasks.length - 1].title}" created!`
      );
    },
  });

  updateTaskMutation = useMutation(updateTask, {
    onMutate: async ({
      taskId,
      categoryId,
      updateTaskDto,
    }: updateTaskVariables) => {
      await this.queryClient.cancelQueries('categories');

      const previousCategories =
        this.queryClient.getQueryData<CategoryEntity[]>('categories');

      this.queryClient.setQueryData<CategoryEntity[]>(
        'categories',
        (oldCategories) => {
          if (oldCategories != null) {
            const [targetCategoryIndex, targetCategoryClone] =
              findObjectAndIndexCloneDeep(
                ({ id }) => id === categoryId,
                oldCategories
              );
            const [targetTaskIndex, targetTaskClone] =
              findObjectAndIndexCloneDeep(
                ({ id }) => id === taskId,
                targetCategoryClone?.tasks
              );

            if (targetCategoryClone != null && targetTaskClone != null) {
              // Create the optimistic updated Task entity.
              const optimisticTask: TaskEntity = {
                ...targetTaskClone,
                ...updateTaskDto,
              };
              // Insert it into the target Category.
              targetCategoryClone.tasks[targetTaskIndex] = optimisticTask;

              // Update the target Category with the new data and return it.
              const oldCategoriesClone = cloneDeep(oldCategories);
              oldCategoriesClone[targetCategoryIndex] = targetCategoryClone;
              return oldCategoriesClone;
            }
            return oldCategories;
          }
          return [];
        }
      );

      return { previousCategories };
    },
    onError: (err, _, context) => {
      if (context?.previousCategories) {
        this.queryClient.setQueryData<CategoryEntity[]>(
          'categories',
          context.previousCategories
        );
      }
      toast.error(
        `An error occurred while updating Task${err ? `\n${String(err)}` : ''}`
      );
    },
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (task) => {
      toast.success(`Task "${task.title}" updated!`);
    },
  });

  /**
   * Mutation to move a Task from one Category to another with optimistic
   * updates... which are a bit silly.
   * Tip: Read createCategoryMutation for basic comments explaining what's
   * happening.
   */
  moveTaskMutation = useMutation(moveAndRepositionTask, {
    onMutate: async ({
      taskId,
      fromCategoryId,
      toCategoryId,
      newPosition,
    }: moveAndRepositionTaskVariables) => {
      await this.queryClient.cancelQueries('categories');

      const previousCategories =
        this.queryClient.getQueryData<CategoryEntity[]>('categories');

      this.queryClient.setQueryData<CategoryEntity[]>(
        'categories',
        (oldCategories) => {
          if (oldCategories != null) {
            const [fromCategoryIndex, fromCategoryClone] =
              findObjectAndIndexCloneDeep(
                ({ id }) => id === fromCategoryId,
                oldCategories
              );
            const [toCategoryIndex, toCategoryClone] =
              findObjectAndIndexCloneDeep(
                ({ id }) => id === toCategoryId,
                oldCategories
              );
            const [targetTaskIndex, targetTaskClone] =
              findObjectAndIndexCloneDeep(
                ({ id }) => id === taskId,
                fromCategoryClone?.tasks
              );

            // Move the Task. Remove out of 'from'. Splice/push it into 'to'.
            if (
              targetTaskClone != null &&
              toCategoryClone != null &&
              fromCategoryClone != null
            ) {
              fromCategoryClone?.tasks.splice(targetTaskIndex, 1);
              if (newPosition < 0) {
                // Add it to the end if newPosition is -1.
                toCategoryClone?.tasks.push(targetTaskClone);
              } else {
                // No need to check if newPosition >= length, splice handles it.
                toCategoryClone?.tasks.splice(newPosition, 0, targetTaskClone);
              }

              const oldCategoriesClone = cloneDeep(oldCategories);
              oldCategoriesClone[fromCategoryIndex] = fromCategoryClone;
              oldCategoriesClone[toCategoryIndex] = toCategoryClone;
              return oldCategoriesClone;
            }
            return oldCategories;
          }
          return []; // Don't know what to do; return empty!
        }
      );
      return { previousCategories };
    },
    onError: (err, _, context) => {
      if (context?.previousCategories) {
        this.queryClient.setQueryData<CategoryEntity[]>(
          'categories',
          context.previousCategories
        );
      }
      toast.error(
        `An error occurred while moving Task${err ? `\n${String(err)}` : ''}`
      );
    },
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (task) => {
      toast.success(`Task "${task.title}" moved!`);
    },
  });

  /**
   * Mutation to delete Tasks with optimistic updates.
   * Tip: Read createCategoryMutation for basic comments explaining what's
   * happening.
   */
  deleteTaskMutation = useMutation(deleteTask, {
    onMutate: async ({ taskId, categoryId }: deleteTaskVariables) => {
      await this.queryClient.cancelQueries('categories');

      const previousCategories =
        this.queryClient.getQueryData<CategoryEntity[]>('categories');

      this.queryClient.setQueryData<CategoryEntity[]>(
        'categories',
        (oldCategories) => {
          if (oldCategories != null) {
            const [targetCategoryIndex, targetCategoryClone] =
              findObjectAndIndexCloneDeep(
                ({ id }) => id === categoryId,
                oldCategories
              );

            if (targetCategoryClone != null) {
              const optimisticNewTasks = cloneDeep(
                targetCategoryClone
                  ? targetCategoryClone?.tasks.filter(({ id }) => id !== taskId)
                  : []
              );
              targetCategoryClone.tasks = optimisticNewTasks;
            }
            if (targetCategoryClone != null) {
              const oldCategoriesClone = cloneDeep(oldCategories);
              oldCategoriesClone[targetCategoryIndex] = targetCategoryClone;
              return oldCategoriesClone;
            }
            return oldCategories;
          }
          return []; // Don't know what to do; return empty!
        }
      );

      return { previousCategories };
    },
    onError: (err, _, context) => {
      if (context?.previousCategories) {
        this.queryClient.setQueryData<CategoryEntity[]>(
          'categories',
          context.previousCategories
        );
      }
      toast.error(
        `An error occurred while deleting the Task${
          err ? `\n${String(err)}` : ''
        }`
      );
    },
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: () => {
      toast.success('Task deleted!');
    },
  });
}
