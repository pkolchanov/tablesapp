import {observer} from "mobx-react";
import React from "react";
import '../styles/app.css';
import {
    BACKSPACE_KEY,
    DELETE_KEY,
    DOWN_KEY,
    ENTER_KEY,
    ESCAPE_KEY,
    LEFT_KEY,
    RIGHT_KEY,
    TAB_KEY,
    UP_KEY
} from "../helpers/keys";
import {sheetStore} from "../stores/SheetStore";
import {fileBrowserStore} from "../stores/FileBrowserStore";
import FileBrowser from "./FileBrowser";
import Sheet from "./Sheet";
import {appStore, ModeEnum} from "../stores/AppStore";
const {clipboard} = require('electron');

@observer
class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    render() {
        return (
            <div className="App">
                <div className="app__wrapper">
                    <FileBrowser/>
                    <Sheet/>
                </div>
            </div>
        )
    }

    handleKeyDown(event) {
        const keyCode = event.which || event.keyCode;
        let shiftKey = event.shiftKey;

        if (event.metaKey && keyCode === 'N'.charCodeAt(0)) {
            event.preventDefault();
            fileBrowserStore.newSheet();
        }

        if (event.metaKey && keyCode === 'C'.charCodeAt(0)) {
            if (event.target && event.target.tagName === "TEXTAREA") {
                return;
            }
            event.preventDefault();
            sheetStore.copy();
        }

        if (event.metaKey && keyCode === 'V'.charCodeAt(0)) {
            const text = clipboard.readText();
            if (text.indexOf('\t') === -1) {
                return;
            }
            event.preventDefault();
            if (event.target && event.target.tagName === "TEXTAREA") {
                document.activeElement.blur();
            }
            sheetStore.paste(text);
        }

        if (appStore.mode === ModeEnum.edit) {
            if (keyCode === ESCAPE_KEY) {
                sheetStore.resetSelection();
            }
            if (keyCode === UP_KEY) {
                event.preventDefault();
                sheetStore.move(-1, 0, shiftKey);
            } else if (keyCode === DOWN_KEY) {
                event.preventDefault();
                sheetStore.move(1, 0, shiftKey);
            } else if (keyCode === ENTER_KEY) {
                event.preventDefault();
                sheetStore.move(1, 0, false);
            } else if (keyCode === LEFT_KEY) {
                if (event.target && event.target.selectionStart === 0) {
                    event.preventDefault();
                    sheetStore.move(0, -1, shiftKey);
                } else if ((!event.target || event.target.tagName !== "TEXTAREA") && shiftKey) {
                    sheetStore.move(0, -1, shiftKey);
                }
            } else if (keyCode === RIGHT_KEY) {
                if (event.target && event.target.value !== undefined && event.target.selectionStart === event.target.value.length) {
                    event.preventDefault();
                    sheetStore.move(0, 1, shiftKey);
                } else if ((!event.target || event.target.tagName !== "TEXTAREA") && shiftKey) {
                    sheetStore.move(0, 1, shiftKey);
                }
            } else if (keyCode === TAB_KEY && !shiftKey) {
                sheetStore.move(0, 1, false);
            } else if (keyCode === TAB_KEY && shiftKey) {
                sheetStore.move(0, -1, false);
            } else if (keyCode === BACKSPACE_KEY) {
                if (event.target && event.target.value !== undefined && event.target.value.length === 0) {
                    event.preventDefault();
                    sheetStore.move(0, -1, false);
                } else if (sheetStore.selectionStartCoords) {
                    event.preventDefault();
                    sheetStore.clearSelected();
                }
            } else if (keyCode === DELETE_KEY && sheetStore.selectionStartCoords) {
                event.preventDefault();
                sheetStore.clearSelected();
            }
        }

        if (appStore.mode === ModeEnum.navigate) {
            if (keyCode === RIGHT_KEY) {
                appStore.changeMode(ModeEnum.edit)
            }
            if (keyCode === BACKSPACE_KEY) {
                fileBrowserStore.removeCurrentAndSelectNext();
            }
            if (keyCode === DOWN_KEY) {
                fileBrowserStore.move(1);
            }
            if (keyCode === UP_KEY) {
                fileBrowserStore.move(-1);
            }
        }

    }

}

export default App;