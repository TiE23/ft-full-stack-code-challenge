import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook provides a ref that, when there is a click that happens that
 * isn't made inside the ref'd element, will update the showing state to false
 * (read: hide it).
 * @param initialShowing
 * @returns [showing, setShowing, ref]
 */
const useHideOnClickOutside = <T extends HTMLElement>(
  initialShowing: boolean
): [boolean, (showing: boolean) => void, React.RefObject<T>] => {
  const [showing, setShowing] = useState(initialShowing);
  const ref = useRef<T>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setShowing(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return [showing, setShowing, ref];
};

export default useHideOnClickOutside;
