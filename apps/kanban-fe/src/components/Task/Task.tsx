import { useState } from 'react';
import { useQueryClient } from 'react-query';
import useMeasure from 'react-use-measure';

import useHideOnClickOutside from '../../hooks/useHideOnClickOutside';
import useHover from '../../hooks/useHover';
import TaskMutations from '../../mutations/task.mutations';
import { EntityId, TaskEntity } from '../../types/entity.types';
import { parseAndPrintDate } from '../../utils/display.utils';

import { MoveAndUpdateControls } from '../Common/MoveAndUpdateControls';
import {
  TaskContainer,
  TaskControlsContainer,
  TaskDate,
  TaskDatesGrid,
  TaskExpandedArea,
  TaskExpandedContent,
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
  const [hoverRef, hovering] = useHover<HTMLDivElement>('over');
  const [expanded, setExpanded, clickOutsideRef] =
    useHideOnClickOutside<HTMLDivElement>(false);
  const [bottomRef, { height: bottomHeight }] = useMeasure();

  const queryClient = useQueryClient();

  const taskMutations = new TaskMutations(queryClient);

  return (
    <TaskContainer
      ref={clickOutsideRef}
      onClick={() => {
        if (!expanded) setExpanded(true); // Only outside click closes.
      }}
    >
      <TaskTitleRow ref={hoverRef}>
        <TaskTitle>{task.title}</TaskTitle>
        <TaskControlsContainer>
          <MoveAndUpdateControls
            disableMoveLeft={leftCategoryId == null}
            disableMoveRight={rightCategoryId == null}
            moveLeft={() =>
              taskMutations.moveTaskMutation.mutate({
                taskId: task.id,
                fromCategoryId: categoryId,
                toCategoryId: leftCategoryId!, // Coax TS a little here...
                newPosition: -1, // To the end.
              })
            }
            moveRight={() =>
              taskMutations.moveTaskMutation.mutate({
                taskId: task.id,
                fromCategoryId: categoryId,
                toCategoryId: rightCategoryId!, // Coax TS a little here...
                newPosition: -1, // To the end.
              })
            }
            trash={() =>
              taskMutations.deleteTaskMutation.mutate({
                taskId: task.id,
                categoryId,
              })
            }
            openEdit={() => console.log('openEdit')}
            show={hovering}
            mode={expanded ? 'edit' : 'move'}
          />
        </TaskControlsContainer>
      </TaskTitleRow>
      <TaskExpandedArea expanded={expanded} expandedHeightPx={bottomHeight}>
        <TaskExpandedContent ref={bottomRef}>
          <TaskDatesGrid>
            <TaskDate>Updated</TaskDate>
            <TaskDate>{parseAndPrintDate(task.updated_at)}</TaskDate>
            <TaskDate>Created</TaskDate>
            <TaskDate>{parseAndPrintDate(task.created_at)}</TaskDate>
          </TaskDatesGrid>
        </TaskExpandedContent>
      </TaskExpandedArea>
    </TaskContainer>
  );
}
