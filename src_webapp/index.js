import React from "react";
import {render} from "react-dom";
import {sheetStore} from "../src/stores/SheetStore";
import Sheet from "../src/components/Sheet";
import {action} from "mobx";
import firebase from "firebase/app";
import "firebase/database";
import './styles/app.css';
import {firebaseConfig} from "../src/helpers/firebaseConfig";

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

table_ref.on('value', refSheet);
table_ref.once('value').then((snapshot) => {
    refSheet(snapshot);
    render(
        <div className={"app"}>
            <Sheet isReadOnly={true}/>
        </div>,
        document.getElementById("root")
    );
});
