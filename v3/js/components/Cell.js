export default class Cell {
    constructor(tableController, params) {
        this.dataGrid = tableController.dataGrid;
        this.dataModel = this.dataGrid.dataModel;
        this.selection = tableController.selection;
        this.tableController = tableController;

        this._cell = null;
        this._row = params.row;
        this._col = params.col;
        this._type = params.type;
        this._title = params.title;
        this._value = params.value;

        return this.createCell();
    }

    get row() {
        return this._row;
    }

    set row(value) {
        this._cell.dataset.row = value;
        this._row = value;
    }

    get col() {
        return this._col;
    }

    set col(value) {
        this._cell.dataset.col = value;
        this._col = value;
    }

    get value() {
        return this._value;
    }

    get readOnly() {
        return this._input.hasAttribute("aria-readonly")
            ? this._input.ariaReadOnly === "true"
            : this._input.readOnly;
    }

    set readOnly(value) {
        if (this._type === "string") return;

        if (this._input.hasAttribute("aria-readonly")) {
            this._input.ariaReadOnly = value;
        } else {
            this._input.readOnly = Boolean(value);
        }
    }

    get inputElement() {
        return this._input;
    }

    createCell() {
        const cell = document.createElement("td");
        cell.dataset.row = this._row;
        cell.dataset.col = this._col;

        if (this._title === "id") {
            cell.dataset.id = this._value;
        }

        let childElement = null;

        if (this._type === "string") {
            childElement = this.createText();
        } else {
            childElement = this.createInput();
        }

        cell.appendChild(childElement);

        this._input = childElement;
        this._cell = cell;

        this.bindEvnets();

        // Store the Cell instance reference in the DOM element
        cell.instance = this;

        return cell;
    }

    createText() {
        const el = document.createElement("span");
        el.textContent = this._value;
        el.className = "text";
        el.tabIndex = 0;
        return el;
    }

    createInput() {
        let input = document.createElement("input");
        switch (this._type) {
            case "datalist":
                input.type = "text";
                input.setAttribute(
                    "list",
                    this.tableController.datalistId(this._title)
                );
                input.value = this._value;
                input.readOnly = true;
                break;
            case "select":
                const select = this.tableController.selectObject[this._title];
                input = select.cloneNode(true);
                input.value = this._value;
                input.ariaReadOnly = true;
                break;
            case "checkbox":
                input.type = "checkbox";
                input.checked = Boolean(this._value);
                input.ariaReadOnly = true;
                break;
            default: // text, number
                input.type = this._type;
                input.value = this._value;
                input.readOnly = true;
                break;
        }

        input.dataset.type = this._type;

        return input;
    }

    bindEvnets() {
        this._cell.addEventListener("click", this.onClick.bind(this));
        this._cell.addEventListener("dblclick", this.onDBClick.bind(this));
        this._cell.addEventListener("input", this.onInput.bind(this));
        this._input.addEventListener("change", this.onChange.bind(this));

        this._input.addEventListener("keydown", this.onKeyDown.bind(this));

        // select range
        this._cell.addEventListener("mousedown", this.onMouseDown.bind(this));
        this._cell.addEventListener("mousemove", this.onMouseMove.bind(this));
        this._cell.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    onClick(e) {
        this.dataGrid.csvButtonVisible = false;

        const cells = this.selection.selectedCells;

        cells.forEach((cell) => {
            this.setEditable(
                cell.querySelector("input") || cell.querySelector("select"),
                false
            );
        });

        if (e.shiftKey && cells.size > 0) {
            this.selection.selectRange(Array.from(cells)[0], this._cell);
        } else {
            this.selection.selectCell(this._cell, e.shiftKey);
            // this._input.focus(); // checkbox 포커스 되어야 셀 이동이 된다.
        }
    }

    onDBClick() {
        this.readOnly = false;
        this._input.focus();
    }

    onInput(e) {
        if (this.dataGrid.isComposing) return;

        // console.log(
        //     `셀 (${this._row}, ${this._col}) 값 변경: ${this._input.value}`
        // );
    }

    setEditable(inputElement, isEditable) {
        if (!inputElement) return;
        if (inputElement.hasAttribute("aria-readonly")) {
            inputElement.ariaReadOnly = String(!isEditable);
        } else {
            inputElement.readOnly = !isEditable;
        }
    }

    onKeyDown(e) {
        const cells = this.selection.selectedCells;
        if (!cells.size) return;

        const isEditing = this.readOnly === false;
        const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

        if (isEditing && !this.dataGrid.isComposing) {
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    this.readOnly = true;
                    const nextInput = this.moveUpDown(e.shiftKey);
                    this.setEditable(nextInput);
                    break;
                case "Tab":
                    e.preventDefault();
                    this._input.blur();
                    this.readOnly = true;
                    this.moveSide(e.shiftKey);
                    break;
                case "Escape":
                    e.preventDefault();
                    this._input.value = this._value;
                    this.readOnly = true;
                    console.log(this._value, this._input.value);
                    break;
            }

            if (this._type === "checkbox" && arrowKeys.includes(e.key)) {
                this.handleArrowKey(e);
            }
        } else {
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    if (this._type === "string") {
                        this.moveUpDown(e.shiftKey);
                    } else {
                        this.readOnly = false;
                        this._input.focus();
                    }

                    break;
                case "Tab":
                    e.preventDefault();
                    this.moveSide(e.shiftKey);
                    break;
            }

            if (arrowKeys.includes(e.key)) {
                this.handleArrowKey(e);
            }
        }
    }

    moveUpDown(shiftKey) {
        if (shiftKey) {
            return this.selection.moveTo(this._row - 1, this._col);
        } else {
            return this.selection.moveTo(this._row + 1, this._col);
        }
    }

    moveSide(shiftKey) {
        if (shiftKey) {
            this.selection.moveTo(this._row, this._col - 1);
        } else {
            this.selection.moveTo(this._row, this._col + 1);
        }
    }

    handleArrowKey(e) {
        e.preventDefault();
        switch (e.key) {
            case "ArrowUp":
                this.selection.moveTo(this._row - 1, this._col);
                break;
            case "ArrowDown":
                this.selection.moveTo(this._row + 1, this._col);
                break;
            case "ArrowLeft":
                this.selection.moveTo(this._row, this._col - 1);
                break;
            case "ArrowRight":
                this.selection.moveTo(this._row, this._col + 1);
                break;
        }
    }

    onChange(e) {
        const currentValue =
            this._type === "checkbox" ? this._input.checked : this._input.value;
        if (this._value !== currentValue) {
            this._value = currentValue;
            this.saveCellData();
        }

        if (this._type === "select") {
            this.readOnly = true;
            const inputElement = this.selection.moveTo(
                this._row + 1,
                this._col
            );
            this.setEditable(inputElement);
        }
    }

    onMouseDown(e) {
        if (e.shiftKey) return;
        this.selection.isRangeSelecting = true;
        this.selection.rangeSelectingStart = this._cell;
        this.selection.clearSelection();
        this.selection.selectCell(this._cell);
    }

    onMouseMove(e) {
        if (this.selection.isRangeSelecting) {
            this.selection.selectRange(
                this.selection.rangeSelectingStart,
                this._cell
            );
        }
    }

    onMouseUp() {
        this.selection.isRangeSelecting = false;
    }

    saveCellData() {
        const id = this.getCellId();
        const title = this.getTitle();
        this.dataModel.updateFieldValue(id, title, this._value);
    }

    getCellId() {
        const cellWithId =
            this._cell.parentElement.querySelector("td[data-id]");
        return cellWithId ? cellWithId.dataset.id : null;
    }

    getTitle() {
        const th = this.dataGrid.thead.querySelectorAll("th")[this._col + 1];
        return th ? th.textContent : null;
    }
}
