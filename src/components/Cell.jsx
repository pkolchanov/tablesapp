import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import '../styles/cell.css';
import {appStore, ModeEnum} from "../stores/AppStore";
import {dndStore} from "../stores/DnDStore";
import TextareaWrapper from "./TexareaWrapper";


@observer
class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragEnter = this.handleDragEnter.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
    }

    render() {
        const [r, c] = this.props.coords;
        const dataDict = sheetStore.data[r][c];
        const [activeR, activeC] = sheetStore.activeCoords;
        const [selectionStartC, selectionEndC] = sheetStore.selectionRectColums || [];
        const [selectionStartR, selectionEndR] = sheetStore.selectionRectRows || [];

        const isActive = appStore.mode === ModeEnum.edit && r === activeR && c === activeC &&
            !sheetStore.selectionStartCoords &&
            !dndStore.draggedColumn;

        const isSelected = sheetStore.selectionEndCoords &&
            ((selectionStartR <= r && r <= selectionEndR)) &&
            ((selectionStartC <= c && c <= selectionEndC));

        const isTargetColumn = dndStore.targetColumn === c;
        const isTargetRow = dndStore.targetRow === r;
        const isDragged = dndStore.draggedColumn === c || dndStore.draggedRow === r;

        let boxShadow = 'none';
        if (isActive) {
            boxShadow = '0 0 0 1px #009ADE inset'
        }
        if (isTargetColumn) {
            boxShadow = `${c < dndStore.draggedColumn ? '' : '-'}2px 0 0 #009ADE inset`;
        } else if (isTargetRow) {
            boxShadow = `0px ${r < dndStore.draggedRow ? '' : '-'}2px 0 #009ADE inset`;
        } else if (isSelected) {
            boxShadow = `${c === selectionStartC ? 1 : 0}px ${r === selectionStartR ? 1 : 0}px 0 0 #009ADE inset, ${c === selectionEndC ? -1 : 0}px ${r === selectionEndR ? -1 : 0}px 0 0 #009ADE inset`
        }
        return (
            <div className={`cell${isDragged ? ' cell_isDragged' : ''} cell_is${dataDict.style}`}
                 onClick={this.handleClick}
                 style={{width: sheetStore.columnWidths[c] + 'px', boxShadow: boxShadow}}
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}
                 onMouseEnter={this.handleMouseEnter}
                 onDrop={this.handleDrop}
                 onDragEnter={this.handleDragEnter}
                 onDragOver={this.handleDragOver}
            >
                {(!isActive || this.props.isReadOnly) && dataDict.value}
                {isActive && !this.props.isReadOnly &&
                <TextareaWrapper width={sheetStore.columnWidths[c]} coords={this.props.coords}/>}
            </div>
        );
    }

    handleClick(event) {
        if (this.props.isReadOnly) {
            return;
        }
        if (event.shiftKey) {
            sheetStore.select(sheetStore.activeCoords, this.props.coords)
        } else {
            sheetStore.activateCell(this.props.coords);
        }
    }

    handleMouseDown() {
        if (this.props.isReadOnly) {
            return;
        }
        sheetStore.startSelection(this.props.coords);
    }

    handleMouseUp() {
        if (this.props.isReadOnly) {
            return;
        }
        sheetStore.endSelection();
    }

    handleMouseEnter() {
        if (this.props.isReadOnly) {
            return;
        }
        if (sheetStore.inSelectionMode) {
            sheetStore.updateSelection(this.props.coords);
        }
    }

    handleDragEnter() {
        if (this.props.isReadOnly) {
            return;
        }
        if (dndStore.draggedRow !== undefined) {
            dndStore.selectTargetRow(this.props.coords[0]);
        }
        if (dndStore.draggedColumn !== undefined)  {
            dndStore.selectTargetColumn(this.props.coords[1]);
        }
    }

    handleDragOver(e) {
        // ¯\_(ツ)_/¯
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop() {
        if (this.props.isReadOnly) {
            return;
        }
        if (this.props.coords[0] === dndStore.draggedRow) {
            return;
        }
        if (this.props.coords[1] === dndStore.draggedColumn) {
            return;
        }
        dndStore.drop();
    }

}


export default Cell;