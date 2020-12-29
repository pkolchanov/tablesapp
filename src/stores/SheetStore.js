import {observable, computed, action} from "mobx";

class SheetStore {
    @observable ncolums = 10;
    @observable nrows = 5;
}


export const sheetStore = new SheetStore();
