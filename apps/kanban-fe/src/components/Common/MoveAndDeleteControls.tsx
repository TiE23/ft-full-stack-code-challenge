import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from '@chakra-ui/icons';

import { ControlsSection, NoStyleButton } from './MoveAndDeleteControls.styles';

interface MoveAndDeleteControlsProps {
  disableMoveLeft: boolean;
  disableMoveRight: boolean;
  moveLeft: VoidFunction;
  moveRight: VoidFunction;
  trash: VoidFunction; // Named 'trash' because `delete` is a reserved keyword.
}

export function MoveAndDeleteControls({
  disableMoveLeft,
  disableMoveRight,
  moveLeft,
  moveRight,
  trash,
}: MoveAndDeleteControlsProps) {
  return (
    <ControlsSection>
      <NoStyleButton disabled={disableMoveLeft} onClick={moveLeft}>
        <ChevronLeftIcon />
      </NoStyleButton>
      <NoStyleButton disabled={disableMoveRight} onClick={moveRight}>
        <ChevronRightIcon />
      </NoStyleButton>
      <NoStyleButton onClick={trash}>
        <DeleteIcon color="red" />
      </NoStyleButton>
    </ControlsSection>
  );
}
