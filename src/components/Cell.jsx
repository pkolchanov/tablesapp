import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import '../styles/cell.css';
import {appStore, ModeEnum} from "../stores/AppStore";
import {dndStore} from "../stores/DnDStore";

@observer
class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.recalcInputHeight = this.recalcInputHeight.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        const current = this.inputRef.current;
        if (current) {
            this.recalcInputHeight();
            current.focus();
        }
    }

    componentDidUpdate() {
        if (this.inputRef.current) {
            this.recalcInputHeight();
            this.inputRef.current.focus();
        }
    }

    render() {
        const [r, c] = this.props.coords;
        const [activeR, activeC] = sheetStore.activeCoords;
        const [selectionStartC, selectionEndC] = sheetStore.selectionRectColums || [];
        const [selectionStartR, selectionEndR] = sheetStore.selectionRectRows || [];

        const isSelected = sheetStore.selectionEndCoords &&
            ((selectionStartR <= r && r <= selectionEndR)) &&
            ((selectionStartC <= c && c <= selectionEndC));
        const isActive = appStore.mode === ModeEnum.edit && r === activeR && c === activeC && !sheetStore.selectionEndCoords;

        const isTarget = dndStore.targetColumn === c;
        const isDragged = dndStore.draggedColumn === c;

        let boxShadow = 'none';
        if (isActive) {
            boxShadow = '0 0 0 1px #009ADE inset'
        } else if (isTarget) {
            boxShadow = '2px 0 0  #EC5D2A inset'
        } else if (isSelected) {
            boxShadow = `${c === selectionStartC ? 1 : 0}px ${r === selectionStartR ? 1 : 0}px 0 0 #009ADE inset, ${c === selectionEndC ? -1 : 0}px ${r === selectionEndR ? -1 : 0}px 0 0 #009ADE inset`
        }
        return (
            <div className={`cell${isDragged ? ' cell_isDragged' :''}`}
                 onClick={this.handleClick}
                 style={{width: sheetStore.columnWidths[c] + 'px', boxShadow: boxShadow}}
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}
                 onMouseEnter={this.handleMouseEnter}
                 onDrop={this.handleDrop}
                 onDragOver={this.handleDragOver}
            >
                {!isActive && sheetStore.data[r][c]}
                {isActive && <textarea className="cell__input"
                                       value={sheetStore.data[r][c]}
                                       onChange={this.handleChange}
                                       onKeyDown={this.recalcInputHeight}
                                       ref={this.inputRef}
                                       style={{width: sheetStore.columnWidths[c] + 'px'}}/>}
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

    handleChange(event) {
        sheetStore.update(this.props.coords, event.target.value);
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

    recalcInputHeight() {
        const inputRef = this.inputRef.current;
        inputRef.style.height = "1px";
        inputRef.style.height = inputRef.scrollHeight + "px";
    }

    handleDragOver(e) {
        e.preventDefault();
        dndStore.selectTargetColumn(this.props.coords[1]);
    }

    handleDrop() {
        dndStore.dropColumn();
    }

}


export default Cell;