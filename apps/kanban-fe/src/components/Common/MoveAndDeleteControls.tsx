import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import { Percent } from '../../types/styling.types';

import { ControlsSection, NoStyleButton } from './MoveAndDeleteControls.styles';

interface MoveAndDeleteControlsProps {
  disableMoveLeft: boolean;
  disableMoveRight: boolean;
  moveLeft: VoidFunction;
  moveRight: VoidFunction;
  trash: VoidFunction; // Named 'trash' because `delete` is a reserved keyword.
  show?: boolean;
  opacityMin?: Percent;
}

export function MoveAndDeleteControls({
  disableMoveLeft,
  disableMoveRight,
  moveLeft,
  moveRight,
  trash,
  show = true,
  opacityMin = 0,
}: MoveAndDeleteControlsProps) {
  return (
    <ControlsSection show={show} opacityMin={opacityMin}>
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
