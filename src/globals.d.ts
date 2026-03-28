import App from "./app";

declare global {
  interface Window {
    app: App;
  }
}

export {};
