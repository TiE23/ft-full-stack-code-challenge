import { cloneDeep } from 'lodash';
import toast from 'react-hot-toast';
import { QueryClient, useMutation } from 'react-query';

import {
  createCategory,
  createCategoryVariables,
  deleteCategory,
  deleteCategoryVariables,
  repositionCategory,
  repositionCategoryVariables,
  updateCategory,
  updateCategoryVariables,
} from '../api/category.api';
import { CategoryEntity } from '../types/entity.types';
import { findObjectAndIndexCloneDeep } from '../utils/common.utils';
import { createOptimisticCategory } from '../utils/entity.utils';

/**
 * Mutations for Categories. All mutations have optimistic updates.
 * Now, if this isn't the ideal way to do this - if there's something obviously
 * wrong - please take a grain of mercy on me as this is the first time I've
 * used react-query. Ever.
 */
export default class CategoryMutations {
  private queryClient: QueryClient;
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }
  /**
   * Mutation to create new Categories with optimistic updates.
   */
  createCategoryMutation = useMutation(createCategory, {
    // Must define the return type explicitly due to a TS <4.7 limitation.
    onMutate: async ({ createCategoryDto }: createCategoryVariables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await this.queryClient.cancelQueries('categories');

      // Snapshot the previous value.
      const previousCategories =
        // Must also define explictly here.
        this.queryClient.getQueryData<CategoryEntity[]>('categories');

      // Optimistically update to the new value.
      this.queryClient.setQueryData<CategoryEntity[]>(
        'categories',
        (oldCategories) => {
          const optimisticNewCategory =
            createOptimisticCategory(createCategoryDto);
          if (oldCategories != null) {
            return [...oldCategories, optimisticNewCategory];
          } else {
            return [optimisticNewCategory];
          }
        }
      );

      // Return a context with the previous and new Category.
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
        `An error occurred while creating a new Category${
          err ? `\n${String(err)}` : ''
        }`
      );
    },
    // Always refetch after error or success.
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (category) => {
      toast.success(`Category "${category.title}" created!`);
    },
  });

  /**
   * Mutation to update a Category with optimistic updates.
   * Tip: Read createCategoryMutation for basic comments explaining what's
   * happening.
   */
  updateCategoryMutation = useMutation(updateCategory, {
    onMutate: async ({
      categoryId,
      updateCategoryDto,
    }: updateCategoryVariables) => {
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
              const optimisticCategory: CategoryEntity = {
                ...targetCategoryClone,
                ...updateCategoryDto,
              };

              oldCategories[targetCategoryIndex] = optimisticCategory;
              return oldCategories;
            }
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
        `An error occurred while updating Category${
          err ? `\n${String(err)}` : ''
        }`
      );
    },
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (category) => {
      toast.success(`Category "${category.title}" updated!`);
    },
  });

  repositionCategoryMutation = useMutation(repositionCategory, {
    onMutate: async ({
      categoryId,
      newPosition,
    }: repositionCategoryVariables) => {
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
              if (
                newPosition === targetCategoryIndex ||
                newPosition >= oldCategories.length ||
                newPosition < 0
              ) {
                // No change in position or
                // trying to move beyond end of array or before 0.
                return oldCategories;
              }

              oldCategories.splice(targetCategoryIndex, 1);

              oldCategories.splice(newPosition, 0, targetCategoryClone);
              return oldCategories;
            } else if (oldCategories != null) {
              return oldCategories;
            }
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
        `An error occurred while repositioning Category${
          err ? `\n${String(err)}` : ''
        }`
      );
    },
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (category) => {
      toast.success(`Category "${category.title}" repositioned!`);
    },
  });

  /**
   * Mutation to delete Categories.
   */
  deleteCategoryMutation = useMutation(deleteCategory, {
    onMutate: async ({ categoryId }: deleteCategoryVariables) => {
      await this.queryClient.cancelQueries('categories');

      const previousCategories =
        this.queryClient.getQueryData<CategoryEntity[]>('categories');

      this.queryClient.setQueryData<CategoryEntity[]>(
        'categories',
        (oldCategories) => {
          if (oldCategories != null) {
            return oldCategories.filter(({ id }) => id !== categoryId);
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
        `An error occurred while deleting the Category${
          err ? `\n${String(err)}` : ''
        }`
      );
    },
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (deleteResult) => {
      toast.success(`${deleteResult.affected} Category deleted!`);
    },
  });
}
