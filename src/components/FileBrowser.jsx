import {observer} from "mobx-react";
import React from "react";
import '../styles/fileBrowser.css';
import {fileBrowserStore} from "../stores/FileBrowserStore";

@observer
class FileBrowser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const sheets = fileBrowserStore.sheets;
        return (
            <div className="fileBrowser">
                {Object.keys(sheets).map(key =>
                    <div
                        className={`fileBrowser__file ${key === fileBrowserStore.currentSheetId && 'fileBrowser__file_active'} `}
                        key={key}
                        onClick={() => fileBrowserStore.select(key)}>
                        <div className="fileBrowser__preview">
                            {sheets[key].sheetData.flat(2)[0].toString()}
                        </div>
                        <div className="fileBrowser__lastUpdate">
                            {sheets[key].lastUpdate}
                        </div>
                    </div>
                )}

            </div>
        )
    }


}

export default FileBrowser;