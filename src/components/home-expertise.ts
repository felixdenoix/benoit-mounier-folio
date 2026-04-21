import { Piece } from "piecesjs";
import debounce from "lodash/debounce";
import { frameDOM } from "@fiddle-digital/string-tune";
import { createThresholdArray, getIntersectionProgress } from "../utils";

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

  constructor() {
    super("HomeExpertise");
  }

  mount() {
    frameDOM.measure(() => {
      this.init();
      this.setup();
    });
    window.addEventListener("resize", this.debouncedResize);
  }

  unmount() {
    window.removeEventListener("resize", this.debouncedResize);
    this.observer?.disconnect();
    this.expertises.forEach((exp) => {
      exp.el.removeEventListener("mousemove", this.onMouseMove);
      exp.el.removeEventListener("mouseleave", this.onMouseLeave);
    });
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

      const mobileMediaGroup = mobileMap.get(id) || null;
      const mobileAssets = mobileMediaGroup ? Array.from(mobileMediaGroup.querySelectorAll("img")) : [];

      const desktopMediaGroup = desktopMap.get(id) || null;
      const desktopAssets = desktopMediaGroup ? Array.from(desktopMediaGroup.querySelectorAll("img")) : [];

      this.expertises.set(id, {
        el,
        projects,
        projectsCount,
        mobileMediaGroup,
        mobileAssets,
        desktopMediaGroup,
        desktopAssets,
      });
    });
  }

  private setup() {
    this.previousIsDesktop = this.isDesktop;
    this.isDesktop = window.matchMedia("(min-width: 768px)").matches;

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
        data.el.removeEventListener("mousemove", this.onMouseMove);
        data.el.removeEventListener("mouseleave", this.onMouseLeave);
      }

      if (this.isDesktop) {
        if (elProjectsCount > 1) {
          data.el.addEventListener("mousemove", this.onMouseMove);
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

    const target = e.currentTarget as HTMLAnchorElement;
    requestAnimationFrame(() => {
      const id = target.dataset.expertiseId;
      const data = id ? this.expertises.get(id) : null;

      if (data && data.bcr) {
        const progress = (e.clientX - data.bcr.left) / data.bcr.width;
        this.setActiveExpertise(id!, progress);
      }
    });
  };

  private onMouseLeave = () => {
    if (!this.isDesktop) return;
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

  private toggleExpertise(id: string, active: boolean) {
    const data = this.expertises.get(id);
    if (!data) return;

    frameDOM.mutate(() => {
      data.el.classList.toggle("text-white", active);

      if (!this.isDesktop && data.mobileMediaGroup) {
        data.mobileMediaGroup.classList.toggle("opacity-100", active);
        data.mobileMediaGroup.classList.toggle("opacity-0", !active);
        data.mobileMediaGroup.classList.toggle("scale-101", active);
        data.mobileMediaGroup.classList.toggle("scale-99", !active);
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
        asset.classList.toggle("opacity-0", !isActive);
        asset.classList.toggle("scale-99!", !isActive);
        // We don't necessarily need to add opacity-100 if the PHP starts with it or other classes,
        // but for safety and to match the 'hide' logic:
        if (isActive) asset.classList.remove("opacity-0", "scale-99!");
      });

      data.activeAssetIndex = index;

      // Update URL on desktop
      const nextProjectUrl = data.projects[index]?.url;
      if (nextProjectUrl && data.el.href !== nextProjectUrl) {
        data.el.href = nextProjectUrl;
      }
    });
  }
}

customElements.define("c-home-expertise", HomeExpertise);
