import React from "react";
import {render} from "react-dom";
import App from "./components/App";
import firebase from "firebase";
import {firebaseConfig} from "./helpers/firebaseConfig";
import {authStore} from "./stores/AuthStore";

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

if (!PRODUCTION) {
    firebase.database().useEmulator("localhost", 9000);
    auth.useEmulator('http://localhost:9099/');
    // auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(
    //     '{"sub": "abc123", "email": "foo@example.com", "email_verified": true}'
    // ));
}

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
auth.onAuthStateChanged((user) => {
    if (user) {
        authStore.setLoggedUser(user)
    } else {
    }
});

render(
    <div>
        <App/>
    </div>,
    document.getElementById("root")
);

// window.store = store;