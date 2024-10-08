export default class Selectioon {
    constructor(dataGrid) {
        this.dataGrid = dataGrid;

        this._selectedCells = new Set();
        this._currentSelectionRange = [];
        this._isRangeSelecting = false;
        this._rangeSelectingStart = null;

        this._copiedCells = [];
    }

    get selectedCells() {
        return this._selectedCells;
    }

    set selectedCells(value) {
        this._selectedCells = value;
    }

    get currentSelectionRange() {
        return this._currentSelectionRange;
    }

    get isRangeSelecting() {
        return this._isRangeSelecting;
    }

    set isRangeSelecting(value) {
        this._isRangeSelecting = value;
    }

    get rangeSelectingStart() {
        return this._rangeSelectingStart;
    }

    set rangeSelectingStart(value) {
        this._rangeSelectingStart = value;
    }

    set copiedCell(value) {
        this._copiedCells = value;
        // console.log(this._copiedCells);
    }

    get copiedCell() {
        return this._copiedCells;
    }

    selectCell(cell, append = false) {
        if (!append) {
            this.clearSelection();
        }

        this._selectedCells.add(cell);
        cell.classList.add("selected");
        cell.instance.focus();

        if (cell.instance.type === "checkbox") {
            cell.instance.readOnly = false;
        }
    }

    moveTo(row, col) {
        const nextCell = this.dataGrid.tbody.querySelector(
            `td[data-row="${row}"][data-col="${col}"]`
        );

        if (nextCell) {
            this.selectCell(nextCell);

            nextCell.scrollIntoView({
                behavior: "smooth",
                block: "center", // 수직 정렬을 지정
                inline: "end", // 수평 정렬을 지정
            });

            // nextCell.focus();

            if (nextCell.type === "checkbox") nextCell.readOnly = false;

            return nextCell;
        }
    }

    selectRange(startCell, endCell) {
        const startRow = parseInt(startCell.instance.row, 10);
        const startCol = parseInt(startCell.instance.col, 10);
        const endRow = parseInt(endCell.instance.row, 10);
        const endCol = parseInt(endCell.instance.col, 10);

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        this.clearSelection();

        let newSelection = [];
        for (let row = minRow; row <= maxRow; row++) {
            let rowSelection = [];
            for (let col = minCol; col <= maxCol; col++) {
                const cell = this.dataGrid.tbody.querySelector(
                    `td[data-row="${row}"][data-col="${col}"]`
                );
                if (cell) {
                    this.selectCell(cell, true);
                    rowSelection.push(cell);
                }
            }
            newSelection.push(rowSelection);
        }

        this._currentSelectionRange = newSelection;

        if (this._selectedCells.size > 1) {
            this.dataGrid.csvButtonVisible = true;
        }
    }

    clearSelection() {
        this._selectedCells.forEach((cell) => {
            cell.classList.remove("selected");
        });

        this._selectedCells.clear();

        const selctedTh = this.dataGrid.querySelector(".selected-th");
        if (selctedTh) {
            selctedTh.classList.remove("selected-th");
        }
    }
}
