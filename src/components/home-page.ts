import { type ScrollTriggerRule, frameDOM } from "@fiddle-digital/string-tune";
import { Piece } from "piecesjs";
import debounce from "lodash/debounce";

const MENU_TRIGGER = "homepage-menu-trigger";

export default class HomePage extends Piece {
  public $introSections: HTMLElement[] | undefined;
  public $hiatus: HTMLElement | undefined;
  private debouncedSetupScrollHandlers = debounce(() => this.setupScrollHandlers(), 420, { maxWait: 850 });

  constructor() {
    super("HomePage");
  }

  mount() {
    this.$introSections = Array.from(this.$("c-home-intro") as NodeList) as HTMLElement[];
    this.$hiatus = this.domAttr("hiatus") as HTMLElement;

    this.setupScrollHandlers();

    window.addEventListener("resize", this.debouncedSetupScrollHandlers);

    // Ensure header is always transparent on page mount.
    this.call("setTransparent", { value: true }, "Header");
  }

  unmount() {
    globalThis.app.smoothScroll?.removeScrollMark(MENU_TRIGGER);

    window.removeEventListener("resize", this.debouncedSetupScrollHandlers);
    this.debouncedSetupScrollHandlers.cancel();
  }

  setupScrollHandlers() {
    frameDOM.measure(() => {
      globalThis.app.smoothScroll?.removeScrollMark(MENU_TRIGGER);

      const elOffset = this?.$hiatus?.offsetTop || 0;

      const offset = elOffset - globalThis.app.consts.innerHeight; // start on the last slide of the intro

      const trigger: ScrollTriggerRule = {
        id: MENU_TRIGGER,
        offset: offset,
        direction: "any",
        onEnter: () => {
          this.call("setTransparent", { value: false }, "Header");
        },
        onLeave: () => {
          this.call("setTransparent", { value: true }, "Header");
        },
      };

      globalThis.app.smoothScroll?.addScrollMark(trigger);
    });
  }

  introAnimation() {
    globalThis.app.smoothScroll?.scrollTo(window.innerHeight);
  }
}

customElements.define("c-homepage", HomePage);
