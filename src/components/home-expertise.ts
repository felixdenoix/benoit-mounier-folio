import { Piece } from "piecesjs";
import debounce from "lodash/debounce";
import { frameDOM } from "@fiddle-digital/string-tune";
import { createThresholdArray, getIntersectionProgress } from "../utils";

export default class HomeExpertise extends Piece {
  private $expertises: HTMLAnchorElement[] | undefined;
  private $handledExpertises: {
    [id: string]: {
      el?: HTMLAnchorElement;
      bcr?: DOMRect;
      assets?: HTMLElement[];
      activeAssetIndex?: number | undefined;
    };
  } = {};
  private $mobileHandledExpertises: {
    [id: string]: {
      el?: HTMLAnchorElement;
      observer?: IntersectionObserver;
      assets?: HTMLElement[];
      assetsWrapper?: HTMLElement;
      activeAssetIndex?: number | undefined;
    };
  } = {};

  private mobileObserver: IntersectionObserver | undefined;
  private debouncedHandleScroll = debounce(this.handleExpertisesScroll.bind(this), 200);
  private debouncedMobileResizeHandler = debounce(this.mobileIntersectionObserverSetup.bind(this), 200);

  constructor() {
    super("HomeExpertise");
  }

  mount() {
    this.$expertises = Array.from((this.domAttr("expertise") as NodeList) || []) as HTMLAnchorElement[];

    frameDOM.measure(() => {
      const media = window.matchMedia("min-width>768px");
      if (media.matches) {
        this.desktopSetup();
      } else {
        this.mobileSetup();
      }
    });
  }

  unmount() {
    Object.values(this.$handledExpertises).forEach((expertise) => {
      expertise.el?.removeEventListener("mousemove", this.handleMouseMove);
      expertise.el?.removeEventListener("mouseleave", this.handleMouseLeave);
    });

    document.removeEventListener("scroll", this.debouncedHandleScroll);
    this.debouncedHandleScroll?.cancel();

    window.addEventListener("resize", this.debouncedMobileResizeHandler);
    this.debouncedMobileResizeHandler?.cancel();

    this.mobileObserver?.disconnect();
  }

  mobileSetup() {
    console.log("😸 mobileSetup");

    const experienceMobileMedias = Array.from(this.domAttr("experience-mobile-media") as NodeList) as HTMLElement[];

    experienceMobileMedias.map((el) => {
      const expertiseId = el.dataset.expertiseId;

      if (expertiseId && this.$mobileHandledExpertises?.[expertiseId]) {
        this.$mobileHandledExpertises[expertiseId].assetsWrapper = el;
        this.$mobileHandledExpertises[expertiseId].assets = Array.from(el.querySelectorAll("img")) as HTMLElement[];
      } else if (expertiseId) {
        this.$mobileHandledExpertises[expertiseId] = {
          assetsWrapper: el,
          assets: Array.from(el.querySelectorAll("img")) as HTMLElement[],
        };
      }
    });

    this.mobileIntersectionObserverSetup();

    window.addEventListener("resize", this.debouncedMobileResizeHandler);
  }

