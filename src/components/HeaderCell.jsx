import {observer} from "mobx-react";
import React from "react";
import '../styles/header-cell.css';
import {sheetStore} from "../stores/SheetStore";


@observer
class HeaderCell extends React.Component {
    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    render() {
        return (
            <div className="header-cell" style={{width:  sheetStore.columnWidths[this.props.c] + 'px'}}>
                <div className="header-cell__resizer" onMouseDown={this.onMouseDown}>|</div>
            </div>
        )
    }

    onMouseDown(e) {
        const moveHandler = ev => {
            sheetStore.resize(ev.clientX);
        };

        const upHandler = () => {
            document.removeEventListener(
                'mousemove',
                moveHandler
            );
            document.removeEventListener(
                'mouseup',
                upHandler
            );
            sheetStore.endResize();
        };

        document.addEventListener(
            'mousemove',
            moveHandler
        );
        document.addEventListener(
            'mouseup',
            upHandler
        );

        sheetStore.startResize(e.clientX, this.props.c);
    }
}

export default HeaderCell;