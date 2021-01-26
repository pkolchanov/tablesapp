import {observer} from "mobx-react";
import React from "react";
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
import {firstRow, lastRow} from "../helpers/htmlExtentions"
import Toolbar from "./Toolbar";
import {authStore} from "../stores/AuthStore";
import '../styles/app.scss';

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
            <div className="app">
                <div className="app__wrapper" onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseUp}>
                    <FileBrowser/>
                    <div className="app__left">
                        <Toolbar/>
                        <Sheet/>
                    </div>
                </div>
            </div>
        )
    }

    handleMouseUp() {
        sheetStore.endSelection();
    }

    handleKeyDown(e) {
        const keyCode = e.which || e.keyCode;
        let shiftKey = e.shiftKey;

        if (e.metaKey && keyCode === 'N'.charCodeAt(0)) {
            e.preventDefault();
            fileBrowserStore.newSheet();
        }

        const target = e.target;
        const isTextArea = target && target.tagName === "TEXTAREA";

        if (e.metaKey && keyCode === 'Z'.charCodeAt(0)) {
            if (shiftKey) {
                fileBrowserStore.redo();
            } else {
                fileBrowserStore.undo();
            }
        }

        if (appStore.mode === ModeEnum.login) {
            if (keyCode === ENTER_KEY && target) {
                e.preventDefault();
                authStore.login();
            }
        }

        if (appStore.mode === ModeEnum.edit) {
            if (e.metaKey && keyCode === 'C'.charCodeAt(0)) {
                if (target && isTextArea) {
                    return;
                }
                e.preventDefault();
                sheetStore.copy();
            }

            if (e.metaKey && keyCode === 'V'.charCodeAt(0)) {
                const text = clipboard.readText();
                if (text.indexOf('\t') === -1) {
                    return;
                }
                e.preventDefault();
                if (target && isTextArea) {
                    document.activeElement.blur();
                }
                sheetStore.paste(text);
            }

            if (e.metaKey && keyCode === 'X'.charCodeAt(0)) {
                if (target && isTextArea) {
                    return;
                }
                e.preventDefault();
                sheetStore.cut();
            }

            if (e.metaKey && keyCode === 'A'.charCodeAt(0)) {
                if (isTextArea && target.selectionEnd === target.value.length &&
                    target.selectionStart === 0) {
                    e.preventDefault();
                    sheetStore.selectAll();
                }
            }

            if (e.metaKey && keyCode === 'B'.charCodeAt(0)) {
                sheetStore.toggleBold();
            }

            if (e.metaKey && keyCode === 'Y'.charCodeAt(0)) {
                sheetStore.removeRow();
            }

            if (keyCode === ESCAPE_KEY) {
                sheetStore.resetSelection();
            }

            if (keyCode === ENTER_KEY && e.metaKey && e.altKey){
                sheetStore.selectRow();
            }else if (keyCode === ENTER_KEY && e.metaKey && e.ctrlKey){
                sheetStore.selectColumn();
            }
            else if (keyCode === UP_KEY) {
                if (e.shiftKey && e.altKey) {
                    e.preventDefault();
                    sheetStore.moveRow(-1);
                } else if (isTextArea && firstRow(target)) {
                    e.preventDefault();
                    sheetStore.move(-1, 0, shiftKey);
                } else if ((!target || !isTextArea)) {
                    sheetStore.move(-1, 0, shiftKey);
                }
            } else if (keyCode === DOWN_KEY) {
                if (e.shiftKey && e.altKey) {
                    e.preventDefault();
                    sheetStore.moveRow(1);
                } else if (isTextArea && lastRow(target)) {
                    e.preventDefault();
                    sheetStore.move(1, 0, shiftKey);
                } else if ((!target || target.tagName !== "TEXTAREA")) {
                    sheetStore.move(1, 0, shiftKey);
                }
            } else if (keyCode === ENTER_KEY) {
                e.preventDefault();
                sheetStore.move(shiftKey ? -1 : 1, 0, false);
            } else if (keyCode === LEFT_KEY) {
                if (e.shiftKey && e.ctrlKey) {
                    e.preventDefault();
                    sheetStore.addWidth(-1)
                } else if (target && target.selectionStart === 0) {
                    e.preventDefault();
                    sheetStore.move(0, -1, shiftKey);
                } else if ((!target || !isTextArea)) {
                    sheetStore.move(0, -1, shiftKey);
                }
            } else if (keyCode === RIGHT_KEY) {
                if (e.shiftKey && e.ctrlKey) {
                    e.preventDefault();
                    sheetStore.addWidth(1)
                } else if (target && target.value !== undefined && target.selectionEnd === target.value.length) {
                    e.preventDefault();
                    sheetStore.move(0, 1, shiftKey);
                } else if ((!target || !isTextArea)) {
                    sheetStore.move(0, 1, shiftKey);
                }
            } else if (keyCode === TAB_KEY && !shiftKey) {
                sheetStore.move(0, 1, false);
            } else if (keyCode === TAB_KEY && shiftKey) {
                sheetStore.move(0, -1, false);
            } else if (keyCode === BACKSPACE_KEY) {
                if (target && target.value !== undefined && target.value.length === 0) {
                    e.preventDefault();
                    sheetStore.move(0, -1, false);
                } else if (sheetStore.selectionStartCoords) {
                    e.preventDefault();
                    sheetStore.clearSelected();
                }
            } else if (keyCode === DELETE_KEY && sheetStore.selectionStartCoords) {
                e.preventDefault();
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