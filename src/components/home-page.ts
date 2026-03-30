import { type ScrollTriggerRule, frameDOM } from "@fiddle-digital/string-tune";
import { Piece } from "piecesjs";

const MENU_TRIGGER = "homepage-menu-trigger";

export default class HomePage extends Piece {
  public $introSections: HTMLElement[] | undefined;
  public $hiatus: HTMLElement | undefined;

  constructor() {
    super("HomePage");
  }

  mount() {
    this.$introSections = Array.from(this.$("c-home-intro") as NodeList) as HTMLElement[];

    this.$hiatus = this.domAttr("hiatus") as HTMLElement;

    frameDOM.measure(() => {
      const elOffset = this?.$hiatus?.getBoundingClientRect().top || 0;
      const scrollOffset = window.app.smoothScroll?.scrollPosition || 0;
      const trigger: ScrollTriggerRule = {
        id: MENU_TRIGGER,
        offset: elOffset + scrollOffset - 200,
        direction: "any",
        onEnter: () => {
          this.call("setTransparent", { value: false }, "Header");
        },
        onLeave: () => {
          this.call("setTransparent", { value: true }, "Header");
        },
      };
      window.app.smoothScroll?.addScrollMark(trigger);
    });
  }

  unmount() {
    window.app.smoothScroll?.removeScrollMark(MENU_TRIGGER);
  }
}

customElements.define("c-homepage", HomePage);
