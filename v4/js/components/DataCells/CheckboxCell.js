import DataCellBase from "./DataCellBase.js";

export default class CheckboxCell extends DataCellBase {
    constructor(params) {
        super(params);
    }

    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = Boolean(value);
        this._el.ariaReadOnly = Boolean(value);
    }

    get value() {
        return this._value;
    }

    set value(arg) {
        // 불리언 값이 아니면 return
        if (typeof arg !== "boolean" && arg !== "true" && arg !== "false") {
            return;
        }

        const isChecked = arg === true || arg === "true";

        this._value = isChecked;
        this._el.checked = isChecked;
    }

    get currentValue() {
        return this._el.checked;
    }

    createElement() {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = this._value;
        input.ariaReadOnly = this._readOnly;
        return input;
    }
}
