import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import Cell from "./Cell";
import HeaderCell from "./HeaderCell";
import RowBumper from "./RowBumper";
import {appStore, AppMode} from "../stores/AppStore";
import '../styles/sheet.css';
import ContextMenu from "./ContextMenu";
import {contextMenuStore} from "../stores/ContextMenuStore";

let range = (start, stop, step = 1) => Array(stop - start + 1).fill(start).map((x, y) => x + y * step)

@observer
class Sheet extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const [[fromR, toR], [fromC, toC]] = this.props.isReadOnly ? sheetStore.boundingBox : [[0, sheetStore.nrows - 1], [0, sheetStore.ncolums - 1]];
        return (
            <div className={`sheet ${this.props.isReadOnly ? 'sheet_isReadonly' : ''}`}
                 onClick={() => appStore.changeMode(AppMode.edit)}>
                {
                    !this.props.isReadOnly &&
                    <div className="sheet__headerRow">
                        <div className="rowBumper"/>
                        {
                            range(fromC, toC).map((j) =>
                                <HeaderCell key={`hc${j}`} c={j}/>)
                        }
                    </div>
                }
                {
                    range(fromR, toR).map((i) =>
                        <div className="sheet__row" key={`r${i}`}>
                            {
                                !this.props.isReadOnly &&
                                <RowBumper r={i}/>
                            }
                            {
                                range(fromC, toC).map((j) =>
                                    <Cell key={`c${i}${j}`} coords={[i, j]} isReadOnly={this.props.isReadOnly}/>)
                            }
                        </div>)
                }
                {
                    contextMenuStore.isOpen &&
                    <ContextMenu/>
                }
            </div>
        );
    }
}

export default Sheet;