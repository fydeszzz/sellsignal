// Preload bridge. Runs before the renderer with contextIsolation on, so the
// renderer never touches Node/Electron internals directly — it only sees the
// minimal, frozen `window.electronAPI` surface defined here.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Fetch JSON natively in the main process (no CORS, MIS Referer injected).
  // Returns the parsed JSON, or rejects on network / parse error.
  fetchJson: (url) => ipcRenderer.invoke('fetch-json', url),
});
