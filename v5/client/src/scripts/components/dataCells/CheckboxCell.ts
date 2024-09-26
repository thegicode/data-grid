import DataCellBase from "./DataCellBase.js";

export default class CheckboxCell extends DataCellBase {
    protected _el: HTMLInputElement | null = null;

    constructor(params: IDataCellParams) {
        super(params);
    }

    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = Boolean(value);
        if (this._el) this._el.ariaReadOnly = String(Boolean(value));
    }

    // get value() {
    //     return this._value;
    // }

    // set value(arg: TDataValue) {
    //     console.log("checkbox vlaue");
    //     // 불리언 값이 아니면 return
    //     if (typeof arg !== "boolean" && arg !== "true" && arg !== "false") {
    //         return;
    //     }

    //     const isChecked = Boolean(arg) === true;

    //     this._value = isChecked.toString();
    //     if (this._el) this._el.checked = isChecked;
    // }

    createElement() {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = this.isTrue();
        input.ariaReadOnly = this._readOnly.toString();
        return input;
    }

    isTrue() {
        return (
            this._value === true ||
            Boolean(this._value === "true") ||
            Boolean(this._value === "on")
        );
    }
}
