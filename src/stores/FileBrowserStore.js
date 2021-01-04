import {action, autorun, makeObservable, observable} from "mobx";
import {sheetStore} from "./SheetStore";
import {v4 as uuidv4} from 'uuid';

const {ipcRenderer: ipc} = require('electron');

class FileBrowserStore {
    @observable
    currentSheetId;

    @observable
    sheets;

    constructor() {
        makeObservable(this);

        const persisted = ipc.sendSync('readContent');
        if (persisted) {
            this.sheets = JSON.parse(persisted);
            this.currentSheetId = Object.keys(this.sheets)[0];
            this.refActiveSheet();
        } else {
            this.sheets = {};
            this.newSheet();
        }

        autorun(() => ipc.send('writeContent',
            JSON.stringify(this.sheets)));
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
    }

    @action
    select(sheetId){
        this.currentSheetId = sheetId;
        this.refActiveSheet();
    }
}

export const fileBrowserStore = new FileBrowserStore();
