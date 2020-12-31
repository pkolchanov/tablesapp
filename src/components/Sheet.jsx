import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import Cell from "./Cell";

import '../styles/sheet.css';
import '../styles/row.css';
import '../styles/app.css';

@observer
class Sheet extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="sheet">
                {Array(sheetStore.nrows).fill().map((_, i) =>
                    <div className="row" key={`r${i}`}>
                        {
                            Array(sheetStore.ncolums).fill().map((_, j) =>
                            <Cell key={`c${i}${j}`} coords={[i,j]}/>)
                        }
                    </div>)
                }
            </div>
        );
    }
}

export default Sheet;