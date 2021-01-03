import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import '../styles/cell.css';

@observer
class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        if (this.inputRef.current) {
            this.inputRef.current.focus();
        }
    }

    componentDidUpdate() {
        if (this.inputRef.current) {
            this.inputRef.current.focus();
        }
    }

    render() {
        const [r, c] = this.props.coords;
        const [activeR, activeC] = sheetStore.activeCoords;
        const [selectionStartR, selectionStartC] = sheetStore.selectionStartCoords || [];
        const [selectionEndR, selectionEndC] = sheetStore.selectionEndCoords || [];

        const isActive = r === activeR && c === activeC && !sheetStore.selectionStartCoords;
        const isSelected = sheetStore.selectionEndCoords &&
            ((selectionEndR <= r && r <= selectionStartR) || (selectionEndR >= r && r >= selectionStartR)) &&
            ((selectionEndC <= c && c <= selectionStartC) || (selectionEndC >= c && c >= selectionStartC));

        return (
            <div className={`cell ${isActive && 'cell_isActive'} ${isSelected && 'cell_isSelected'}`}
                 onClick={this.handleClick}
                 style={{width: sheetStore.columnWidths[c] + 'px'}}>
                {!isActive && sheetStore.data[r][c]}
                {isActive && <input className="cell__input"
                                    value={sheetStore.data[r][c]}
                                    onChange={this.handleChange}
                                    ref={this.inputRef}
                                    style={{width: sheetStore.columnWidths[c] + 'px'}}/>}
            </div>
        );
    }

    handleClick(event) {
        if (event.shiftKey) {
            sheetStore.select(this.props.coords)
        } else {
            sheetStore.activateCell(this.props.coords);
        }
    }

    handleChange(event) {
        sheetStore.update(this.props.coords, event.target.value);
    }

}


export default Cell;