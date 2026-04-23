import { Piece } from "piecesjs";
import { frameDOM } from "@fiddle-digital/string-tune";
import debounce from "lodash/debounce";

export default class Project extends Piece {
  $projectHeading: HTMLElement | undefined;

  $textContentScroller: HTMLElement | undefined;
  $textContentScrollWrapper: HTMLElement | undefined;
  $textContentShadowWrapper: HTMLElement | undefined;
  headingObserver: IntersectionObserver | undefined;
  navObserver: IntersectionObserver | undefined;
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

  debouncedResizeCallback = debounce(() => this.handleResize(), 300, {});

  $textContentProjectNav: HTMLElement | undefined;
  $projectAssetContent: HTMLElement | undefined;
  $bottomNav: HTMLElement | undefined;

  constructor() {
    super("Project");
  }

  mount() {
    this.$projectHeading = this.domAttr("project-heading") as HTMLElement;
    this.$textContentScroller = this.domAttr("text-content-scroller") as HTMLElement;
    this.$textContentScrollWrapper = this.domAttr("text-content-scroll-wrapper") as HTMLElement;
    this.$textContentShadowWrapper = this.domAttr("text-content-shadow-wrapper") as HTMLElement;

    this.$textContentProjectNav = this.domAttr("text-content-project-nav") as HTMLElement;
    this.$bottomNav = this.domAttr("bottom-nav") as HTMLElement;
    this.$projectAssetContent = this.domAttr("asset-content") as HTMLElement;

    this.setupScrollMarks();
    this.initTextContentScrollData();

    if (this.scrollData.track) {
      this.scrollRaf = window.requestAnimationFrame((t) => this.handleTextContentScroll(t));
    }

    requestAnimationFrame(() => {
      window.addEventListener("resize", this.debouncedResizeCallback, {
        passive: true,
      });
    });
  }

  unmount() {
    if (this.scrollRaf) {
      window.cancelAnimationFrame(this.scrollRaf);
    }
    this.headingObserver?.disconnect();
    this.navObserver?.disconnect();
    window.removeEventListener("resize", this.debouncedResizeCallback);
  }

  handleResize() {
    this.initTextContentScrollData();
  }

  setupScrollMarks() {
    const heading = this.$projectHeading?.dataset.heading;
    if (heading && this.$projectHeading) {
      this.headingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // If the element is scrolling off the top of the screen (boundingClientRect.top < 0)
            // and it is less than 50% visible (or completely invisible)
            const isLeavingTop = entry.boundingClientRect.top < 0;
            const crossedMiddle = isLeavingTop && entry.intersectionRatio <= 0.5;

            if (crossedMiddle) {
              this.call("toggleProjectMode", { activate: true, heading }, "Header");
            } else {
              this.call("toggleProjectMode", { activate: false }, "Header");
            }
          });
        },
        { threshold: [0, 0.5] },
      );

      this.headingObserver.observe(this.$projectHeading);
    }

    if (this.$textContentProjectNav && this.$bottomNav) {
      this.navObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.$textContentProjectNav?.classList.toggle("bottom-reached", true);
            } else {
              this.$textContentProjectNav?.classList.toggle("bottom-reached", false);
            }
          });
        },
        { rootMargin: "0px 0px 0px 0px", threshold: 0 },
      );

      this.navObserver.observe(this.$bottomNav);
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

    this.scrollRaf = window?.requestAnimationFrame((t) => this.handleTextContentScroll(t));
  }
}

customElements.define("c-project", Project);
