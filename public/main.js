const {app, BrowserWindow, webContents} = require('electron');
var remote = require('@electron/remote/main');
remote.initialize();

let win;

function closeWindow(){
    console.log("closed");
}

function createWindow(){

    win = new BrowserWindow({
        width: 800,
        height: 60,
        useContentSize: false,
        x: 2,
        y: 2,
        movable: false,
        frame: false,
        resizable: false,
        transparent: true,
        webPreferences: {
           contextIsolation: false,
           enableRemoteModule: true,
           nodeIntegration: true
        }
    });


    console.log(win);
    
    win.setMinimumSize(400, 60);
    remote.enable(win.webContents);
    win.webContents.openDevTools({mode: "detach"});
    win.setAlwaysOnTop(true, 'screen');
    win.removeMenu();
    win.loadURL('http://127.0.0.1:3000');

    win.on('close',function(event){
        event.preventDefault();
        win.hide();

        return false;
    });

    
}



app.on('ready', createWindow);


const dh = require('desktop-hotkeys');

var hk1;

function fnPressed() {
    win.show();
    win.focus();
}

function fnReleased() {
	
}


console.log("desktop-hotkeys module started: " + dh.start(true));


const isWindows = (process.platform === 'win32');
const CTRL = isWindows ? 17 : 29;
const ALT = isWindows ? 18 : 56;
const SPACE = isWindows ? 13 : 13;

try {
	hk1 = dh.registerShortcut([CTRL, ALT, SPACE], fnPressed, fnReleased, true);
	console.log('registerShortcut returned ' + hk1);

} catch (ex) {
	console.log('exception ' + ex);
}
