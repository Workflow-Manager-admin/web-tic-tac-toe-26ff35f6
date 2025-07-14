import React, { useState } from 'react';
import './App.css';

/**
 * Square component: renders a single Tic Tac Toe cell.
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell: ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

/**
 * GameBoard component: displays a 3x3 Tic Tac Toe grid.
 */
function GameBoard({ squares, onSquareClick, highlights }) {
  return (
    <div className="ttt-board">
      {squares.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          highlight={highlights && highlights.includes(idx)}
        />
      ))}
    </div>
  );
}

/**
 * Returns [winner ("X" or "O" or null), winning line array or null, isDraw: boolean]
 */
function calculateGameOutcome(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c], false];
    }
  }
  if (squares.every(Boolean)) {
    return [null, null, true];
  }
  return [null, null, false];
}

/**
 * PUBLIC_INTERFACE
 * App: Main app with PvP game logic, UI, and theme.
 */
function App() {
  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null)); // 3x3 board
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);

  // Calculate win/draw on move
  React.useEffect(() => {
    const [victor, line, draw] = calculateGameOutcome(squares);
    if (victor) {
      setGameOver(true);
      setWinner(victor);
      setWinLine(line);
      setScore(prev => ({ ...prev, [victor]: prev[victor] + 1 }));
    } else if (draw) {
      setGameOver(true);
      setWinner(null);
      setWinLine(null);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (gameOver || squares[idx]) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setGameOver(false);
    setWinner(null);
    setWinLine(null);
    setXIsNext((score.X + score.O) % 2 === 0); // alternate who starts
  }

  // Status message
  let status;
  if (gameOver) {
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = "It's a Draw!";
    }
  } else {
    status = `Current Turn: ${xIsNext ? 'X' : 'O'}`;
  }

  // UI
  return (
    <div className="ttt-app">
      <div className="ttt-status-score">
        <div className="ttt-score">
          <span className="ttt-x-score" aria-label="X score">
            X: {score.X}
          </span>
          <span style={{fontWeight: 300, color: "#aaa", margin: '0 0.7rem'}}>•</span>
          <span className="ttt-o-score" aria-label="O score">
            O: {score.O}
          </span>
        </div>
        <div className="ttt-status">
          {status}
        </div>
      </div>
      <GameBoard
        squares={squares}
        onSquareClick={handleSquareClick}
        highlights={winLine}
      />
      <div className="ttt-controls">
        <button className="ttt-btn ttt-btn-primary" onClick={handleReset}>
          {gameOver ? "Play Again" : "Reset"}
        </button>
        <span className="ttt-mode-pill"> PvP </span>
      </div>
      <footer className="ttt-footer">
        <span>Minimal Tic Tac Toe • React</span>
      </footer>
    </div>
  );
}

export default App;
