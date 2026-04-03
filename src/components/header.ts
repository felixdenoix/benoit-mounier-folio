import { Piece } from "piecesjs";
import { frameDOM } from "@fiddle-digital/string-tune";

export default class CustomHeader extends Piece {
  // private $tween: gsap.core.Tween | undefined;
  $projectTitleSlot: HTMLElement | undefined;
  $projectTitle: HTMLElement | undefined;
  $menu: HTMLElement | undefined;
  $grid: HTMLElement | undefined;

  constructor() {
    super("Header", {
      stylesheets: [() => import("../styles/components/header.css")],
    });
  }

  mount() {
    this.setTransparent({ value: this.hide });

    frameDOM.measure(() => {
      this.$projectTitleSlot = this.$("#header-menu-project-title") as HTMLElement;
      this.$projectTitle = this.domAttr("project-title") as HTMLElement;
      this.$menu = this.$("#header-menu-nav") as HTMLElement;
      this.$grid = this.domAttr("grid") as HTMLElement;
    });
  }

  // lifecycle method
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

  // Lifecycle END

  setTransparent({ value, toggle }: { value?: boolean; toggle?: boolean }) {
    console.log("😸 set transparent", value, toggle);
    if (toggle) {
      this.hide = !this.hide;
    } else if (value !== undefined && value !== this.hide) {
      this.hide = value;
    }
  }

  toggleProjectMode(params: { activate?: boolean; heading?: string }) {
    console.log("😸 toggleProjectMode");
    console.log("😸 activate", params.activate);

    if (params.activate && params.heading && this.$projectTitle) {
      frameDOM.mutate(() => {
        this.$projectTitle!.innerHTML = params.heading as string;
      });

      this.updateProjectTitleWidth();

      window.addEventListener("resize", this.updateProjectTitleWidth.bind(this));

      frameDOM.mutate(() => {
        this.$grid?.classList.add("project-title");
      });
    } else {
      window.removeEventListener("resize", this.updateProjectTitleWidth);

      frameDOM.mutate(() => {
        this.$grid?.classList.remove("project-title");
        // setTimeout(() => this)
      });
    }
  }

  updateProjectTitleWidth() {
    frameDOM.measure(() => {
      const gridWidth = this.$grid?.getBoundingClientRect().width || 0;
      const menuWidth = this.$menu?.getBoundingClientRect().width || 0;

      // value from browser migth have units appened
      const gridGutterWidth = window.app.rootStyles
        ?.getPropertyValue("--grid-padding")
        ?.match(/^\d+/gm)?.[0];

      const GRID_GUTTER_WIDTH = gridGutterWidth ? parseFloat(gridGutterWidth) : 10;
      // grid padding is same as grid gutter
      const GRID_PADDING = GRID_GUTTER_WIDTH;

      const projectTitleWidth = gridWidth - menuWidth - 2 * GRID_PADDING;

      frameDOM.mutate(() => {
        this.$grid?.style.setProperty(
          "--header-menu-project-title-width",
          `${projectTitleWidth}px`,
        );
      });
    });
  }
}

customElements.define("c-header", CustomHeader);
