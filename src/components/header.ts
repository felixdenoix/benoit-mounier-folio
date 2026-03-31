import { Piece } from "piecesjs";
import { frameDOM } from "@fiddle-digital/string-tune";

export default class CustomHeader extends Piece {
  // private $tween: gsap.core.Tween | undefined;
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

    this.$projectTitle = this.$("#header-menu-project-title") as HTMLElement;
    this.$menu = this.$("#header-menu-nav") as HTMLElement;
    this.$grid = this.domAttr("grid") as HTMLElement;
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

  // Lifecycle END

  setTransparent({ value, toggle }: { value?: boolean; toggle?: boolean }) {
    if (toggle) {
      this.hide = !this.hide;
    } else if (value !== undefined && value !== this.hide) {
      this.hide = value;
    }
  }

  toggleProjectMode(activate?: boolean) {
    console.log("😸 toggleProjectMode");
    console.log("😸 activate", activate);
    if (activate) {
      this.updateProjectTitleWidth();

      window.addEventListener("resize", this.updateProjectTitleWidth.bind(this));

      frameDOM.mutate(() => {
        this.$grid?.classList.add("project-title");
      });
    } else {
      window.removeEventListener("resize", this.updateProjectTitleWidth);

      frameDOM.mutate(() => {
        this.$grid?.classList.remove("project-title");
      });
    }
  }

  updateProjectTitleWidth() {
    frameDOM.measure(() => {
      console.log("😸 this.$grid", this.$grid);
      console.log("😸 this.$menu", this.$menu);
      const gridWidth = this.$grid?.getBoundingClientRect().width || 0;
      const menuWidth = this.$menu?.getBoundingClientRect().width || 0;

      const projectTitleWidth = gridWidth - menuWidth;

      console.log("😸 projectTitleWidth", projectTitleWidth);

      frameDOM.mutate(() => {
        this.$grid?.style.setProperty("--header-menu-project-title", `${projectTitleWidth}px`);
      });
    });
  }
}

customElements.define("c-header", CustomHeader);
