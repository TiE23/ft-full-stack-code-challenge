import React, { useState } from 'react';

import useFocus from '../../hooks/useFocus';
import {
  NewEntityCreateButton,
  NewEntityFormContainer,
  NewEntityInput,
} from './NewEntity.styles';

export interface NewEntityFormProps {
  onCreate: (input: string) => void;
}

export function NewEntityForm({ onCreate }: NewEntityFormProps) {
  const [input, setInput] = useState('');
  const inputRef = useFocus();

  /**
   * Listen for the enter key so we can trigger a submit in a controlled manner.
   * @param event
   */
  const handleInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submit();
    }
  };

  const submit = () => {
    onCreate(input);
  };

  return (
    <>
      <NewEntityInput
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleInput}
      />
      <NewEntityCreateButton
        onClick={() => submit()}
        disabled={input.trim().length === 0}
      >
        Create
      </NewEntityCreateButton>
    </>
  );
}

export default NewEntityForm;
