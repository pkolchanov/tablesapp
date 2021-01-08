import {action, computed, makeObservable, observable} from "mobx";

const {clipboard} = require('electron');

class SheetStore {
    @observable data;
    @observable activeCoords = [0, 0];

    @observable selectionEndCoords;
    @observable selectionStartCoords;
    inSelectionMode;

    @observable columnWidths;
    defaultWidth = 200;
    startX;
    startWidth;
    resizingColumnNum;

    @computed
    get nrows() {
        return this.data.length;
    }

    @computed
    get ncolums() {
        return this.data[0] ? this.data[0].length : 0;
    }

    @computed
    get selectionRows() {
        return [Math.min(this.selectionStartCoords[0], this.selectionEndCoords[0]), Math.max(this.selectionStartCoords[0], this.selectionEndCoords[0])]
    }

    @computed
    get selectionColums() {
        return [Math.min(this.selectionEndCoords[1], this.selectionStartCoords[1]), Math.max(this.selectionEndCoords[1], this.selectionStartCoords[1])]
    }


    constructor() {
        makeObservable(this);
    }


    @action
    activateCell(coords) {
        this.activeCoords = coords;
        this.resetSelection();
    }

    @action
    update(coords, value) {
        this.data[coords[0]][coords[1]] = value;
    }

    @action
    addColumns(n = 1) {
        const emptyArr = Array(n).fill("");
        const widthArr = Array(n).fill(this.columnWidths);
        this.data.forEach(r => r.push(...emptyArr));
        this.columnWidths = this.columnWidths.concat(widthArr);
    }

    @action
    addRows(n = 1) {
        this.data.push(...Array(n).fill(Array(this.ncolums).fill("")))
    }

    @action
    move(dr, dc, withSelection) {
        if (withSelection && !this.selectionStartCoords) {
            this.selectionStartCoords = [...this.activeCoords];
        }
        if (withSelection && !this.selectionEndCoords) {
            this.selectionEndCoords = [...this.activeCoords];
        }

        const newActiveRow = this.activeCoords[0] + dr;
        if (newActiveRow >= 0) {
            if (newActiveRow >= this.nrows) {
                this.addRows();
            }
            this.activeCoords[0] = newActiveRow;
        }

        const newActiveRowCol = this.activeCoords[1] + dc;
        if (newActiveRowCol >= 0) {
            if (newActiveRowCol >= this.ncolums) {
                this.addColumns();
            }
            this.activeCoords[1] = newActiveRowCol;
        }

        if (!withSelection) {
            this.resetSelection();
        } else {
            const newSelectionEndR = this.selectionEndCoords[0] + dr;
            if (newSelectionEndR >= 0) {
                this.selectionEndCoords[0] = newSelectionEndR;
            }

            const newSelectionEndC = this.selectionEndCoords[1] + dc;
            if (newSelectionEndC >= 0) {
                this.selectionEndCoords[1] = newSelectionEndC;
            }
        }
    }

    @action
    resize(clientX) {
        const change = this.startX - clientX;
        this.columnWidths[this.resizingColumnNum] = this.startWidth - change;
    }

    @action
    startResize(startX, c) {
        this.startX = startX;
        this.resizingColumnNum = c;
        this.startWidth = this.columnWidths[c];
    }

    @action
    endResize() {
        this.startX = undefined;
        this.startWidth = undefined;
        this.resizingColumnNum = undefined;
    }


    @action
    startSelection(coords) {
        this.inSelectionMode = true;
        this.tempSelectionStart = [...coords];
        this.selectionEndCoords = undefined;
    }

    @action
    updateSelection(endCoords) {
        if (this.tempSelectionStart) {
            this.selectionStartCoords = [...this.tempSelectionStart];
            this.tempSelectionStart = undefined;
        }
        this.selectionEndCoords = [...endCoords];
    }

    @action
    endSelection() {
        this.inSelectionMode = false;
    }

    @action
    select(startCoords, endCoords) {
        this.selectionStartCoords = [...startCoords];
        this.selectionEndCoords = [...endCoords];
    }

    @action
    resetSelection() {
        this.selectionEndCoords = undefined;
        this.selectionStartCoords = undefined;
    }

    @action
    clearSelected() {
        this.fillSelection("");
        this.resetSelection();
    }

    @action
    fillSelection(st) {
        const [fromR, toR] = this.selectionRows;
        const [fromC, toC] = this.selectionColums;

        for (let i = fromR; i <= toR; i++) {
            for (let j = fromC; j <= toC; j++) {
                this.data[i][j] = st;
            }
        }
    }

    @action
    cut(){
        this.copy();
        this.clearSelected();
    }

    copy() {
        const [fromR, toR] = this.selectionRows;
        const [fromC, toC] = this.selectionColums;

        const toCSV = this.data.slice(fromR, toR + 1)
            .map(r => r.slice(fromC, toC + 1))
            .map(r => r.join('\t'))
            .join('\n');
        clipboard.writeText(toCSV, 'selection');
    }

    @action
    paste(text) {
        const [activeR, activeC] = this.activeCoords;
        const matrix = text.split('\n')
            .map(s => s.split('\t'));

        const diffRows = this.nrows - (activeR + matrix.length);
        const diffCols = this.ncolums - (activeC + matrix[0].length);
        if (diffCols < 0) {
            this.addColumns(Math.abs(diffCols));
        }
        if (diffRows < 0) {
            this.addRows(Math.abs(diffRows));
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                this.data[i + activeR]
                    [j + activeC] = matrix[i][j];
            }
        }
    }
}


export const sheetStore = new SheetStore();
