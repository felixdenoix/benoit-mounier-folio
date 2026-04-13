import App from "./app";
import gsap from "gsap";

export {};

declare global {
  interface Window {
    app: App;
  }

  var app: App;
  var gsap: typeof gsap;
}
