import { StringTune } from "@fiddle-digital/string-tune";
import { Core } from "@unseenco/taxi";
import type { CacheEntry } from "@unseenco/taxi/src/Core";
import BaseTransition from "../transitions/base";

export default class App {
  private router: Core | undefined;
  public smoothScroll: StringTune | undefined;

  constructor() {
    this.router = new Core({
      transitions: {
        default: BaseTransition,
      },
    });
  }

  initSmooth() {
    const smooth = StringTune.getInstance();

    this.smoothScroll = smooth;

    if (this.smoothScroll) {
      this.smoothScroll.setupSettings({
        "offset-top": "-12vh",
        "offset-bottom": "8vh",
        parallax: 0.28,
        lerp: 0.65,
        strength: 0.4,
      });
      this.smoothScroll.speed = 0.12;
      this.smoothScroll.speedAccelerate = 0.35;
    }
  }

  startSmooth() {
    console.log("😸 startSmooth");
    this.smoothScroll?.start(60);
  }

  init() {
    console.log("😸 this.router", this.router);
    this.initSmooth();
    this.initRouterEvents();

    requestAnimationFrame(() => {
      this.startSmooth();
    });
  }

  initRouterEvents() {
    this.router?.on("NAVIGATE_IN", ({ to }: { to: CacheEntry }) => {
      const { title, description, image } = (to.content as HTMLElement).dataset;

      // update header
      const updatedLinks = Array.from((to.page as Document).querySelectorAll("nav>a.header-link"));
      const currentLinks = Array.from(document.querySelectorAll("nav>a.header-link"));
      for (let index = 0; index < currentLinks.length; index++) {
        const link = currentLinks[index];
        const targetDataset = (updatedLinks[index] as HTMLElement).dataset;
        Object.keys((link as HTMLElement).dataset).map((key) => {
          delete (link as HTMLElement).dataset[key];
        });
        Object.keys(targetDataset).map((key) => {
          (link as HTMLElement).dataset[key] = targetDataset[key];
        });
      }

      // Update URL
      document
        .querySelector('meta[property="og:url"]')
        ?.setAttribute("content", window.location.href);
      document.querySelectorAll("nav>a.header-link");

      // Update Title
      if (title) {
        document.title = title;
        document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
      }

      // Update Description
      if (description) {
        document.querySelector('meta[name="description"]')?.setAttribute("content", description);
        document
          .querySelector('meta[property="og:description"]')
          ?.setAttribute("content", description);
      }

      // Update Image
      if (image) {
        document.querySelector('meta[property="og:image"]')?.setAttribute("content", image);
      }
    });

    this.router?.on(
      "NAVIGATE_END",
      ({
        to,
        from,
        trigger,
      }: {
        to: CacheEntry;
        from: CacheEntry;
        trigger: boolean | string | HTMLElement;
      }) => {
        console.log("😸 Navigate end: to, from, trigger", to, from, trigger);
        requestAnimationFrame(() => {
          this.smoothScroll?.onResize(true);
          // this.smoothScroll?.invalidateCenters(); // TODO: not documented anymore
        });
      },
    );
  }
}
