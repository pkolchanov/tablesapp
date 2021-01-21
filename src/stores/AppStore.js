import {action, makeObservable, observable} from "mobx";

export const ModeEnum = Object.freeze({"navigate": 1, "edit": 2, "login": 3});

class AppStore {
    @observable
    mode = ModeEnum.edit;

    constructor() {
        makeObservable(this);
    }

    @action
    changeMode(mode) {
        this.mode = mode;
    }

}

export const appStore = new AppStore();
