const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().size;
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
    width,
    height,
    kiosk: true,
    resizable: true,
  });
  mainWindow.loadFile("src/index.html");
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
