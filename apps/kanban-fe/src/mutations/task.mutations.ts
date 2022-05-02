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
import {
  createOptimisticCategory,
  createOptimisticTask,
} from '../utils/entity.utils';

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

      this.queryClient.setQueryData<CategoryEntity[]>('categories', (old) => {
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
        this.queryClient.setQueryData<CategoryEntity[]>(
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

      this.queryClient.setQueryData<CategoryEntity[]>('categories', (old) => {
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
    onSuccess: () => {
      toast.success(`Task moved!`);
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

      this.queryClient.setQueryData<CategoryEntity[]>('categories', (old) => {
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
        this.queryClient.setQueryData<CategoryEntity[]>(
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
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (data) => {
      toast.success(
        `Task "${data.tasks[data.tasks.length - 1].title}" created!`
      );
    },
  });
}
