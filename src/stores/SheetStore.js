import {action, computed, makeObservable, observable} from "mobx";

export const CellStyles = Object.freeze({"bold": "bold", "normal": "normal", "accent": "accent", "subtle": "subtle"});
export const CellModel = {'value': '', 'style': CellStyles.normal, 'isUnderlined': false};
export const SheetMode = Object.freeze({"Navigate": 1, "Edit": 2})

class SheetStore {
    @observable 
    data;

    @observable
    activeCoords;

    @observable 
    mode = SheetMode.Navigate;

    @observable 
    selectionEndCoords;

    @observable 
    selectionStartCoords;

    inSelectionMode;
    prevStyles;
    prevCSV;

    @observable
    columnWidths;

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
    get boundingBox() {
        let startIndex = this.findFirstNonEmptyCorner();
        let endIndex = this.findLastNonEmptyCorner();
        return [[startIndex[0], endIndex[0]], [startIndex[1], endIndex[1]]]
    }

    findFirstNonEmptyCorner() {
        //ᕕ( ᐛ )ᕗ
        let a;
        for (let i = 0; i < this.nrows; i++) {
            for (let j = 0; j < this.ncolums; j++) {
                if (this.data[i][j].value) {
                    a = [i, j];
                    break;
                }
            }
            if (a) {
                break;
            }
        }
        a = a || [0, 0];
        let b;
        for (let j = 0; j < this.ncolums; j++) {
            for (let i = 0; i < this.nrows; i++) {
                if (this.data[i][j].value) {
                    b = [i, j];
                }
            }
            if (b) {
                break;
            }
        }
        b = b || [0, 0];
        return [Math.min(a[0], b[0]), Math.min(a[1], b[1])]
    }

    findLastNonEmptyCorner() {
        // ᕕ( ᐛ )ᕗ
        let a;
        for (let i = this.nrows - 1; i > 0; i--) {
            for (let j = this.ncolums - 1; j >= 0; j--) {
                if (this.data[i][j].value) {
                    a = [i, j];
                    break;
                }
            }
            if (a) {
                break;
            }
        }
        a = a || [this.nrows - 1, this.ncolums - 1];
        let b;
        for (let j = this.ncolums - 1; j >= 0; j--) {
            for (let i = this.nrows - 1; i > 0; i--) {
                if (this.data[i][j].value) {
                    b = [i, j];
                    break;
                }
            }
            if (b) {
                break;
            }
        }
        b = b || [this.nrows - 1, this.ncolums - 1];
        return [Math.max(a[0], b[0]), Math.max(a[1], b[1])]
    }

    @computed
    get selectedColumn() {
        if ((this.selectionStartCoords &&
            this.selectionEndCoords &&
            this.selectionStartCoords[1] === this.selectionEndCoords[1] &&
            this.selectionEndCoords[0] === this.nrows - 1) &&
            this.selectionStartCoords[0] === 0
        ) {
            return this.selectionStartCoords[1];
        }
        return false;
    }

    @computed
    get selectedRow() {
        if ((this.selectionStartCoords &&
            this.selectionEndCoords &&
            this.selectionStartCoords[0] === this.selectionEndCoords[0] &&
            this.selectionEndCoords[1] === this.ncolums - 1)) {
            return this.selectionStartCoords[0];
        }
        return false;
    }

    isCellInsideSelection(coords) {
        const [selectionStartC, selectionEndC] = this.selectionRectColums || [];
        const [selectionStartR, selectionEndR] = this.selectionRectRows || [];
        const [r, c] = coords;
        return ((selectionStartR <= r && r <= selectionEndR)) &&
            ((selectionStartC <= c && c <= selectionEndC));
    }

    constructor() {
        makeObservable(this);
    }

