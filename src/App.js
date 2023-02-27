import './App.css';
import React, { useState } from 'react';
//eslint-disable-next-line
import header from './header'

const MINE_SYMBOL = '💣';
const FLAG_SYMBOL = '🚩';
const EMPTY_SYMBOL = '⬜';

function Tile({ isMine, isRevealed, isFlagged, adjacentMines, onClick, onContextMenu }) {
  function handleClick(event) {
    event.preventDefault();
    onClick();
  }

  function handleContextMenu(event) {
    event.preventDefault();
    onContextMenu();
  }

  let content;
  if (isFlagged) {
    content = FLAG_SYMBOL;
  } else if (isRevealed) {
    if (isMine) {
      content = MINE_SYMBOL;
    } else {
      content = adjacentMines;
    }
  } else {
    content = EMPTY_SYMBOL;
  }

  return (
    <button
      className="tile"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {content}
    </button>
  );
}

function Minesweeper() {
  const [tiles, setTiles] = useState(initializeTiles());
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  function initializeTiles() {
    // Create a 2D array of tiles with random mines
    // and set the adjacentMines property for each tile
    let tilesArr = new Array(5);
    for (let i=0; i<5; i++) {
      tilesArr[i] = new Array(5);
      for (let j=0; j<5; j++) {
        const isMine = Math.random() < 0.2;
        tilesArr[i][j] = { isMine, isRevealed: false, isFlagged: false, adjacentMines: 0 }
      }
    }

    for (let i=0; i<5; i++) {
      for (let j=0; j<5; j++) {
        const thisTile = tilesArr[i][j];

        if (thisTile.isMine) {
          if (i-1>=0) {
           if (j-1>=0) {
             tilesArr[i-1][j-1].adjacentMines += 1;
           }
            if (j>=0) {
              tilesArr[i-1][j].adjacentMines += 1;
            }
            if (j+1<5) {
              tilesArr[i-1][j+1].adjacentMines += 1;
            }
          }
          if (i>=0) {
            if (j-1>=0) {
              tilesArr[i][j-1].adjacentMines += 1;
            }
            if (j+1<5) {
              tilesArr[i][j+1].adjacentMines += 1;
            }
          }
          if (i+1<5) {
            if (j-1>=0) {
              tilesArr[i+1][j-1].adjacentMines += 1;
            }
            if (j>=0) {
              tilesArr[i+1][j].adjacentMines += 1;
            }
            if (j+1<5) {
              tilesArr[i+1][j+1].adjacentMines += 1;
            }
          }
        }
      }
    }
    return tilesArr 
  

  }

  function revealTile(row, col) {
    tiles[row][col] = { ...tiles[row][col], isRevealed: true }
    setTiles([...tiles])
    // Set the isRevealed property of the specified tile to true
    // and re-render the board
  }

  function flagTile(row, col) {
    const currentFlagStatus = tiles[row][col].isFlagged;
    tiles[row][col] = { ...tiles[row][col], isFlagged: !currentFlagStatus }
    setTiles([...tiles])
    // Set the isFlagged property of the specified tile to true
    // and re-render the board
  }
 
  function handleTileClick(row, col) {
    if (isGameOver || isGameWon) {
      return;
    }

    const tile = tiles[row][col];
    if (tile.isFlagged || tile.isRevealed) {
      return;
    }

    if (tile.isMine) {
      setIsGameOver(true);
      alert('Oh no you hit a mine!')
      for (let i=0; i<5; i++) {
        for (let j = 0; j < 5; j++) {
          revealTile(i, j)
        }
      }
    } else {
      revealTile(row, col);
    }
    checkIsGameWon();
  }

  function handleTileContextMenu(row, col) {
    if (isGameOver || isGameWon) {
      return;
    }

    const tile = tiles[row][col];
    if (tile.isRevealed) {
      return;
    }

    flagTile(row, col);
    checkIsGameWon();
  }

  function checkIsGameWon() {
    if (!isGameOver) {
      let foundAll = true;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (tiles[i][j].isMine && !tiles[i][j].isFlagged) {
            foundAll = false;
          }
          if (!tiles[i][j].isMine && tiles[i][j].isFlagged) {
            foundAll = false;
          }
        }
      }
      if (foundAll) {
        setIsGameWon(true)
        alert('You WON!!!!')
      }
    }
  }


  return (
    <div className="minesweeper">
      <div className="wrapper">
      <header/>
      {tiles.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((tile, colIndex) => (
              <Tile
                key={colIndex}
                {...tile}
                onClick={() => handleTileClick(rowIndex, colIndex)}
                onContextMenu={() => handleTileContextMenu(rowIndex, colIndex)}
              />
        
          ))}
        </div>
      ))}
      </div>
    </div>
  );
}
//eslint-disable-next-line


export default  Minesweeper;