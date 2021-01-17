import {action, computed, makeObservable, observable, reaction, remove, set} from "mobx";
import {CellModel, sheetStore} from "./SheetStore";
import {appStore, ModeEnum} from "./AppStore";

import {v4 as uuidv4} from 'uuid';
const {ipcRenderer: ipc} = require('electron');

import firebase from "firebase/app";
import "firebase/database";
import "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyBF0S3sKdlv05aNSPxsW7d3G_dFZsx3euM",
    authDomain: "tables-c30c4.firebaseapp.com",
    databaseURL: "https://tables-c30c4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tables-c30c4",
    storageBucket: "tables-c30c4.appspot.com",
    messagingSenderId: "853616983925",
    appId: "1:853616983925:web:1183fa77dbc2a947d51d3c"
};

firebase.initializeApp(firebaseConfig);

firebase.database().useEmulator("localhost", 9000);

class FileBrowserStore {
    @observable
    currentSheetId;
    @observable
    sheets;

    history = [];
    future = [];

    @computed
    get currentSheet() {
        return this.sheets[this.currentSheetId];
    }

    @computed
    get sheetsNumber() {
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
    }

    init() {
        const persisted = ipc.sendSync('readContent');
        if (persisted) {
            this.sheets = observable.object(JSON.parse(persisted));
            this.currentSheetId = this.flatSheets[0][0];
            this.refActiveSheet();
        } else {
            this.sheets = {};
            this.newSheet();
        }
        this.history.push(JSON.stringify(this.sheets));
        reaction(() => JSON.stringify([this.currentSheetId, this.currentSheet.sheetData]),
            () => {
                // todo find out way how to separate switch updates and actual data updates
                if (!this.allowLastUpdate) {
                    this.allowLastUpdate = true;
                    return;
                }
                this.preserve();
                this.currentSheet.lastUpdate = Date.now();
            }, {fireImmediately: true});
    }

    preserve() {
        const serialized = JSON.stringify(this.sheets);
        this.history.push(serialized);
        ipc.send('writeContent', serialized)
        firebase.database().ref('tables/' + this.currentSheetId).set(this.currentSheet);
    }

    @action
    refActiveSheet() {
        sheetStore.data = this.sheets[this.currentSheetId].sheetData;
        sheetStore.columnWidths = this.sheets[this.currentSheetId].columnWidths;
        sheetStore.activeCoords = this.sheets[this.currentSheetId].activeCoords;
        sheetStore.resetSelection();
        this.allowLastUpdate = false;
    }

    @action
    select(sheetId) {
        this.currentSheetId = sheetId;
        this.refActiveSheet();
    }

    @action
    redo() {
        if (this.future.length < 1) {
            return;
        }
        const last = this.future.pop();
        this.history.push(last);
        this.swapState(last);
    }

    @action
    undo() {
        if (this.history.length < 2) {
            return;
        }
        const current = this.history[this.history.length - 1];
        this.future.push(current);
        this.history = this.history.slice(0, this.history.length - 1);

        const previousSerialized = this.history[this.history.length - 1];
        this.swapState(previousSerialized);
    }

    swapState(historyItem) {
        const parsed = JSON.parse(historyItem);

        Object.keys(this.sheets).forEach((key) => {
            if (!(key in parsed)) {
                remove(this.sheets, key);
            }
        });
        set(this.sheets, parsed);
        if (!(this.currentSheetId in this.sheets)) {
            this.selectLastSheetId();
        }
        ipc.send('writeContent', historyItem);
        this.refActiveSheet();
    }

    @action
    newSheet() {
        const newId = uuidv4();
        this.sheets[newId] = {
            'sheetData': Array(30).fill().map((_) =>
                Array(10).fill().map((_) => Object.assign({}, CellModel))),
            'columnWidths': Array(15).fill().map((_) => sheetStore.defaultWidth),
            'lastUpdate': Date.now(),
            'activeCoords': [0, 0]
        };
        this.currentSheetId = newId;
        this.preserve();
        this.refActiveSheet();
        appStore.changeMode(ModeEnum.edit);
    }

    @action
    removeCurrentAndSelectNext() {
        if (this.sheetsNumber === 1) {
            return
        }
        delete this.sheets[this.currentSheetId];
        this.selectLastSheetId();
        this.preserve();
        this.refActiveSheet();
    }

    @action
    selectLastSheetId() {
        this.currentSheetId = this.flatSheets[0][0];
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
