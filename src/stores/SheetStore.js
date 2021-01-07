import {action, computed, makeObservable, observable} from "mobx";

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
    addColumn() {
        this.data.forEach(r => r.push(""));
        this.columnWidths.push(defaultWidth);
    }

    @action
    addRow() {
        this.data.push(Array(this.ncolums).fill(""))
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
                this.addRow();
            }
            this.activeCoords[0] = newActiveRow;
        }

        const newActiveRowCol = this.activeCoords[1] + dc;
        if (newActiveRowCol >= 0) {
            if (newActiveRowCol >= this.ncolums) {
                this.addColumn();
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
    updateSelection(endCoords) {
        this.selectionEndCoords = [...endCoords];
    }

    @action
    startSelection(coords) {
        this.inSelectionMode = true;
        this.selectionStartCoords = [...coords];
        this.selectionEndCoords = undefined;
    }

    @action
    endSelection() {
        this.inSelectionMode = false;
    }

    @action
    select(startCoords, endCoords){
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
        const [selectionStartR, selectionStartC] = this.selectionStartCoords;
        const [selectionEndR, selectionEndC] = this.selectionEndCoords;
        const fromR = Math.min(selectionStartR, selectionEndR);
        const toR = Math.max(selectionStartR, selectionEndR);

        const fromC = Math.min(selectionStartC, selectionEndC);
        const toC = Math.max(selectionStartC, selectionEndC);

        for (let i = fromR; i <= toR; i++) {
            for (let j = fromC; j <= toC; j++) {
                this.data[i][j] = st;
            }
        }
    }
}


export const sheetStore = new SheetStore();
