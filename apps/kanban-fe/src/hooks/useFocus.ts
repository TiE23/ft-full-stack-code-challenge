import { useRef, useEffect } from 'react';

/**
 * Custom hook provides a ref that, when the element it is attached to appears,
 * will focus it - making it ready immediately for keyboard input.
 * @returns
 */
const useFocus = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('focus!!', !!ref.current?.focus());
    ref.current?.focus();
  }, []);

  return ref;
};

export default useFocus;
