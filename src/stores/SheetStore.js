import {action, computed, makeObservable, observable} from "mobx";

export const CellStyles = Object.freeze({"bold": "bold", "normal": "normal"});
export const CellModel = {'value': '', 'style': CellStyles.normal};

class SheetStore {
    @observable data;
    @observable activeCoords;

    @observable selectionEndCoords;
    @observable selectionStartCoords;
    inSelectionMode;
    prevStyles;
    prevCSV;

    @observable columnWidths;
    defaultWidth = 200;
    startX;
    startWidth;
    @observable
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
    get selectionRectRows() {
        return this.selectionStartCoords &&
            this.selectionEndCoords &&
            [Math.min(this.selectionStartCoords[0], this.selectionEndCoords[0]), Math.max(this.selectionStartCoords[0], this.selectionEndCoords[0])]
    }

    @computed
    get selectionRectColums() {
        return this.selectionStartCoords &&
            this.selectionEndCoords &&
            [Math.min(this.selectionEndCoords[1], this.selectionStartCoords[1]), Math.max(this.selectionEndCoords[1], this.selectionStartCoords[1])]
    }

    @computed
    get selectedColumn() {
        if ((this.selectionStartCoords &&
            this.selectionEndCoords &&
            this.selectionStartCoords[1] === this.selectionEndCoords[1] &&
            this.selectionEndCoords[0] === this.nrows - 1)) {
            return this.selectionStartCoords[1];
        }
        return false;
    }

    constructor() {
        makeObservable(this);
    }


    @action
    activateCell(coords) {
        this.activeCoords[0] = coords[0];
        this.activeCoords[1] = coords[1];
        this.resetSelection();
    }

    @action
    update(coords, value) {
        this.data[coords[0]][coords[1]].value = value;
    }

    @action
    addColumns(n = 1) {
        const emptyArr = Array(n).fill(Object.assign({}, CellModel));
        const widthArr = Array(n).fill(this.columnWidths);
        this.data.forEach(r => r.push(...emptyArr));
        this.columnWidths = this.columnWidths.concat(widthArr);
    }

    @action
    addRows(n = 1) {
        this.data.push(...Array(n).fill(Array(this.ncolums).fill(Object.assign({}, CellModel))))
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
    selectAll() {
        this.selectionStartCoords = [0, 0];
        this.selectionEndCoords = [this.nrows - 1, this.ncolums - 1];
    }

    @action
    selectColumn(cn) {
        this.selectionStartCoords = [0, cn];
        this.selectionEndCoords = [this.nrows - 1, cn];
    }

    @action
    clearSelected() {
        this.fillSelection("");
        this.resetSelection();
    }

    @action
    fillSelection(st) {
        const [fromR, toR] = this.selectionRectRows;
        const [fromC, toC] = this.selectionRectColums;

        for (let i = fromR; i <= toR; i++) {
            for (let j = fromC; j <= toC; j++) {
                this.data[i][j].value = st;
            }
        }
    }

    @action
    swapColumn(from, to) {
        this.data.forEach(r => {
            const e = r[from];
            r.splice(from, 1);
            r.splice(to, 0, e);
        });
        const w = this.columnWidths[from];
        this.columnWidths.splice(from, 1);
        this.columnWidths.splice(to, 0, w);
    }

    @action
    moveRow(dr) {
        const from = this.activeCoords[0];
        const to = this.activeCoords[0] + dr;
        if (to < 0) {
            return
        }
        this.move(dr, 0);
        this.swapRow(from, to)
    }

    @action
    swapRow(from, to) {
        const e = this.data[from];
        this.data.splice(from, 1);
        this.data.splice(to, 0, e);
    }

    @action
    addWidth(step) {
        this.columnWidths[this.activeCoords[1]] += step* 10;
    }

    @action
    cut() {
        this.copy();
        this.clearSelected();
    }

    copy() {
        const [fromR, toR] = this.selectionRectRows;
        const [fromC, toC] = this.selectionRectColums;

        const selectionSlice = this.data.slice(fromR, toR + 1)
            .map(r => r.slice(fromC, toC + 1));

        const toCSV = selectionSlice
            .map(r => r.map(x => x.value).join('\t'))
            .join('\n');
        navigator.clipboard.writeText(toCSV);
        this.prevStyles = selectionSlice.map(r => r.map(x => x.style))
        this.prevCSV = toCSV;
    }

    @action
    paste(text) {
        const usePrevStyles = this.prevCSV === text;
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
                this.data[i + activeR][j + activeC].value = matrix[i][j];
                if (usePrevStyles) {
                    this.data[i + activeR][j + activeC].style = this.prevStyles[i][j];
                }
            }
        }
    }

    @action
    toggleBold() {
        let [fromR, toR] = this.selectionRectRows || [this.activeCoords[0], this.activeCoords[0]];
        let [fromC, toC] = this.selectionRectColums || [this.activeCoords[1], this.activeCoords[1]];

        const to = this.data[fromR][fromC].style === CellStyles.normal ? CellStyles.bold : CellStyles.normal;

        for (let i = fromR; i <= toR; i++) {
            for (let j = fromC; j <= toC; j++) {
                this.data[i][j].style = to;
            }
        }
    }
}


export const sheetStore = new SheetStore();
