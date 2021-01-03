import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import Cell from "./Cell";
import HeaderCell from "./HeaderCell";
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
import '../styles/sheet.css';
import '../styles/row.css';
import '../styles/app.css';

@observer
class Sheet extends React.Component {
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
            <div className="sheet">
                <div className="header-row">
                    {Array(sheetStore.ncolums).fill().map((_, i) =>
                        <HeaderCell key={`hc${i}`} c={i}/>)}
                </div>
                {Array(sheetStore.nrows).fill().map((_, i) =>
                    <div className="row" key={`r${i}`}>
                        {
                            Array(sheetStore.ncolums).fill().map((_, j) =>
                                <Cell key={`c${i}${j}`} coords={[i, j]}/>)
                        }
                    </div>)
                }
            </div>
        );
    }

    handleKeyDown(event) {
        const keyCode = event.which || event.keyCode;
        let shiftKey = event.shiftKey;
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
            sheetStore.move(1, 0, false);
        } else if (keyCode === LEFT_KEY) {
            if (event.target && event.target.selectionStart === 0) {
                event.preventDefault();
                sheetStore.move(0, -1, shiftKey);
            } else if (shiftKey) {
                sheetStore.move(0, -1, shiftKey);
            }
        } else if (keyCode === RIGHT_KEY) {
            if (event.target && event.target.value !== undefined && event.target.selectionStart === event.target.value.length) {
                event.preventDefault();
                sheetStore.move(0, 1, shiftKey);
            } else if (shiftKey) {
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
}

export default Sheet;