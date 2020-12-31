import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import '../styles/cell.css';
import {DOWN_KEY, ENTER_KEY, LEFT_KEY, RIGHT_KEY, UP_KEY} from "../helpers/keys";

@observer
class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
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
        const isActive = r === sheetStore.activeCoords[0] &&
            c === sheetStore.activeCoords[1];

        return (
            <div className={`cell ${isActive && 'cell-isActive'}`}
                 onClick={this.handleClick}>
                {!isActive && sheetStore.data[r][c]}
                {isActive && <input className="cell__input" value={sheetStore.data[r][c]} onChange={this.handleChange}
                                    ref={this.inputRef} onKeyDown={this.handleKeyDown}/>}
            </div>
        );
    }

    handleClick() {
        sheetStore.activateCell(this.props.coords);
    }

    handleChange(event) {
        sheetStore.update(this.props.coords, event.target.value);
    }

    handleKeyDown(event) {
        const keyCode = event.which || event.keyCode;
        const [r, c] = this.props.coords;

        if (keyCode === UP_KEY) {
            event.preventDefault();
            sheetStore.move(-1, 0);
        } else if (keyCode === DOWN_KEY || keyCode === ENTER_KEY) {
            event.preventDefault();
            sheetStore.move(1, 0);
        } else if (keyCode === LEFT_KEY && event.target.selectionStart === 0) {
            event.preventDefault();
            sheetStore.move(0, -1);
        } else if (keyCode === RIGHT_KEY &&
            event.target.selectionStart === sheetStore.data[r][c].length) {
            event.preventDefault();
            sheetStore.move(0, 1);
        }

        console.log(keyCode);
        console.log(event.target.selectionStart);
    }

}


export default Cell;