import { StringTune, frameDOM } from "@fiddle-digital/string-tune";
import gsap from "gsap";
import { Core } from "@unseenco/taxi";
import type { CacheEntry } from "@unseenco/taxi/src/Core";
import BaseTransition from "../transitions/base";
import { debounce } from "lodash";
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

export default class App {
  private router: Core | undefined;
  public smoothScroll: StringTune | undefined;
  private stylesheetToLoad: number = 0;
  public gsap: typeof gsap = gsap;
  public rootStyles: CSSStyleDeclaration | undefined;
  public consts: {
    innerHeight: number;
    innerWidth: number;
  } = {
    innerHeight: 0,
    innerWidth: 0,
  };

  constructor() {
    this.router = new Core({
      renderers: {
        default: DefaultRenderer,
      },
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

      this.smoothScroll.speed = 0.12;
      this.smoothScroll.speedAccelerate = 0.35;
    }
  }

  startSmooth() {
    this.smoothScroll?.start(60);
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
    this.initRouterEvents();
    this.initSmooth();
    this.startSmooth();

    await loadComponents(document.body);

    gsap.config({
      autoSleep: 60,
      force3D: true,
      nullTargetWarn: import.meta.env.MODE === "development",
    });

    this.handleStylesheetLoading(() => {
      // console.log("😸 all stylesheets have loaded");
    });
  }

  initRouterEvents() {
    this.router?.on("NAVIGATE_IN", ({ to }: { to: CacheEntry }) => {
      const { title, description, image, hideHeader } = (to.content as HTMLElement).dataset;

      // update header
      const updatedLinks = Array.from((to.page as Document).querySelectorAll("nav>a.header-link"));
      const currentLinks = Array.from(document.querySelectorAll("nav>a.header-link"));

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
      // document.querySelectorAll("nav>a.header-link");

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

  private handleStylesheetLoading(callback: () => void) {
    // trigger resize upon load end
    const styleSheets = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];

    this.stylesheetToLoad = styleSheets.length;

    const stylesheetsLoaded = () => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
        callback();
      });
    };

    styleSheets.map((stylesheet) => {
      const hasLoaded = Boolean(stylesheet.sheet);

      if (hasLoaded) {
        this.stylesheetToLoad--;
        if (this.stylesheetToLoad === 0) {
          stylesheetsLoaded();
        }
      } else {
        stylesheet.onload = () => {
          this.stylesheetToLoad--;
          if (this.stylesheetToLoad === 0) {
            stylesheetsLoaded();
          }
        };
      }
    });
  }
}
