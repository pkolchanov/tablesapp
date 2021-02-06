import {observer} from "mobx-react";
import * as React from "react";
import ToggleSwitch from "./ToggleSwitch";
import {fileBrowserStore} from "../stores/FileBrowserStore";
import '../styles/shareForm.scss';

@observer
class ShareForm extends React.Component {

    render() {
        return (
            <div className="shareForm">
                <div className="shareForm__top" onClick={() => fileBrowserStore.togglePublishing()}>
                    Anyone with the secret link can view
                    <ToggleSwitch checked={fileBrowserStore.currentSheet.isPublished}
                                  onChange={() => fileBrowserStore.togglePublishing()}
                                  className='shareForm__toggle'/>
                </div>
                {
                    fileBrowserStore.currentSheet.isPublished &&
                    <div className="shareForm__bottom">
                        <div className="shareForm__linkLabel">
                            Secret link
                        </div>
                        <input className="shareForm__link"
                               type="text"
                               value={fileBrowserStore.currentSheetUrl}
                               readOnly={true}
                        >
                        </input>
                        <div className="shareForm__copyToClipboard" onClick={(e) => {addHighlight(e); this.copySheetUrlToClipboard();}}>
                            Copy to clipboard
                        </div>
                    </div>
                }
            </div>
        )
    }

    copySheetUrlToClipboard() {
        navigator.clipboard.writeText(fileBrowserStore.currentSheetUrl)
    }
}

//todo remove copypaste from Tooolbar
function addHighlight(e) {
    let target = e.target;
    target.classList.add("shareForm__copyToClipboard_isHighlighted");
    setTimeout(() => {
        target.classList.remove("shareForm__copyToClipboard_isHighlighted");
    }, 100);
}

export default ShareForm;