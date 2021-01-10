import {observer} from "mobx-react";
import React from "react";
import '../styles/headerCell.css';
import {sheetStore} from "../stores/SheetStore";
import {dndStore} from "../stores/DnDStore";


@observer
class HeaderCell extends React.Component {
    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    render() {
        return (
            <div className="headerCell"
                 style={{width: sheetStore.columnWidths[this.props.c] + 'px'}}>
                <div draggable className="headerCell__filler"
                     onClick={this.onClick}
                     onDragStart={this.onDragStart}
                     onDragOver={this.onDragOver}
                     onDrop={this.onDrop}
                     onDragEnd={this.onDragEnd}
                />
                <div className="headerCell__resizer" onMouseDown={this.onMouseDown}>|</div>
            </div>
        )
    }

    onClick(e) {
        sheetStore.selectColumn(this.props.c);
    }

    onDragStart(ev) {
        // const moveHandler = ev => {
        //     ev.preventDefault();
        //     dndStore.setCurrentCoords(ev.clientX, ev.clientY);
        // };
        // document.addEventListener(
        //     'drag',
        //     moveHandler
        // );
        sheetStore.resetSelection();
        dndStore.setStartCoords(ev.clientX, ev.clientY);
        dndStore.selectDraggedColumn(this.props.c);
    }

    onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        dndStore.selectTargetColumn(this.props.c);
    }

    onDrop() {
        dndStore.dropColumn();
    }

    onDragEnd() {
        dndStore.dragEnd();
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