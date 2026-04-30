import { Piece } from "piecesjs";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { frameDOM } from "@fiddle-digital/string-tune";
import { createThresholdArray, getIntersectionProgress } from "../utils";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ExpertiseData {
  el: HTMLAnchorElement;
  projects: any[];
  projectsCount: number;
  mobileMediaGroup: HTMLElement | null;
  mobileAssets: HTMLElement[];
  desktopMediaGroup: HTMLElement | null;
  desktopAssets: HTMLElement[];
  activeAssetIndex?: number;
  bcr?: DOMRect;
}

export default class HomeExpertise extends Piece {
  private $expertiseEls: HTMLAnchorElement[] = [];
  private expertises: Map<string, ExpertiseData> = new Map();
  private observer: IntersectionObserver | undefined;
  private activeId: string | null = null;
  private isDesktop: boolean = false;
  private previousIsDesktop: boolean = false;

  private debouncedResize = debounce(() => this.setup(), 200);
  private throttledMouseMove = throttle((e) => this.onMouseMove(e), 200, { leading: true });

  private desktopScrollTrigger: ScrollTrigger | undefined;
  private expertiseTimeline: gsap.core.Timeline | undefined;

  constructor() {
    super("HomeExpertise");
  }

  mount() {
    frameDOM.measure(() => {
      this.previousIsDesktop = this.isDesktop;
      this.isDesktop = window.matchMedia("(min-width: 768px)").matches;

      this.init();
      this.setup(false);

      if (this.isDesktop) {
        this.desktopInviewAnimation();
      }
    });
    this.on("resize", window, this.debouncedResize);
  }

  unmount() {
    this.off("resize", window, this.debouncedResize);
    this.observer?.disconnect();
    this.expertises.forEach((exp) => {
      if (this.throttledMouseMove) {
        exp.el.removeEventListener("mousemove", this.throttledMouseMove);
      }
      exp.el.removeEventListener("mouseleave", this.onMouseLeave);
    });

    this.expertiseTimeline?.kill();
  }

  private init() {
    this.$expertiseEls = Array.from((this.domAttr("expertise") as NodeList) || []) as HTMLAnchorElement[];

    const mobileGroups = Array.from((this.domAttr("media-group") as NodeList) || []) as HTMLElement[];
    const desktopGroups = Array.from((this.domAttr("desktop-media-group") as NodeList) || []) as HTMLElement[];

    const mobileMap = new Map(mobileGroups.map((mg) => [mg.dataset.expertiseId, mg]));
    const desktopMap = new Map(desktopGroups.map((dg) => [dg.dataset.expertiseId, dg]));

    this.$expertiseEls.forEach((el) => {
      const id = el.dataset.expertiseId;
      if (!id) return;

      const projectsRaw = el.dataset.expertiseProjects;
      const projects = projectsRaw ? JSON.parse(projectsRaw) : [];
      const projectsCount = el.dataset.projectsCount ? parseInt(el.dataset.projectsCount) : 0;

      const expertise: ExpertiseData = {
        el,
        projects,
        projectsCount,
        mobileMediaGroup: null,
        mobileAssets: [],
        desktopMediaGroup: null,
        desktopAssets: [],
      };

      if (!this.isDesktop) {
        const mobileMediaGroup = mobileMap.get(id) || null;
        const mobileAssets = mobileMediaGroup ? Array.from(mobileMediaGroup.querySelectorAll("img")) : [];

        expertise.mobileMediaGroup = mobileMediaGroup;
        expertise.mobileAssets = mobileAssets;
      } else {
        const desktopMediaGroup = desktopMap.get(id) || null;
        const desktopAssets = desktopMediaGroup ? Array.from(desktopMediaGroup.querySelectorAll("img")) : [];

        expertise.desktopMediaGroup = desktopMediaGroup;
        expertise.desktopAssets = desktopAssets;
        expertise.activeAssetIndex = 0;
      }

      this.expertises.set(id, expertise);
    });
  }

  private setup(deviceCheck: boolean = true) {
    if (deviceCheck) {
      this.previousIsDesktop = this.isDesktop;
      this.isDesktop = window.matchMedia("(min-width: 768px)").matches;
    }

    const modeChanged = this.isDesktop !== this.previousIsDesktop;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    if (!this.isDesktop) {
      this.setupObserver();
    }

    this.expertises.forEach((data, id) => {
      const elProjectsCount = data.projectsCount;

      if (elProjectsCount > 1 && this.previousIsDesktop && !this.isDesktop) {
        data.el.removeEventListener("mousemove", this.throttledMouseMove);
        data.el.removeEventListener("mouseleave", this.onMouseLeave);
      }

      if (this.isDesktop) {
        if (elProjectsCount > 1) {
          data.el.addEventListener("mousemove", this.throttledMouseMove);
          data.el.addEventListener("mouseleave", this.onMouseLeave);
          data.bcr = data.el.getBoundingClientRect();
        }
      } else {
        this.observer?.observe(data.el);
      }

      // If we switched between desktop/mobile, force an update of the new active set
      if (modeChanged && data.activeAssetIndex !== undefined) {
        this.updateAsset(id, data.activeAssetIndex, true);
      }
    });
  }

