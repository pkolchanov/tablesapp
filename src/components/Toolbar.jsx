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
                    <a className='toolbar__item' onClick={() => fileBrowserStore.newSheet()}>
                        <svg
                            className='toolbar__plusIcon'>
                            <use xlinkHref="#plus"></use>
                        </svg>
                    </a>
                </div>
                <div className="toolbar__middle">
                    <StyleSelector className='toolbar__item'/>
                    <a className='toolbar__item' onClick={() => sheetStore.underline()}>
                        Underline
                    </a>
                    {
                        !PRODUCTION &&
                        <a className='toolbar__item' onClick={this.randomizeSheet}>Randomize</a>
                    }
                </div>
                <div className="toolbar__right">
                    {
                        authStore.loggedUser &&
                        <div className='toolbar__item' onClick={this.copySheetUrlToClipboard}>✓ Table shared</div>
                    }
                    {
                        !authStore.loggedUser &&
                        <a className='toolbar__item' onClick={this.onClick}>Share</a>
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

export default Toolbar;