import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import {appStore, ModeEnum} from "../stores/AppStore";
import {dndStore} from "../stores/DnDStore";
import TextareaWrapper from "./TexareaWrapper";
import {contextMenuStore} from "../stores/ContextMenuStore";
import color from '../styles/color.module.scss';
import '../styles/cell.scss';

@observer
class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragEnter = this.handleDragEnter.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    render() {
        const [r, c] = this.props.coords;
        const dataDict = sheetStore.data[r][c];
        const [activeR, activeC] = sheetStore.activeCoords;
        const [selectionStartC, selectionEndC] = sheetStore.selectionRectColums || [];
        const [selectionStartR, selectionEndR] = sheetStore.selectionRectRows || [];

        const isActiveCoords = appStore.mode === ModeEnum.edit &&
            r === activeR &&
            c === activeC
        const isActive = isActiveCoords &&
            !sheetStore.selectionStartCoords &&
            !dndStore.draggedColumn;

        const isSelected = appStore.mode === ModeEnum.edit &&
            sheetStore.selectionEndCoords &&
            sheetStore.isCellInsideSelection(this.props.coords);

        const isTargetColumn = dndStore.targetColumn === c;
        const isTargetRow = dndStore.targetRow === r;
        const isDragged = dndStore.draggedColumn === c || dndStore.draggedRow === r;
        const isUnderlined = dataDict.isUnderlined;

        //todo refactor this shit
        let boxShadow = 'none';
        if (isUnderlined) {
            boxShadow = `0 -1px 0 0 ${color.colorLightGray} inset`
        }
        if (isActiveCoords) {
            boxShadow = `0 0 0 1px ${sheetStore.selectionStartCoords ? color.colorBlueLight : color.colorBlue} inset`
            if (isUnderlined) {
                boxShadow = boxShadow += `, 0 -2px 0 0 ${color.colorLightGray} inset`
            }
        }
        if (isTargetColumn) {
            boxShadow = `${c < dndStore.draggedColumn ? '' : '-'}2px 0 0 ${color.colorBlue} inset`;
        } else if (isTargetRow) {
            boxShadow = `0px ${r < dndStore.draggedRow ? '' : '-'}2px 0 ${color.colorBlue} inset`;
        } else if (isSelected) {
            const topLeft = `${c === selectionStartC ? 1 : 0}px ${r === selectionStartR ? 1 : 0}px 0 0 ${color.colorBlue} inset`
            const bottomRight = `${c === selectionEndC ? -1 : 0}px ${r === selectionEndR ? -1 : 0}px 0 0 ${color.colorBlue} inset`
            let bs = [topLeft, bottomRight]
            if (isActiveCoords) {
                bs.push(`0 0 0 1.5px ${color.colorBlue} inset`)
            }
            if (isUnderlined) {
                bs.push(`0 ${r === selectionEndR ? -2 : -1}px 0 0 ${color.colorLightGray} inset`)
            }
            boxShadow = bs.join(', ')
        }
        return (
            <div className={`cell${isDragged ? ' cell_isDragged' : ''} cell_is${dataDict.style}`}
                 onClick={this.handleClick}
                 style={{width: sheetStore.columnWidths[c] + 'px', boxShadow: boxShadow}}
                 onMouseDown={this.handleMouseDown}
                 onMouseEnter={this.handleMouseEnter}
                 onDrop={this.handleDrop}
                 onDragEnter={this.handleDragEnter}
                 onDragOver={this.handleDragOver}
                 onContextMenu={this.handleContextMenu}
            >
                {(!isActive || this.props.isReadOnly) && dataDict.value}
                {
                    isActive && !this.props.isReadOnly &&
                    <TextareaWrapper width={sheetStore.columnWidths[c]} coords={this.props.coords}/>
                }
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

    handleMouseDown(e) {
        if (this.props.isReadOnly) {
            return;
        }
        if (e.button === 0) {
            sheetStore.startSelection(this.props.coords);
        }
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
        dndStore.dragEnter(this.props.coords);
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
        dndStore.drop(this.props.coords);
    }

    handleContextMenu(e) {
        if (this.props.isReadOnly) {
            return;
        }
        e.preventDefault();
        if (!sheetStore.isCellInsideSelection(this.props.coords)) {
            sheetStore.activateCell(this.props.coords);
        }
        contextMenuStore.toggle(e.pageX + 2, e.pageY + 2);
    }

}


export default Cell;