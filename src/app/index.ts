import { StringTune, frameDOM } from "@fiddle-digital/string-tune";
import gsap from "gsap";
import { Core } from "@unseenco/taxi";
import type { CacheEntry } from "@unseenco/taxi/src/Core";
import BaseTransition from "../transitions/base";
import debounce from "lodash/debounce";
import {
  StringLerp,
  StringPositionTracker,
  StringProgress,
  StringProgressPart,
  StringScrollContainer,
  StringSplit,
} from "@fiddle-digital/string-tune";
import { loader as loadComponents } from "../components";
import DefaultRenderer from "./defaultRenderer";
import HomeRenderer from "./homeRenderer";

export default class App {
  private router: Core | undefined;
  public smoothScroll: StringTune | undefined;
  public gsap: typeof gsap = gsap;
  public rootStyles: CSSStyleDeclaration | undefined;
  public consts: {
    innerHeight: number;
    innerWidth: number;
  } = {
    innerHeight: 0,
    innerWidth: 0,
  };

  constructor() {}

  initSmooth() {
    const smooth = StringTune.getInstance();
    this.smoothScroll = smooth;

    if (this.smoothScroll) {
      this.smoothScroll.setupSettings({
        lerp: 0.3,
        strength: 0.1,
      });

      this.smoothScroll.use(StringLerp);
      this.smoothScroll.use(StringProgress);
      this.smoothScroll.use(StringProgressPart);
      this.smoothScroll.use(StringScrollContainer);
      this.smoothScroll.use(StringSplit);

      if (import.meta.env.MODE === "development") {
        this.smoothScroll.use(StringPositionTracker);
        this.smoothScroll.PositionTrackerVisible = true;
      }

      this.smoothScroll.speed = 0.08;
      this.smoothScroll.speedAccelerate = 0.3;
    }
  }

  async init() {
    globalThis.gsap = gsap;
    this.gsap = gsap;

    this.initGlobalVars();
    window.addEventListener(
      "resize",
      debounce(
        (e: Event) => {
          this.initGlobalVars(e);
        },
        300,
        { maxWait: 750 },
      ),
    );

    this.initSmooth();
    // SmoothScroll is started from the taxi DefaultRenderer

    await loadComponents(document.body);

    gsap.config({
      autoSleep: 60,
      force3D: true,
      nullTargetWarn: import.meta.env.MODE === "development",
    });

    this.handleStylesheetLoading(() => {
      this.router = new Core({
        renderers: {
          default: DefaultRenderer,
          home: HomeRenderer,
        },
        transitions: {
          default: BaseTransition,
        },
      });
      this.initRouterEvents();
    });
  }

  initRouterEvents() {
    this.router?.on("NAVIGATE_IN", ({ to }: { to: CacheEntry }) => {
      const { title, description, image, hideHeader } = (to.content as HTMLElement).dataset;

      // update nav (header && footer)
      const currentLinks = Array.from(document.querySelectorAll("nav>a.header-link"));
      const updatedLinks = Array.from((to.page as Document).querySelectorAll("nav>a.header-link"));

      // The c-header component has a string-copy-progress from footer. On page change, need to remove the progress property as it is not reset on page change.
      const header = document.querySelector("c-header") as HTMLElement;
      if (header?.style && "--progress" in header.style) {
        header.style.removeProperty("--progress");
      }

      for (let index = 0; index < currentLinks.length; index++) {
        const link = currentLinks[index];
        const targetDataset = (updatedLinks[index] as HTMLElement).dataset;
        Object.keys((link as HTMLElement).dataset).map((key) => {
          delete (link as HTMLElement).dataset[key];
          if (key === "current") {
            link.removeAttribute("aria-current");
          }
        });
        Object.keys(targetDataset).map((key) => {
          (link as HTMLElement).dataset[key] = targetDataset[key];
          if (key === "current") {
            link.setAttribute("aria-current", "page");
          }
        });
      }

      // Update URL
      document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.href);

      if (hideHeader !== undefined) {
        document.querySelector("c-header")?.setAttribute("hide", "true");
      } else {
        document.querySelector("c-header")?.removeAttribute("hide");
      }

      // Update Title
      if (title) {
        document.title = title;
        document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
      }

      // Update Description
      if (description) {
        document.querySelector('meta[name="description"]')?.setAttribute("content", description);
        document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
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
        // to,
        // from,
        // trigger,
      }: {
        to: CacheEntry;
        from: CacheEntry;
        trigger: boolean | string | HTMLElement;
      }) => {
        // console.log("😸 Navigate end: to, from, trigger", to, from, trigger);
        requestAnimationFrame(() => {
          this.smoothScroll?.onResize(true);
          // this.smoothScroll?.invalidateCenters(); // TODO: not documented anymore
        });
      },
    );
  }

  private initGlobalVars(e?: Event) {
    frameDOM.measure(() => {
      const windowElement = (e?.target as Window) || window;
      this.rootStyles = getComputedStyle(windowElement.document.documentElement);

      this.consts.innerHeight = windowElement.innerHeight;
      this.consts.innerWidth = windowElement.innerWidth;
    });
  }

  private async handleStylesheetLoading(callback?: () => void) {
    // trigger resize upon load end
    const styleSheets = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];

    const styleSheetPromises = styleSheets.map((stylesheet) => {
      return new Promise((resolve) => {
        const hasLoaded = Boolean(stylesheet.sheet);

        if (hasLoaded) {
          resolve(true);
        } else {
          stylesheet.onload = () => resolve(true);
          stylesheet.onerror = () => resolve(false);
        }
      });
    });

    await Promise.race([Promise.all(styleSheetPromises), new Promise((resolve) => setTimeout(resolve, 5000))]);

    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });

    if (callback) {
      callback();
    }
  }
}
