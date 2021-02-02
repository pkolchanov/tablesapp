import {observer} from "mobx-react";
import React from "react";
import {authStore} from "../stores/AuthStore";
import {fileBrowserStore} from "../stores/FileBrowserStore";
import {firebaseConfig} from "../helpers/firebaseConfig";
import StyleSelector from "./StyleSelector";
import LoginForm from "./LoginForm";
import {appStore, ModeEnum} from "../stores/AppStore";
import {action} from "mobx";
import * as randomWords from 'random-words';
import plus from '../icons/plus.svg';
import '../styles/toolbar.scss';
import {sheetStore} from "../stores/SheetStore";

@observer
class Toolbar extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        return (
            <div className='toolbar'>
                <div className="toolbar__left">
                    <ToolbarItem
                        onClick={() => fileBrowserStore.newSheet()}
                        item={
                            <svg
                                className='toolbar__plusIcon'>
                                <use xlinkHref="#plus"></use>
                            </svg>
                        }
                    />
                </div>
                <div className="toolbar__middle">
                    <StyleSelector className='toolbar__item'/>
                    <ToolbarItem item="Underline" onClick={() => sheetStore.underline()}/>
                    {
                        !PRODUCTION &&
                        <ToolbarItem item="Randomize" onClick={this.randomizeSheet}/>
                    }
                </div>
                <div className="toolbar__right">
                    {
                        authStore.loggedUser &&
                        <ToolbarItem item="✓ Table shared" onClick={this.copySheetUrlToClipboard}/>
                    }
                    {
                        !authStore.loggedUser &&
                        <ToolbarItem item="Share" onClick={this.onClick}/>
                    }
                    {
                        appStore.mode === ModeEnum.login &&
                        <LoginForm/>
                    }
                </div>

            </div>
        )
    }

    onClick() {
        appStore.changeMode(ModeEnum.login);
    }

    copySheetUrlToClipboard() {
        navigator.clipboard.writeText((PRODUCTION ? `https://${firebaseConfig.authDomain}` : 'http://localhost:5000') + `/${fileBrowserStore.currentSheetId}`)
    }

    @action
    randomizeSheet() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                fileBrowserStore.currentSheet.sheetData[i][j].value = randomWords({min: 3, max: 5, join: ' '})
            }
        }
    }
}

function ToolbarItem(props) {
    return (
        <a className='toolbar__item'
           onClick={(e) => {
               addHighlight(e);
               props.onClick()
           }}>
            {props.item}
        </a>
    );
}

function addHighlight(e) {
    let target = e.target;
    if (target.classList.value.indexOf("toolbar__item") === -1) {
        target = target.parentElement;
    }
    target.classList.add("toolbar__item_isHighlighted");
    setTimeout(() => {
        target.classList.remove("toolbar__item_isHighlighted");
    }, 100);
}

export default Toolbar;