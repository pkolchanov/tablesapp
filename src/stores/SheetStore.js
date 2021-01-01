import {observable, computed, action, makeObservable} from "mobx";

const {ipcRenderer: ipc} = require('electron');


class SheetStore {
    @observable data;
    @observable activeCoords = [0, 0];

    @computed
    get nrows() {
        return this.data.length;
    }

    @computed
    get ncolums() {
        return this.data[0] ? this.data[0].length : 0;
    }

    constructor() {
        makeObservable(this);
        const persisted = ipc.sendSync('readContent');
        this.data = persisted ? JSON.parse(persisted) : Array(10).fill().map((_) =>
            Array(10).fill().map((_) => "")
        );
    }

    @action
    activateCell(coords) {
        this.activeCoords = coords;
    }

    @action
    update(coords, value) {
        this.data[coords[0]][coords[1]] = value;
        ipc.send('writeContent', JSON.stringify(this.data));
    }

    @action
    set(row, column, value) {
        const matrix = this.data;
        const nextMatrix = [...matrix];

        const firstRow = matrix[0];
        const nextFirstRow = firstRow ? [...firstRow] : [];
        if (nextFirstRow.length - 1 < column) {
            nextFirstRow[column] = "";
            nextMatrix[0] = nextFirstRow;
        }

        const nextRow = matrix[row] ? [...matrix[row]] : [];
        nextRow[column] = value;
        nextMatrix[row] = nextRow;
        window.newMatrix = nextMatrix;
        this.data = nextMatrix;
    }

    @action
    addColumn() {
        this.data.forEach(r => r.push(""))
    }

    @action
    addRow() {
        this.data.push(Array(this.ncolums).fill(""))
    }

    @action
    move(dr, dc) {
        let newActiveRow = this.activeCoords[0] + dr;
        if (newActiveRow >= 0) {
            if (newActiveRow >= this.nrows) {
                this.addRow();
            }
            this.activeCoords[0] = newActiveRow;
        }

        let newActiveRowCol = this.activeCoords[1] + dc;
        if (newActiveRowCol >= 0) {
            if (newActiveRowCol >= this.ncolums) {
                this.addColumn();
            }
            this.activeCoords[1] = newActiveRowCol;
        }
    }
}


export const sheetStore = new SheetStore();
