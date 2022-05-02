import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import mergeRefs from 'react-merge-refs';

import useHideOnClickOutside from '../../hooks/useHideOnClickOutside';
import useHover from '../../hooks/useHover';
import CategoryMutations from '../../mutations/category.mutations';
import { EntityType } from '../../types/api.types';
import { CategoryEntity, EntityId } from '../../types/entity.types';

import TitleStringInput from '../Common/Inputs/TitleStringInput';
import { MoveAndUpdateControls } from '../Common/MoveAndUpdateControls';
import { NewEntity } from '../NewEntity';
import { Task } from '../Task';
import {
  CategoryContainer,
  CategoryControlsContainer,
  CategoryTitle,
  CategoryTitleRow,
  CategoryTitleRowLeft,
  TasksList,
} from './Category.styles';

interface CategoryProps {
  category: CategoryEntity;
  categoryIndex: number;
  leftCategoryId?: EntityId;
  rightCategoryId?: EntityId;
}
export function Category({
  category,
  categoryIndex,
  leftCategoryId,
  rightCategoryId,
}: CategoryProps) {
  const queryClient = useQueryClient();

  const categoryMutations = new CategoryMutations(queryClient);

  const [hoverRef, hovering] = useHover<HTMLDivElement>('enter');
  const [expanded, setExpanded, clickOutsideRef] =
    useHideOnClickOutside<HTMLDivElement>(false);

  const [editMode, setEditMode] = useState(false);
  const [titleEdit, setTitleEdit] = useState(category.title);

  useEffect(() => {
    if (!expanded || !editMode) {
      if (editMode) {
        setEditMode(false);
      }
      // Reset the edits on leaving editMode or collapsing the Task.
      setTitleEdit(category.title);
    }

    // Update with the next refresh.
    if (!editMode && titleEdit !== category.title) {
      setTitleEdit(category.title);
    }
  }, [editMode, expanded, titleEdit, category.title]);

  const submitUpdate = () => {
    if (titleEdit.trim() === '') {
      return;
    }

    categoryMutations.updateCategoryMutation.mutate({
      categoryId: category.id,
      updateCategoryDto: { title: titleEdit },
    });
    setEditMode(false);
  };

  return (
    <CategoryContainer>
      <CategoryTitleRow
        ref={mergeRefs([hoverRef, clickOutsideRef])}
        onClick={() => {
          if (!expanded) setExpanded(true); // Only outside click closes.
        }}
      >
        <CategoryTitleRowLeft>
          {expanded && editMode ? (
            <TitleStringInput
              title={titleEdit}
              setTitle={setTitleEdit}
              submit={submitUpdate}
              placeholder="Category Title"
            />
          ) : (
            <CategoryTitle>{category.title}</CategoryTitle>
          )}
        </CategoryTitleRowLeft>
        <CategoryControlsContainer>
          <MoveAndUpdateControls
            openEdit={() => setEditMode(!editMode)}
            show={hovering}
            mode={expanded ? 'edit' : 'move'}
            disableMoveLeft={leftCategoryId == null}
            disableMoveRight={rightCategoryId == null}
            moveLeft={() =>
              categoryMutations.repositionCategoryMutation.mutate({
                categoryId: category.id,
                newPosition: categoryIndex - 1,
              })
            }
            moveRight={() =>
              categoryMutations.repositionCategoryMutation.mutate({
                categoryId: category.id,
                newPosition: categoryIndex + 1,
              })
            }
            trash={() =>
              categoryMutations.deleteCategoryMutation.mutate({
                categoryId: category.id,
              })
            }
          />
        </CategoryControlsContainer>
      </CategoryTitleRow>
      <TasksList>
        {category.tasks.map((task, taskIndex, { length: tasksCount }) => (
          <Task
            key={`${taskIndex}_${task.lexical_order}_${task.id}`}
            task={task}
            taskIndex={taskIndex}
            tasksCount={tasksCount}
            categoryId={category.id}
            leftCategoryId={leftCategoryId}
            rightCategoryId={rightCategoryId}
          />
        ))}
        <NewEntity entityType={EntityType.TASK} categoryId={category.id} />
      </TasksList>
    </CategoryContainer>
  );
}

export default Category;
