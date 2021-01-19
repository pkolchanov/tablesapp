'use strict';

const {app, BrowserWindow, ipcMain: ipc} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow;

let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
    dev = true;
}

app.setAsDefaultProtocolClient("tablesapp");

global.handleContent = {
    filename: `${app.getPath('userData')}/content.${dev ? 'dev' : ''}.json`,

    write(content) {
        fs.writeFileSync(this.filename, content, 'utf8');
    },
    read() {
        return fs.existsSync(this.filename) ? fs.readFileSync(this.filename, 'utf8') : false;
    }
};

function createWindow() {
    ipc.on('writeContent', (event, arg) => {
        global.handleContent.write(arg);
    });
    ipc.on('readContent', (event, arg) => {
        event.returnValue = global.handleContent.read(arg);
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024, height: 768, show: false,
        webPreferences: {
            nodeIntegration: true,
            // scrollBounce: true
        },
        titleBarStyle: 'hidden'
    });

    // and load the index.html of the app.
    let indexPath;
    if (dev && process.argv.indexOf('--noDevServer') === -1) {
        indexPath = url.format({
            protocol: 'http:',
            host: 'localhost:8080',
            pathname: 'index.html',
            slashes: true
        });
    } else {
        indexPath = url.format({
            protocol: 'file:',
            pathname: path.join(__dirname, 'dist', 'index.html'),
            slashes: true
        });
    }
    mainWindow.loadURL(indexPath);

    // Don't show until we are ready and loaded
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // Open the DevTools automatically if developing
        if (dev) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('open-url', function (event, data) {
    mainWindow.webContents.send('finishLogin', data)
});

if (dev) {
    const installExtension = require('electron-devtools-installer').default;
    const REACT_DEVELOPER_TOOLS = require('electron-devtools-installer')
        .REACT_DEVELOPER_TOOLS;
    app.whenReady().then(() => {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    });
}

