import { BoardBase } from './Board.styling';
import { Test } from './Test';

export function Board() {
  return (
    <BoardBase>
      <h1>Welcome to Board!</h1>
      <Test />
    </BoardBase>
  );
}

export default Board;
