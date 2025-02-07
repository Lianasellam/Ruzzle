// components/Board.js
import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';

// Returns a random letter (A-Z)
const generateRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
};

// Creates a 2D board (array) of cells with a letter and coordinates
const createBoard = (size) => {
  let board = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push({
        letter: generateRandomLetter(),
        row: i,
        col: j,
      });
    }
    board.push(row);
  }
  return board;
};

// Helper function to check if two cells are adjacent (including diagonally)
const isAdjacent = (cellA, cellB) => {
  return (
    Math.abs(cellA.row - cellB.row) <= 1 &&
    Math.abs(cellA.col - cellB.col) <= 1
  );
};

const Board = ({ size = 4, onCellPress, selectedCells, gridData }) => {
  // Use provided gridData if available; otherwise, generate a random board.
  const board = gridData || createBoard(size);
  const boardLayout = useRef(null);

  // Set up a PanResponder to support swiping across cells.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        handleTouch(evt.nativeEvent);
      },
      onPanResponderMove: (evt, gestureState) => {
        handleTouch(evt.nativeEvent);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  // Determine which cell is being touched based on its location.
  const handleTouch = (nativeEvent) => {
    if (!boardLayout.current) return;
    const { locationX, locationY } = nativeEvent;
    // Each cell is about 60px with margins; we assume roughly 64px per cell.
    const cellSize = 64;
    const row = Math.floor(locationY / cellSize);
    const col = Math.floor(locationX / cellSize);
    if (row < 0 || row >= size || col < 0 || col >= size) return;
    const cell = board[row][col];
    // If the cell is not already selected and is adjacent (or first), call onCellPress.
    if (!selectedCells.some((c) => c.row === cell.row && c.col === cell.col)) {
      if (
        selectedCells.length === 0 ||
        isAdjacent(selectedCells[selectedCells.length - 1], cell)
      ) {
        onCellPress(cell);
      }
    }
  };

  return (
    <View
      style={styles.board}
      onLayout={(e) => {
        boardLayout.current = e.nativeEvent.layout;
      }}
      {...panResponder.panHandlers}
    >
      {board.map((rowData, rowIndex) => (
        <View style={styles.row} key={`row-${rowIndex}`}>
          {rowData.map((cell) => {
            const isSelected = selectedCells.some(
              (selected) => selected.row === cell.row && selected.col === cell.col
            );
            return (
              <View
                key={`cell-${cell.row}-${cell.col}`}
                style={[styles.cell, isSelected && styles.selectedCell]}
              >
                <Text style={styles.letter}>{cell.letter}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    backgroundColor: '#fff',
  },
  selectedCell: {
    backgroundColor: '#add8e6', // Light blue highlight
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Board;


