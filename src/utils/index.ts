import { frameDOM } from "@fiddle-digital/string-tune";
import { piecesManager, type PieceData } from "piecesjs";

export function lazyMediaHandler(doc: Document | ParentNode, mediaQuerySelector: string = '[data-dom="lazy-media"]') {
  const lazyMedias = Array.from(doc.querySelectorAll(mediaQuerySelector)) as HTMLImageElement[];

  frameDOM.mutate(() => {
    lazyMedias.map((asset: HTMLImageElement) => {
      if (asset.complete || asset.naturalHeight) {
        asset.classList.add("loaded");
        asset.classList.remove("error");
      } else {
        asset.onload = () => {
          asset.classList.add("loaded");
        };
        asset.onerror = () => {
          asset.classList.add("error");
        };
      }
    });
  });
}

export function callPieceMethod(
  data: {
    selector: string;
    component: string;
    method: string;
    arguments?: Record<string, any>;
  },
  domNode?: Document | ParentNode,
) {
  const startTime = performance.now();
  const querySelectorDomNode = domNode || document;

  const attemptCall = () => {
    const componentDOM = querySelectorDomNode.querySelector(data.selector);
    const id = componentDOM && "cid" in componentDOM ? (componentDOM.cid as string) : null;

    if (id) {
      const pieceData = piecesManager.currentPieces?.[data.component]?.[id] as PieceData;
      if (pieceData) {
        const piece = pieceData.piece as Record<string, any>;

        if (data.method in piece && typeof piece[data.method] === "function") {
          piece[data.method](data.arguments);
          return; // Success, stop the loop
        }
      }
    }

    const elapsed = performance.now() - startTime;
    if (elapsed < 1000) {
      requestAnimationFrame(attemptCall);
    } else {
      console.warn(`[callPieceMethod] Could not call ${data.method} on ${data.component} (${data.selector}) after 1s`);
    }
  };

  attemptCall();
}

/**
 * Generates an array of threshold values for IntersectionObserver.
 *
 * @param numSteps - The number of increments between 0 and 1.
 * @returns An array of numbers (e.g., if steps=4, returns [0, 0.25, 0.5, 0.75, 1])
 */
export function createThresholdArray(numSteps: number): number[] {
  const thresholds: number[] = [];

  // Ensure we have at least 1 step to avoid division by zero
  const steps = Math.max(numSteps, 1);

  for (let i = 0; i <= steps; i++) {
    thresholds.push(i / steps);
  }

  return thresholds;
}

/**
 * Calculates the intersection progress of an element within its root.
 * @param entry The IntersectionObserverEntry from the observer callback.
 * @returns A float between 0 (below root) and 1 (above root).
 */
export function getIntersectionProgress(entry: IntersectionObserverEntry): number {
  const { boundingClientRect, rootBounds } = entry;

  // If rootBounds is null, it defaults to the viewport
  const rootHeight = rootBounds ? rootBounds.height : window.innerHeight;

  const rootTop = rootBounds ? rootBounds.top : 0;

  /**
   * The "Total Distance" the element travels to go from "just appearing"
   * to "just disappearing" is: Root Height + Element Height.
   */
  const totalDistance = rootHeight + boundingClientRect.height;

  /**
   * Calculate how far the element has traveled into the viewport.
   * When element top is at root bottom, distance is 0.
   * When element bottom is at root top, distance is totalDistance.
   */
  const currentDistance = rootTop + rootHeight - boundingClientRect.top;

  const progress = currentDistance / totalDistance;

  // Clamp the value between 0 and 1
  return Math.min(Math.max(progress, 0), 1);
}

export function round(value: number, precision = 1) {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}
