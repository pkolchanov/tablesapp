import React from "react";
import {render} from "react-dom";
import App from "./components/App";
import {fileBrowserStore} from "./stores/FileBrowserStore"

fileBrowserStore.init();

render(
    <div>
        <App />
    </div>,
    document.getElementById("root")
);

// window.store = store;