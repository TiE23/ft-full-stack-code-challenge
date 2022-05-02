import toast from 'react-hot-toast';
import { QueryClient, useMutation } from 'react-query';

import { createCategory, createCategoryVariables } from '../api/category.api';
import { CategoryEntity } from '../types/entity.types';
import { createOptimisticCategory } from '../utils/entity.utils';

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

      const optimisticNewCategory = createOptimisticCategory(createCategoryDto);

      // Optimistically update to the new value.
      this.queryClient.setQueryData<CategoryEntity[]>('categories', (old) => {
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
    // Always refetch after error or success.
    onSettled: () => {
      this.queryClient.invalidateQueries('categories');
    },
    onSuccess: (data) => {
      toast.success(`Category "${data.title}" created!`);
    },
  });
}
