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
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    render() {
        const selectedColumn = sheetStore.selectedColumn;
        const isSelected = this.props.c === selectedColumn;
        const nextSelected = (this.props.c + 1) === selectedColumn;
        return (
            <div className={`headerCell ${isSelected ? ' headerCell_isSelected' : ''}`}
                 style={{width: sheetStore.columnWidths[this.props.c] + 'px'}}
                 onDragEnd={this.onDragEnd}>
                <div draggable className="headerCell__filler"
                     onClick={this.onClick}
                     onDragStart={this.onDragStart}
                     onDragOver={this.onDragOver}
                     onDragEnter={this.onDragEnter}
                     onDrop={this.onDrop}>
                    {isSelected ? '∙∙∙' : ''}
                </div>
                {
                    !isSelected &&
                    !nextSelected &&
                    <div className="headerCell__resizer" onMouseDown={this.onMouseDown}>|</div>
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

    onDragEnter(){
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