import {action, computed, makeObservable, observable} from "mobx";
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

    @observable
    startX;

    @observable
    startY;

    @observable
    currentX;

    @observable
    currentY;

    constructor() {
        makeObservable(this);
    }

    @action
    setStartCoords(x, y) {
        this.startX = x;
        this.startY = y;
    }

    @action
    setCurrentCoords(x, y) {
        this.currentX = x;
        this.currentY = y;
    }

    @computed
    get diffX() {
        return this.currentX - this.startX;
    }

    @computed
    get diffY() {
        return this.currentY - this.startY;
    }

    @action
    selectDraggedColumn(c) {
        this.draggedColumn = c;
    }

    @action
    selectDraggedRow(r) {
        this.draggedRow = r;
    }

    @action
    selectTargetColumn(c) {
        if (c !== this.draggedColumn) {
            this.targetColumn = c;
        }
    }

    @action
    selectTargetRow(r) {
        if (r !== this.draggedRow) {
            this.targetRow = r;
        }
    }

    @action
    drop() {
        if (this.targetColumn !== undefined && this.draggedColumn !== undefined ) {
            sheetStore.swapColumn(this.draggedColumn, this.targetColumn);
            sheetStore.selectColumn(this.targetColumn);
        } else if (this.targetRow !== undefined  && this.draggedRow !== undefined ) {
            sheetStore.swapRow(this.draggedRow, this.targetRow);
            sheetStore.selectRow(this.targetRow);
        }
        this.dragEnd();
    }

    @action
    dragEnd() {
        this.draggedColumn = undefined;
        this.targetColumn = undefined;
        this.draggedRow = undefined;
        this.targetRow = undefined;
        this.startX = undefined;
        this.currentX = undefined;
        this.startY = undefined;
        this.currentY = undefined;
    }

}

export const dndStore = new DnDStore();
