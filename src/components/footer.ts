import { Piece } from "piecesjs";

export default class CustomFooter extends Piece {
  public $navigation: HTMLElement | undefined;
  public $showNavigation: boolean = true;
  public $logo: HTMLElement | undefined;
  public $showLogo: boolean = true;

  constructor() {
    super("Footer");
  }

  mount() {
    this.$navigation = this.$("nav") as HTMLElement;

    // globalThis.app.smoothScroll?.on("object:progress:footer", this.scrollProgress);
  }

  unmount() {
    // globalThis.app.smoothScroll?.off("object:progress:footer", this.scrollProgress);
  }

  // scrollProgress(e: any) {
  // console.log("😸 scrollProgress", e);
  // }
}

customElements.define("c-footer", CustomFooter);
