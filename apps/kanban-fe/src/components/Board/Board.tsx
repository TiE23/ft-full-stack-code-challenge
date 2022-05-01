import { useQuery } from 'react-query';

import { getAllCategories } from '../../api/category.api';
import { CategoryEntity } from '../../types/entity.types';
import { Category } from '../Category';

import { BoardBase } from './Board.styles';

export function Board() {
  const { status, error, data } = useQuery<CategoryEntity[], Error>(
    'categories',
    getAllCategories
  );
  console.log(status, error);
  console.table(data);
  if (status === 'loading') {
    return <span>Loading...</span>;
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>;
  }
  if (data == null) {
    return <span>Could not load</span>;
  }
  return (
    <BoardBase>
      {data!.map((category) => (
        <Category key={category.id} category={category} />
      ))}
    </BoardBase>
  );
}

export default Board;
