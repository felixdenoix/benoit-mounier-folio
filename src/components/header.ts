import { Piece } from "piecesjs";

export default class CustomHeader extends Piece {
  // private $tween: gsap.core.Tween | undefined;

  constructor() {
    super("Header", {
      stylesheets: [() => import("../styles/components/header.css")],
    });
  }

  mount() {
    this.setTransparent({ value: this.hide });
  }

  setTransparent({ value, toggle }: { value?: boolean; toggle?: boolean }) {
    if (toggle) {
      this.hide = !this.hide;
    } else if (value !== undefined && value !== this.hide) {
      this.hide = value;
    }
  }

  update() {
    (this.domAttr("header") as HTMLElement)?.classList.toggle("hide", this.hide);
  }

  set hide(hide) {
    this.setAttribute("hide", hide?.toString());
  }

  get hide() {
    return this.getAttribute("hide") === "true";
  }

  // Important to automatically call the update function if attribute is changing
  static get observedAttributes() {
    return ["hide"];
  }
}

customElements.define("c-header", CustomHeader);
