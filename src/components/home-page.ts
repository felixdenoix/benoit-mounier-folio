import { Piece } from "piecesjs";

export default class HomePage extends Piece {
  public $introSections: HTMLElement[] | undefined;
  public $hiatus: HTMLElement | undefined;
  menuObserver: IntersectionObserver | undefined;

  constructor() {
    super("HomePage");
  }

  mount() {
    this.$introSections = Array.from((this.$("c-home-intro") as NodeList) || []) as HTMLElement[];
    this.$hiatus = this.domAttr("hiatus") as HTMLElement;

    this.setupScrollHandlers();

    // Ensure header is always transparent on page mount.
    // this.call("setTransparent", { value: true }, "Header");
  }

  unmount() {
    this.menuObserver?.disconnect();
  }

  setupScrollHandlers() {
    if (this?.$hiatus) {
      this.menuObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const isEnteringScreen = entry.boundingClientRect.top < entry.intersectionRect.bottom;
            const crossedBottom = isEnteringScreen && entry.intersectionRatio > 0;
            const aboveViewport = entry.boundingClientRect.top < 0;

            if (aboveViewport) return;

            if (crossedBottom) {
              this.call("setTransparent", { value: false }, "Header");
            } else {
              this.call("setTransparent", { value: true }, "Header");
            }
          });
        },
        { threshold: [0, 0.1] },
      );

      this.menuObserver.observe(this.$hiatus);
    }
  }

  introAnimation() {
    globalThis.app.gsap.to(window, {
      duration: 2,
      scrollTo: globalThis.app.consts.vh * 100 || window.innerHeight,
      ease: "power3.out",
    });
  }
}

customElements.define("c-homepage", HomePage);
