document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const checkBtn = document.getElementById('checkBtn');
    const difficultyDropdown = document.getElementById('difficulty');

    // needs to be generated fast somehow, sample board for now
    const sampleBoard = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    function shuffleBoard(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const i1 = Math.floor(Math.random() * 9);
                const j1 = Math.floor(Math.random() * 9);
                const temp = board[i][j];
                board[i][j] = board[i1][j1];
                board[i1][j1] = temp;
            }
        }
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

    function generateSudoku(difficulty = 'easy') {
        const grid = JSON.parse(JSON.stringify(sampleBoard));
        shuffleBoard(grid);
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
            const value = input.value;
            if (value && !validateInput(input)) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '#00ffff';
            }
        });

        if (isValid) {
            alert('Board is valid!');
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
