import {action, makeObservable, observable} from "mobx";
import {sheetStore} from "./SheetStore";

class DnDStore {
    @observable
    draggedColumn;

    @observable
    draggedRow;

    @observable
    targetColumn;

    @observable
    targetRow;

    constructor() {
        makeObservable(this);
    }

    @action
    selectDraggedColumn(c) {
        this.draggedColumn = c;
    }

    @action
    selectTargetColumn(c) {
        if (c !== this.draggedColumn) {
            this.targetColumn = c;
        }
    }

    @action
    dropColumn() {
        sheetStore.moveColumn(this.draggedColumn, this.targetColumn);
        this.draggedColumn = undefined;
        this.targetColumn = undefined;
    }

    @action
    dragEnd(){
        this.draggedColumn = undefined;
        this.targetColumn = undefined;
    }
}

export const dndStore = new DnDStore();
