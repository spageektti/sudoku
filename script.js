document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const checkBtn = document.getElementById('checkBtn');
    const difficultyDropdown = document.getElementById('difficulty');

    async function fetchSudokuBoard() {
        const response = await fetch('https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{solution}}}');
        const data = await response.json();
        return data.newboard.grids[0].solution;
    }

    function removeNumbersFromBoard(board, difficulty) {
        let attempts = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 40 : 55;
        while (attempts > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                attempts--;
            }
        }
    }

    async function generateSudoku(difficulty = 'easy') {
        const grid = await fetchSudokuBoard();
        removeNumbersFromBoard(grid, difficulty);
        board.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = '1';
                input.pattern = '[1-9]';
                if (grid[row][col] !== 0) {
                    input.value = grid[row][col];
                    input.disabled = true;
                }
                cell.appendChild(input);
                board.appendChild(cell);
            }
        }
    }

    function validateInput(input) {
        const value = input.value;
        if (value === '') return false; // Check for empty cells
        const index = Array.from(input.parentNode.parentNode.children).indexOf(input.parentNode);
        const row = Math.floor(index / 9);
        const col = index % 9;
        for (let i = 0; i < 9; i++) {
            const currentInput = board.children[row * 9 + i].querySelector('input').value;
            if (i !== col && currentInput === value) {
                return false;
            }
        }
        for (let i = 0; i < 9; i++) {
            const currentInput = board.children[i * 9 + col].querySelector('input').value;
            if (i !== row && currentInput === value) {
                return false;
            }
        }
        const boxRowStart = Math.floor(row / 3) * 3;
        const boxColStart = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const currentInput = board.children[(boxRowStart + i) * 9 + (boxColStart + j)].querySelector('input').value;
                if ((boxRowStart + i) !== row && (boxColStart + j) !== col && currentInput === value) {
                    return false;
                }
            }
        }
        return true;
    }

    function checkBoard() {
        const inputs = document.querySelectorAll('.cell input');
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                input.style.color = 'red';
                isValid = false;
            } else {
                input.style.color = '#00ffff';
            }
        });

        const allFilled = Array.from(inputs).every(input => input.value !== '');

        if (isValid && allFilled) {
            alert('Board is valid!');
        } else if (!allFilled) {
            alert('The board has empty cells.');
        } else {
            alert('There are some errors on the board.');
        }
    }

    generateSudoku(difficultyDropdown.value);
    difficultyDropdown.addEventListener('change', (event) => {
        generateSudoku(event.target.value);
    });
    checkBtn.addEventListener('click', checkBoard);
});
