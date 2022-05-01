import { useQuery, useQueryClient } from 'react-query';

import { CategoryEntity, getAllCategories } from '../../api/category.api';

export function Test() {
  // const queryClient = useQueryClient();

  const { status, error, data } = useQuery<CategoryEntity[], Error>(
    'categories',
    getAllCategories
  );

  if (status === 'loading') {
    return <span>Loading...</span>;
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <ul>
        {data!.map((category) => (
          <li key={category.id}>
            #{category.id}: "{category.title}"
            {category.tasks.length !== 0 && (
              <ul>
                {category.tasks.map((task) => (
                  <li key={task.id}>
                    #{task.id}: "{task.title}"
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
