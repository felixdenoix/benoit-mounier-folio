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

    const mediaGroups = Array.from(this.domAttr("media-group") as NodeList) as HTMLElement[];
    const mediaMap = new Map(mediaGroups.map((mg) => [mg.dataset.expertiseId, mg]));

    this.$expertiseEls.forEach((el) => {
      const id = el.dataset.expertiseId;
      if (!id) return;

      const projectsRaw = el.dataset.expertiseProjects;
      const projects = projectsRaw ? JSON.parse(projectsRaw) : [];
      const projectsCount = el.dataset.projectsCount ? parseInt(el.dataset.projectsCount) : 0;
      const mediaGroup = mediaMap.get(id) as HTMLElement;
      const assets = mediaGroup ? Array.from(mediaGroup.querySelectorAll("img")) : [];

      this.expertises.set(id, {
        el,
        projects,
        projectsCount,
        mediaGroup,
        assets,
      });
    });
  }

  private setup() {
    this.previousIsDesktop = this.isDesktop;
    this.isDesktop = window.matchMedia("(min-width: 768px)").matches;
    this.observer?.disconnect();

    if (!this.isDesktop) {
      this.setupObserver();
    }

    this.expertises.forEach((data) => {
      if (this.previousIsDesktop) {
        data.el.removeEventListener("mousemove", this.onMouseMove);
        data.el.removeEventListener("mouseleave", this.onMouseLeave);
      }
      if (this.isDesktop) {
        data.el.addEventListener("mousemove", this.onMouseMove);
        data.el.addEventListener("mouseleave", this.onMouseLeave);
        data.bcr = data.el.getBoundingClientRect();
      } else {
        this.observer?.observe(data.el);
      }
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
        threshold: createThresholdArray(30),
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
    console.log("😸 setActiveExpertise");
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
    console.log("😸 toggleExpertise");
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
    console.log("😸 updateAsset");
    const data = this.expertises.get(id);
    if (!data || data.activeAssetIndex === index) return;

    frameDOM.mutate(() => {
      if (data.activeAssetIndex !== undefined) {
        const prevAsset = data.assets[data.activeAssetIndex];
        prevAsset?.classList.add("opacity-0", "scale-99!");
      }

      const nextProjectAsset = data.assets[index];
      if (nextProjectAsset) {
        nextProjectAsset.classList.remove("opacity-0", "scale-99!");
        data.activeAssetIndex = index;

        // Update URL on desktop
        const nextProjectUrl = data.projects[index]?.url;
        if (nextProjectUrl && data.el.href !== nextProjectUrl) {
          data.el.href = data.projects[index].url;
        }
      }
    });
  }
}

customElements.define("c-home-expertise", HomeExpertise);
