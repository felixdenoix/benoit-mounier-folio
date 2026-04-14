import { Renderer } from "@unseenco/taxi";
import { gsap } from "gsap";

import { callPieceMethod, lazyMediaHandler } from "../utils";

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

  initialLoad() {
    this.$siteLoader = document.querySelector("#site-loader") as HTMLElement;
    this.$siteLoaderProgress = document.querySelector("span[data-dom=progress]") as HTMLSpanElement;
    this.$pageAssets = Array.from(this.content.querySelectorAll("img:not([loading=lazy])")).filter(
      Boolean,
    ) as HTMLImageElement[];

    this.siteLoaderQTo = gsap.quickTo(this.$siteLoaderProgress, "textContent", {
      duration: 0.5,
      ease: "power3.out",
      snap: "textContent",
      onComplete: () => {
        if (this.pageAssetsCount === this.pageAssetloaded) {
          this.exitLoader(() => {
            this.onEnter();
            this.onEnterCompleted();
          });
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
          const progress = (this.pageAssetloaded / this.pageAssetsCount) * 100;
          this.siteLoaderQTo(progress);
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

    Promise.race([Promise.allSettled(loadPromises), timeout])
      .catch(console.error)
      .finally(() => {
        this.siteLoaderQTo(100);
      });
  }

  onEnter() {
    lazyMediaHandler(this.content);
  }

  onEnterCompleted() {
    callPieceMethod(
      {
        selector: "c-header",
        component: "Header",
        method: "setTransparent",
        arguments: { value: false },
      },
      document,
    );
  }

  onLeave() {}

  onLeaveCompleted() {}

  exitLoader(callback?: () => void) {
    if (!this.$siteLoader) return;

    gsap
      .timeline({
        delay: 0.5,
        onComplete: () => {
          document.body.style.removeProperty("overflow");
          globalThis.app.smoothScroll?.start(60);

          if (callback) {
            callback();
          }
        },
      })
      .to(this.$siteLoaderProgress!.parentElement, {
        duration: 0.5,
        ease: "power3.out",
        opacity: 0,
      })
      .to(
        this.$siteLoader,
        {
          duration: 0.5,
          autoAlpha: 0,
          ease: "power3.out",
        },
        "<50%",
      );
  }
}
