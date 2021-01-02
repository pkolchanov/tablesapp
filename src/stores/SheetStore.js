import {action, computed, makeObservable, observable} from "mobx";

const {ipcRenderer: ipc} = require('electron');

const defaultWidth = 200;

class SheetStore {
    @observable data;
    @observable activeCoords = [0, 0];

    @observable columnWidths;
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

        const persisted = ipc.sendSync('readContent');
        const parsed = persisted ? JSON.parse(persisted): false;
        this.data = parsed ? parsed.data :
            Array(10).fill().map((_) =>
                Array(10).fill().map((_) => ""));

        this.columnWidths = parsed? parsed.columnWidths :
            Array(this.ncolums).fill().map((_) => defaultWidth);
    }

    @action
    activateCell(coords) {
        this.activeCoords = coords;
    }

    @action
    update(coords, value) {
        this.data[coords[0]][coords[1]] = value;
        ipc.send('writeContent',
            JSON.stringify({data: this.data, columnWidths: this.columnWidths}));
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
}


export const sheetStore = new SheetStore();
