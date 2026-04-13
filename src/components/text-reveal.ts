import { Piece } from "piecesjs";

export default class TextReveal extends Piece {
  private $paragraph: HTMLElement | undefined | null;

  constructor() {
    super("TextReveal");
  }

  mount() {
    this.on("resize", window, this.handleResize);

    this.$paragraph = this.$<HTMLElement>("p") as HTMLElement;

    requestAnimationFrame(() => {
      this.handleResize();
    });
  }

  unmount() {
    this.off("resize", window, this.handleResize);
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
