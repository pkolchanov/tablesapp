import {contextMenuStore} from "../stores/ContextMenuStore";
import {action} from "mobx";
import {sheetStore} from "../stores/SheetStore";
import * as React from "react";
import {observer} from "mobx-react";
import '../styles/contextMenu.scss';

const handleClickOutside = (e => {
    document.removeEventListener(
        'mousedown',
        handleClickOutside
    );
    const isOutside = e.target.classList.value.indexOf('contextMenu') === -1;
    if (isOutside) {
        contextMenuStore.close();
    }
})

@observer
class ContextMenu extends React.Component {

    componentDidMount() {
        document.addEventListener('mousedown', handleClickOutside)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', handleClickOutside)
    }

    render() {
        return (
            <div>
                {
                    <div className='contextMenu' style={{top: contextMenuStore.y, left: contextMenuStore.x}}>
                        <ContextMenuItem action='Insert row'
                                         onClick={() => sheetStore.addRows(sheetStore.activeCoords[0], 1)}/>
                        <ContextMenuItem action='Delete row' shortcut='⌘Y' onClick={() => sheetStore.removeRow()}/>
                    </div>
                }
            </div>
        )
    }

}

function ContextMenuItem(props) {
    return (
        <div className="contextMenu__item"
             onClick={action((e) => {
                 contextMenuStore.isOpen = false;
                 props.onClick();
             })}>
            <div className="contextMenu__action">
                {props.action}
            </div>
            <div className="contextMenu__shortcut">
                {props.shortcut}
            </div>
        </div>
    )

}

export default ContextMenu;