  mobileIntersectionHandler(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      const expertiseId = (entry.target as HTMLElement)?.dataset?.expertiseId;

      if (expertiseId && this.$mobileHandledExpertises?.[expertiseId]) {
        const expertise = this.$mobileHandledExpertises[expertiseId];
        const assetsWrapper = expertise.assetsWrapper;
        const assets = expertise.assets;

        const expertiseProjectsCount = expertise.el?.dataset.projectsCount
          ? parseInt(expertise.el?.dataset.projectsCount)
          : 0;

        if (assetsWrapper && entry.intersectionRatio > 0.6) {
          assetsWrapper.style.opacity = ".6";

          if (expertiseProjectsCount > 1 && assets) {
            const entryProgress = getIntersectionProgress(entry);

            const newActiveProjectIndex = Math.floor(entryProgress * expertiseProjectsCount);

            if (newActiveProjectIndex !== expertise.activeAssetIndex) {
              assets[newActiveProjectIndex].style.opacity = "1";

              if (expertise.activeAssetIndex !== undefined && assets[expertise.activeAssetIndex]) {
                assets[expertise.activeAssetIndex].style.opacity = "0";
              }

              expertise.activeAssetIndex = newActiveProjectIndex;
            }
          }
        } else if (assetsWrapper) {
          assetsWrapper.style.opacity = "0";
          if (expertiseProjectsCount > 1) {
            assets?.forEach((el) => {
              el.style.opacity = "0";
              expertise.activeAssetIndex = 0;
            });
          }
        }
      }
    });
  }

  mobileIntersectionObserverSetup() {
    this.mobileObserver?.disconnect();

    // get first Cta dimentions as they all got same size
    const ctaClientRectHeight = this.$expertises?.[0]?.getBoundingClientRect()?.height || 50;

    const viewportHeight = globalThis.app.consts.innerHeight;

    const intersectionObserverYMargin = Math.round((viewportHeight - ctaClientRectHeight * 2) / 2);

    this.mobileObserver = new IntersectionObserver(this.mobileIntersectionHandler.bind(this), {
      threshold: createThresholdArray(40),
      rootMargin: `-${intersectionObserverYMargin}px 0px -${intersectionObserverYMargin}px 0px`,
    });

    this.$expertises?.forEach((expertise) => {
      const expertiseId = expertise.dataset.expertiseId;

      if (expertiseId && this.$mobileHandledExpertises[expertiseId]) {
        this.$mobileHandledExpertises[expertiseId].el = expertise;
      } else if (expertiseId) {
        this.$mobileHandledExpertises[expertiseId] = { el: expertise };
      }

      this.mobileObserver?.observe(expertise);
    });
  }

  desktopSetup() {
    let elNeedsWatching = false;

    this.$expertises?.forEach((el) => {
      const id = el.dataset.expertiseId;

      if (!id) return;

      const projectsCount = el.dataset.projectsCount ? parseInt(el.dataset.projectsCount) : 0;

      if (projectsCount > 1) {
        elNeedsWatching = true;

        const assets = Array.from(el.querySelectorAll("img"));

        this.$handledExpertises[id] = {
          el: el,
          assets: assets,
        };
        el.addEventListener("mousemove", this.handleMouseMove.bind(this), { passive: true });
        el.addEventListener("mouseleave", this.handleMouseLeave.bind(this), { passive: true });
      }
    });

    if (elNeedsWatching) {
      this.handleExpertisesScroll();
      document.addEventListener("scroll", this.debouncedHandleScroll, { passive: true });
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (
      e.target instanceof HTMLAnchorElement &&
      e.target?.dataset?.expertiseId &&
      e.target?.dataset?.expertiseId in this.$handledExpertises
    ) {
      const id = e.target?.dataset?.expertiseId as string;
      const projects = e.target?.dataset.expertiseProjects as string;

      const expertise = this.$handledExpertises[id];

      const rect = expertise?.bcr;
      const assets = expertise?.assets;

      if (!rect || !assets) return;

      const relativeX = Math.round(e.clientX - rect.left);
      const progressX = relativeX / Math.round(rect.width);

      const elIndex = Math.floor(progressX * assets.length);

      frameDOM.mutate(() => {
        if (expertise.activeAssetIndex !== undefined && expertise.activeAssetIndex !== elIndex) {
          assets[expertise.activeAssetIndex].classList.toggle("scale-99!", true);
          assets[expertise.activeAssetIndex].classList.toggle("opacity-0", true);

          if (projects) {
            const parsedProjects = JSON.parse(projects);
            const projectUrl = parsedProjects[elIndex].url;
            if (projectUrl) {
              (e.target as HTMLAnchorElement).href = projectUrl;
            }
          }
        }

        if (elIndex > -1 && elIndex !== expertise.activeAssetIndex && elIndex < assets.length) {
          assets[elIndex].classList.toggle("opacity-0", false);
          assets[elIndex].classList.toggle("scale-99!", false);
          expertise.activeAssetIndex = elIndex;
        }
      });
    }
  }

  handleMouseLeave(e: Event) {
    if (
      e.target instanceof HTMLAnchorElement &&
      e.target?.dataset?.expertiseId &&
      e.target?.dataset?.expertiseId in this.$handledExpertises
    ) {
      const id = e.target?.dataset?.expertiseId as string;
      const expertise = this.$handledExpertises[id];
      const assets = expertise.assets;
      const activeAssetIndex = expertise.activeAssetIndex;

      if (activeAssetIndex !== undefined && assets) {
        assets[activeAssetIndex].classList.toggle("opacity-0", true);
        expertise.activeAssetIndex = undefined;
      }
    }
  }

  handleExpertisesScroll() {
    frameDOM.measure(() => {
      Object.entries(this.$handledExpertises).forEach(([id, expertise]) => {
        const boundingRect = expertise.el?.getBoundingClientRect();
        if (this.$handledExpertises[id]) {
          this.$handledExpertises[id].bcr = boundingRect;
        }
      });
    });
  }
}

customElements.define("c-home-expertise", HomeExpertise);
