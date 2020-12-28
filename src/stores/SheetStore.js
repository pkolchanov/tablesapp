import {observable, computed, action} from "mobx";

class SheetStore {
    @observable colums = 10;
    @observable rows = 100;
}


export const sheetStore = new SheetStore();
