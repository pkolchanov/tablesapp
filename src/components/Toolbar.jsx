import {observer} from "mobx-react";
import React from "react";
import {authStore} from "../stores/AuthStore";
import {fileBrowserStore} from "../stores/FileBrowserStore";
import StyleSelector from "./StyleSelector";
import LoginForm from "./LoginForm";
import {appStore, AppMode} from "../stores/AppStore";
import {sheetStore} from "../stores/SheetStore";
import {action} from "mobx";
import * as randomWords from 'random-words';
import plus from '../icons/plus.svg';
import dice from '../icons/dice.svg';
import '../styles/toolbar.scss';
import ShareForm from "./ShareForm";

@observer
class Toolbar extends React.Component {

    constructor(props) {
        super(props);
        this.changeMode = this.changeMode.bind(this);
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
                        <ToolbarItem item={
                            <span className='toolbar__iconWrapper'>
                                <svg className='toolbar__diceIcon'>
                                    <use xlinkHref="#dice"></use>
                                </svg>
                                Randomize
                            </span>
                        } onClick={this.randomizeSheet}/>
                    }
                </div>
                <div className="toolbar__right">
                    {
                        authStore.loggedUser &&
                        fileBrowserStore.currentSheet.isPublished &&
                        <ToolbarItem item={`✓ Table shared`} onClick={() => this.changeMode(AppMode.share)}/>
                    }
                    {
                        (!authStore.loggedUser || !fileBrowserStore.currentSheet.isPublished) &&
                        <ToolbarItem item="Share" onClick={() => this.onShareClick()}/>
                    }
                    {
                        appStore.mode === AppMode.login &&
                        <LoginForm/>
                    }
                    {
                        appStore.mode === AppMode.share &&
                        <ShareForm/>
                    }
                </div>

            </div>
        )
    }

    changeMode(mode) {
        appStore.changeMode(mode);
    }

    onShareClick() {
        if (!authStore.loggedUser) {
            this.changeMode(AppMode.login)
        } else {
            this.changeMode(AppMode.share);
        }
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