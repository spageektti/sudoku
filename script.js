document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const checkBtn = document.getElementById('checkBtn');
    const difficultyDropdown = document.getElementById('difficulty');
    const timerDisplay = document.getElementById('timer');
    let timerInterval;
    let startTime;

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const minutes = Math.floor(elapsedTime / 60000) % 60;
            const seconds = Math.floor((elapsedTime / 1000) % 60);
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function generateSudoku(difficulty = 'easy') {
        stopTimer();
        const puzzleString = sudoku.generate(difficulty);
        const grid = sudoku.board_string_to_grid(puzzleString);
        board.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = '1';
                input.pattern = '[1-9]';
                if (grid[row][col] !== '.') {
                    input.value = grid[row][col];
                    input.disabled = true;
                }
                cell.appendChild(input);
                board.appendChild(cell);
            }
        }
        startTimer();
    }

    function validateInput(input) {
        const value = input.value;
        if (value === '') return false;
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
            stopTimer();
            alert(`Board is valid! Time: ${timerDisplay.textContent}`);
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
