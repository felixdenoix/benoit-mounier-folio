import App from "./app";

const appInstance = new App();

globalThis.app = appInstance;

globalThis.app.init();
