document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');

    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1';
        input.pattern = '[1-9]';
        cell.appendChild(input);
        board.appendChild(cell);
    }

    const checkBtn = document.getElementById('checkBtn');
    checkBtn.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.cell input');
        let isValid = true;

        inputs.forEach(input => {
            const value = input.value;
            if (value && !validateInput(input)) {
                input.style.color = 'red';
                isValid = false;
            } else {
                input.style.color = '#00ffff';
            }
        });

        if (isValid) {
            alert('Board is valid!');
        } else {
            alert('There are some errors on the board.');
        }
    });

    function validateInput(input) {
        const value = input.value;
        const index = Array.from(input.parentNode.parentNode.children).indexOf(input.parentNode);
        const row = Math.floor(index / 9);
        const col = index % 9;

        // check row
        for (let i = 0; i < 9; i++) {
            const currentInput = board.children[row * 9 + i].querySelector('input').value;
            if (i !== col && currentInput === value) {
                return false;
            }
        }

        // check column
        for (let i = 0; i < 9; i++) {
            const currentInput = board.children[i * 9 + col].querySelector('input').value;
            if (i !== row && currentInput === value) {
                return false;
            }
        }

        // check 3x3 box
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
});
