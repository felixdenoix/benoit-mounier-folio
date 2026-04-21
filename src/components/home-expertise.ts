import { Piece } from "piecesjs";
import debounce from "lodash/debounce";
import { frameDOM } from "@fiddle-digital/string-tune";
import { createThresholdArray, getIntersectionProgress } from "../utils";

interface ExpertiseData {
  el: HTMLAnchorElement;
  projects: any[];
  projectsCount: number;
  mediaGroup: HTMLElement | null;
  assets: HTMLElement[];
  activeAssetIndex?: number;
  bcr?: DOMRect;
}

export default class HomeExpertise extends Piece {
  private $expertiseEls: HTMLAnchorElement[] = [];
  private expertises: Map<string, ExpertiseData> = new Map();
  private observer: IntersectionObserver | undefined;
  private activeId: string | null = null;
  private isDesktop: boolean = false;

  private debouncedResize = debounce(() => this.setup(), 200);

  constructor() {
    super("HomeExpertise");
  }

  mount() {
    frameDOM.measure(() => {
      this.$expertiseEls = Array.from((this.domAttr("expertise") as NodeList) || []) as HTMLAnchorElement[];
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

  private setup() {
    this.isDesktop = window.matchMedia("(min-width: 768px)").matches;
    this.observer?.disconnect();

    this.$expertiseEls.forEach((el) => {
      const id = el.dataset.expertiseId;
      if (!id) return;

      const projectsRaw = el.dataset.expertiseProjects;
      const projects = projectsRaw ? JSON.parse(projectsRaw) : [];
      const projectsCount = el.dataset.projectsCount ? parseInt(el.dataset.projectsCount) : 0;
      const mediaGroup = this.querySelector(`[data-dom="media-group"][data-expertise-id="${id}"]`) as HTMLElement;
      const assets = mediaGroup ? Array.from(mediaGroup.querySelectorAll("img")) : [];

      const data: ExpertiseData = {
        el,
        projects,
        projectsCount,
        mediaGroup,
        assets,
      };

      if (this.isDesktop) {
        el.addEventListener("mousemove", this.onMouseMove);
        el.addEventListener("mouseleave", this.onMouseLeave);
        data.bcr = el.getBoundingClientRect();
      } else {
        this.setupObserver();
        this.observer?.observe(el);
      }

      this.expertises.set(id, data);
    });
  }

  private setupObserver() {
    if (this.observer) return;

    // Estimate margin based on first element
    const firstExp = this.expertises.values().next().value;
    const ctaHeight = firstExp?.el.getBoundingClientRect().height || 50;
    const viewportHeight = globalThis.app.consts.innerHeight;
    const margin = Math.round((viewportHeight - ctaHeight * 2) / 2);

    this.observer = new IntersectionObserver(
      (entries) => {
        if (this.isDesktop) return;

        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.expertiseId;
          if (!id) return;

          if (entry.intersectionRatio > 0.6) {
            const progress = getIntersectionProgress(entry);
            this.setActiveExpertise(id, progress);
          } else if (this.activeId === id) {
            this.setActiveExpertise(null);
          }
        });
      },
      {
        threshold: createThresholdArray(40),
        rootMargin: `-${margin}px 0px -${margin}px 0px`,
      },
    );
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDesktop) return;

    const target = e.currentTarget as HTMLAnchorElement;
    const id = target.dataset.expertiseId;
    const data = id ? this.expertises.get(id) : null;

    if (data && data.bcr) {
      const progress = (e.clientX - data.bcr.left) / data.bcr.width;
      this.setActiveExpertise(id!, progress);
    }
  };

  private onMouseLeave = () => {
    if (!this.isDesktop) return;
    this.setActiveExpertise(null);
  };

  private setActiveExpertise(id: string | null, progress: number = 0) {
    if (this.activeId !== id) {
      if (this.activeId) {
        this.toggleExpertise(this.activeId, false);
      }
      this.activeId = id;
      if (id) {
        this.toggleExpertise(id, true);
      }
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
    if (!data || !data.mediaGroup) return;

    frameDOM.mutate(() => {
      data.mediaGroup?.classList.toggle("opacity-100", active);
      data.mediaGroup?.classList.toggle("opacity-0", !active);
      data.mediaGroup?.classList.toggle("scale-101", active);
      data.mediaGroup?.classList.toggle("scale-99", !active);

      // Default to first asset if becoming active
      if (active && data.activeAssetIndex === undefined) {
        this.updateAsset(id, 0);
      }
    });
  }

  private updateAsset(id: string, index: number) {
    const data = this.expertises.get(id);
    if (!data || data.activeAssetIndex === index) return;

    frameDOM.mutate(() => {
      if (data.activeAssetIndex !== undefined) {
        const prevAsset = data.assets[data.activeAssetIndex];
        prevAsset?.classList.add("opacity-0", "scale-99!");
      }

      const nextAsset = data.assets[index];
      if (nextAsset) {
        nextAsset.classList.remove("opacity-0", "scale-99!");
        data.activeAssetIndex = index;

        // Update URL on desktop
        if (this.isDesktop && data.projects[index]?.url) {
          data.el.href = data.projects[index].url;
        }
      }
    });
  }
}

customElements.define("c-home-expertise", HomeExpertise);
