import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import {
  deleteTask,
  deleteTaskVariables,
  moveAndRepositionTask,
  moveAndRepositionTaskVariables,
} from '../../api/task.api';
import TaskMutations from '../../mutations/task.mutations';

import { CategoryEntity, EntityId, TaskEntity } from '../../types/entity.types';
import { createOptimisticCategory } from '../../utils/entity.utils';
import {
  ButtonWrapper,
  NoStyleButton,
  TaskContainer,
  TaskControlsSection,
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

  return (
    <TaskContainer>
      <TaskTitleRow>
        <TaskTitle>{task.title}</TaskTitle>
        <TaskControlsSection>
          <NoStyleButton
            disabled={leftCategoryId == null}
            onClick={() => {
              console.log(
                `move task from ${categoryId} left to ${leftCategoryId}`
              );
              taskMutations.moveTaskMutation.mutate({
                taskId: task.id,
                fromCategoryId: categoryId,
                toCategoryId: leftCategoryId!, // Coax TS a little here...
                newPosition: -1, // To the end.
              });
            }}
          >
            <ChevronLeftIcon />
          </NoStyleButton>
          <NoStyleButton
            disabled={rightCategoryId == null}
            onClick={() => {
              console.log(
                `move task from ${categoryId} right to ${rightCategoryId}`
              );

              taskMutations.moveTaskMutation.mutate({
                taskId: task.id,
                fromCategoryId: categoryId,
                toCategoryId: rightCategoryId!, // Coax TS a little here...
                newPosition: -1, // To the end.
              });
            }}
          >
            <ChevronRightIcon />
          </NoStyleButton>
          <DeleteIcon
            onClick={() =>
              taskMutations.deleteTaskMutation.mutate({
                taskId: task.id,
                categoryId,
              })
            }
            color="red"
          />
        </TaskControlsSection>
      </TaskTitleRow>
    </TaskContainer>
  );
}
