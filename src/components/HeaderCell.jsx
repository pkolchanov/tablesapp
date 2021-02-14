import {observer} from "mobx-react";
import React from "react";
import {sheetStore} from "../stores/SheetStore";
import {dndStore} from "../stores/DnDStore";
import '../styles/headerCell.scss';
import {appStore, AppMode} from "../stores/AppStore";

@observer
class HeaderCell extends React.Component {
    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    render() {
        const selectedColumn = sheetStore.selectedColumn
        const isSelected = this.props.c === selectedColumn && appStore.mode === AppMode.edit;
        const nextSelected = (this.props.c + 1) === selectedColumn && appStore.mode === AppMode.edit;
        return (
            <div className={`headerCell ${isSelected ? ' headerCell_isSelected' : ''}`}
                 style={{width: sheetStore.columnWidths[this.props.c] + 'px'}}
                 onDragEnd={this.onDragEnd}
                 onDragOver={this.onDragOver}
                 onDragEnter={this.onDragEnter}
                 onDrop={this.onDrop}
            >
                <div draggable className="headerCell__filler"
                     style={{width: sheetStore.columnWidths[this.props.c] - 5 + 'px'}} //5 px – half of resizer
                     onClick={this.onClick}
                     onDragStart={this.onDragStart}>
                </div>
                {
                    !isSelected &&
                    !nextSelected &&
                    <div className={`headerCell__resizer ${isSelected ? 'headerCell__resizer_isSelected' : ''}`}
                         onMouseDown={this.onMouseDown} >|</div>
                }

            </div>
        )
    }

    onClick() {
        sheetStore.selectColumn(this.props.c);
    }

    onDragStart() {
        dndStore.selectDraggedColumn(this.props.c);
    }

    onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    onDragEnter() {
        dndStore.dragEnter([-1, this.props.c]);
    }

    onDrop() {
        dndStore.drop([-1, this.props.c]);
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