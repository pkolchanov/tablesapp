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
        const dataCell = sheetStore.data[r][c];
        const [activeR, activeC] = sheetStore.activeCoords;
        const [selectionStartC, selectionEndC] = sheetStore.selectionRectColums || [];
        const [selectionStartR, selectionEndR] = sheetStore.selectionRectRows || [];

        const isActive = appStore.mode === ModeEnum.edit && r === activeR && c === activeC &&
            !sheetStore.selectionStartCoords &&
            !dndStore.draggedColumn;

        const isSelected = sheetStore.selectionEndCoords &&
            ((selectionStartR <= r && r <= selectionEndR)) &&
            ((selectionStartC <= c && c <= selectionEndC));

        const isTarget = dndStore.targetColumn === c;
        const isDragged = dndStore.draggedColumn === c;

        let boxShadow = 'none';
        if (isActive) {
            boxShadow = '0 0 0 1px #009ADE inset'
        }
        if (isTarget) {
            boxShadow = `${c < dndStore.draggedColumn ? '' : '-'}2px 0 0 #009ADE inset`;
        } else if (isSelected) {
            boxShadow = `${c === selectionStartC ? 1 : 0}px ${r === selectionStartR ? 1 : 0}px 0 0 #009ADE inset, ${c === selectionEndC ? -1 : 0}px ${r === selectionEndR ? -1 : 0}px 0 0 #009ADE inset`
        }
        return (
            <div className={`cell${isDragged ? ' cell_isDragged' : ''} cell_is${dataCell.style}`}
                 onClick={this.handleClick}
                 style={{width: sheetStore.columnWidths[c] + 'px', boxShadow: boxShadow}}
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}
                 onMouseEnter={this.handleMouseEnter}
                 onDrop={this.handleDrop}
                 onDragEnter={this.handleDragEnter}
                 onDragOver={this.handleDragOver}
            >
                {!isActive && dataCell.value}
                {isActive && <TextareaWrapper width={sheetStore.columnWidths[c]} coords={this.props.coords}/>}
            </div>
        );
    }

    handleClick(event) {
        if (event.shiftKey) {
            sheetStore.select(sheetStore.activeCoords, this.props.coords)
        } else {
            sheetStore.activateCell(this.props.coords);
        }
    }

    handleMouseDown() {
        sheetStore.startSelection(this.props.coords);
    }

    handleMouseUp() {
        sheetStore.endSelection();
    }

    handleMouseEnter() {
        if (sheetStore.inSelectionMode) {
            sheetStore.updateSelection(this.props.coords);
        }
    }

    handleDragEnter() {
        dndStore.selectTargetColumn(this.props.coords[1]);
    }

    handleDragOver(e) {
        // ¯\_(ツ)_/¯
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop() {
        if (this.props.coords[1] === dndStore.draggedColumn) {
            return;
        }
        dndStore.dropColumn();
    }

}


export default Cell;