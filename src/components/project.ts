import { Piece } from "piecesjs";
import { frameDOM, type ScrollTriggerRule } from "@fiddle-digital/string-tune";
import debounce from "lodash/debounce";

const HEADING_TRIGGER_ID = "project-heading-trigger";
const PROJECT_NAV_TRIGGER_ID = "project-nav-trigger";

export default class Project extends Piece {
  $projectHeading: HTMLElement | undefined;

  $textContentScroller: HTMLElement | undefined;
  $textContentScrollWrapper: HTMLElement | undefined;
  $textContentShadowWrapper: HTMLElement | undefined;
  scrollData = {
    parentDimension: 0,
    childDimension: 0,
    scrollAmountPossible: 0,
    scrollAmount: 0,
    prevPosition: 0,
    currentPosition: 0,
    progress: 0,
    track: false,
  };
  progress: number = 0;
  overflow: boolean = false;
  scrollRaf: number | undefined;

  debouncedResizeCallback = debounce(this.handleResize, 300, {});

  $textContentProjectNav: HTMLElement | undefined;
  $projectAssetContent: HTMLElement | undefined;

  constructor() {
    super("Project");
  }

  mount() {
    this.$projectHeading = this.domAttr("project-heading") as HTMLElement;
    this.$textContentScroller = this.domAttr("text-content-scroller") as HTMLElement;
    this.$textContentScrollWrapper = this.domAttr("text-content-scroll-wrapper") as HTMLElement;
    this.$textContentShadowWrapper = this.domAttr("text-content-shadow-wrapper") as HTMLElement;

    this.$textContentProjectNav = this.domAttr("text-content-project-nav") as HTMLElement;
    this.$projectAssetContent = this.domAttr("asset-content") as HTMLElement;

    this.setupScrollMarks();
    this.initTextContentScrollData();

    if (this.scrollData.track) {
      this.scrollRaf = window.requestAnimationFrame(this.handleTextContentScroll.bind(this));
    }
    window.addEventListener("resize", this.debouncedResizeCallback.bind(this), {
      passive: true,
    });
  }

  unmount() {
    if (this.scrollRaf) {
      window.cancelAnimationFrame(this.scrollRaf);
    }
    globalThis.app.smoothScroll?.removeScrollMark(HEADING_TRIGGER_ID);
    globalThis.app.smoothScroll?.removeScrollMark(PROJECT_NAV_TRIGGER_ID);
    window.removeEventListener("resize", this.debouncedResizeCallback);
  }

  handleResize() {
    this.initTextContentScrollData();

    globalThis.app.smoothScroll?.removeScrollMark(HEADING_TRIGGER_ID);
    globalThis.app.smoothScroll?.removeScrollMark(PROJECT_NAV_TRIGGER_ID);

    this.setupScrollMarks();
  }

  setupScrollMarks() {
    const heading = this.$projectHeading?.dataset.heading;
    if (heading) {
      frameDOM.measure(() => {
        const { top: elOffset, height: elHeight } = this.$projectHeading?.getBoundingClientRect() || {
          top: 0,
          height: 0,
        };
        const scrollOffset = globalThis.app.smoothScroll?.scrollPosition || 0;

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

        globalThis.app.smoothScroll?.addScrollMark(trigger);
      });
    }

    if (this.$textContentProjectNav) {
      frameDOM.measure(() => {
        const { height } = this.$projectAssetContent?.getBoundingClientRect() || {
          height: 0,
        };

        const topOffset = this.$projectAssetContent?.offsetTop || 0;
        const windowHeight = globalThis.app.consts.innerHeight || 0;

        const offset = height + topOffset - windowHeight;

        const trigger: ScrollTriggerRule = {
          id: PROJECT_NAV_TRIGGER_ID,
          offset: offset,
          direction: "any",
          onEnter: () => {
            this.$textContentProjectNav?.classList?.toggle("bottom-reached", true);
          },
          onLeave: () => {
            this.$textContentProjectNav?.classList?.toggle("bottom-reached", false);
          },
        };

        globalThis.app.smoothScroll?.addScrollMark(trigger);
      });
    }
  }

  initTextContentScrollData() {
    this.scrollData.childDimension = this.$textContentScroller?.clientHeight || 0;
    this.scrollData.parentDimension = this.$textContentScrollWrapper?.clientHeight || 0;

    if (this.scrollData.childDimension > this.scrollData.parentDimension) {
      this.overflow = true;
      this.scrollData.track = true;
      this.scrollData.scrollAmountPossible = this.scrollData.childDimension - this.scrollData.parentDimension;
    } else {
      this.scrollData.track = false;
      this.overflow = false;
    }

    frameDOM.mutate(() => {
      this.$textContentShadowWrapper?.classList.toggle("overflowing", this.overflow);
    });
  }

  handleTextContentScroll(_timestamp: number) {
    frameDOM.measure(() => {
      this.scrollData.prevPosition = this.scrollData.scrollAmount || 0;
      this.scrollData.currentPosition = this.$textContentScrollWrapper?.scrollTop || 0;

      this.scrollData.progress =
        Math.round((this.scrollData.currentPosition / this.scrollData.scrollAmountPossible + Number.EPSILON) * 1000) /
        1000;

      frameDOM.mutate(() => {
        this.$textContentShadowWrapper?.style.setProperty("--css-progress", this.scrollData.progress.toString());
        // cssProgress = ease.value(this.scrollData.progress);
      });
    });

    window?.requestAnimationFrame(this.handleTextContentScroll.bind(this));
  }
}

customElements.define("c-project", Project);