  private setupObserver() {
    if (this.observer) return;

    // Estimate margin based on first element
    const firstExp = this.expertises.values().next().value;
    const ctaHeight = firstExp?.el.getBoundingClientRect().height || 50;
    const viewportHeight = window.innerHeight;
    const margin = Math.round((viewportHeight - ctaHeight) / 2);

    this.observer = new IntersectionObserver(
      (entries) => {
        if (this.isDesktop) return;
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.expertiseId;
          if (!id) return;

          if (entry.intersectionRatio > 0.6) {
            const data = this.expertises.get(id);
            if (data) {
              if (data.projectsCount > 1) {
                const progress = getIntersectionProgress(entry);
                this.setActiveExpertise(id, progress);
              } else if (this.activeId !== id) {
                this.setActiveExpertise(id, 0);
              }
            }
          } else if (this.activeId === id) {
            this.setActiveExpertise(null);
          }
        });
      },
      {
        threshold: createThresholdArray(15),
        rootMargin: `-${margin}px 0px -${margin}px 0px`,
      },
    );
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDesktop) return;

    const id = (e.currentTarget as HTMLAnchorElement)?.dataset.expertiseId;
    requestAnimationFrame(() => {
      const data = id ? this.expertises.get(id) : null;

      if (data && data.bcr) {
        const progress = (e.clientX - data.bcr.left) / data.bcr.width;
        this.setActiveExpertise(id!, progress);
      }
    });
  };

  private onMouseLeave = () => {
    if (!this.isDesktop) return;
    if (this.throttledMouseMove) this.throttledMouseMove.cancel();
    this.setActiveExpertise(null);
  };

  private setActiveExpertise(id: string | null, progress: number = 0) {
    if (this.activeId !== id) {
      // Only toggle visibility via JS on mobile
      if (!this.isDesktop) {
        if (this.activeId) this.toggleExpertise(this.activeId, false);
        if (id) this.toggleExpertise(id, true);
      }
      this.activeId = id;
    }

    if (id) {
      const data = this.expertises.get(id);
      if (data && data.projectsCount > 1) {
        const assetIndex = Math.floor(Math.min(progress, 0.99) * data.projectsCount);
        this.updateAsset(id, assetIndex);
      }
    }
  }

  // Only in use for mobile client as desktop is using hover
  private toggleExpertise(id: string, active: boolean) {
    const data = this.expertises.get(id);
    if (!data) return;

    frameDOM.mutate(() => {
      data.el.classList.toggle("text-white", active);

      if (!this.isDesktop && data.mobileMediaGroup) {
        data.mobileMediaGroup.classList.toggle("opacity-100!", active);
        data.mobileMediaGroup.classList.toggle("scale-101!", active);
        // // both classes are inlined by tailwind in index.js
        // data.mobileMediaGroup.classList.toggle("opacity-0", !active);
        // data.mobileMediaGroup.classList.toggle("scale-99", !active);
      }

      // Default to first asset if becoming active and there are multiple projects
      if (active && data.activeAssetIndex === undefined && data.projectsCount > 1) {
        this.updateAsset(id, 0);
      }
    });
  }

  private updateAsset(id: string, index: number, force: boolean = false) {
    const data = this.expertises.get(id);
    if (!data || (!force && data.activeAssetIndex === index)) return;

    frameDOM.mutate(() => {
      const assets = this.isDesktop ? data.desktopAssets : data.mobileAssets;

      assets.forEach((asset, i) => {
        const isActive = i === index;
        asset.classList.toggle("opacity-100!", isActive);
        asset.classList.toggle("scale-101!", isActive);
        // We don't necessarily need to add opacity-100 if the PHP starts with it or other classes,
        // but for safety and to match the 'hide' logic:
        if (!isActive) asset.classList.remove("opacity-100!", "scale-101!");
      });

      data.activeAssetIndex = index;

      // Update URL on desktop
      const nextProjectUrl = data.projects[index]?.url;
      if (nextProjectUrl && data.el.href !== nextProjectUrl) {
        data.el.href = nextProjectUrl;
      }
    });
  }

  desktopInviewAnimation() {
    this.expertiseTimeline?.kill();
    this.desktopScrollTrigger?.kill();

    this.classList.add("hide-focus");

    // Ensure keyboard navigation kills animation.
    this.on(
      "keyup",
      window,
      (e) => {
        if (e.key === "Tab") {
          this.expertiseTimeline?.kill();
        }
      },
      { once: true },
    );

    const tl = gsap.timeline({
      repeat: -1,
      paused: true,
    });

    this.$expertiseEls.forEach((el) => {
      tl.call(
        (link) => {
          requestAnimationFrame(() => {
            link?.focus({ preventScroll: true, focusVisible: false });
          });
        },
        [el],
        "+=2.5",
      );

      el.addEventListener(
        "mousemove",
        () => {
          tl.clear();
          this.classList.remove("hide-focus");

          const activeElement = document.activeElement as HTMLElement;
          if (activeElement) {
            activeElement.blur();
          }
        },
        { once: true },
      );
    });

    this.expertiseTimeline = tl;

    this.desktopScrollTrigger = ScrollTrigger.create({
      trigger: this,
      start: "top 70%",
      end: "bottom bottom-=70px",
      snap: {
        directional: true,
        snapTo: (value, self) => {
          if (self?.direction === 1) {
            return 1;
          }
          return value;
        },
      },
      onEnter: (_self) => {
        this.$expertiseEls[0]?.focus();
        this.expertiseTimeline?.play();
      },
      onLeave: (self) => {
        self.disable();
      },
      onSnapComplete: (self) => {
        self.disable();
      },
      toggleActions: "play none none none",
    });
  }
}

customElements.define("c-home-expertise", HomeExpertise);
