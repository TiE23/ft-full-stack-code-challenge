import { cloneDeep } from 'lodash';
import toast from 'react-hot-toast';
import { QueryClient, useMutation } from 'react-query';

import { addTask, addTaskVariables } from '../api/category.api';
import {
  deleteTask,
  deleteTaskVariables,
  moveAndRepositionTask,
  moveAndRepositionTaskVariables,
} from '../api/task.api';
import { CategoryEntity } from '../types/entity.types';
import { findObjectAndIndexCloneDeep } from '../utils/common.utils';
import {
  createOptimisticCategory,
  createOptimisticTask,
} from '../utils/entity.utils';

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
   * Mutation to delete Tasks
   * Tip: Read the comments in NewEntityForm for line-by-line details as it's
   * quite similar.
   */
  deleteTaskMutation = useMutation(deleteTask, {
    onMutate: async ({ taskId, categoryId }: deleteTaskVariables) => {
      await this.queryClient.cancelQueries('categories');

      const previousCategories =
        this.queryClient.getQueryData<CategoryEntity[]>('categories');

      const [targetCategoryIndex, targetCategoryClone] =
        findObjectAndIndexCloneDeep(
          (category) => category.id === categoryId,
          previousCategories
        );

      if (targetCategoryClone != null) {
        const optimisticNewTasks = cloneDeep(
          targetCategoryClone
            ? targetCategoryClone?.tasks.filter((task) => task.id !== taskId)
            : []
        );
        targetCategoryClone.tasks = optimisticNewTasks;
      }

      this.queryClient.setQueryData<CategoryEntity[]>(
        'categories',
        (oldCategories) => {
          if (oldCategories != null && targetCategoryClone != null) {
            const oldCategoriesClone = cloneDeep(oldCategories);
            oldCategoriesClone[targetCategoryIndex] = targetCategoryClone;
            return oldCategoriesClone;
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

  /**
   * Mutation to move a Task from one Category to another with optimistic
   * updates.
   * The optimistic updates make this quite silly, I must say.
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

      const [fromCategoryIndex, fromCategoryClone] =
        findObjectAndIndexCloneDeep(
          (category) => category.id === fromCategoryId,
          previousCategories
        );
      const [toCategoryIndex, toCategoryClone] = findObjectAndIndexCloneDeep(
        (category) => category.id === toCategoryId,
        previousCategories
      );
      const [targetTaskIndex, targetTaskClone] = findObjectAndIndexCloneDeep(
        (task) => task.id === taskId,
        fromCategoryClone?.tasks
      );

      // Move the Task. Remove out of 'from'. Splice/push it into 'to'.
      if (targetTaskClone != null) {
        fromCategoryClone?.tasks.splice(targetTaskIndex, 1);
        if (newPosition < 0) {
          // Add it to the end if newPosition is -1.
          toCategoryClone?.tasks.push(targetTaskClone);
        } else {
          toCategoryClone?.tasks.splice(newPosition, 0, targetTaskClone);
        }
      }

      this.queryClient.setQueryData<CategoryEntity[]>(
        'categories',
        (oldCategories) => {
          if (
            oldCategories != null &&
            toCategoryClone != null &&
            fromCategoryClone != null
          ) {
            const oldCategoriesClone = cloneDeep(oldCategories);
            oldCategoriesClone[fromCategoryIndex] = fromCategoryClone;
            oldCategoriesClone[toCategoryIndex] = toCategoryClone;
            return oldCategoriesClone;
          }
          return [];
        }
      );
      return { previousCategories };
    },
    // If the mutation fails, use the context we returned above.
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
    // Always refetch after error or success.
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (task) => {
      toast.success(`Task "${task.title}" moved!`);
    },
  });

  /**
   * Mutation to create new Tasks (added to a Category) with optimistic updates.
   */
  createTaskMutation = useMutation(addTask, {
    // Performing optimistic updates.
    onMutate: async ({ categoryId, createTaskDto }: addTaskVariables) => {
      await this.queryClient.cancelQueries('categories');

      const previousCategories =
        this.queryClient.getQueryData<CategoryEntity[]>('categories');

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

      this.queryClient.setQueryData<CategoryEntity[]>(
        'categories',
        (oldCategories) => {
          if (oldCategories == null) {
            return [optimisticNewCategory];
          }
          return [...oldCategories, optimisticNewCategory];
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
}
