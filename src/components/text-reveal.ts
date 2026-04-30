import { Piece } from "piecesjs";
import debounce from "lodash/debounce";

export default class TextReveal extends Piece {
  private $paragraph: HTMLElement | undefined | null;
  private debouncedResizeHandler = debounce(this.handleResize.bind(this), 300);

  constructor() {
    super("TextReveal");
  }

  mount() {
    this.on("resize", window, this.debouncedResizeHandler, { passive: true });

    this.$paragraph = this.$<HTMLElement>("p") as HTMLElement;

    requestAnimationFrame(() => {
      this.handleResize();
    });
  }

  unmount() {
    this.debouncedResizeHandler.flush();
    this.off("resize", window, this.debouncedResizeHandler);
  }

  handleResize() {
    const paragraphHeight = this.$paragraph?.getBoundingClientRect().height;

    if (paragraphHeight) {
      this.style.setProperty("--paragraph-height", `${Math.round(paragraphHeight)}px`);
    }
  }
}

// Register the custom element
customElements.define("c-text-reveal", TextReveal);
