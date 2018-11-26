// Проход по представлению InputView
export function InputView(root, callback) {
    let rows = root.children;
    for (
        let rowIndex = 0, rowsLen = rows.length;
        rowIndex < rowsLen;
        rowIndex++
    ) {
        let cols = rows[rowIndex].children;
        for (
            let colIndex = 0, colsLen = cols.length, elemIndex = 0;
            elemIndex < colsLen;
            elemIndex++
        ) {
            let elem = cols[elemIndex];
            if (elem instanceof HTMLSpanElement)
                continue;

            callback(elem, rowIndex, colIndex);
            colIndex++;
        }
    }
}

// Проход по представлению SimplexTable
export function SimplexTable(root, callback) {
    let rows = root.rows;
    for (let i = 1, iLen = rows.length; i < iLen; i++) {
        let cells = rows[i].cells;
        for (let j = 1, jLen = cells.length; j < jLen; j++) {
            callback(cells[j], i - 1, j - 1);
        }
    }
}
