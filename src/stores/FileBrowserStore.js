import {action, autorun, computed, makeObservable, observable, reaction} from "mobx";
import {sheetStore} from "./SheetStore";
import {v4 as uuidv4} from 'uuid';

const {ipcRenderer: ipc} = require('electron');

class FileBrowserStore {
    @observable
    currentSheetId;
    @observable
    sheets;

    @computed
    get currentSheet() {
        return this.sheets[this.currentSheetId];
    }

    @computed
    get sheetsNumber(){
        return Object.keys(this.sheets).length;
    }

    @computed
    get flatSheets() {
        return Object.entries(this.sheets)
            .sort(([, a], [, b]) => a.lastUpdate > b.lastUpdate ? -1 : 1);
    }

    allowLastUpdate = true;


    constructor() {
        makeObservable(this);

        const persisted = ipc.sendSync('readContent');
        if (persisted) {
            this.sheets = JSON.parse(persisted);
            this.currentSheetId = this.flatSheets[0][0];
            this.refActiveSheet();
        } else {
            this.sheets = {};
            this.newSheet();
        }

        autorun(() => ipc.send('writeContent',
            JSON.stringify(this.sheets)));

        reaction(() => JSON.stringify(this.currentSheet), () => {
            // todo find out way how to separate switch updates and actual data updates
            if (!this.allowLastUpdate) {
                this.allowLastUpdate = true;
                return;
            }
            this.currentSheet.lastUpdate = Date.now();
        });
    }


    @action
    newSheet() {
        const newId = uuidv4();
        this.sheets[newId] = {
            'sheetData': Array(30).fill().map((_) =>
                Array(10).fill().map((_) => "")),
            'columnWidths': Array(30).fill().map((_) => sheetStore.defaultWidth),
            'lastUpdate': Date.now()
        };
        this.currentSheetId = newId;
        this.refActiveSheet();
    }

    @action
    refActiveSheet() {
        sheetStore.data = this.sheets[this.currentSheetId].sheetData;
        sheetStore.columnWidths = this.sheets[this.currentSheetId].columnWidths;
        this.allowLastUpdate = false;
    }

    @action
    select(sheetId) {
        this.currentSheetId = sheetId;
        this.refActiveSheet();
    }

    @action
    removeCurrentAndSelectNext() {
        if (this.sheetsNumber === 1){
            return
        }
        delete this.sheets[this.currentSheetId];
        this.currentSheetId = this.flatSheets[0][0];
        this.refActiveSheet();
    }


    @action
    move(delta) {
        const currIdx = this.flatSheets.findIndex(x => x[0] === this.currentSheetId);
        const newIdx = currIdx + delta;
        if (newIdx === this.sheetsNumber || newIdx < 0) {
        } else {
            this.currentSheetId = this.flatSheets[newIdx][0];
            this.refActiveSheet();
        }
    }
}

export const fileBrowserStore = new FileBrowserStore();
