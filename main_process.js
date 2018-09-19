// Basic init
const electron = require('electron')
const path = require('path');
const { Socket, Transport } = require('electron-ipc-socket');

const {app, BrowserWindow, crashReporter, ipcMain, Menu} = electron

const socketRoutes = require('./services');
const bindSocketToRoutes = require('./services/bindSocketToRoutes');
const isDevelopment = (process.env.NODE_ENV === 'development');

if (isDevelopment) {
  // Let electron reloads by itself when webpack watches changes in ./app/
  require('electron-reload')(__dirname, {
    electron: require('${__dirname}/../../node_modules/electron')
  })
}


const userDataPath = (electron.app || electron.remote.app).getPath('userData');


const contentPath = path.join(userDataPath, '/stories');

global.contentPath = contentPath;
  

// To avoid being garbage collected
let mainWindow
let forceQuit = false

/**
 * Install react and redux devtools
 */
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

app.on('ready', async () => {

  

    /**
     * install devtools extensions in dev mode
     */
    if (isDevelopment) {
      await installExtensions();
    }

    const mainScreen = electron.screen.getPrimaryDisplay();

    mainWindow = new BrowserWindow({
      width: mainScreen.bounds.width, 
      height: mainScreen.bounds.height,
      icon: path.join(__dirname, 'assets/android-chrome-96x96.png')
    })

    const socket = Socket('main-win', Transport(ipcMain, mainWindow));
    socket.open();
    bindSocketToRoutes(socket, socketRoutes);

    socket.on('event:ready', () => {
        console.log('main-win ready');
    });

    mainWindow.loadURL(`file://${__dirname}/app/electronIndex.html`);

    // show window once on first load
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.show();
    });


    mainWindow.webContents.on('did-finish-load', () => {
      // Handle window logic properly on macOS:
      // 1. App should not terminate if window has been closed
      // 2. Click on icon in dock should re-open the window
      // 3. ⌘+Q should close the window and quit the app
      if (process.platform === 'darwin') {
        mainWindow.on('close', function (e) {
          if (!forceQuit) {
            e.preventDefault();
            mainWindow.hide();
          }
        });

        app.on('activate', () => {
          mainWindow.show();
        });
        
        app.on('before-quit', () => {
          forceQuit = true;
        });
      } else {
        mainWindow.on('closed', () => {
          mainWindow = null;
        });
      }
    });   

    if (isDevelopment) {
      // auto-open dev tools
      mainWindow.webContents.openDevTools();

      // add inspect element on right click menu
      mainWindow.webContents.on('context-menu', (e, props) => {
        Menu.buildFromTemplate([{
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement(props.x, props.y);
          }
        }]).popup(mainWindow);
      });
    }
})

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

crashReporter.start({
  productName: 'YourName',
  companyName: 'YourCompany',
  submitURL: 'https://your-domain.com/url-to-submit',
  uploadToServer: false
});

