// App.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import Board from './components/Board';
import dictionary from './assets/dictionary.json';

// Helper function to check if two cells are adjacent (including diagonally)
const isAdjacent = (cellA, cellB) => {
  return (
    Math.abs(cellA.row - cellB.row) <= 1 &&
    Math.abs(cellA.col - cellB.col) <= 1
  );
};

// Helper function to convert a 16-letter string into a 4x4 grid.
const createCustomBoardFromString = (input) => {
  if (input.length !== 16) {
    Alert.alert('Input Error', 'Please enter exactly 16 letters.');
    return null;
  }
  let board = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      let letter = input.charAt(i * 4 + j).toUpperCase();
      row.push({ letter, row: i, col: j });
    }
    board.push(row);
  }
  return board;
};

export default function App() {
  const [selectedCells, setSelectedCells] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [submittedWords, setSubmittedWords] = useState([]);
  const [gridMode, setGridMode] = useState('random'); // 'random' or 'custom'
  const [customGridInput, setCustomGridInput] = useState('');
  const [customGrid, setCustomGrid] = useState(null);

  // Handle cell selection (either by tap or swipe)
  const handleCellPress = (cell) => {
    if (selectedCells.length === 0) {
      setSelectedCells([cell]);
      setCurrentWord(cell.letter);
    } else {
      const lastCell = selectedCells[selectedCells.length - 1];
      if (isAdjacent(lastCell, cell)) {
        if (!selectedCells.some((c) => c.row === cell.row && c.col === cell.col)) {
          setSelectedCells([...selectedCells, cell]);
          setCurrentWord((prev) => prev + cell.letter);
        }
      } else {
        Alert.alert('Invalid Move', 'You must select an adjacent cell.');
      }
    }
  };

  // Validate and submit the current word.
  const handleSubmitWord = () => {
    if (currentWord.length === 0) return;

    if (submittedWords.includes(currentWord)) {
      Alert.alert('Duplicate Word', `"${currentWord}" has already been submitted.`);
    } else if (dictionary.words.includes(currentWord.toLowerCase())) {
      const wordScore = currentWord.length;
      setScore((prevScore) => prevScore + wordScore);
      setSubmittedWords([...submittedWords, currentWord]);
      Alert.alert('Good Job!', `"${currentWord}" is valid! (+${wordScore} points)`);
    } else {
      Alert.alert('Invalid Word', `"${currentWord}" is not in the dictionary.`);
    }

    setSelectedCells([]);
    setCurrentWord('');
  };

  // Reset the current selection without submitting.
  const handleResetSelection = () => {
    setSelectedCells([]);
    setCurrentWord('');
  };

  // Convert the text input into a custom grid and switch mode.
  const handleSetCustomGrid = () => {
    const newGrid = createCustomBoardFromString(customGridInput);
    if (newGrid) {
      setCustomGrid(newGrid);
      setGridMode('custom');
      setSelectedCells([]);
      setCurrentWord('');
    }
  };

  // Toggle between random and custom grid modes.
  const handleToggleGridMode = () => {
    if (gridMode === 'random') {
      setGridMode('custom');
    } else {
      setGridMode('random');
      setCustomGrid(null);
    }
    setSelectedCells([]);
    setCurrentWord('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>

      {/* Toggle button for grid mode */}
      <TouchableOpacity style={styles.button} onPress={handleToggleGridMode}>
        <Text style={styles.buttonText}>
          Switch to {gridMode === 'random' ? 'Custom Grid' : 'Random Grid'}
        </Text>
      </TouchableOpacity>

      {/* When in custom mode, show text input for 16 letters */}
      {gridMode === 'custom' && (
        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter 16 letters"
            value={customGridInput}
            onChangeText={setCustomGridInput}
            maxLength={16}
          />
          <TouchableOpacity style={styles.button} onPress={handleSetCustomGrid}>
            <Text style={styles.buttonText}>Set Custom Grid</Text>
          </TouchableOpacity>
        </View>
      )}

      <Board
        size={4}
        onCellPress={handleCellPress}
        selectedCells={selectedCells}
        gridData={gridMode === 'custom' && customGrid ? customGrid : undefined}
      />

      <Text style={styles.currentWord}>Current Word: {currentWord}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSubmitWord}>
        <Text style={styles.buttonText}>Submit Word</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleResetSelection}>
        <Text style={styles.buttonText}>Reset Selection</Text>
      </TouchableOpacity>
      <Text style={styles.submittedWordsTitle}>Submitted Words:</Text>
      {submittedWords.map((word, index) => (
        <Text key={index} style={styles.submittedWord}>
          {word}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
  },
  currentWord: {
    fontSize: 24,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  submittedWordsTitle: {
    fontSize: 20,
    marginTop: 20,
  },
  submittedWord: {
    fontSize: 16,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    marginRight: 10,
    width: 150,
    fontSize: 16,
  },
});


