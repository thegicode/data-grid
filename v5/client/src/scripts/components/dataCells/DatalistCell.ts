import DataCellBase from "./DataCellBase.js";

export default class DatalistCell extends DataCellBase {
    private _dataListID: string;

    constructor(params: IDataCellParams) {
        super(params);
        this._dataListID = `datalist-${this._key}`;
    }

    checkValueType(value: string) {
        const listElement = document.getElementById(
            this._dataListID
        ) as HTMLDataListElement;
        const isIncluded =
            listElement &&
            [...listElement.options].some((option) => option.value === value);
        if (isIncluded) {
            return value;
        }
        return null;
    }

    createElement() {
        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("list", this._dataListID);
        input.value = this._value;
        input.readOnly = true;
        return input;
    }
}
