import { StringTune } from "@fiddle-digital/string-tune";
import { Core } from "@unseenco/taxi";
import type { CacheEntry } from "@unseenco/taxi/src/Core";
import BaseTransition from "../transitions/base";
import {
  StringSplit,
  StringProgress,
  StringProgressPart,
  StringPositionTracker,
} from "@fiddle-digital/string-tune";
import { piecesManager } from "piecesjs";
import { loader as loadComponents } from "../components";

export default class App {
  private router: Core | undefined;
  public smoothScroll: StringTune | undefined;
  private stylesheetToLoad: number = 0;

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
      this.smoothScroll.setupSettings({});

      this.smoothScroll.use(StringSplit);
      this.smoothScroll.use(StringProgress);
      this.smoothScroll.use(StringProgressPart);

      this.smoothScroll.use(StringPositionTracker);
      this.smoothScroll.PositionTrackerVisible = true;

      this.smoothScroll.speed = 0.12;
      this.smoothScroll.speedAccelerate = 0.35;
    }
  }

  startSmooth() {
    this.smoothScroll?.start(60);
  }

  async init() {
    this.initRouterEvents();
    await loadComponents(document.body);
    console.log("😸 pieces have loaded", piecesManager);

    requestAnimationFrame(() => {
      this.initSmooth();
      this.startSmooth();
    });

    this.handleStylesheetLoading(() => {
      console.log("😸 all stylesheets have loaded");
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

      // Update components
      loadComponents(to.content as HTMLElement);
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

  private handleStylesheetLoading(callback: () => void) {
    // trigger resize upon load end
    const styleSheets = Array.from(
      document.head.querySelectorAll('link[rel="stylesheet"]'),
    ) as HTMLLinkElement[];
    console.log("😸 stylesheets", styleSheets);

    this.stylesheetToLoad = styleSheets.length;

    const stylesheetsLoaded = () => {
      console.log("😸 stylesheetsLoaded");
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
        callback();
      });
    };

    styleSheets.map((stylesheet) => {
      const hasLoaded = Boolean(stylesheet.sheet);
      console.log("😸 stylesheet hasLoaded", stylesheet, hasLoaded);

      if (hasLoaded) {
        this.stylesheetToLoad--;
        if (this.stylesheetToLoad === 0) {
          stylesheetsLoaded();
        }
      } else {
        stylesheet.onload = () => {
          console.log("😸 link onload", stylesheet);
          this.stylesheetToLoad--;
          if (this.stylesheetToLoad === 0) {
            stylesheetsLoaded();
          }
        };
      }
    });
  }
}
