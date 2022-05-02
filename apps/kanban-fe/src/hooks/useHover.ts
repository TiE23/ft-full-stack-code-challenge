import { MutableRefObject, useEffect, useRef, useState } from 'react';

export type MouseMode = 'over' | 'enter';

/**
 * Borrowed from https://usehooks.com/useHover/ with custom adjustment to
 * support mouseover/mouseenter option.
 * (The first Google result for "react on hover hook"...)
 * @returns
 */
function useHover<T>(mode: MouseMode = 'over'): [MutableRefObject<T>, boolean] {
  const [value, setValue] = useState<boolean>(false);
  const ref: any = useRef<T | null>(null);
  const handleMouseOver = (): void => setValue(true);
  const handleMouseOut = (): void => setValue(false);

  const [mouseOn, mouseOff] =
    mode === 'over' ? ['mouseover', 'mouseout'] : ['mouseenter', 'mouseleave'];

  useEffect(
    () => {
      const node: any = ref.current;
      if (node) {
        node.addEventListener(mouseOn, handleMouseOver);
        node.addEventListener(mouseOff, handleMouseOut);
        return () => {
          node.removeEventListener(mouseOn, handleMouseOver);
          node.removeEventListener(mouseOff, handleMouseOut);
        };
      }
      return;
    },
    [ref.current] // Recall only if ref changes
  );
  return [ref, value];
}

export default useHover;
