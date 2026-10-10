const path = require("node:path");
const { pathToFileURL } = require("node:url");
const fs = require("node:fs");
const { app, BrowserWindow, shell } = require("electron");
const editorPath = path.join(__dirname, "app", "index.html");
const editorUrl = pathToFileURL(editorPath).href;
const smokeOutput = process.argv.find(arg => arg.startsWith("--smoke-output="))?.slice(15);
if (smokeOutput) app.disableHardwareAcceleration();

// Keep the application on Chromium's Web MIDI implementation. The editor asks
// separately for SysEx access when the user presses Connect.
app.commandLine.appendSwitch("enable-features", "WebMidi");

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();

let mainWindow;

function isLocalEditor(webContents) {
  const url = webContents?.getURL() || "";
  return url.split(/[?#]/)[0] === editorUrl;
}

function configureMidiPermissions() {
  const ses = mainWindow.webContents.session;
  const midiPermissions = new Set(["midi", "midiSysex"]);

  ses.setPermissionCheckHandler((webContents, permission) => {
    return Boolean(webContents && isLocalEditor(webContents) && midiPermissions.has(permission));
  });

  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(isLocalEditor(webContents) && midiPermissions.has(permission));
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 920,
    minHeight: 680,
    show: Boolean(smokeOutput),
    autoHideMenuBar: true,
    backgroundColor: "#070707",
    icon: path.join(__dirname, "app", process.platform === "win32" ? "sloop-icon.ico" : "sloop-icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true
    }
  });

  configureMidiPermissions();

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      void shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.split(/[?#]/)[0] !== editorUrl) {
      event.preventDefault();
      if (url.startsWith("https://") || url.startsWith("http://")) void shell.openExternal(url);
    }
  });

  mainWindow.once("ready-to-show", () => { if (!smokeOutput) mainWindow.show(); });
  mainWindow.webContents.on("did-finish-load", async () => {
    if (!smokeOutput) return;
    try {
      const result = await mainWindow.webContents.executeJavaScript(`(async () => {
        const access = await navigator.requestMIDIAccess({sysex:true});
        return {title:document.title, secureContext:isSecureContext,
          midiAvailable:typeof navigator.requestMIDIAccess === 'function',
          sysexEnabled:access.sysexEnabled, inputs:[...access.inputs.values()].map(p=>p.name),
          buttons:document.querySelectorAll('button').length,
          nodeExposed:typeof window.require !== 'undefined'};
      })()`);
      fs.writeFileSync(smokeOutput + ".json", JSON.stringify(result,null,2));
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const screenshot = await mainWindow.webContents.capturePage();
        fs.writeFileSync(smokeOutput + ".png", screenshot.toPNG());
      } catch (error) {
        fs.writeFileSync(smokeOutput + "-capture.txt", String(error));
      }
      app.exit(0);
    } catch (error) {
      fs.writeFileSync(smokeOutput + ".json", JSON.stringify({error:String(error)}));
      app.exit(1);
    }
  });
  void mainWindow.loadFile(editorPath, { hash: "sound" });
}

app.whenReady().then(createWindow);

app.on("second-instance", () => {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
