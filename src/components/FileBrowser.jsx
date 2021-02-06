import {observer} from "mobx-react";
import React from "react";
import {fileBrowserStore} from "../stores/FileBrowserStore";
import {appStore, ModeEnum} from "../stores/AppStore";
import {relativeDateTime} from "../helpers/date";
import '../styles/fileBrowser.scss';
import link from '../icons/link.svg';

@observer
class FileBrowser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`fileBrowser${appStore.mode === ModeEnum.navigate ? ' fileBrowser_active' : ''} `}
                 onClick={() => appStore.changeMode(ModeEnum.navigate)}>
                <div className='fileBrowser__spacer'/>
                {fileBrowserStore.flatSheets.map(([key, value]) =>
                    <div
                        className={`fileBrowser__file${key === fileBrowserStore.currentSheetId ? ' fileBrowser__file_selected' : ''} `}
                        key={key}
                        onClick={() => fileBrowserStore.select(key)}>
                        <div className='fileBrowser__itemWrapper'>
                            <div className='fileBrowser__itemLeft'>
                                {
                                    fileBrowserStore.currentSheet.isPublished &&
                                    <svg className='fileBrowser__sharedIcon'>
                                        <use xlinkHref="#link"></use>
                                    </svg>
                                }

                            </div>
                            <div className='fileBrowser__itemRight'>
                                <div className="fileBrowser__preview">
                                    {value.sheetData.flat(2).map(x => x.value).filter(x => !!x)[0]}
                                </div>
                                <div className="fileBrowser__lastUpdate">
                                    {relativeDateTime(value.lastUpdate)}
                                </div>
                            </div>

                        </div>

                    </div>
                )}

            </div>
        )
    }


}

export default FileBrowser;