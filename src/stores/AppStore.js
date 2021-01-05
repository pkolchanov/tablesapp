import {action, makeObservable, observable} from "mobx";

export const ModeEnum = Object.freeze({"navigate":1, "edit":2});

class AppStore {
    @observable
    mode = ModeEnum.navigate;

    constructor() {
        makeObservable(this);
    }

    @action
    changeMode(mode){
        this.mode = mode;
    }

}

export const appStore = new AppStore();
