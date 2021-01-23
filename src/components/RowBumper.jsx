import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import {dndStore} from "../stores/DnDStore";
import '../styles/rowBumper.css';

@observer
class RowBumper extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    render() {
        return (
            <div draggable
                 className={`rowBumper ${sheetStore.selectedRow === this.props.r ? " rowBumper_isSelected" : ""}`}
                 onClick={this.onClick}
                 onDragStart={this.onDragStart}
                 onDragEnter={this.onDragEnter}
                 onDragOver={this.onDragOver}
                 onDrop={this.onDrop}
                 onDragEnd={this.onDragEnd}
            />
        );
    }


    onClick() {
        sheetStore.selectRow(this.props.r)
    }

    onDragStart(ev) {
        sheetStore.selectRow(this.props.r);
        dndStore.setStartCoords(ev.clientX, ev.clientY);
        dndStore.selectDraggedRow(this.props.r);
    }

    onDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        dndStore.selectTargetRow(this.props.r);
    }

    onDrop() {
        dndStore.drop();
    }

    onDragEnd() {
        dndStore.dragEnd();
    }

    onDragOver(e) {
        // ¯\_(ツ)_/¯
        e.preventDefault();
        e.stopPropagation();
    }
}

export default RowBumper;