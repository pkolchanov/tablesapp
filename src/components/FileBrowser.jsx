import {observer} from "mobx-react";
import React from "react";
import '../styles/fileBrowser.css';
import {fileBrowserStore} from "../stores/FileBrowserStore";
import {appStore, ModeEnum} from "../stores/AppStore";
import {relativeDateTime} from "../helpers/date";

@observer
class FileBrowser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const sheets = Object.entries(fileBrowserStore.sheets)
            .sort(([, a], [, b]) => a.lastUpdate > b.lastUpdate ? -1 : 1);
        return (
            <div className={`fileBrowser${appStore.mode === ModeEnum.navigate ? ' fileBrowser_active' : ''} `}
                 onClick={() => appStore.changeMode(ModeEnum.navigate)}>
                <div className='fileBrowser__spacer'/>
                {sheets.map(([key, value]) =>
                    <div
                        className={`fileBrowser__file${key === fileBrowserStore.currentSheetId ? ' fileBrowser__file_selected' : ''} `}
                        key={key}
                        onClick={() => fileBrowserStore.select(key)}>
                        <div className="fileBrowser__preview">
                            {value.sheetData.flat(2).map(x => x.value).filter(x => !!x)[0]}
                        </div>
                        <div className="fileBrowser__lastUpdate">
                            {relativeDateTime(value.lastUpdate)}
                        </div>
                    </div>
                )}

            </div>
        )
    }


}

export default FileBrowser;