import App from "./app";

const appInstance = new App();

// Ensure page always starts at top.
globalThis.window.scroll({ top: 0, left: 0, behavior: "instant" });

globalThis.app = appInstance;

globalThis.app.init();
