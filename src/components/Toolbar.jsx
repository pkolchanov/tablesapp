import {observer} from "mobx-react";
import React from "react";
import {authStore} from "../stores/AuthStore";
import {fileBrowserStore} from "../stores/FileBrowserStore";
import {firebaseConfig} from "../helpers/firebaseConfig";
import LoginForm from "./LoginForm";
import '../styles/toolbar.css';
import {appStore, ModeEnum} from "../stores/AppStore";
import {action} from "mobx";
import * as randomWords from 'random-words';

@observer
class Toolbar extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        return (
            <div className='toolbar'>
                {
                    !PRODUCTION &&
                    <button onClick={this.randomizeSheet}>randomize</button>
                }
                {
                    authStore.loggedUser &&
                    <div className='toolbar__shared' onClick={this.copySheetUrlToClipboard}>Table shared ✓</div>
                }
                {
                    !authStore.loggedUser &&
                    <a className='toolbar__share' onClick={this.onClick}>Share</a>
                }
                {
                    appStore.mode === ModeEnum.login &&
                    <LoginForm/>
                }

            </div>
        )
    }

    onClick() {
        appStore.changeMode(ModeEnum.login);
    }

    copySheetUrlToClipboard() {
        navigator.clipboard.writeText(PRODUCTION ? `https://${firebaseConfig.authDomain}` : 'http://localhost:5000' + `/${fileBrowserStore.currentSheetId}`)
    }


    @action
    randomizeSheet() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                fileBrowserStore.currentSheet.sheetData[i][j].value = randomWords({min: 2, max: 5, join: ' '})
            }
        }
    }
}

export default Toolbar;