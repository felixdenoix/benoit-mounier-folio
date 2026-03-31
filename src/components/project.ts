import { Piece } from "piecesjs";
import { frameDOM, type ScrollTriggerRule } from "@fiddle-digital/string-tune";

const HEADING_TRIGGER_ID = "project-heading-trigger";

export default class Project extends Piece {
  $projectHeading: HTMLElement | undefined;

  constructor() {
    super("Project");
  }

  mount() {
    this.$projectHeading = this.domAttr("project-heading") as HTMLElement;

    frameDOM.measure(() => {
      const elOffset = this?.$projectHeading?.getBoundingClientRect().top || 0;
      const scrollOffset = window.app.smoothScroll?.scrollPosition || 0;

      const offset = elOffset + scrollOffset;
      console.log("😸 offset", offset);

      const trigger: ScrollTriggerRule = {
        id: HEADING_TRIGGER_ID,
        offset: offset,
        direction: "any",
        onEnter: () => {
          console.log("😸 onEnter");
          this.call("toggleProjectMode", true, "Header");
        },
        onLeave: () => {
          console.log("😸 onLeave");
          this.call("toggleProjectMode", false, "Header");
        },
      };
      window.app.smoothScroll?.addScrollMark(trigger);
    });
  }

  unmount() {
    window.app.smoothScroll?.removeScrollMark(HEADING_TRIGGER_ID);
  }

  handleProjectTitleFlip() {}
}

customElements.define("c-project", Project);
