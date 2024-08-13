document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');

    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1';
        cell.appendChild(input);
        board.appendChild(cell);
    }

    const checkBtn = document.getElementById('checkBtn');
    checkBtn.addEventListener('click', () => {
        alert('Checking the board!');
    });
});
