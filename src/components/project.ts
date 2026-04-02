import { Piece } from "piecesjs";
import { frameDOM, type ScrollTriggerRule } from "@fiddle-digital/string-tune";

const HEADING_TRIGGER_ID = "project-heading-trigger";

export default class Project extends Piece {
  $projectHeading: HTMLElement | undefined;
  headerTriggerSet: boolean = false;

  constructor() {
    super("Project");
  }

  mount() {
    this.$projectHeading = this.domAttr("project-heading") as HTMLElement;
    const heading = this.$projectHeading?.dataset.heading;

    if (heading) {
      frameDOM.measure(() => {
        const { top: elOffset, height: elHeight } =
          this.$projectHeading?.getBoundingClientRect() || {
            top: 0,
            height: 0,
          };
        const scrollOffset = window.app.smoothScroll?.scrollPosition || 0;

        const offset = elOffset + scrollOffset + elHeight / 2;

        const trigger: ScrollTriggerRule = {
          id: HEADING_TRIGGER_ID,
          offset: offset,
          direction: "any",
          onEnter: () => {
            this.call(
              "toggleProjectMode",
              {
                activate: true,
                heading: this.$projectHeading?.dataset.heading,
              },
              "Header",
            );
          },
          onLeave: () => {
            this.call("toggleProjectMode", { activate: false }, "Header");
          },
        };

        window.app.smoothScroll?.addScrollMark(trigger);
        this.headerTriggerSet = true;
      });
    }
  }

  unmount() {
    if (this.headerTriggerSet) {
      window.app.smoothScroll?.removeScrollMark(HEADING_TRIGGER_ID);
    }
  }

  handleProjectTitleFlip() {}
}

customElements.define("c-project", Project);
