import { useState, useRef, useEffect } from 'react';
import '../styles/WordleGrid.css';
import '../styles/Keyboard.css';

const NUM_COLUMNS = 5;
const NUM_ROWS = 6;
const DEBUG = true;
const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Delete']
]; 

function WordleGrid() {
  const cellsRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [cells, setCells] = 
      useState(Array(NUM_COLUMNS * NUM_ROWS).fill()
      .map((_, index) => ({ id : index, color: 'white', char: "" })));

  const currentRow = rowAt(focusedIndex);
  const canEditNextRow = 
      cells.slice(NUM_COLUMNS * currentRow, NUM_COLUMNS * (currentRow + 1))
      .every((cell) => cell.color !== 'white' && cell.char != '');
  const cellToEdit = cells.findIndex((cell) => cell.char === '');

  console.log("Cell to edit: %d", cellToEdit);

  useEffect(() => {
    if (DEBUG) {
      console.log("Focus index changed to %d", focusedIndex);
    }
    const map = getMap();
    const node = map.get(focusedIndex);
    node.focus();
  }, [focusedIndex]);

  function rowAt(index) {
    return Math.floor(index / NUM_COLUMNS) 
  };

  function getMap() {
    if (!cellsRef.current) {
      cellsRef.current = new Map();
    }
    return cellsRef.current;
  }

  function handleColorChange(newColor, e) {
    // Don't shift focus to color buttons
    e.preventDefault();

    setCells(cells.map((cell) => 
      cell.id === focusedIndex ? {...cell, color: newColor} : cell));
  };

  function handleClick(index, e) {
    if (DEBUG) {
      console.log("index: %d char: %s", index, cells[index].char);
    }
    // Don't allow clicking into non editable cells or empty cells
    if (rowAt(index) !== currentRow || cells[index].char === '') {
      e.preventDefault();
    } else {
      setFocusedIndex(index);
    }
  }

  function handleKeyPress(key) {
    if (DEBUG) {
      console.log("key: %s", key);
    }

    const um = key.match(/^[A-Za-z]$/);
    console.log("matched: %s", um);
    switch(key) {
      case 'Backspace':
      case 'Delete':
        if (DEBUG) {
          console.log("In Backspace");
        }

        if (rowAt(cellToEdit - 1) === currentRow) {
          setCells(cells.map((cell) => 
            cell.id === cellToEdit - 1 ? 
            {...cell, color: 'white', char : ''} : cell));
          
          // Change focus to last cell that has a character
          if (rowAt(cellToEdit - 2) === currentRow) {
            setFocusedIndex(cellToEdit - 2);
          }
        }
        break;

      case 'Enter':
        if (DEBUG) {
          console.log("In Enter");
        }
        if (canEditNextRow && cellToEdit != -1) {
          setFocusedIndex(cellToEdit);
        }
        break;

      case key.match(/^[A-Za-z]$/)?.input:
        const c = key.toLowerCase();

        if (rowAt(cellToEdit) !== currentRow) return;
        
        setCells(cells.map((cell) => 
            cell.id === cellToEdit ? {...cell, char : c} : cell));
        setFocusedIndex(cellToEdit);
        break;
    }
  }

  return (
    <div onKeyDown={(e) => handleKeyPress(e.key)} tabIndex="0">
      <div className="color-options">
        <button onClick={(e) => handleColorChange('grey', e)}>Grey</button>
        <button onClick={(e) => handleColorChange('green', e)}>Green</button>
        <button onClick={(e) => handleColorChange('yellow', e)}>Yellow</button>
      </div>
      <div className="grid-container">
        {cells.map((cell) => (
          <button className="wordle-cell"
            key={cell.id}
            tabIndex={-1}
            value={cell.char}
            style={{ backgroundColor: cell.color }}
            onClick={(e) => handleClick(cell.id, e)}
            ref={(node) => {
              const map = getMap();
              if (node) { 
                map.set(cell.id, node);
              } else {
                map.delete(cell.id);
              }
            }}
          >
            {cell.char}
          </button>
        ))}
      </div>
      <div className="keyboard-container">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key, keyIndex) => (
              <button className="key"
                key={keyIndex}
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
    </div>
    </div>
  );
};

export default WordleGrid;
