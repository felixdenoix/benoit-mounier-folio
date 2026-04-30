import { Piece } from "piecesjs";
import { frameDOM } from "@fiddle-digital/string-tune";
import throttle from "lodash/throttle";

export default class CustomHeader extends Piece {
  // private $tween: gsap.core.Tween | undefined;
  $projectTitleSlot: HTMLElement | undefined;
  $projectTitle: HTMLElement | undefined;
  $menu: HTMLElement | undefined;
  $grid: HTMLElement | undefined;
  $header: HTMLElement | undefined;

  immediateTransform: boolean = false;
  throttlededUpdateProjectTitleWidth = throttle((e) => this.updateProjectTitleWidth(e), 200);

  constructor() {
    super("Header");
  }

  mount() {
    this.setTransparent({ value: this.hide });

    this.$projectTitleSlot = this.$("#header-menu-project-title") as HTMLElement;
    this.$projectTitle = this.domAttr("project-title") as HTMLElement;
    this.$menu = this.$("#header-menu-nav") as HTMLElement;
    this.$grid = this.domAttr("grid") as HTMLElement;
    this.$header = this.domAttr("header") as HTMLElement;
  }

  unmount(update?: boolean): void {
    this.throttlededUpdateProjectTitleWidth.flush();
    this.off("resize", window, this.throttlededUpdateProjectTitleWidth);
  }

  // lifecycle method
  update() {
    if (this.$header) {
      frameDOM.mutate(() => {
        this.$header!.classList.toggle("duration-[unset]", this.immediateTransform);
        this.$header!.classList.toggle("hide", this.hide);
      });
    }
  }

  set hide(hide) {
    this.setAttribute("hide", hide?.toString());
  }

  get hide() {
    return this?.getAttribute("hide") === "true";
  }

  // Important to automatically call the update function if attribute is changing
  static get observedAttributes() {
    return ["hide"];
  }

  // Lifecycle END

  setTransparent({ value, toggle, immediate }: { value?: boolean; toggle?: boolean; immediate?: boolean }) {
    this.immediateTransform = immediate ?? false;
    if (toggle) {
      this.hide = !this.hide;
    } else if (value !== undefined && value !== this.hide) {
      this.hide = value;
    }
  }

  toggleProjectMode(params: { activate?: boolean; heading?: string; callback?: () => void }) {
    if (params.activate && params.heading && this.$projectTitle) {
      frameDOM.mutate(() => {
        this.$projectTitle!.innerHTML = params.heading as string;
      });

      this.updateProjectTitleWidth();

      this.on("resize", window, this.throttlededUpdateProjectTitleWidth, { passive: true });

      frameDOM.mutate(() => {
        this.$grid?.classList.add("project-title");
      });
    } else {
      this.off("resize", window, this.throttlededUpdateProjectTitleWidth);

      frameDOM.mutate(() => {
        this.$grid?.classList.remove("project-title");
      });
    }

    if (params.callback) {
      params.callback();
    }
  }

  updateProjectTitleWidth(_e?: Event) {
    frameDOM.measure(() => {
      const gridWidth = this.$grid?.getBoundingClientRect().width || 0;
      const menuWidth = this.$menu?.getBoundingClientRect().width || 0;

      // value from browser migth have units appened
      const gridGutterWidth = globalThis.app.rootStyles?.getPropertyValue("--grid-padding")?.match(/^\d+/gm)?.[0];

      const GRID_GUTTER_WIDTH = gridGutterWidth ? parseFloat(gridGutterWidth) : 10;
      // grid padding is same as grid gutter
      const GRID_PADDING = GRID_GUTTER_WIDTH;

      // 2 for the grid padding + 1 for gutter between the project title and the nav
      const projectTitleWidth = gridWidth - menuWidth - 3 * GRID_PADDING;

      frameDOM.mutate(() => {
        this.$grid?.style.setProperty("--header-menu-project-title-width", `${projectTitleWidth}px`);
      });
    });
  }

  resetPosition(options: { callback: () => void } = { callback: () => {} }) {
    if (this.$header) {
      globalThis.app.gsap.to(this.$header, {
        duration: 0.35,
        "--progress": 0,
        onComplete: options.callback,
      });
    }
  }
}

customElements.define("c-header", CustomHeader);
