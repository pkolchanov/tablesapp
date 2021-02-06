import {action, makeObservable, observable} from "mobx";

export const ModeEnum = Object.freeze({"navigate": 1, "edit": 2, "login": 3, "share": 4});

class AppStore {
    @observable
    mode = ModeEnum.edit;

    constructor() {
        makeObservable(this);
    }

    @action
    changeMode(mode) {
        if (this.mode === mode) {
            this.mode = ModeEnum.edit;
        } else {
            this.mode = mode;
        }
    }

}

export const appStore = new AppStore();
