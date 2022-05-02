import {
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons';
import { theme } from '../../../theme';
import { useTransition } from '@react-spring/web';
import useMeasure from 'react-use-measure';

import { Percent } from '../../../types/styling.types';

import {
  AnimatedControlsSection,
  AnimatedEditSection,
  ControlsContainer,
  NoStyleButton,
} from './MoveAndUpdateControls.styles';
import { useEffect, useState } from 'react';

interface MoveAndUpdateControlsProps {
  disableMoveLeft: boolean;
  disableMoveDown?: boolean;
  disableMoveUp?: boolean;
  disableMoveRight: boolean;
  moveLeft: VoidFunction;
  moveDown?: VoidFunction;
  moveUp?: VoidFunction;
  moveRight: VoidFunction;
  openEdit?: VoidFunction;
  trash: VoidFunction; // Named 'trash' because `delete` is a reserved keyword.
  mode: 'edit' | 'move';
  show?: boolean;
  opacityMin?: Percent;
}

export function MoveAndUpdateControls({
  disableMoveLeft,
  disableMoveDown = true,
  disableMoveUp = true,
  disableMoveRight,
  moveLeft,
  moveDown,
  moveUp,
  moveRight,
  openEdit,
  trash,
  mode,
  show = true,
  opacityMin = 0,
}: MoveAndUpdateControlsProps) {
  const transition = useTransition(mode === 'edit', {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: mode === 'edit',
    delay: theme.design.controls.transitionDelayMs,
    config: {
      duration: theme.design.controls.transitionTimeMs,
    },
  });

  // This is such a hack but I'm turning this in soon. :)
  const [measureRef, { height, width }] = useMeasure();
  const [moveHeight, setMoveHeight] = useState(height);
  const [moveWidth, setMoveWidth] = useState(width);
  useEffect(() => {
    if (height > moveHeight) setMoveHeight(height);
    if (width > moveWidth) setMoveWidth(width);
  }, [height, width]);

  const disableMove = !show || mode !== 'move';
  const disableEdit = !show || mode !== 'edit';

  return (
    <ControlsContainer
      show={show}
      opacityMin={opacityMin}
      heightPx={moveHeight}
      widthPx={moveWidth}
    >
      {transition(({ opacity }, editMode) =>
        editMode ? (
          <AnimatedEditSection
            style={{
              position: 'absolute',
              opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
            }}
          >
            <NoStyleButton disabled={disableEdit} onClick={openEdit}>
              <EditIcon
                w={theme.design.controls.iconSizePx}
                h={theme.design.controls.iconSizePx}
              />
            </NoStyleButton>
          </AnimatedEditSection>
        ) : (
          <AnimatedControlsSection
            ref={measureRef}
            style={{
              position: 'absolute',
              opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }),
            }}
          >
            <NoStyleButton
              disabled={disableMoveLeft || disableMove}
              onClick={moveLeft}
            >
              <ChevronLeftIcon
                w={theme.design.controls.iconSizePx}
                h={theme.design.controls.iconSizePx}
              />
            </NoStyleButton>
            {moveDown && (
              <NoStyleButton
                disabled={disableMoveDown || disableMove}
                onClick={moveDown}
              >
                <ChevronDownIcon
                  w={theme.design.controls.iconSizePx}
                  h={theme.design.controls.iconSizePx}
                />
              </NoStyleButton>
            )}
            {moveUp && (
              <NoStyleButton
                disabled={disableMoveUp || disableMove}
                onClick={moveUp}
              >
                <ChevronUpIcon
                  w={theme.design.controls.iconSizePx}
                  h={theme.design.controls.iconSizePx}
                />
              </NoStyleButton>
            )}
            <NoStyleButton
              disabled={disableMoveRight || disableMove}
              onClick={moveRight}
            >
              <ChevronRightIcon
                w={theme.design.controls.iconSizePx}
                h={theme.design.controls.iconSizePx}
              />
            </NoStyleButton>
            <NoStyleButton onClick={trash || disableMove}>
              <DeleteIcon
                w={theme.design.controls.iconSizePx}
                h={theme.design.controls.iconSizePx}
                color="red"
              />
            </NoStyleButton>
          </AnimatedControlsSection>
        )
      )}
    </ControlsContainer>
  );
}
