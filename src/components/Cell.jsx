import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import '../styles/cell.css';
import {appStore, ModeEnum} from "../stores/AppStore";

@observer
class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.reCalcInputHeight = this.reCalcInputHeight.bind(this);
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        if (this.inputRef.current) {
            this.reCalcInputHeight();
            this.inputRef.current.focus();
        }
    }

    componentDidUpdate() {
        if (this.inputRef.current) {
            this.reCalcInputHeight();
            this.inputRef.current.focus();
        }
    }

    render() {
        const [r, c] = this.props.coords;
        const [activeR, activeC] = sheetStore.activeCoords;
        const [selectionStartR, selectionStartC] = sheetStore.selectionStartCoords || [];
        const [selectionEndR, selectionEndC] = sheetStore.selectionEndCoords || [];

        const isActive = appStore.mode === ModeEnum.edit && r === activeR && c === activeC && !sheetStore.selectionStartCoords;
        const isSelected = sheetStore.selectionEndCoords &&
            ((selectionEndR <= r && r <= selectionStartR) || (selectionEndR >= r && r >= selectionStartR)) &&
            ((selectionEndC <= c && c <= selectionStartC) || (selectionEndC >= c && c >= selectionStartC));

        return (
            <div className={`cell${isActive ? ' cell_isActive' : ''}${isSelected ? ' cell_isSelected' : ''}`}
                 onClick={this.handleClick}
                 style={{width: sheetStore.columnWidths[c] + 'px'}}
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}
                 onMouseEnter={this.handleMouseEnter}

            >
                {!isActive && sheetStore.data[r][c]}
                {isActive && <textarea className="cell__input"
                                       value={sheetStore.data[r][c]}
                                       onChange={this.handleChange}
                                       onKeyDown={this.reCalcInputHeight}
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

    handleMouseEnter(event) {
        if (sheetStore.inSelectionMode) {
            sheetStore.updateSelection(this.props.coords);
        }
    }

    reCalcInputHeight() {
        this.inputRef.current.style.height = "1px";
        this.inputRef.current.style.height = this.inputRef.current.scrollHeight + "px";
    }


}


export default Cell;