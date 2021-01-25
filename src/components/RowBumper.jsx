import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";
import {dndStore} from "../stores/DnDStore";
import '../styles/rowBumper.scss';
import {appStore, ModeEnum} from "../stores/AppStore";

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
        const isSelected = sheetStore.selectedRow === this.props.r && appStore.mode === ModeEnum.edit;
        return (
            <div draggable
                 className={`rowBumper ${isSelected ? " rowBumper_isSelected" : ""}`}
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

    onDragStart() {
        dndStore.selectDraggedRow(this.props.r);
    }

    onDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        dndStore.dragEnter([this.props.r, -1]);
    }

    onDrop() {
        dndStore.drop([this.props.r, -1]);
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