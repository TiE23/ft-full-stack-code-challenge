import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import useMeasure from 'react-use-measure';
import useFocus from '../../hooks/useFocus';

import useHideOnClickOutside from '../../hooks/useHideOnClickOutside';
import useHover from '../../hooks/useHover';
import TaskMutations from '../../mutations/task.mutations';
import { EntityId, TaskEntity } from '../../types/entity.types';
import { listenForEnter } from '../../utils/common.utils';
import { parseAndPrintDate } from '../../utils/display.utils';

import StringInput from '../Common/Inputs/StringInput.styled';
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
  }, [editMode, expanded]);

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
        <TaskTitle>
          {expanded && editMode ? (
            <TitleStringInput
              title={titleEdit}
              setTitle={setTitleEdit}
              submit={submitUpdate}
            />
          ) : (
            task.title
          )}
        </TaskTitle>
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
            openEdit={() => {
              console.log('openEdit', !editMode);
              setEditMode(!editMode);
            }}
            show={hovering}
            mode={expanded ? 'edit' : 'move'}
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

interface TitleStringInputProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  submit: VoidFunction;
}
/**
 * This needs to be its own component for useFocus() to work. Literally the only
 * reason.
 * @param props
 * @returns
 */
function TitleStringInput({ title, setTitle, submit }: TitleStringInputProps) {
  const inputRef = useFocus();
  return (
    <StringInput
      ref={inputRef}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyPress={listenForEnter(submit)}
      placeholder="Task Title"
    />
  );
}
