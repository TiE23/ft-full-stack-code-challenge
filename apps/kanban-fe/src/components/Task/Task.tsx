import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import useMeasure from 'react-use-measure';

import useHideOnClickOutside from '../../hooks/useHideOnClickOutside';
import useHover from '../../hooks/useHover';
import TaskMutations from '../../mutations/task.mutations';
import { EntityId, TaskEntity } from '../../types/entity.types';
import { parseAndPrintDate } from '../../utils/display.utils';

import { MoveAndUpdateControls } from '../Common/MoveAndUpdateControls';
import TitleStringInput from '../Common/Inputs/TitleStringInput';
import {
  TaskContainer,
  TaskControlsContainer,
  TaskDate,
  TaskDatesGrid,
  TaskExpandedArea,
  TaskExpandedContent,
  TaskTitleRow,
  TaskTitleRowLeft,
} from './Task.styles';

export interface TaskProps {
  task: TaskEntity;
  taskIndex: number;
  tasksCount: number;
  categoryId: EntityId;
  leftCategoryId?: EntityId;
  rightCategoryId?: EntityId;
}

export function Task({
  task,
  taskIndex,
  tasksCount,
  categoryId,
  leftCategoryId,
  rightCategoryId,
}: TaskProps) {
  const queryClient = useQueryClient();

  const taskMutations = new TaskMutations(queryClient);

  const [hoverRef, hovering] = useHover<HTMLDivElement>('over');
  const [expanded, setExpanded, clickOutsideRef] =
    useHideOnClickOutside<HTMLDivElement>(false);
  const [bottomRef, { height: bottomHeight }] = useMeasure();

  const [editMode, setEditMode] = useState(false);
  const [titleEdit, setTitleEdit] = useState(task.title);

  useEffect(() => {
    if (!expanded || !editMode) {
      if (editMode) {
        setEditMode(false);
      }
      // Reset the edits on leaving editMode or collapsing the Task.
      setTitleEdit(task.title);
    }

    // Update with the next refresh.
    if (!editMode && titleEdit !== task.title) {
      setTitleEdit(task.title);
    }
  }, [editMode, expanded, titleEdit, task.title]);

  const submitUpdate = () => {
    if (titleEdit.trim() === '') {
      return;
    }

    taskMutations.updateTaskMutation.mutate({
      taskId: task.id,
      categoryId,
      updateTaskDto: { title: titleEdit },
    });
    setEditMode(false);
  };

  return (
    <TaskContainer
      ref={clickOutsideRef}
      onClick={() => {
        if (!expanded) setExpanded(true); // Only outside click closes.
      }}
    >
      <TaskTitleRow ref={hoverRef}>
        <TaskTitleRowLeft>
          {expanded && editMode ? (
            <TitleStringInput
              title={titleEdit}
              setTitle={setTitleEdit}
              submit={submitUpdate}
              placeholder="Task Title"
            />
          ) : (
            task.title
          )}
        </TaskTitleRowLeft>
        <TaskControlsContainer>
          <MoveAndUpdateControls
            openEdit={() => setEditMode(!editMode)}
            show={hovering}
            mode={expanded ? 'edit' : 'move'}
            disableMoveLeft={leftCategoryId == null}
            disableMoveDown={taskIndex === tasksCount - 1}
            disableMoveUp={taskIndex <= 0}
            disableMoveRight={rightCategoryId == null}
            moveLeft={() =>
              taskMutations.moveTaskMutation.mutate({
                taskId: task.id,
                fromCategoryId: categoryId,
                toCategoryId: leftCategoryId!, // Coax TS a little here...
                newPosition: -1, // To the end.
              })
            }
            moveDown={() =>
              taskMutations.moveTaskMutation.mutate({
                taskId: task.id,
                fromCategoryId: categoryId,
                toCategoryId: categoryId,
                newPosition: taskIndex + 1,
              })
            }
            moveUp={() =>
              taskMutations.moveTaskMutation.mutate({
                taskId: task.id,
                fromCategoryId: categoryId,
                toCategoryId: categoryId,
                newPosition: taskIndex - 1,
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
          />
        </TaskControlsContainer>
      </TaskTitleRow>
      <TaskExpandedArea expanded={expanded} expandedHeightPx={bottomHeight}>
        <TaskExpandedContent ref={bottomRef}>
          <TaskDatesGrid>
            <TaskDate>Created</TaskDate>
            <TaskDate>{parseAndPrintDate(task.created_at)}</TaskDate>
            <TaskDate>Updated</TaskDate>
            <TaskDate>{parseAndPrintDate(task.updated_at)}</TaskDate>
          </TaskDatesGrid>
        </TaskExpandedContent>
      </TaskExpandedArea>
    </TaskContainer>
  );
}
