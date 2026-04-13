import { Renderer } from "@unseenco/taxi";
import { lazyMediaHandler } from "../utils";

import { gsap } from "gsap";
import { piecesManager, type PieceData } from "piecesjs";

export type ExitLoaderComponentCallback = {
  selector: string;
  component: string;
  method: string;
};

export default class DefaultRenderer extends Renderer {
  $pageAssets: HTMLImageElement[] | undefined;
  $siteLoader: HTMLElement | undefined;
  $siteLoaderProgress: HTMLSpanElement | undefined;
  siteLoaderQTo: any;

  siteLoaderRaf: number | undefined;

  pageAssetsCount: number = 0;
  pageAssetloaded: number = 0;

  exitLoaderComponentCallbacks: ExitLoaderComponentCallback[] | undefined;

  constructor(
    args: any,
    options: {
      exitLoaderComponentCallbacks?: ExitLoaderComponentCallback[];
    } = {},
  ) {
    super(args);
    this.exitLoaderComponentCallbacks = options.exitLoaderComponentCallbacks;
  }

  initialLoad() {
    this.$siteLoader = this.content.querySelector("#site-loader") as HTMLElement;

    this.$siteLoaderProgress = this.content.querySelector("span[data-dom=progress]") as HTMLSpanElement;

    this.$pageAssets = Array.from(this.content.querySelectorAll("img:not([loading=lazy])")).filter(
      Boolean,
    ) as HTMLImageElement[];

    this.siteLoaderQTo = gsap.quickTo(this.$siteLoaderProgress, "textContent", {
      duration: 1,
      ease: "power3.out",
      snap: "textContent",
      onComplete: () => {
        if (this.pageAssetsCount === this.pageAssetloaded) {
          this.exitLoader();
        }
      },
    });

    this.pageAssetsCount = this.$pageAssets?.length || 0;

    if (this.pageAssetsCount === 0) {
      this.siteLoaderQTo(100);
      return;
    }

    // Use map to create an array of Promises
    const loadPromises = this.$pageAssets.map((asset) => {
      return new Promise((resolve) => {
        const handleLoad = () => {
          this.pageAssetloaded++;
          this.siteLoaderQTo((this.pageAssetloaded / this.pageAssetsCount) * 100);
          resolve(true);
        };

        // Check if already loaded
        if (asset.complete) {
          handleLoad();
        } else {
          asset.addEventListener("load", handleLoad, { once: true });
          asset.addEventListener("error", handleLoad, { once: true });
        }
      });
    });

    const timeout = new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });

    Promise.race([Promise.allSettled(loadPromises).catch(console.error), timeout]).then(() => {
      this.siteLoaderQTo(100);
    });
  }

  onEnter() {
    lazyMediaHandler(this.page as Document);
  }

  onEnterCompleted() {
    setTimeout(() => {
      globalThis.app.smoothScroll?.scrollTo(window.innerHeight);
    }, 1000);
  }

  onLeave() {}

  onLeaveCompleted() {}

  exitLoader() {
    if (!this.$siteLoader) return;

    gsap
      .timeline({
        delay: 0.5,
        onComplete: () => {
          globalThis.app.smoothScroll?.start(60);
          this.onEnter();
          this.onEnterCompleted();

          if (this.exitLoaderComponentCallbacks?.length) {
            this.handleExitLoaderCallbacks();
          }
        },
      })
      .to(this.$siteLoaderProgress!.parentElement, {
        duration: 0.5,
        opacity: 0,
      })
      .to(this.$siteLoader, { duration: 0.75, autoAlpha: 0 });
  }

  handleExitLoaderCallbacks() {
    this.exitLoaderComponentCallbacks?.forEach(({ selector, component, method }) => {
      const componentDOM = this.content.querySelector(selector);
      const id = componentDOM && "cid" in componentDOM ? (componentDOM.cid as string) : null;
      if (id) {
        const pieceData = piecesManager.currentPieces?.[component]?.[id] as PieceData;

        const piece = pieceData.piece as Record<string, any>;

        if (method in piece && typeof piece[method] === "function") {
          piece[method]();
        }
      }
    });
  }
}
