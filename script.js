document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const checkBtn = document.getElementById('checkBtn');
    const difficultyDropdown = document.getElementById('difficulty');

    function generateSudoku(difficulty = 'easy') {
        const puzzles = {
            easy: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
            medium: '009000600060005080200190007003050000008000600000080300800027005010500020005000800',
            hard: '020600000004000050006050008070000004000207000900000010500040700030000200000009040'
        };
        const puzzle = puzzles[difficulty].split('');

        board.innerHTML = '';

        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1';
            input.pattern = '[1-9]';

            if (puzzle[i] !== '0') {
                input.value = puzzle[i];
                input.disabled = true;
            }

            cell.appendChild(input);
            board.appendChild(cell);
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
