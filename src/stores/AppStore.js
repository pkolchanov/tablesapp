import {action, makeObservable, observable} from "mobx";

export const AppMode = Object.freeze({"navigate": 1, "edit": 2, "login": 3, "share": 4});

class AppStore {
    @observable
    mode = AppMode.edit;

    constructor() {
        makeObservable(this);
    }

    @action
    changeMode(mode) {
        if (this.mode === mode) {
            this.mode = AppMode.edit;
        } else {
            this.mode = mode;
        }
    }

}

export const appStore = new AppStore();
