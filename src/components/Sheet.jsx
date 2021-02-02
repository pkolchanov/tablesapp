import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import Cell from "./Cell";
import HeaderCell from "./HeaderCell";
import RowBumper from "./RowBumper";
import {appStore, ModeEnum} from "../stores/AppStore";
import '../styles/sheet.css';
import ContextMenu from "./ContextMenu";
import {contextMenuStore} from "../stores/ContextMenuStore";

@observer
class Sheet extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`sheet ${this.props.isReadOnly ? 'sheet_isReadonly' : ''}`}
                 onClick={() => appStore.changeMode(ModeEnum.edit)}>
                {
                    !this.props.isReadOnly &&
                    <div className="sheet__headerRow">
                        <div className="rowBumper"/>
                        {Array(sheetStore.ncolums).fill().map((_, i) =>
                            <HeaderCell key={`hc${i}`} c={i}/>)}
                    </div>
                }
                {Array(sheetStore.nrows).fill().map((_, i) =>
                    <div className="sheet__row" key={`r${i}`}>
                        <RowBumper r={i}/>
                        {
                            Array(sheetStore.ncolums).fill().map((_, j) =>
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