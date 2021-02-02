import {action, makeObservable, observable} from "mobx";

class ContextMenuStore {
    @observable
    isOpen = false;
    @observable
    x;
    @observable
    y;

    constructor() {
        makeObservable(this);
    }

    @action
    toggle(x, y) {
        this.isOpen = !this.isOpen;
        this.x = x;
        this.y = y;
    }

    @action
    close(){
        this.isOpen = false;
        this.x = undefined;
        this.y = undefined;
    }

}

export const contextMenuStore = new ContextMenuStore();