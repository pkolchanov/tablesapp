import React from "react";
import {CellStyles, sheetStore} from "../stores/SheetStore";
import '../styles/styleSelector.scss';
import {observer} from "mobx-react";
import {action, makeObservable, observable} from "mobx";
import {appStore, AppMode} from "../stores/AppStore";

@observer
class StyleSelector extends React.Component {
    @observable
    isOpen = false;

    constructor(props) {
        super(props);
        makeObservable(this);
        this.toggle = this.toggle.bind(this);
        this.toggleStyle = this.toggleStyle.bind(this);
        this.toggleButtonRef = React.createRef();
    }

    render() {
        if(this.toggleButtonRef.current){
            this.toggleButtonRef.current.getBoundingClientRect();
        }
        let leftOffset = this.toggleButtonRef.current ? this.toggleButtonRef.current.getBoundingClientRect().left : 300;
        return (
            <div>
                <a className={`${this.props.className} styleSelector__toggle`} onClick={this.toggle}
                   ref={this.toggleButtonRef}>
                    Choose a style
                </a>
                {
                    this.isOpen &&
                    <div className="styleSelector__popup" style={{left: leftOffset}}>
                        <div className="styleSelector__item"
                             onClick={() => this.toggleStyle(CellStyles.bold)}>
                            <div className="styleSelector__itemName styleSelector__bold">
                                Bold
                            </div>
                            <div className="styleSelector__shortcut">
                                ⌘B
                            </div>
                        </div>
                        <div className="styleSelector__item"
                             onClick={() => this.toggleStyle(CellStyles.accent)}>
                            <div className="styleSelector__itemName styleSelector__accent">
                                Accent
                            </div>
                            <div className="styleSelector__shortcut">
                                ⌘I
                            </div>
                        </div>
                        <div className="styleSelector__item styleSelector__normal"
                             onClick={() => this.toggleStyle(CellStyles.normal)}>
                            Normal
                        </div>
                        <div className="styleSelector__item styleSelector__subtle"
                             onClick={() => this.toggleStyle(CellStyles.subtle)}>
                            Subtle
                        </div>
                    </div>
                }
            </div>

        );
    }

    @action
    toggleStyle(style) {
        sheetStore.toggleStyle(style);
        this.isOpen = false;
    }


    @action
    toggle() {
        appStore.changeMode(AppMode.edit);
        if (this.isOpen) {
            this.isOpen = false;
        } else {
            this.isOpen = true;
            const handleClickOutside = action(e => {
                document.removeEventListener(
                    'mousedown',
                    handleClickOutside
                );
                const isOutside = (e.target.classList.value.indexOf('styleSelector') === -1) ||
                    (e.target.classList.value === 'styleSelector__popup');
                if (isOutside) {
                    this.isOpen = false;
                }
            });
            document.addEventListener("mousedown", handleClickOutside)
        }

    }
}

export default StyleSelector;