import {observable, computed, action, makeObservable} from "mobx";

var randomWords = require('random-words');

class SheetStore {
    @observable data;
    @observable activeCoords = [1, 9];

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
        this.data = Array(100).fill().map((_) =>
            Array(10).fill().map((_) => randomWords({min: 2, max: 10, join: ' '}))
        )
    }

    @action
    activateCell(coords) {
        this.activeCoords = coords;
    }

    @action
    update(coords, value) {
        this.data[coords[0]][coords[1]] = value;
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
    move(dr, dc) {
        let newActiveRow = this.activeCoords[0] + dr;
        if (newActiveRow >= 0) {
            // if (newActiveRow >= this.nrows) {
            //     this.set(newActiveRow, this.activeCoords[1], undefined)
            // }
            this.activeCoords[0] = newActiveRow;
        }

        let newActiveRowCol = this.activeCoords[1] + dc;
        if (newActiveRowCol >= 0) {
            // if (newActiveRowCol >= this.ncolums) {
            //     this.set(this.activeCoords[0], newActiveRowCol, undefined)
            // }
            this.activeCoords[1] = newActiveRowCol;
        }
    }
}


export const sheetStore = new SheetStore();