    @action
    setMode(mode) {
        this.mode = mode;
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
    addColumns(idx, n = 1) {
        const emptyArr = Array(n).fill(Object.assign({}, CellModel));
        const widthArr = Array(n).fill(this.defaultWidth);
        this.data.forEach(r => r.splice(idx, 0, ...emptyArr));
        this.columnWidths.splice(idx, 0, widthArr);
    }

    @action
    addRows(idx, n = 1) {
        this.data.splice(idx, 0, ...Array(n).fill(Array(this.ncolums).fill(Object.assign({}, CellModel))))
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
                this.addRows(this.nrows);
            }
            this.activeCoords[0] = newActiveRow;
        }

        const newActiveRowCol = this.activeCoords[1] + dc;
        if (newActiveRowCol >= 0) {
            if (newActiveRowCol >= this.ncolums) {
                this.addColumns(this.ncolums);
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
            this.activeCoords = [...this.tempSelectionStart];
            this.tempSelectionStart = undefined;
        }
        this.selectionEndCoords = [...endCoords];
    }

    @action
    endSelection() {
        if (this.inSelectionMode) {
            this.inSelectionMode = false;
        }
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
        if (cn === undefined) {
            cn = this.activeCoords[1]
        }
        this.selectionStartCoords = [0, cn];
        this.selectionEndCoords = [this.nrows - 1, cn];
    }

    @action
    selectRow(rn) {
        if (rn === undefined) {
            rn = this.activeCoords[0]
        }
        this.selectionStartCoords = [rn, 0];
        this.selectionEndCoords = [rn, this.ncolums - 1];
    }

    @action
    clearSelected() {
        this.fillSelection("");
        this.resetSelection();
    }

    @action
    clearActive() {
        const [r, c] = this.activeCoords;
        this.data[r][c].value = "";
        this.setMode(SheetMode.Edit);
    }

    @action
    fillSelection(st) {
        let [fromR, toR] = this.fromRtoR;
        let [fromC, toC] = this.fromCtoC;

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
        let [fromC, toC] =  this.fromCtoC;
        const to = this.columnWidths[this.activeCoords[1]] + step * 10;
        if (to < 10) {
            return;
        }
        for (let c = fromC; c <= toC; c++) {
            this.columnWidths[c] = to;
        }
    }

    @action
    cut() {
        this.copy();
        this.clearSelected();
    }

    @action
    removeRow() {
        this.data.splice(this.activeCoords[0], 1);
    }

    @action
    removeColumn() {
        this.data.forEach(r => r.splice(this.activeCoords[1], 1));
        this.columnWidths.splice(this.activeCoords[1], 1);
    }

    copy() {
        let [fromR, toR] = this.fromRtoR;
        let [fromC, toC] = this.fromCtoC;

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
        const matrix = (text.indexOf('\t') !== -1 || text.indexOf('\n') !== -1) ?
            text.split('\n').map(s => s.split('\t')) :
            [[text]];

        const diffRows = this.nrows - (activeR + matrix.length);
        const diffCols = this.ncolums - (activeC + matrix[0].length);
        if (diffCols < 0) {
            this.addColumns(this.ncolums, Math.abs(diffCols));
        }
        if (diffRows < 0) {
            this.addRows(this.nrows, Math.abs(diffRows));
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
    toggleStyle(toStyle) {
        this.changeSelection((firstCell) => firstCell.style !== toStyle ? toStyle : CellStyles.normal,
            (i, j, to) => this.data[i][j].style = to)
    }

    @action
    underline() {
        this.changeSelection((firstCell) => !firstCell.isUnderlined,
            (i, j, to) => this.data[i][j].isUnderlined = to);
    }

    changeSelection(toGetter, updater) {
        let [fromR, toR] = this.fromRtoR;
        let [fromC, toC] = this.fromCtoC;

        const to = toGetter(this.data[fromR][fromC]);
        for (let i = fromR; i <= toR; i++) {
            for (let j = fromC; j <= toC; j++) {
                updater(i, j, to);
            }
        }
    }

    @computed
    get fromRtoR() {
        return this.selectionRectRows || [this.activeCoords[0], this.activeCoords[0]];
    }

    @computed
    get fromCtoC() {
        return this.selectionRectColums || [this.activeCoords[1], this.activeCoords[1]];
    }

}


export const sheetStore = new SheetStore();
