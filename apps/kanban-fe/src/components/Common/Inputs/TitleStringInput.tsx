import useFocus from '../../../hooks/useFocus';
import { listenForEnter } from '../../../utils/common.utils';

import StringInput from './StringInput.styled';

interface TitleStringInputProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  submit: VoidFunction;
  placeholder?: string;
}
/**
 * This needs to be its own component for useFocus() to work. Literally the only
 * reason.
 * @param props
 * @returns
 */
function TitleStringInput({
  title,
  setTitle,
  submit,
  placeholder,
}: TitleStringInputProps) {
  const inputRef = useFocus();
  return (
    <StringInput
      ref={inputRef}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyPress={listenForEnter(submit)}
      placeholder={placeholder}
    />
  );
}

export default TitleStringInput;
