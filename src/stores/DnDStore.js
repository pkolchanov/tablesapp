import {action, computed, makeObservable, observable} from "mobx";
import {sheetStore} from "./SheetStore";

export const DragMode = Object.freeze({"row": 1, "column": 2});

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

    @computed
    get dragMode() {
        if (this.draggedColumn !== undefined) {
            return DragMode.column;
        }
        if (this.draggedRow !== undefined) {
            return DragMode.row;
        }
        return false;
    }

    @action
    selectDraggedColumn(c) {
        sheetStore.selectColumn(c);
        this.draggedColumn = c;
    }

    @action
    selectDraggedRow(r) {
        sheetStore.selectRow(r);
        this.draggedRow = r;
    }

    @action
    selectTargetColumn(c) {
        if (c !== this.draggedColumn && c >= 0) {
            this.targetColumn = c;
        }
    }

    @action
    selectTargetRow(r) {
        if (r !== this.draggedRow && r >= 0) {
            this.targetRow = r;
        }
    }

    @action
    dragEnter(coords) {
        const [r, c] = coords;
        if (this.dragMode === DragMode.row) {
            this.selectTargetRow(r);
        }
        if (this.dragMode === DragMode.column) {
            this.selectTargetColumn(c);
        }
    }

    @action
    drop(coords) {
        const [r, c] = coords;
        if (this.dragMode === DragMode.row) {
            if (r !== this.draggedRow && this.targetRow !== undefined) {
                sheetStore.swapRow(this.draggedRow, this.targetRow);
                sheetStore.selectRow(this.targetRow);
            }
        }
        if (this.dragMode === DragMode.column) {
            if (c !== this.draggedColumn && this.targetColumn !== undefined) {
                sheetStore.swapColumn(this.draggedColumn, this.targetColumn);
                sheetStore.selectColumn(this.targetColumn);
            }
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
