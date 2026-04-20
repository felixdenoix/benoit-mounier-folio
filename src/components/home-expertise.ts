import { Piece } from "piecesjs";
import debounce from "lodash/debounce";
import { frameDOM } from "@fiddle-digital/string-tune";

export default class HomeExpertise extends Piece {
  private $handledExperiences: {
    [id: string]: {
      el?: HTMLAnchorElement;
      bcr?: DOMRect;
      assets?: HTMLElement[];
      activeAssetIndex?: number | undefined;
    };
  } = {};

  private debouncedHandleScroll = debounce(this.handleExperiencesScroll.bind(this), 200);

  constructor() {
    super("HomeExpertise");
  }

  mount() {
    const experiences = Array.from((this.domAttr("expertise") as NodeList) || []) as HTMLAnchorElement[];

    let elNeedsWatching = false;

    experiences.forEach((el) => {
      const id = el.dataset.expertiseId;

      if (!id) return;

      const projectsCount = el.dataset.projectsCount ? parseInt(el.dataset.projectsCount) : 0;

      if (projectsCount > 1) {
        elNeedsWatching = true;

        const assets = Array.from(el.querySelectorAll("img"));

        this.$handledExperiences[id] = {
          el: el,
          assets: assets,
        };
        el.addEventListener("mousemove", this.handleMouseMove.bind(this), { passive: true });
        el.addEventListener("mouseleave", this.handleMouseLeave.bind(this), { passive: true });
      }
    });

    if (elNeedsWatching) {
      document.addEventListener("scroll", this.debouncedHandleScroll, { passive: true });
    }
  }

  unmount() {
    Object.values(this.$handledExperiences).forEach((experience) => {
      experience.el?.removeEventListener("mousemove", this.handleMouseMove);
      experience.el?.removeEventListener("mouseleave", this.handleMouseLeave);
    });

    document.removeEventListener("scroll", this.debouncedHandleScroll);
    this.debouncedHandleScroll?.cancel();
  }

  handleMouseMove(e: MouseEvent) {
    if (
      e.target instanceof HTMLAnchorElement &&
      e.target?.dataset?.expertiseId &&
      e.target?.dataset?.expertiseId in this.$handledExperiences
    ) {
      const id = e.target?.dataset?.expertiseId as string;
      const projects = e.target?.dataset.expertiseProjects as string;

      const experience = this.$handledExperiences[id];

      const rect = experience?.bcr;
      const assets = experience?.assets;

      if (!rect || !assets) return;

      const relativeX = Math.round(e.clientX - rect.left);
      const progressX = relativeX / Math.round(rect.width);

      const elIndex = Math.floor(progressX * assets.length);

      frameDOM.mutate(() => {
        if (experience.activeAssetIndex !== undefined && experience.activeAssetIndex !== elIndex) {
          assets[experience.activeAssetIndex].classList.toggle("scale-99!", true);
          assets[experience.activeAssetIndex].classList.toggle("opacity-0", true);

          if (projects) {
            const parsedProjects = JSON.parse(projects);
            const projectUrl = parsedProjects[elIndex].url;
            if (projectUrl) {
              (e.target as HTMLAnchorElement).href = projectUrl;
            }
          }
        }

        if (elIndex > -1 && elIndex !== experience.activeAssetIndex) {
          assets[elIndex].classList.toggle("opacity-0", false);
          assets[elIndex].classList.toggle("scale-99!", false);
          experience.activeAssetIndex = elIndex;
        }
      });
    }
  }

  handleMouseLeave(e: Event) {
    if (
      e.target instanceof HTMLAnchorElement &&
      e.target?.dataset?.expertiseId &&
      e.target?.dataset?.expertiseId in this.$handledExperiences
    ) {
      const id = e.target?.dataset?.expertiseId as string;
      const experience = this.$handledExperiences[id];
      const assets = experience.assets;
      const activeAssetIndex = experience.activeAssetIndex;

      if (activeAssetIndex !== undefined && assets) {
        assets[activeAssetIndex].classList.toggle("opacity-0", true);
        experience.activeAssetIndex = undefined;
      }
    }
  }

  handleExperiencesScroll(_e: Event) {
    frameDOM.measure(() => {
      Object.entries(this.$handledExperiences).forEach(([id, experience]) => {
        const boundingRect = experience.el?.getBoundingClientRect();
        if (this.$handledExperiences[id]) {
          this.$handledExperiences[id].bcr = boundingRect;
        }
      });
    });
  }
}

customElements.define("c-home-expertise", HomeExpertise);
