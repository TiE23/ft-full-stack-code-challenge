import { useQuery } from 'react-query';

import { getAllCategories } from '../../api/category.api';
import { EntityType } from '../../types/api.types';
import { CategoryEntity } from '../../types/entity.types';
import { Category } from '../Category';
import { NewEntity } from '../NewEntity';

import { BoardBase } from './Board.styles';

export function Board() {
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
  if (data == null) {
    return <span>Could not load</span>;
  }
  return (
    <BoardBase>
      {data!.map((category) => (
        <Category key={category.id} category={category} />
      ))}
      <NewEntity entityType={EntityType.CATEGORY} />
    </BoardBase>
  );
}

export default Board;
