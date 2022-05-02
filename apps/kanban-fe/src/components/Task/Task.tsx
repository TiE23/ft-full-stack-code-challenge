import { useQueryClient } from 'react-query';

import TaskMutations from '../../mutations/task.mutations';

import { EntityId, TaskEntity } from '../../types/entity.types';
import { MoveAndDeleteControls } from '../Common';
import { TaskContainer, TaskTitle, TaskTitleRow } from './Task.styles';

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
        <MoveAndDeleteControls
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
        />
      </TaskTitleRow>
    </TaskContainer>
  );
}
