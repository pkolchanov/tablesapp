import {action, makeObservable, observable} from "mobx";
import firebase from "firebase/app";
import "firebase/auth";
import {firebaseConfig} from "../helpers/firebaseConfig";
import {appStore, AppMode} from "./AppStore";

const {ipcRenderer: ipc} = require('electron');

class AuthStore {
    @observable
    loggedUser;
    @observable
    enteredEmail;
    @observable
    emailForSignIn;
    @observable
    magicLink;
    @observable
    authError;
    @observable
    isPending = false;

    constructor() {
        makeObservable(this);
        ipc.on('finishLogin', (event, link) => {
            this.finishReg(link)
        });
    }

    @action
    setEmail(un) {
        this.enteredEmail = un;
        this.authError = undefined;
    }

    @action
    setLoggedUser(user) {
        this.loggedUser = user;
    }

    @action
    login() {
        this.isPending = true;
        this.authError = undefined;
        firebase.auth().sendSignInLinkToEmail(this.enteredEmail, {
            url: PRODUCTION ? `https://${firebaseConfig.authDomain}/finishSignUp` : 'http://localhost:5000/finishSignUp',
            handleCodeInApp: true,
        })
            .then(() => {
                this.emailForSignIn = this.enteredEmail;
                this.isPending = false;
            })
            .catch((error) => {
                this.authError = error;
                this.isPending = false;
            });
    }

    @action
    finishReg(link) {
        this.isPending = true;
        this.magicLink = link;
        firebase.auth().signInWithEmailLink(this.emailForSignIn, link)
            .then((result) => {
                this.magicLink = "";
                this.emailForSignIn = "";
                this.enteredEmail = "";
                this.loggedUser = result;
                this.isPending = false;
                appStore.mode = AppMode.share;
            })
            .catch((error) => {
                this.magicLink = "";
                this.emailForSignIn = "";
                this.enteredEmail = "";
                this.authError = error;
                this.isPending = false;
            });
    }

    @action
    signOut() {
        firebase.auth().signOut().then(() => {
        }).catch((error) => {
        });
    }

    @action
    resetEmailForSignIn() {
        this.emailForSignIn = "";
        this.magicLink = "";
        this.authError = "";
    }

}

export const authStore = new AuthStore();
window.authStore = authStore;