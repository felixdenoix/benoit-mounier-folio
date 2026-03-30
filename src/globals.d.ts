import App from "./app";
import gsap from "gsap";

declare global {
  interface Window {
    app: App;
  }

  let gsap: typeof gsap;
}

export {};
