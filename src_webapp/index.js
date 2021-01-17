import React from "react";
import {render} from "react-dom";
import {sheetStore} from "../src/stores/SheetStore";
import Sheet from "../src/components/Sheet";
import {action} from "mobx";
import firebase from "firebase/app";
import "firebase/database";

import './styles/app.css';


const firebaseConfig = {
    apiKey: "AIzaSyBF0S3sKdlv05aNSPxsW7d3G_dFZsx3euM",
    authDomain: "tables-c30c4.firebaseapp.com",
    databaseURL: "https://tables-c30c4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tables-c30c4",
    storageBucket: "tables-c30c4.appspot.com",
    messagingSenderId: "853616983925",
    appId: "1:853616983925:web:1183fa77dbc2a947d51d3c"
};

firebase.initializeApp(firebaseConfig);
if (location.hostname === "localhost") {
    firebase.database().useEmulator("localhost", 9000);
}

const refSheet = action((snapshot) => {
    const data = snapshot.val();
    sheetStore.data = data.sheetData;
    sheetStore.columnWidths = data.columnWidths;
    sheetStore.activeCoords = data.activeCoords;
})

const tableId = window.location.pathname;
const table_ref = firebase.database().ref('tables' + tableId);

table_ref.once('value').then((snapshot) => {
    refSheet(snapshot);
    render(
        <div className={"app"}>
            <Sheet isReadOnly={true}/>
        </div>,
        document.getElementById("root")
    );
});

table_ref.on('value', refSheet);
