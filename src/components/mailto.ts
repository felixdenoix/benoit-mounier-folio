import { Piece } from "piecesjs";

export default class Mailto extends Piece {
  public $link: HTMLLinkElement | undefined;
  public $success: HTMLSpanElement | undefined;
  private $clipboardFallback: boolean = false;

  constructor() {
    super("MailTo");
  }

  mount() {
    // this.$link = this.$("a") as HTMLLinkElement;

    this.insertAdjacentHTML(
      "beforeend",
      `<span class="success block col-start-1 row-start-1 text-inherit opacity-0 bg-inherit w-fit text-center pointer-events-none font-[number:inherit] whitespace-nowrap">adresse copiée</span>`,
    );

    this.$link = this.$("a[href]") as HTMLLinkElement;
    this.$success = this.$(".success") as HTMLSpanElement;

    // this.on("click", this.$link, this.handleClick);
  }

  async handleClick(e: Event) {
    try {
      if (!this.$clipboardFallback && this.$link) {
        e.preventDefault();
        const target = e.target as HTMLLinkElement;
        const mailto = target?.href as string;

        const [, mail] = mailto.split(":");

        await navigator.clipboard.writeText(mail);
        const tl = globalThis.gsap
          .timeline({ paused: true })
          .to(this.$link, {
            autoAlpha: 0,
            duration: 0.5,
          })
          .to(this.$success!, { autoAlpha: 1, duration: 0.5 })
          .to(this.$success!, { autoAlpha: 0, duration: 0.5, delay: 3 })
          .to(this.$link, {
            autoAlpha: 1,
            duration: 0.5,
          });

        tl.play();
      }
    } catch (error) {
      console.error("Error writing to clipboard:", error);

      if (!this.$clipboardFallback) {
        this.$clipboardFallback = true;
        e.currentTarget?.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: false,
            view: window,
          }),
        );
      }
    }
  }
}

customElements.define("c-mailto", Mailto);
