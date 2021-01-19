import {action, makeObservable, observable} from "mobx";
import firebase from "firebase/app";
import "firebase/auth";
import {firebaseConfig} from "../helpers/firebaseConfig";

const {ipcRenderer: ipc} = require('electron');

class AuthStore {
    @observable
    loggedUser;
    @observable
    emailForSignIn = "";
    @observable
    enteredEmail = "";
    @observable
    authError = "";

    constructor() {
        makeObservable(this);
        ipc.on('finishLogin', (event, link) => {
            this.finishReg(link)
        });
    }

    @action
    setEmail(un) {
        this.enteredEmail = un;
    }

    @action
    setLoggedUser(user) {
        this.loggedUser = user;
    }

    @action
    login() {
        firebase.auth().sendSignInLinkToEmail(this.enteredEmail, {
            url: PRODUCTION ? `https://${firebaseConfig.authDomain}/finishSignUp` : 'http://localhost:5000/finishSignUp',
            handleCodeInApp: true,
        })
            .then(() => {
                this.emailForSignIn = this.enteredEmail;
                this.enteredEmail = "";
                console.log('emailSent');
            })
            .catch((error) => {
                console.log('error');
                this.authError = error;
            });
    }

    @action
    finishReg(link) {
        firebase.auth().signInWithEmailLink(this.emailForSignIn, link)
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn');
                this.emailForSignIn = "";
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    @action
    signOut() {
        firebase.auth().signOut().then(() => {
        }).catch((error) => {
        });
    }

}

export const authStore = new AuthStore();
